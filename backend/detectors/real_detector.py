from facenet_pytorch import MTCNN

import os
import re
from typing import Dict, Any, List

import cv2
import numpy as np
import torch
from torch import nn
from torch.nn import AdaptiveAvgPool2d, Dropout, Linear
from timm.models.efficientnet import tf_efficientnet_b7_ns

from backend.detectors.base import BaseDetector


class DeepFakeClassifier(nn.Module):
    def __init__(self):
        super().__init__()

        self.encoder = tf_efficientnet_b7_ns(
            pretrained=False,
            drop_path_rate=0.2
        )

        self.avg_pool = AdaptiveAvgPool2d((1, 1))
        self.dropout = Dropout(0.0)
        self.fc = Linear(2560, 1)

    def forward(self, x):
        x = self.encoder.forward_features(x)
        x = self.avg_pool(x).flatten(1)
        x = self.dropout(x)
        return self.fc(x)


class RealDeepfakeDetector(BaseDetector):
    def __init__(self, weights_path: str = None):
        base_dir = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        if weights_path is None:
            weights_path = os.path.join(
                base_dir,
                "models",
                "final_111_DeepFakeClassifier_tf_efficientnet_b7_ns_0_36"
            )

        self.weights_path = weights_path
        self.device = torch.device("cpu")

        # -------------------------------------------------
        # DOWNLOAD MODEL AUTOMATICALLY IF MISSING
        # -------------------------------------------------

        if not os.path.exists(self.weights_path):
            import requests

            print("DFDC model not found. Downloading model...")

            os.makedirs(
                os.path.dirname(self.weights_path),
                exist_ok=True
            )

            model_url = (
                "https://github.com/selimsef/"
                "dfdc_deepfake_challenge/"
                "releases/download/0.0.1/"
                "final_111_DeepFakeClassifier_"
                "tf_efficientnet_b7_ns_0_36"
            )

            with requests.get(
                model_url,
                stream=True,
                timeout=600
            ) as response:

                response.raise_for_status()

                with open(
                    self.weights_path,
                    "wb"
                ) as model_file:

                    for chunk in response.iter_content(
                        chunk_size=1024 * 1024
                    ):
                        if chunk:
                            model_file.write(chunk)

            print("DFDC model downloaded successfully.")

        # -------------------------------------------------
        # LOAD NEURAL MODEL
        # -------------------------------------------------

        self.model = DeepFakeClassifier().to(
            self.device
        )

        checkpoint = torch.load(
            self.weights_path,
            map_location=self.device,
            weights_only=False
        )

        state_dict = checkpoint.get(
            "state_dict",
            checkpoint
        )

        # Remove module. prefix from original training
        state_dict = {
            re.sub(r"^module\.", "", key): value
            for key, value in state_dict.items()
        }

        self.model.load_state_dict(
            state_dict,
            strict=True
        )

        self.model.eval()

        self.is_loaded = True

        # -------------------------------------------------
        # MTCNN FACE DETECTOR
        # -------------------------------------------------

        self.face_detector = MTCNN(
            margin=0,
            thresholds=[0.7, 0.8, 0.8],
            device=self.device
        )

    @property
    def name(self) -> str:
        return "DFDC EfficientNet-B7 Deepfake Detector"

    @property
    def version(self) -> str:
        return "2.2-dfdc-mtcnn"

    # -------------------------------------------------
    # SAMPLE VIDEO FRAMES
    # -------------------------------------------------

    def _sample_video_frames(
        self,
        file_path: str,
        max_frames: int = 12
    ) -> List[np.ndarray]:

        cap = cv2.VideoCapture(file_path)

        if not cap.isOpened():
            return []

        frame_count = int(
            cap.get(cv2.CAP_PROP_FRAME_COUNT)
        )

        if frame_count <= 0:
            cap.release()
            return []

        number_of_frames = min(
            max_frames,
            frame_count
        )

        indices = np.linspace(
            0,
            frame_count - 1,
            number_of_frames,
            dtype=int
        )

        frames = []

        for frame_index in indices:
            cap.set(
                cv2.CAP_PROP_POS_FRAMES,
                int(frame_index)
            )

            success, frame = cap.read()

            if success and frame is not None:
                frames.append(frame)

        cap.release()

        return frames

    # -------------------------------------------------
    # EXTRACT FACE USING MTCNN
    # -------------------------------------------------

    def _extract_face(
        self,
        frame: np.ndarray
    ) -> np.ndarray | None:

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        height, width = rgb_frame.shape[:2]

        # Detect on half-size frame
        # matching original DFDC approach
        small_frame = cv2.resize(
            rgb_frame,
            (
                max(1, width // 2),
                max(1, height // 2)
            )
        )

        boxes, probs = self.face_detector.detect(
            small_frame,
            landmarks=False
        )

        if boxes is None or len(boxes) == 0:
            return None

        if probs is not None:
            best_index = int(
                np.argmax(probs)
            )
        else:
            best_index = 0

        bbox = boxes[best_index]

        xmin, ymin, xmax, ymax = [
            int(value * 2)
            for value in bbox
        ]

        face_width = xmax - xmin
        face_height = ymax - ymin

        if face_width <= 0 or face_height <= 0:
            return None

        margin_width = face_width // 3
        margin_height = face_height // 3

        x1 = max(
            xmin - margin_width,
            0
        )

        y1 = max(
            ymin - margin_height,
            0
        )

        x2 = min(
            xmax + margin_width,
            frame.shape[1]
        )

        y2 = min(
            ymax + margin_height,
            frame.shape[0]
        )

        face = frame[
            y1:y2,
            x1:x2
        ]

        if face.size == 0:
            return None

        return face

    # -------------------------------------------------
    # PREPROCESS FACE
    # -------------------------------------------------

    def _preprocess_face(
        self,
        face: np.ndarray
    ) -> torch.Tensor:

        face = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2RGB
        )

        height, width = face.shape[:2]

        scale = 380.0 / max(
            height,
            width
        )

        new_width = max(
            1,
            int(width * scale)
        )

        new_height = max(
            1,
            int(height * scale)
        )

        interpolation = (
            cv2.INTER_AREA
            if scale < 1.0
            else cv2.INTER_CUBIC
        )

        face = cv2.resize(
            face,
            (new_width, new_height),
            interpolation=interpolation
        )

        # 380x380 black canvas
        image = np.zeros(
            (380, 380, 3),
            dtype=np.uint8
        )

        start_x = (
            380 - new_width
        ) // 2

        start_y = (
            380 - new_height
        ) // 2

        image[
            start_y:start_y + new_height,
            start_x:start_x + new_width
        ] = face

        tensor = torch.from_numpy(
            image
        ).float()

        tensor = tensor.permute(
            2,
            0,
            1
        )

        tensor = tensor / 255.0

        mean = torch.tensor(
            [0.485, 0.456, 0.406],
            dtype=torch.float32
        ).view(
            3,
            1,
            1
        )

        std = torch.tensor(
            [0.229, 0.224, 0.225],
            dtype=torch.float32
        ).view(
            3,
            1,
            1
        )

        tensor = (
            tensor - mean
        ) / std

        return tensor

    # -------------------------------------------------
    # RUN MODEL ON VIDEO
    # -------------------------------------------------

    def _predict_video(
        self,
        file_path: str
    ) -> List[float]:

        frames = self._sample_video_frames(
            file_path,
            max_frames=12
        )

        probabilities = []

        for frame in frames:
            face = self._extract_face(
                frame
            )

            if face is None:
                continue

            tensor = self._preprocess_face(
                face
            )

            tensor = tensor.unsqueeze(0)

            tensor = tensor.to(
                self.device
            )

            with torch.no_grad():
                output = self.model(
                    tensor
                )

                fake_probability = (
                    torch.sigmoid(
                        output
                    )
                    .squeeze()
                    .item()
                )

            probabilities.append(
                float(fake_probability)
            )

        return probabilities

    # -------------------------------------------------
    # MAIN ANALYZE FUNCTION
    # -------------------------------------------------

    def analyze(
        self,
        file_path: str,
        media_type: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:

        if not self.is_loaded:
            raise RuntimeError(
                "Deepfake model is not loaded."
            )

        if media_type != "VIDEO":
            raise ValueError(
                "Current real detector supports VIDEO files only."
            )

        probabilities = self._predict_video(
            file_path
        )

        # -------------------------------------------------
        # NO FACE DETECTED
        # -------------------------------------------------

        if not probabilities:
            return {
                "detector_scores": {},
                "likely_technique":
                    "Unable to determine",
                "technique_confidence":
                    0.0,
                "explanations": [
                    {
                        "title":
                            "No usable face detected",
                        "confidence":
                            "Low",
                        "description":
                            "The neural detector could not "
                            "detect a usable face in the "
                            "sampled video frames."
                    }
                ],
                "multi_face_info": [],
                "is_suspicious": False,
                "raw_fake_probability": None,
                "frames_analyzed": 0
            }

        # -------------------------------------------------
        # CALCULATE RESULT
        # -------------------------------------------------

        fake_probability = float(
            np.mean(probabilities)
        )

        manipulation_percent = round(
            fake_probability * 100,
            1
        )

        authenticity_percent = round(
            100.0 - manipulation_percent,
            1
        )

        # Conservative suspicious flag
        is_suspicious = (
            fake_probability >= 0.45
        )

        detector_scores = {
            "face": authenticity_percent
        }

        # -------------------------------------------------
        # TECHNIQUE CLASSIFICATION
        # -------------------------------------------------

        if fake_probability >= 0.70:
            likely_technique = (
                "Deepfake / AI Manipulation"
            )

            confidence = (
                manipulation_percent
            )

        elif fake_probability >= 0.45:
            likely_technique = (
                "Possible Deepfake Manipulation"
            )

            confidence = (
                manipulation_percent
            )

        elif fake_probability >= 0.25:
            likely_technique = (
                "Possible Manipulation / Uncertain"
            )

            confidence = (
                100.0 - abs(
                    manipulation_percent - 50.0
                )
            )

        else:
            likely_technique = (
                "None Detected"
            )

            confidence = (
                authenticity_percent
            )

        # -------------------------------------------------
        # EXPLANATION CONFIDENCE
        # -------------------------------------------------

        if (
            fake_probability >= 0.75
            or fake_probability <= 0.25
        ):
            explanation_confidence = "High"

        elif (
            fake_probability >= 0.60
            or fake_probability <= 0.40
        ):
            explanation_confidence = "Medium"

        else:
            explanation_confidence = "Low"

        explanations = [
            {
                "title":
                    "DFDC EfficientNet-B7 Neural Analysis",

                "confidence":
                    explanation_confidence,

                "description":
                    f"Neural model analyzed "
                    f"{len(probabilities)} detected face frames. "
                    f"Average fake probability: "
                    f"{manipulation_percent}%."
            }
        ]

        multi_face_info = [
            {
                "person_id": 1,
                "name": "Detected Face",
                "manipulation_probability":
                    manipulation_percent,
                "is_manipulated":
                    is_suspicious,
                "bbox": []
            }
        ]

        return {
            "detector_scores":
                detector_scores,

            "likely_technique":
                likely_technique,

            "technique_confidence":
                round(confidence, 1),

            "explanations":
                explanations,

            "multi_face_info":
                multi_face_info,

            "is_suspicious":
                is_suspicious,

            "raw_fake_probability":
                manipulation_percent,

            "frames_analyzed":
                len(probabilities)
        }