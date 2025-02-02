import * as Speech from "expo-speech";

export const speak = (text) => {
  Speech.speak(text, {
    language: "en",
    pitch: 1,
    rate: 0.8,
  });
};
