import React, { useContext, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";

function LoginScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Firebase Login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("✅ Logged in:", userCredential.user);
      navigation.replace("Home"); // ✅ Redirect after login
    } catch (error) {
      Alert.alert("Login Failed", error.message);
      console.error("❌ Login Error:", error);
    }
  };

  // 🔥 Firebase Register
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("✅ Registered:", userCredential.user);
      navigation.replace("Home"); // ✅ Redirect after register
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
      console.error("❌ Register Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Firebase Login</Text>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} 
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

export default LoginScreen;
