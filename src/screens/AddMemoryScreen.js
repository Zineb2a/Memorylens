import React, { useContext, useState, useRef, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator 
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";

function AddMemoryScreen({ navigation }) {
  const { user, setUser, loading } = useContext(AuthContext);
  const [facing, setFacing] = useState("back");
  const [capturing, setCapturing] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePictures = async () => {
    if (!cameraRef.current) return;
    setCapturing(true);
    let frames = [];
    for (let i = 0; i < 5; i++) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      frames.push(photo.uri);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setCapturedFrames(frames);
    setCapturing(false);
    askForLabel();
  };

  const askForLabel = () => {
    Alert.prompt(
      "Label Memory",
      "Enter a label for this memory:",
      (inputLabel) => {
        if (inputLabel) {
          setLabel(inputLabel);
          askForNote();
        }
      }
    );
  };

  const askForNote = () => {
    Alert.prompt(
      "Add a Note (Optional)",
      "Would you like to add a note to this memory?",
      (inputNote) => {
        if (inputNote) setNote(inputNote);
      },
      "plain-text",
      ""
    );
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", { uri: imageUri, type: "image/jpeg", name: "memory.jpg" });
      data.append("upload_preset", "memory"); 
      const response = await fetch("https://api.cloudinary.com/v1_1/dlotlvg9e/image/upload", {
        method: "POST",
        body: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const saveMemoryToFirestore = async (label, imageUrls, note) => {
    if (!user || !label.trim() || imageUrls.length === 0) {
      Alert.alert("Error", "Label and images are required.");
      return;
    }
    try {
      const memoryDocRef = doc(collection(db, `users/${user.uid}/memories`));
      await setDoc(memoryDocRef, { label, image_urls: imageUrls, note, created_at: new Date() });
      Alert.alert("✅ Success!", "Memory saved.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", "Failed to save memory.");
    }
  };

  const uploadImagesAndSave = async () => {
    if (!capturedFrames.length || !label.trim()) {
      Alert.alert("Error", "Please provide a label and capture at least one image.");
      return;
    }
    setUploading(true);
    let imageUrls = await Promise.all(capturedFrames.map(uploadToCloudinary));
    imageUrls = imageUrls.filter(Boolean);
    setUploading(false);
    if (imageUrls.length > 0) saveMemoryToFirestore(label, imageUrls, note);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture & Label Memory</Text>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <TouchableOpacity style={styles.button} onPress={takePictures}>
          <Text style={styles.text}>Capture</Text>
        </TouchableOpacity>
      </CameraView>
      {uploading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <TouchableOpacity style={styles.button} onPress={uploadImagesAndSave}>
          <Text style={styles.text}>Save Memory</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F8F8F8" },
  title: { textAlign: "center", fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  camera: { flex: 1, width: "100%", aspectRatio: 3 / 4, borderRadius: 10, overflow: "hidden" },
  button: { backgroundColor: "#443469", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  text: { color: "white", fontWeight: "bold" },
});

export default AddMemoryScreen;
