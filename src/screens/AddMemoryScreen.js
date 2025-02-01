import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import AuthContext from "../context/AuthContext";

export default function AddMemoryScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  // ✅ Request camera permission when component mounts
  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting camera permission...");
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");

        // ✅ Ensure Camera object exists before accessing Constants
        if (Camera?.Constants) {
          setCameraType(Camera.Constants.Type.back);
        }
      } catch (error) {
        console.error("Error requesting camera permission:", error);
        setHasPermission(false);
      }
    })();
  }, []);

  // ✅ Handle camera ready state
  const onCameraReady = () => {
    console.log("Camera is ready!");
    setIsCameraReady(true);
  };

  // ✅ Debugging: Show logs
  console.log("Camera permission status:", hasPermission);

  // ✅ Show proper messages based on permission state
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera access is required</Text>
        <Button 
          title="Grant Permission" 
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Object</Text>
      {cameraType !== null ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            onCameraReady={onCameraReady}
          />
          <Button title="Start Capturing" onPress={() => console.log("Capturing started...")} disabled={!isCameraReady} />
        </>
      ) : (
        <Text>Loading Camera...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  camera: { width: 300, height: 400, marginBottom: 10 },
});
