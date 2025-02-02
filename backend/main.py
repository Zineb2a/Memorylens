from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import torch
from ultralytics import YOLO
import uvicorn

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO("yolov8n.pt").to(device)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        data = await websocket.receive_bytes()  # Receive frame from frontend
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        results = model(frame)
        faces = [{"x1": int(box.xyxy[0][0]), "y1": int(box.xyxy[0][1]), 
                  "x2": int(box.xyxy[0][2]), "y2": int(box.xyxy[0][3])} 
                 for result in results for box in result.boxes]

        await websocket.send_json({"faces": faces})  # Send results back

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)