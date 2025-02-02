import React, { useContext, useState, useRef, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";  // ✅ Import Ionicons for Back Button
import { CameraView, useCameraPermissions } from "expo-camera";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";

export default function AddMemoryScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [capturing, setCapturing] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

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
    for (let i = 0; i < 6; i++) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      frames.push(photo.uri);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setCapturedFrames(frames);
    setCapturing(false);
    askForLabel();
  };

  const askForLabel = () => {
    Alert.prompt("Label Memory", "Enter a label for this memory:", (inputLabel) => {
      if (inputLabel) {
        setLabel(inputLabel);
        askForNote();
      }
    });
  };

  const askForNote = () => {
    Alert.prompt("Add a Note (Optional)", "Would you like to add a note to this memory?", (inputNote) => {
      if (inputNote) setNote(inputNote);
    }, "plain-text", "");
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
      
      // ✅ Ensures proper navigation to Memories Page
      navigation.navigate("MemoriesScreen");

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
      {/* ✅ BACK BUTTON (Same as MemoriesScreen) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {showNotification && (
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Heads Up! 📷</Text>
            <Text style={styles.modalText}>The app will take 6 captures automatically. Please hold your phone steady.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowNotification(false)}>
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.title}>Capture & Label Memory</Text>
      <CameraView style={styles.camera} facing={"back"} ref={cameraRef}>
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
  container: { flex: 1, justifyContent: "center", padding: 60, backgroundColor: "#F8F8F8", alignItems: "center" ,  marginTop: -1},
  title: { textAlign: "center", fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  camera: { flex: 1, width: "100%", aspectRatio: 3 / 4, borderRadius: 10, overflow: "hidden" },
  button: { backgroundColor: "#443469", padding: 17, borderRadius: 8, alignItems: "center", marginTop: 2 },
  text: { color: "white", fontWeight: "bold" },

  // ✅ BACK BUTTON (Same as MemoriesScreen)
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#443469",
    padding: 10,
    borderRadius: 50,
    zIndex: 10, // ✅ Ensures button stays on top
    marginTop: -1
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#443469", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  modalButton: { backgroundColor: "#443469", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  modalButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "center", alignItems: "center", zIndex: 10 },
});
