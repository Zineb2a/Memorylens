import React, { useContext, useState, useRef, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";  // ✅ Import Ionicons
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";

export default function AddMemoryScreen({ navigation }) {
  const { user, setUser, loading } = useContext(AuthContext);
  const [facing, setFacing] = useState("back");
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

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* 🔥 POPUP NOTIFICATION */}
      {showNotification && (
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Heads Up! 📷</Text>
            <Text style={styles.modalText}>
              6 captures will be taken. 
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowNotification(false)}>
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.title}>Capture & Label Memory</Text>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.text}>Capture</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#F8F8F8", 
    alignItems: "center",
    paddingTop: 70  
  },

  // ✅ Back Button Styling (Same as MemoriesScreen)
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#443469",
    padding: 10,
    borderRadius: 50,
    zIndex: 10, // ✅ Ensures button stays on top
  },

  title: { 
    textAlign: "center", 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#333" 
  },
  
  camera: { 
    flex: 1, 
    width: "100%", 
    aspectRatio: 3 / 4, 
    borderRadius: 10, 
    overflow: "hidden" 
  },
  
  button: { 
    backgroundColor: "#443469", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 1 
  },
  
  text: { 
    color: "white", 
    fontWeight: "bold" 
  },

  // 🔥 MODAL STYLES
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
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#443469", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  modalText: { 
    fontSize: 16, 
    color: "#555", 
    textAlign: "center", 
    marginBottom: 20 
  },
  modalButton: { 
    backgroundColor: "#443469", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8 
  },
  modalButtonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  overlay: { 
    position: "absolute", 
    top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: "rgba(0, 0, 0, 0.4)", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: 10 
  },
});
