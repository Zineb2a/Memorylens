import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LandingScreen from "./screens/LandingScreen";
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import AddMemoryScreen from "./screens/AddMemoryScreen";
import LoadingScreen from "./screens/LoadingScreen";
import MemoriesScreen from "./screens/MemoriesScreen";
import { AuthProvider } from "./context/AuthContext"; // ✅ Ensure AuthProvider is correctly imported
import AuthContext from "./context/AuthContext";
import HelpScreen from "./screens/HelpScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext); // ✅ Correctly extract user & loading

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
          <Stack.Screen name="HelpScreen" component={HelpScreen} />
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
