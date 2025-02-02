export const startStreaming = async () => {
  const ws = new WebSocket("wss://172.20.10.6:8000/ws");

  ws.onopen = () => {
    console.log("Connected to WebSocket");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Detected faces:", data);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  setInterval(async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      blob.arrayBuffer().then((buffer) => {
        ws.send(buffer);
      });
    }
  }, 100); // Send a frame every 100ms
};
