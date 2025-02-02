import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Arrow Icon

export default function MemoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 🔥 Back Button (Top Left) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Screen Content */}
      <Text style={styles.title}>Saved Memories</Text>
      <Text style={styles.description}>Here are all the memories you’ve saved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAFD",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50, // 🔥 Adjust for different screens
    left: 20,
    backgroundColor: "#443469",
    padding: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
