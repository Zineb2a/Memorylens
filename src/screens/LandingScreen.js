import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
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
      setUser(userCredential.user); // Store Firebase user
      console.log("✅ Logged in:", userCredential.user);
      navigation.replace("Home"); // Redirect to Home
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
      setUser(userCredential.user); // Store Firebase user
      console.log("✅ Registered:", userCredential.user);
      navigation.replace("Home"); // Redirect to Home
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
      console.error("❌ Register Error:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In or Register</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} disabled={loading} />

      {/* Register Button */}
      <Button title="Register" onPress={handleRegister} disabled={loading} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E6E6FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
