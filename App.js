import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import * as AuthSession from "expo-auth-session";
import { auth0Config } from "./authConfig";
import { StatusBar } from "react-native";
import { app, db } from "./firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";

// Auth0 login URL discovery
const discovery = {
  authorizationEndpoint: `https://${auth0Config.domain}/authorize`,
  tokenEndpoint: `https://${auth0Config.domain}/oauth/token`,
  userInfoEndpoint: `https://${auth0Config.domain}/userinfo`,
};

export default function App() {
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);

  // Setup Auth0 authentication request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0Config.clientId,
      redirectUri: auth0Config.redirectUri,
      responseType: "token",
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  // Handle authentication response
  useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response.params.access_token);
    }
  }, [response]);

  // Fetch User Info from Auth0
  const fetchUserInfo = async (accessToken) => {
    try {
      const userResponse = await fetch(discovery.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userResponse.json();
      setUser(userData);
      await saveUserProfile(userData);
      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Save User Profile to Firestore
  const saveUserProfile = async (user) => {
    try {
      await setDoc(doc(db, "users", user.sub), {
        name: user.name || "",
        email: user.email || "",
        createdAt: new Date(),
      });
      console.log("User profile saved to Firestore.");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Fetch User's Memories from Firestore
  const fetchUserMemories = async (userId) => {
    try {
      const q = query(collection(db, "recognized_objects"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userMemories = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMemories(userMemories);
      console.log("Fetched Memories:", userMemories);
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setMemories([]);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome {user.name || user.email}!</Text>
          <Button title="Logout" onPress={logout} />
          <Button title="Fetch Memories" onPress={() => fetchUserMemories(user.sub)} />

          {/* Display User's Memories */}
          <FlatList
            data={memories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Text>{item.objectName} - {new Date(item.timestamp.toDate()).toLocaleString()}</Text>}
          />
        </>
      ) : (
        <View style={styles.landingContainer}>
          <Text style={styles.title}>fghjkljb.ewdjkbjkndewjbhdbhjdw </Text>
          <Text style={styles.subtitle}>Capture and cherish your memories</Text>
          <Button title="Login with Auth0" onPress={() => promptAsync()} />
        </View>
      )}
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
