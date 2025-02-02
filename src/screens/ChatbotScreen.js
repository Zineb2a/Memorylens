import React from "react";
import { View, StyleSheet } from "react-native";
import Chatbot from "../components/Chatbot";  // ✅ Import Chatbot

const ChatbotScreen = () => {
  return (
    <View style={styles.container}>
      <Chatbot />  {/* ✅ Render the Chatbot inside the screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default ChatbotScreen;
