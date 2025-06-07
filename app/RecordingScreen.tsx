import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "./api/index"; // Adjust the import path as necessary
import { useUser } from "./context/userContext"; // Adjust the import path as necessary
const recordingOptions = {
  android: {
    extension: ".wav",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {},
};
export default function RecordingScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"transcript" | "summary">("transcript");
  const [input, setInput] = useState("");
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const router = useRouter();
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const { user } = useUser();

  // Add a state to track if recording has started
  const [hasStarted, setHasStarted] = useState(false);

  // Start recording on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") return;
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(recordingOptions);
        await newRecording.startAsync();
        setRecording(newRecording);
        setHasStarted(true);
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    })();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  //need to tell the difference betwen sopping and navitation awaty
  const stopRecording = async () => {
    setIsParsing(true);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        try {
          const formData = new FormData();
          formData.append("audio", {
            uri,
            name: "recording.wav",
            type: "audio/wav",
          } as any);
          formData.append("userId", user?.userId ?? "");
          const response = await api.post("/api/audio/generate-summary", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setGeneratedSummary(response.data.text);
        } catch (error) {
          console.error("Error uploading audio:", error);
        } finally {
          setIsParsing(false);
        }
      }
      setAudioUri(uri || null);
      setRecording(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tabButton, activeTab === "transcript" && styles.tabActive]} onPress={() => setActiveTab("transcript")}>
          <Ionicons name="document-text-outline" size={22} color={activeTab === "transcript" ? "#007AFF" : "#888"} />
          <Text style={[styles.tabText, activeTab === "transcript" && styles.tabTextActive]}>Transcript</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === "summary" && styles.tabActive]} onPress={() => setActiveTab("summary")}>
          <Ionicons name="reader-outline" size={22} color={activeTab === "summary" ? "#007AFF" : "#888"} />
          <Text style={[styles.tabText, activeTab === "summary" && styles.tabTextActive]}>Summary</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === "transcript" && <Text style={styles.placeholderText}>Transcript will appear here.</Text>}

        {activeTab === "summary" && generatedSummary ? (
          <Text style={styles.placeholderText}>{generatedSummary}</Text>
        ) : activeTab === "summary" && isParsing ? (
          <View style={styles.recordingIndicator}>
            <Ionicons name="hourglass-outline" size={24} color="red" />
            <Text style={styles.recordingText}>Parsing audio...</Text>
          </View>
        ) : activeTab === "summary" && !generatedSummary && !isParsing ? (
          <Text style={styles.placeholderText}>No summary available yet.</Text>
        ) : null}
      </View>

      {/* Audio Capture/Playback at the bottom */}
      <View style={styles.audioCaptureWrapper}>
        <View style={styles.inputRow}>
          <TextInput style={styles.textInput} placeholder="Type a message..." value={input} onChangeText={setInput} editable={!recording} />
          {!hasStarted && (
            <TouchableOpacity
              style={styles.recordButtonCircle}
              onPress={async () => {
                // Start recording logic (same as useEffect)
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
                  setHasStarted(true);
                } catch (err) {
                  console.error("Failed to start recording", err);
                }
              }}
            >
              <Ionicons name="mic" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {recording && (
            <TouchableOpacity style={styles.recordButtonCircle} onPress={stopRecording}>
              <Ionicons name="stop" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {/* {audioUri && !recording && <AudioPlayback uri={audioUri} />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  audioCaptureWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recordingText: {
    marginLeft: 10,
    fontSize: 16,
    color: "red",
    fontWeight: "500",
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  stopButtonSmall: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonCircle: {
    backgroundColor: "red",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
