"""Inference service: lazily loads model weights and runs predictions."""

from __future__ import annotations

import io
from functools import lru_cache
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms

from app.modules.quantum.cnn import CNet
from app.modules.quantum.qnn import HNet, create_qnn

WEIGHTS_DIR = Path(__file__).parent / "weights"

# Same preprocessing for both models — CIFAR-10 expects 3×32×32 RGB tensors.
_transform = transforms.Compose([
    transforms.Lambda(lambda image: image.convert("RGB")),
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
])

_LABELS = {0: "airplane", 1: "automobile"}


@lru_cache(maxsize=1)
def get_cnn_model() -> CNet:
    """Load the classic CNN weights into memory once and cache."""
    model = CNet()
    model.load_state_dict(torch.load(WEIGHTS_DIR / "model_cnet.pt", map_location="cpu"))
    model.eval()
    return model


@lru_cache(maxsize=1)
def get_qnn_model() -> HNet:
    """Load the hybrid QNN weights into memory once and cache."""
    model = HNet(create_qnn())
    model.load_state_dict(torch.load(WEIGHTS_DIR / "model_hybrid.pt", map_location="cpu"))
    model.eval()
    return model


def preprocess(image_bytes: bytes) -> torch.Tensor:
    """Decode raw bytes into a model-ready 1×3×32×32 tensor."""
    image = Image.open(io.BytesIO(image_bytes))
    return _transform(image).unsqueeze(0)


def _predict(model: torch.nn.Module, image_bytes: bytes) -> int:
    tensor = preprocess(image_bytes)
    with torch.no_grad():
        logits = model(tensor)
    return int(torch.argmax(logits, dim=1).item())


def predict_cnn(image_bytes: bytes) -> dict:
    pred = _predict(get_cnn_model(), image_bytes)
    return {"prediction": pred, "label": _LABELS[pred], "model": "cnn"}


def predict_qnn(image_bytes: bytes) -> dict:
    pred = _predict(get_qnn_model(), image_bytes)
    return {"prediction": pred, "label": _LABELS[pred], "model": "qnn"}
