import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import AuthContext from "../context/AuthContext";

function WhoIsItScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("🚨 No user detected!");
      return;
    }
    fetchIdentities();
  }, [user]);

  const fetchIdentities = async () => {
    try {
      const identitiesRef = collection(db, `users/${user.uid}/whoIsIt`);
      const querySnapshot = await getDocs(identitiesRef);
      const identityList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown",
          image_urls: data.image_urls && data.image_urls.length > 0 ? data.image_urls : [null], 
          description: data.description || "",
          created_at: data.created_at ? new Date(data.created_at.seconds * 1000) : new Date(),
        };
      });
      setIdentities(identityList);
    } catch (error) {
      console.error("❌ Error fetching identities:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIdentity = async (identityId) => {
    Alert.alert(
      "Delete Identity",
      "Are you sure you want to delete this identity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, `users/${user.uid}/whoIsIt/${identityId}`));
              setIdentities((prevIdentities) => prevIdentities.filter(id => id.id !== identityId));
              Alert.alert("✅ Success!", "Identity deleted.");
            } catch (error) {
              console.error("❌ Error deleting identity:", error);
              Alert.alert("Error", "Failed to delete identity.");
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
        <Text style={styles.message}>Please log in to view identities.</Text>
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

      <Text style={styles.title}>Who Is It?</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#443469" />
      ) : identities.length === 0 ? (
        <Text style={styles.noIdentities}>No identities stored yet.</Text>
      ) : (
        <FlatList
          data={identities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.identityCard}>
              {item.image_urls[0] ? (
                <Image source={{ uri: item.image_urls[0] }} style={styles.image} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}
              <Text style={styles.identityName}>{item.name}</Text>
              {item.description ? <Text style={styles.identityDescription}>{item.description}</Text> : null}
              <Text style={styles.identityDate}>{item.created_at.toDateString()}</Text>
              
              {/* 🚀 DELETE BUTTON */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteIdentity(item.id)}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
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
  noIdentities: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 50,
  },
  identityCard: {
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
  identityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  identityDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  identityDate: {
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

export default WhoIsItScreen;
