import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth"; 
import { auth, db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AuthContext from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, setUser, setToken } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddMemory = () => {
    console.log("📝 Navigating to Add Memory. Current User:", user);
    if (!user) {
      console.error("🚨 User is NULL before navigating! Something is wrong.");
    }
    navigation.navigate("AddMemory");
  };
  

  useEffect(() => {
    if (user) fetchMemories();
  }, [user]);

  const fetchMemories = async () => {
    if (!user) return; 

    try {
      const memoriesRef = collection(db, "users", user.uid, "memories"); 
      const querySnapshot = await getDocs(memoriesRef);
      setMemories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Fully logs out
      setUser(null);
      setToken(null);
      navigation.replace("Landing"); // ✅ Prevent back button returning to logged-in state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.smallCircle} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
    top: 50,
    left: 20,
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
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
