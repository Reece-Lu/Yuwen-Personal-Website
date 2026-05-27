"""Pydantic response schemas for the quantum module."""

from enum import IntEnum
from pydantic import BaseModel, Field


class CifarBinaryClass(IntEnum):
    """The two CIFAR-10 classes the models were trained on."""

    AIRPLANE = 0
    AUTOMOBILE = 1


class PredictionResponse(BaseModel):
    """Result of an image classification call."""

    prediction: int = Field(
        ...,
        description="Predicted class index (0 = airplane, 1 = automobile).",
        examples=[0],
    )
    label: str = Field(
        ...,
        description="Human-readable class label.",
        examples=["airplane"],
    )
    model: str = Field(
        ...,
        description="Which model produced the prediction.",
        examples=["cnn"],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"prediction": 0, "label": "airplane", "model": "cnn"},
                {"prediction": 1, "label": "automobile", "model": "qnn"},
            ]
        }
    }
