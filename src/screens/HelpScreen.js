import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";

function HelpScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [helpTopics, setHelpTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("🚨 No user detected!");
      return;
    }
    fetchHelpTopics();
  }, [user]);

  const fetchHelpTopics = async () => {
    try {
      const helpRef = collection(db, "helpTopics"); // Fetching help content
      const querySnapshot = await getDocs(helpRef);
      const topicList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHelpTopics(topicList);
    } catch (error) {
      console.error("❌ Error fetching help topics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>Please log in to view help topics.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Auth")}>
          <Text style={styles.text}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Help & Guidance</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#443469" />
      ) : helpTopics.length === 0 ? (
        <Text style={styles.noTopics}>No help topics available.</Text>
      ) : (
        <FlatList
          data={helpTopics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.topicCard}>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Text style={styles.topicDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// 🎨 **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAFD",
    padding: 60,
    marginTop: -1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#443469",
    padding: 8,
    borderRadius: 50,
    marginTop: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4B0082",
  },
  noTopics: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 50,
  },
  topicCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  topicDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#443469",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HelpScreen;
