// src/services/authService.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Sign up new user
export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    createdAt: new Date(),
  });

  return user;
};

// Login user
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout user
export const logout = async () => {
  return await signOut(auth);
};
