import React, { useContext, useState } from "react";
import { View, Text, Button, Alert, TextInput, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Fix deprecated property
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Memory</Text>
      <TextInput
        placeholder="Label your memory"
        value={label}
        onChangeText={setLabel}
        style={styles.input}
      />
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Save Memory" onPress={() => console.log("Memory Saved!")} />
    </View>
  );
}

// ✅ FIX: Add missing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});
