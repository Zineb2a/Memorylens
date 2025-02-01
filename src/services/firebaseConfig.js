// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore database
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Storage for images
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

// Your Firebase configuration (replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyAK-kttslvQ-FoYH2Bzu8yEL5-oz-0WgDE",
  authDomain: "memorylens-51b2e.firebaseapp.com",
  databaseURL: "https://memorylens-51b2e.firebaseio.com",
  projectId: "memorylens-51b2e",
  storageBucket: "memorylens-51b2e.appspot.com", // ✅ Fixed typo in storage bucket
  messagingSenderId: "730443709508",
  appId: "1:730443709508:web:4b080f3dfa83373a42d011",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };