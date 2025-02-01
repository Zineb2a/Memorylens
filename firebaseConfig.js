// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore database
import { getAuth } from "firebase/auth"; // Firebase authentication

// Your Firebase configuration (replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyAK-kttslvQ-FoYH2Bzu8yEL5-oz-0WgDE",
  authDomain: "memorylens-51b2e.firebaseapp.com",
  databaseURL: "https://memorylens-51b2e.firebaseio.com",
  projectId: "memorylens-51b2e",
  storageBucket: "memorylens-51b2e.firebasestorage.app",
  messagingSenderId: "730443709508",
  appId: "1:730443709508:web:4b080f3dfa83373a42d011",
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services you will use
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Authentication

export { app, db, auth };
