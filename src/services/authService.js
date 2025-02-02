import { auth } from "../services/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const signInWithAuth0 = async () => {
  const { setUser, setToken } = useContext(AuthContext);

  try {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    const auth0Domain = "YOUR_AUTH0_DOMAIN";
    const auth0ClientId = "YOUR_AUTH0_CLIENT_ID";

    const authUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&response_type=token&redirect_uri=${redirectUri}&scope=openid profile email`;
    const response = await AuthSession.startAsync({ authUrl });

    if (response.type === "success") {
      const { id_token } = response.params;
      console.log("✅ Auth0 ID Token Received:", id_token);

      // 🔹 Use Firebase to Sign In with Auth0 Token
      const credential = GoogleAuthProvider.credential(id_token);
      const firebaseUser = await signInWithCredential(auth, credential);

      // 🔹 Store Firebase user & Firebase token in AuthContext
      setUser(firebaseUser.user);
      const firebaseToken = await firebaseUser.user.getIdToken(true);
      setToken(firebaseToken);
      console.log("🔥 Firebase User Signed In and Token Set:", firebaseToken);
    }
  } catch (error) {
    console.error("❌ Error signing in:", error);
  }
};

export { signInWithAuth0 };
