import cv2
import torch
import numpy as np
from ultralytics import YOLO
from facenet_pytorch import InceptionResnetV1
from PIL import Image

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load YOLOv8 model (move to GPU)
model = YOLO("yolov8n.pt").to(device)  # Ensure this model is trained for faces

# Load FaceNet model (move to GPU)
face_rec_model = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Function to normalize images for FaceNet (better recognition)
def prewhiten(x):
    mean, std = x.mean(), x.std()
    std_adj = np.maximum(std, 1.0 / np.sqrt(x.size))
    return (x - mean) / std_adj

# Load stored face embeddings
known_faces = {
    "Fatou : Neighbour": [],
    "Haifaa : First Born": [],
     "Sofia : Friend ": []
}

known_embeddings = {}

# Convert stored images to embeddings
for name, image_paths in known_faces.items():
    embeddings = []
    for img_path in image_paths:
        img = cv2.imread(img_path)
        img = cv2.resize(img, (160, 160))  # Resize image
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB
        img = prewhiten(img)  # Normalize
        img = torch.tensor(img, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0).to(device)

        with torch.no_grad():
            embedding = face_rec_model(img).detach().cpu().numpy()  # Get embedding
        embeddings.append(embedding)

    known_embeddings[name] = np.mean(embeddings, axis=0).astype(np.float32)  # Store as float32

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break

    # Run YOLOv8 face detection on GPU
    results = model(frame)

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Get bounding box coordinates
            face = frame[y1:y2, x1:x2]  # Crop face region

            if face.shape[0] < 10 or face.shape[1] < 10:  # Avoid very small detections
                continue

            # Convert face to embedding
            face = cv2.resize(face, (160, 160))  # Resize for FaceNet
            face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)  # Convert to RGB
            face = prewhiten(face)  # Normalize
            face_tensor = torch.tensor(face, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0).to(device)

            with torch.no_grad():
                face_embedding = face_rec_model(face_tensor).detach().cpu().numpy()

            # Compare with known face embeddings
            min_dist = float("inf")
            identified_person = "Unknown"
            for name, emb in known_embeddings.items():
                dist = np.linalg.norm(face_embedding - emb)  # Compute Euclidean distance
                if dist < min_dist:
                    min_dist = dist
                    identified_person = name if dist < 0.8 else "Unknown"  # Adjust threshold (lower = stricter)

            # Draw bounding box and label
            color = (0, 255, 0) if identified_person != "Unknown" else (0, 0, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, identified_person, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    # Display the frame
    cv2.imshow("YOLOv8 Real-Time Face Recognition", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()