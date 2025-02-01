import React, { useState, useEffect, useContext } from "react"; // ✅ Import useState & useEffect
import { View, Text, Button, FlatList, Image, StyleSheet } from "react-native";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AuthContext from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("User is not authenticated.");
      return;
    }
    fetchMemories();
  }, [user]);

  const fetchMemories = async () => {
    try {
      if (!user) return;
      const memoriesRef = collection(db, "users", user.sub, "memories");
      const querySnapshot = await getDocs(memoriesRef);
      setMemories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Your Memories</Text>
      {loading && <Text>Loading memories...</Text>}
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memoryCard}>
            <Text>{item.label}</Text>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        )}
      />
      <Button title="Add Memory" onPress={() => navigation.navigate("AddMemory")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  memoryCard: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  image: { width: 100, height: 100, marginVertical: 5 },
});
