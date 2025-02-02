import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { auth0Config } from "../services/authConfig";
import AuthContext from "../context/AuthContext";
import { db } from "../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Auth0 authentication endpoints (✅ KEPT INTACT)
const discovery = {
  authorizationEndpoint: `https://${auth0Config.domain}/authorize`,
  tokenEndpoint: `https://${auth0Config.domain}/oauth/token`,
  userInfoEndpoint: `https://${auth0Config.domain}/userinfo`,
};

export default function LandingScreen() {
  const { setUser, setToken } = useContext(AuthContext);
  const [authRequest, authResponse, promptAuth] = AuthSession.useAuthRequest(
    {
      clientId: auth0Config.clientId,
      redirectUri: auth0Config.redirectUri,
      responseType: "token",
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  useEffect(() => {
    if (authResponse?.type === "success") {
      fetchUserInfo(authResponse.params.access_token);
    }
  }, [authResponse]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const userResponse = await fetch(discovery.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userResponse.json();
      console.log("✅ Auth0 User Info:", userData);

      // ✅ Store user info and token globally
      setUser(userData);
      setToken(accessToken);

      // ✅ Save user info in Firestore
      const userRef = doc(db, "users", userData.sub);
      await setDoc(userRef, {
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        authProvider: "Auth0",
        lastLogin: new Date(),
      }, { merge: true });

      Alert.alert("Success!", `Logged in as ${userData.name || userData.email}`);
    } catch (error) {
      console.error("❌ Error signing in:", error);
      Alert.alert("Login Failed", "Could not authenticate with Auth0.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative Circle */}
      <View style={styles.circle} />
      {/* ✅ Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />
       {/* Small Decorative Circle for Balance */}
       <View style={styles.smallCircle} />

      {/* ✅ Title & Subtitle
      <Text style={styles.subtitle}> Recognize, Remember, Navigate </Text> */}
      {/* Footer Text at the Bottom */}
      <View style={styles.footer}>
        <Text style={styles.subtitle}>Recognize. Remember. Navigate.</Text>
      </View>

      {/* ✅ Access the App Button (Triggers Auth0 Login) */}
      <TouchableOpacity style={styles.button} onPress={() => promptAuth()} disabled={!authRequest}>
        <Text style={styles.buttonText}>Access the App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#E6E6FA",
  },
  circle: {
    width: 350, // Adjust size
    height: 350, // Adjust size
    backgroundColor: "rgba(186, 146, 255, 0.3)", // Light purple transparent color
    borderRadius: 175, // Makes it a perfect circle (width/2)
    position: "absolute",
    top: -50, // Move slightly above the screen
    right: -50, // Adjust positioning
  },
  smallCircle: {
    width: 130, // Smaller circle size
    height: 130,
    backgroundColor: "rgba(186, 146, 255, 0.15)", // Lighter transparent purple
    borderRadius: 65, // Perfect circle
    position: "absolute",
    top: 30, // Adjust for balance
    left: -40, // Move towards the left
  },
  
  logo: {
    width: 230,
    height: 230,
    resizeMode: "contain",
    position: "absolute",
    marginTop: 50, // Moves the logo DOWN
    marginBottom: 30, // Adds space below the logo
    marginLeft: 50, // Moves logo RIGHT
    marginRight: 50, // Moves logo LEFT
  },
  title: { 
    fontSize: 34, 
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    position: "absolute", // 🔥 Fixes it to the bottom
    bottom: 40, // 🔥 Adjust distance from the bottom
    alignItems: "center",
    width: "100%", // Full width
    color: "#443469",
  },

  subtitle: { 
    fontSize: 20, 
    marginBottom: 30,
    color: "#443469",
  },
  button: {
    backgroundColor: "#443469",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 250, // Moves the logo DOWN
    marginBottom: 30, // Adds space below the logo
    marginLeft: 52, // Moves logo RIGHT
    marginRight: 50, // Moves logo LEFT
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
