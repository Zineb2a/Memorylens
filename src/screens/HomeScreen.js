import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Arrow Icon
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AuthContext from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, setUser, setToken } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated.");
      return;
    }
    fetchMemories();
  }, [user]);

  const fetchMemories = async () => {
    try {
      if (!user) return;
      const memoriesRef = collection(db, "users", user.sub, "memories");
      const querySnapshot = await getDocs(memoriesRef);
      setMemories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  };

  // ✅ LOGOUT FUNCTION (Using the SAME LOGIC as other buttons)
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigation.navigate("Landing"); // ✅ MATCHING BUTTON NAVIGATION
  };

  return (
    <View style={styles.container}>
   

      {/* Background Circles */}
      <View style={styles.circle} />
      <View style={styles.smallCircle} />
      {/* 🔥 Logout Button (TOP LEFT) */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddMemory")}>
          <Text style={styles.buttonText}>Add Memory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MemoriesScreen")}>
          <Text style={styles.buttonText}>Saved Memories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.helpButton]} onPress={() => navigation.navigate("HelpScreen")}>
          <Text style={styles.helpButtonText}>Guide Me</Text>
        </TouchableOpacity>
      </View>
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
  logoutButton: {
    position: "absolute",
    top: 50, // ✅ Adjust top position
    left: 20, // ✅ Move to the left
    backgroundColor: "#B399D4",
    padding: 10,
    borderRadius: 50,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  circle: {
    width: 350,
    height: 350,
    backgroundColor: "rgba(186, 146, 255, 0.3)",
    borderRadius: 175,
    position: "absolute",
    top: -50,
    right: -50,
  },
  smallCircle: {
    width: 130,
    height: 130,
    backgroundColor: "rgba(186, 146, 255, 0.15)",
    borderRadius: 65,
    position: "absolute",
    top: 30,
    left: -40,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginTop: 90,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#443469",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  helpButton: {
    backgroundColor: "#AC131C",
    width: 250,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    color: "#FFFFFF",
    fontSize: 25, // 🔥 Bigger text ONLY for "Guide Me"
    fontWeight: "bold",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
