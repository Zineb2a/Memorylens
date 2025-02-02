import { Audio } from "expo-av";
import { useState } from "react";
import { View, Button, Text } from "react-native";

const SpeechToText = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [transcript, setTranscript] = useState("");

  const startRecording = async () => {
    try {
      // Set the audio mode for recording on iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true, // Ensures recording works even in silent mode
      });

      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    setRecording(null);
    console.log("Recording saved at", uri);
  };

  return (
    <View>
      <Button title="Start Recording" onPress={startRecording} />
      <Button
        title="Stop Recording"
        onPress={stopRecording}
        disabled={!recording}
      />
      {audioUri && (
        <Button title="Transcribe" onPress={() => transcribeAudio(audioUri)} />
      )}
      <Text>{transcript}</Text>
    </View>
  );
};

export default SpeechToText;
