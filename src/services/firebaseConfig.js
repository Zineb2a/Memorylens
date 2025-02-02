import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAK-kttslvQ-FoYH2Bzu8yEL5-oz-0WgDE",
  authDomain: "memorylens-51b2e.firebaseapp.com",
  projectId: "memorylens-51b2e",
  storageBucket: "memorylens-51b2e.appspot.com",
  messagingSenderId: "730443709508",
  appId: "1:730443709508:web:4b080f3dfa83373a42d011",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
const db = getFirestore(app);

export { auth, db };
