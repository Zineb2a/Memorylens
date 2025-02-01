import React from "react";
import { View, Text, Button } from "react-native";

export default function AuthScreen({ navigation }) {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
