// src/services/storageService.js
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload an image to Firebase Storage
export const uploadImage = async (imageUri) => {
  const userId = auth.currentUser.uid;
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `memories/${userId}/${Date.now()}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};
