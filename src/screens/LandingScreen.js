import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { auth0Config } from "../services/authConfig";
import AuthContext from "../context/AuthContext";
import { db } from "../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Auth0 authentication endpoints
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
      <Text style={styles.title}>Welcome to MemoryLens</Text>
      <Text style={styles.subtitle}>Capture and cherish your memories</Text>
      <Button title="Login with Auth0" onPress={() => promptAuth()} disabled={!authRequest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginBottom: 20 },
});
