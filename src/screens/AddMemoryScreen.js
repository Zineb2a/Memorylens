
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Arrow Icon
import { storage, db } from "../services/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import AuthContext from "../context/AuthContext";

export default function AddMemoryScreen({ navigation }) {
  const { user, token, loading } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);

  if (loading) {
    return <Text style={styles.loadingText}>Loading user...</Text>;
  }

  if (!user || !token) {
    Alert.alert("Authentication Required", "You must be logged in to add a memory.");
    navigation.navigate("Landing");
    return null;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Back Button (Top Left) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Add a New Memory</Text>
      <TextInput
        placeholder="Label your memory"
        value={label}
        onChangeText={setLabel}
        style={styles.input}
      />
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.saveButton} onPress={() => console.log("Memory Saved!")}>
        <Text style={styles.buttonText}>Save Memory</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAFD", // 🎨 Match Landing Page Background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50, // Adjust for different screens
    left: 20,
    backgroundColor: "#443469",
    padding: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 15,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  pickImageButton: {
    backgroundColor: "#443469",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});
