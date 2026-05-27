"""HTTP routes for image classification with the classic CNN and hybrid QNN."""

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.modules.quantum import service
from app.modules.quantum.schemas import PredictionResponse

router = APIRouter(prefix="/predict", tags=["Quantum ML"])


_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}


def _check_image(file: UploadFile) -> None:
    if file.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported media type: {file.content_type}. "
                   f"Allowed: {sorted(_ALLOWED_CONTENT_TYPES)}.",
        )


@router.post(
    "/cnn",
    response_model=PredictionResponse,
    summary="Classify an image with the classic CNN",
    description=(
        "Classic LeNet-style CNN trained on CIFAR-10 (airplane vs automobile). "
        "Upload an image and the model will return the predicted class. "
        "Images are auto-converted to RGB and resized to 32×32."
    ),
    responses={
        415: {"description": "Unsupported image type"},
        500: {"description": "Inference error"},
    },
)
async def predict_cnn(file: UploadFile = File(..., description="Image file (JPEG/PNG/WEBP/BMP).")):
    _check_image(file)
    image_bytes = await file.read()
    try:
        return service.predict_cnn(image_bytes)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post(
    "/qnn",
    response_model=PredictionResponse,
    summary="Classify an image with the hybrid Quantum NN",
    description=(
        "Hybrid model: a small CNN extracts a 2-D feature, which is fed into a 2-qubit "
        "variational quantum circuit (ZZFeatureMap + RealAmplitudes) wired through "
        "Qiskit's TorchConnector. **Slower** than the classic CNN — expect ~1-2 s per request."
    ),
    responses={
        415: {"description": "Unsupported image type"},
        500: {"description": "Inference error"},
    },
)
async def predict_qnn(file: UploadFile = File(..., description="Image file (JPEG/PNG/WEBP/BMP).")):
    _check_image(file)
    image_bytes = await file.read()
    try:
        return service.predict_qnn(image_bytes)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc)) from exc
