import React, { useState, useEffect } from "react";
import { View, Button, Text, Modal } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Camera" onPress={() => setIsCameraOpen(true)} />

      <Modal visible={isCameraOpen} animationType="slide">
        <Camera style={{ flex: 1 }} />
        <Button title="Close Camera" onPress={() => setIsCameraOpen(false)} />
      </Modal>
    </View>
  );
}
