import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AudioPlayback({ uri }: { uri: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    setIsPlaying(true);
    sound.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
    await sound.playAsync();
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Playback</Text>
      <TouchableOpacity style={styles.button} onPress={isPlaying ? stopAudio : playAudio}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 32 },
  label: { fontSize: 18, marginBottom: 12, color: "#007AFF" },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
