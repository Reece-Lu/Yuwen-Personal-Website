"""Hybrid Quantum-Classical Neural Network.

A small CNN extracts a 2-D feature vector, which is fed into a 2-qubit
variational quantum circuit (ZZFeatureMap + RealAmplitudes ansatz).
The QNN's expectation value is then mapped to a 2-class output.
"""

import torch
from torch.nn import Conv2d, Dropout2d, Linear, MaxPool2d, Module
from torch.nn.functional import relu

from qiskit import QuantumCircuit
from qiskit.circuit.library import RealAmplitudes, ZZFeatureMap
from qiskit_machine_learning.connectors import TorchConnector
from qiskit_machine_learning.neural_networks import EstimatorQNN


def create_qnn() -> EstimatorQNN:
    """Build the 2-qubit variational quantum circuit used by ``HNet``."""
    feature_map = ZZFeatureMap(2)
    ansatz = RealAmplitudes(2, reps=1)
    qc = QuantumCircuit(2)
    qc.compose(feature_map, inplace=True)
    qc.compose(ansatz, inplace=True)
    return EstimatorQNN(
        circuit=qc,
        input_params=feature_map.parameters,
        weight_params=ansatz.parameters,
        input_gradients=True,
    )


class HNet(Module):
    """CNN feature extractor + QNN classifier."""

    def __init__(self, qnn: EstimatorQNN) -> None:
        super().__init__()
        self.conv1 = Conv2d(3, 6, kernel_size=5)
        self.conv2 = Conv2d(6, 16, kernel_size=5)
        self.dropout = Dropout2d()
        self.fc1 = Linear(16 * 5 * 5, 120)
        self.fc2 = Linear(120, 2)            # 2-D vector fed into the QNN
        self.qnn = TorchConnector(qnn)       # quantum layer
        self.fc3 = Linear(1, 1)              # 1-D QNN output → scalar

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = relu(self.conv1(x))
        x = MaxPool2d(2)(x)
        x = relu(self.conv2(x))
        x = MaxPool2d(2)(x)
        x = self.dropout(x)
        x = x.view(x.shape[0], -1)
        x = relu(self.fc1(x))
        x = self.fc2(x)
        x = self.qnn(x)
        x = self.fc3(x)
        return torch.cat((x, 1 - x), -1)
