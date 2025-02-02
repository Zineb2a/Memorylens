from flask import Flask, request, jsonify
from subprocess import Popen, PIPE
from ultralytics import YOLO
import torch

app = Flask(__name__)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO("yolov8n.pt").to(device)

@app.route('/run-script', methods=['GET'])
def run_script():
    # Replace 'your_script.py' with your actual script
    process = Popen(['python3', 'backend/face-recognition.py'], stdout=PIPE, stderr=PIPE)
    stdout, stderr = process.communicate()
    
    if process.returncode != 0:
        return f"Error: {stderr.decode()}", 500
    
    return f"Script executed successfully! Output: {stdout.decode()}"

@app.route('/process-image', methods=['POST'])
def process_image():
    frame = request.get_json()["frame"]
    results = model(frame)
    return jsonify({"processed_frame": results})





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
