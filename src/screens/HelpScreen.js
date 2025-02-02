import React, { useState, useRef } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons for Back Button
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";

export default function WhoIsItScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Replace with your backend URL (Ngrok if needed)
  const BACKEND_URL = "https://59c2-132-205-229-28.ngrok-free.app/detect/";

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>📸 Camera access is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      setError(null);

      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

        await sendToBackend(photo.uri);
      } catch (error) {
        console.error("❌ Capture Error:", error);
        setError("Failed to capture image.");
        setLoading(false);
      }
    }
  };

  const sendToBackend = async (imageUri) => {
    try {
      setLoading(true);
      setError(null);

      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist at given URI.");
      }

      let formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "room.jpg",
        type: "image/jpeg",
      });

      console.log("📡 Sending request to:", BACKEND_URL);

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend response:", data);
      setRoom(data.room);
      speak(data.room);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Failed to detect room. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    Speech.speak(`Detected room is ${text}`, {
      language: "en",
      pitch: 1,
      rate: 0.8,
    });
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button (Same as MemoriesScreen) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.captureButtonText}>📷</Text>
        </TouchableOpacity>
      </CameraView>

      {loading && <ActivityIndicator size="large" color="#FFFFFF" style={styles.loading} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {room !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>🏠 {room}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  // ✅ Same Back Button as MemoriesScreen
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#443469",
    padding: 8,
    borderRadius: 50,
    zIndex: 10, // ✅ Ensures it stays above everything
  },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "rgba(255,255,255,0.6)",
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  captureButtonText: {
    fontSize: 30,
    color: "#000",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  resultContainer: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionText: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

