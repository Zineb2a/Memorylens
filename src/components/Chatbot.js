import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "@env";
import Icon from "react-native-vector-icons/MaterialIcons";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat`, {
        messages: [...messages, userMessage],
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dr. Patience</Text>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.role === "user" ? styles.userMessage : styles.assistantMessage]}>
            <Text style={[styles.messageText, msg.role === "user" ? styles.userText : styles.assistantText]}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : <Icon name="send" size={24} color="#ffffff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafe",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#70B1CB",
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "75%",
    alignSelf: "flex-start",
  },
  assistantMessage: {
    backgroundColor: "#eaf4fc",
  },
  userMessage: {
    backgroundColor: "#c2e1f6",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: "#ffffff",
  },
  assistantText: {
    color: "#333333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#70B1CB",
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});

export default Chatbot;
