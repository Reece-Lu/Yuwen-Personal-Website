"""Training scripts for the classic CNN and hybrid QNN models.

Run with:
    python -m app.modules.quantum.training cnn
    python -m app.modules.quantum.training qnn

Outputs are written to ``app/modules/quantum/weights/``.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import torch
import torch.optim as optim
from torch.nn import CrossEntropyLoss
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from app.modules.quantum.cnn import CNet
from app.modules.quantum.qnn import HNet, create_qnn

WEIGHTS_DIR = Path(__file__).parent / "weights"
DATA_ROOT = Path(__file__).parent / ".data"


# ── Data ─────────────────────────────────────────────────────────────────────

def _binary_cifar10(batch_size: int, n_samples: int) -> tuple[DataLoader, DataLoader]:
    """Load CIFAR-10 filtered to classes 0 (airplane) and 1 (automobile)."""
    tfm = transforms.Compose([transforms.ToTensor()])
    train = datasets.CIFAR10(root=str(DATA_ROOT), train=True, download=True, transform=tfm)
    test = datasets.CIFAR10(root=str(DATA_ROOT), train=False, download=True, transform=tfm)

    def _filter(ds):
        targets = np.array(ds.targets)
        idx = np.append(
            np.where(targets == 0)[0][:n_samples],
            np.where(targets == 1)[0][:n_samples],
        )
        ds.data = ds.data[idx]
        ds.targets = targets[idx].tolist()
        return ds

    return (
        DataLoader(_filter(train), batch_size=batch_size, shuffle=True),
        DataLoader(_filter(test), batch_size=batch_size, shuffle=True),
    )


# ── Generic train loop ───────────────────────────────────────────────────────

def _train(model: torch.nn.Module, loader: DataLoader, epochs: int, lr: float = 1e-3) -> None:
    optimizer = optim.SGD(model.parameters(), lr=lr)
    loss_fn = CrossEntropyLoss()
    model.train()
    for epoch in range(epochs):
        total = 0.0
        for data, target in loader:
            optimizer.zero_grad()
            loss = loss_fn(model(data), target.long())
            loss.backward()
            optimizer.step()
            total += loss.item()
        print(f"Epoch {epoch + 1}/{epochs} — loss {total / len(loader):.4f}")


# ── Public entry points ──────────────────────────────────────────────────────

def train_cnn(n_samples: int = 100, epochs: int = 10) -> Path:
    train_loader, _ = _binary_cifar10(batch_size=1, n_samples=n_samples)
    model = CNet()
    _train(model, train_loader, epochs)
    out = WEIGHTS_DIR / "model_cnet.pt"
    out.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), out)
    print(f"Saved {out}")
    return out


def train_qnn(n_samples: int = 300, epochs: int = 15) -> Path:
    train_loader, _ = _binary_cifar10(batch_size=1, n_samples=n_samples)
    model = HNet(create_qnn())
    _train(model, train_loader, epochs)
    out = WEIGHTS_DIR / "model_hybrid.pt"
    out.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), out)
    print(f"Saved {out}")
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the quantum module models.")
    parser.add_argument("model", choices=["cnn", "qnn"])
    parser.add_argument("--n-samples", type=int, default=None)
    parser.add_argument("--epochs", type=int, default=None)
    args = parser.parse_args()

    if args.model == "cnn":
        train_cnn(
            n_samples=args.n_samples or 100,
            epochs=args.epochs or 10,
        )
    else:
        train_qnn(
            n_samples=args.n_samples or 300,
            epochs=args.epochs or 15,
        )


if __name__ == "__main__":
    main()
