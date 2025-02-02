import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AuthContext from "../context/AuthContext";

export default function AuthScreen() {
  const { loginWithAuth0 } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MemoryLens</Text>
      
      <TouchableOpacity style={styles.loginButton} onPress={loginWithAuth0}>
        <Text style={styles.loginText}>Login with Auth0</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEAFD",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#443469",
    padding: 15,
    borderRadius: 8,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
