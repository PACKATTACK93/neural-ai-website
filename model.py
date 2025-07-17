from deepface import DeepFace
import cv2
import numpy as np
from PIL import Image
import io

def detect_ethnicity(file):
    image = np.array(Image.open(io.BytesIO(file)))
    result = DeepFace.analyze(image, actions=['race'], enforce_detection=False)
    return result[0]['race']
