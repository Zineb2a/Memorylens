import React, { useContext, useState, useRef } from "react";
import { View, Text, Button, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { storage, db } from "../services/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import AuthContext from "../context/AuthContext";

import * as FileSystem from 'expo-file-system';


export default function AddMemoryScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [facing, setFacing] = useState("back");
  const [capturing, setCapturing] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const startCapturing = async () => {
    if (!cameraRef.current) return;
    setCapturing(true);
    let frames = [];

    for (let i = 0; i < 5; i++) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      frames.push(photo.uri);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setCapturedFrames(frames.slice(0, 3));
    setCapturing(false);
  };

  const compressImage = async (uri) => {
    const compressedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return compressedImage.uri;
  };

  // const uriToBlob = async (uri) => {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = function () {
  //       resolve(xhr.response);
  //     };
  //     xhr.onerror = function () {
  //       reject(new Error("Failed to convert URI to Blob"));
  //     };
  //     xhr.responseType = "blob";
  //     xhr.open("GET", uri, true);
  //     xhr.send(null);
  //   });
  // };


const uriToBlob = async (uri) => {
  try {
    const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const blob = new Blob([file], { type: "image/jpeg" });
    return blob;
  } catch (error) {
    console.error("❌ Failed to convert URI to Blob:", error);
    throw error;
  }
};


  const uploadImages = async () => {
    if (!user || capturedFrames.length === 0) {
      Alert.alert("Error", "No frames captured.");
      return;
    }

    let imageUrls = [];
    for (let frame of capturedFrames) {
      try {
        const compressedUri = await compressImage(frame);
        const blob = await uriToBlob(compressedUri);

        const fileName = `memories/${user.uid}/${Date.now()}.jpg`;
        const fileRef = ref(storage, fileName);
        await uploadBytes(fileRef, blob);
        const imageUrl = await getDownloadURL(fileRef);
        imageUrls.push(imageUrl);
      } catch (error) {
        Alert.alert("Upload Error", `Failed to upload image: ${error.message}`);
        return;
      }
    }

    try {
      await addDoc(collection(db, "users", user.uid, "memories"), {
        label: "New Object",
        image_urls: imageUrls,
        created_at: new Date(),
      });

      Alert.alert("Success!", "Memory saved.");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Database Error", "Failed to save memory.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Object</Text>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={startCapturing} disabled={capturing}>
            <Text style={styles.text}>Start Capturing</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {capturedFrames.length > 0 && <Button title="Save Memory" onPress={uploadImages} />}
      {capturedFrames.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.preview} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  message: { textAlign: "center", paddingBottom: 10 },
  title: { textAlign: "center", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, flexDirection: "row", backgroundColor: "transparent", margin: 64 },
  button: { flex: 1, alignSelf: "flex-end", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
  preview: { width: 100, height: 100, margin: 5 },
});