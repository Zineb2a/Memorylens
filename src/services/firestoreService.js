// src/services/firestoreService.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

// Add a new memory (label + image URL)
export const addMemory = async (label, imageUrl) => {
  const userId = auth.currentUser.uid;
  await addDoc(collection(db, "users", userId, "memories"), {
    label,
    imageUrl,
    createdAt: new Date(),
  });
};

// Fetch all memories for the logged-in user
export const fetchMemories = async () => {
  const userId = auth.currentUser.uid;
  const memoriesRef = collection(db, "users", userId, "memories");
  const querySnapshot = await getDocs(memoriesRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
