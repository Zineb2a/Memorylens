import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LandingScreen from "./src/screens/LandingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import AddMemoryScreen from "./src/screens/AddMemoryScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import MemoriesScreen from "./src/screens/MemoriesScreen";
import ChatbotScreen from "./src/screens/ChatbotScreen";  // ✅ Import ChatbotScreen
import AuthContext, { AuthProvider } from "./src/context/AuthContext";  // ✅ Corrected Import

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddMemory" component={AddMemoryScreen} />
          <Stack.Screen name="MemoriesScreen" component={MemoriesScreen} />
          <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} />  {/* ✅ Chatbot Screen Navigation */}
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
