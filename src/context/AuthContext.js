import React, { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🛠 Checking Firebase login state...");

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase User Logged In:", firebaseUser);
        setUser(firebaseUser);
      } else {
        console.error("No Firebase User Found! Logging Out...");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("✅ User Logged Out!");
    } catch (error) {
      console.error("❌ Logout Failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
