import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";

function MemoriesScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("🚨 No user detected!");
      return;
    }
    fetchMemories();
  }, [user]);

  const fetchMemories = async () => {
    try {
      const memoriesRef = collection(db, `users/${user.uid}/memories`);
      const querySnapshot = await getDocs(memoriesRef);
      const memoryList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          label: data.label || "Untitled",
          image_urls: data.image_urls && data.image_urls.length > 0 ? data.image_urls : [null], 
          note: data.note || "",
          created_at: data.created_at ? new Date(data.created_at.seconds * 1000) : new Date(),
        };
      });
      setMemories(memoryList);
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (memoryId) => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this memory?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, `users/${user.uid}/memories/${memoryId}`));
              setMemories((prevMemories) => prevMemories.filter(mem => mem.id !== memoryId));
              Alert.alert("Success!", "Memory deleted.");
            } catch (error) {
              console.error("❌ Error deleting memory:", error);
              Alert.alert("Error", "Failed to delete memory.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>Please log in to view your memories.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Auth")}>
          <Text style={styles.text}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Memories</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#443469" />
      ) : memories.length === 0 ? (
        <Text style={styles.noMemories}>No memories saved yet.</Text>
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memoryCard}>
              {item.image_urls[0] ? (
                <Image source={{ uri: item.image_urls[0] }} style={styles.image} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}
              <Text style={styles.memoryLabel}>{item.label}</Text>
              {item.note ? <Text style={styles.memoryNote}>{item.note}</Text> : null}
              <Text style={styles.memoryDate}>{item.created_at.toDateString()}</Text>
              
              {/*DELETE BUTTON */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMemory(item.id)}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

// **Styles**
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
  noMemories: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 50,
  },
  memoryCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  noImageText: {
    color: "#555",
    fontSize: 16,
  },
  memoryLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  memoryNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  memoryDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#D32F2F",
    padding: 6,
    borderRadius: 50,
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

export default MemoriesScreen;
