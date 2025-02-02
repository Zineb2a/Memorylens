import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";

export default function LandingScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Login with Email and Password
  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      console.error("❌ Login Error:", error);
    }
    setLoading(false);
  };

  // 🔥 Register with Email and Password
  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
      console.error("❌ Register Error:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.smallCircle} />

      <View style={styles.formContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Sign In</Text>

        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#666" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholderTextColor="#666" />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Sign In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Plain Footer Sentence */}
      <Text style={styles.footerText}>Recognize, Remember, Navigate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAFD",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
    position: "relative",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 250,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 15,
    top: 35,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#443469",
    marginBottom: 25,
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
  input: {
    width: "85%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#443469",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    width: "85%",
    height: 30,
    backgroundColor: "#443469",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 15,
  },
  registerButtonText: {
    color: "#443469",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    position: "absolute",
    bottom: 40, // ✅ Fixes it at the bottom
    fontSize: 19,
    color: "#333", // ✅ Normal dark text
  },
});
