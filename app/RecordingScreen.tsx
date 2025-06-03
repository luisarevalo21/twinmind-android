import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AudioPlayback from "./components/audioPlayback";
export default function RecordingScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Start recording on mount
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") return;
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    })();

    // Cleanup: stop recording if user leaves
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri || null);
      setRecording(null);
    }
  };

  const playAudio = async () => {
    if (audioUri) {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      await sound.playAsync();
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Recording</Text>
        <Text style={styles.tab}>Other Tab</Text>
      </View>
      <View style={styles.recordingIndicator}>
        <Ionicons name="mic" size={48} color="red" />
        <Text style={styles.recordingText}>{recording ? "Recording..." : audioUri ? "Recording stopped" : ""}</Text>
      </View>
      {recording ? (
        <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
          <Ionicons name="stop" size={32} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 8 }}>Stop</Text>
        </TouchableOpacity>
      ) : audioUri ? (
        <TouchableOpacity style={styles.stopButton} onPress={isPlaying ? stopAudio : playAudio}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 8 }}>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      ) : null}
      {audioUri && !recording && <AudioPlayback uri={audioUri} />}
      <TouchableOpacity style={[styles.stopButton, { backgroundColor: "#888", marginTop: 16 }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  tabs: { flexDirection: "row", marginBottom: 32 },
  tabActive: { marginHorizontal: 16, fontWeight: "bold", fontSize: 18, color: "#007AFF" },
  tab: { marginHorizontal: 16, fontSize: 18, color: "#888" },
  recordingIndicator: { alignItems: "center" },
  recordingText: { marginTop: 12, fontSize: 20, color: "red" },
  stopButton: {
    marginTop: 40,
    backgroundColor: "red",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
