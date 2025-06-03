import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../api";
import { useUser } from "../context/userContext";

export default function AudioCapture() {
  const [input, setInput] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80} style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setPopupVisible(true)} activeOpacity={1}>
            <View pointerEvents="none">
              <TextInput style={styles.input} placeholder="Type a message..." value={input} editable={false} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={() => router.push("/RecordingScreen")}>
            <Ionicons name="mic" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={popupVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.popupContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
            <Ionicons name="close" size={32} color="#007AFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.popupInput}
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
              autoFocus
              onSubmitEditing={async () => {
                await api.post(`/api/user/${user.userId}/message`, { message: input });
                setPopupVisible(false);
                setInput("");
              }}
            />
            <TouchableOpacity
              style={{
                padding: 2,
                alignItems: "center",
                marginTop: 16,
              }}
              onPress={async () => {
                if (input.trim().length > 0) {
                  await api.post(`/api/user/${user.userId}/message`, { message: input });
                  setPopupVisible(false);
                  setInput("");
                }
              }}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#25292e",
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    color: "#000",
  },
  captureButton: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 24,
    left: 16,
    zIndex: 10,
  },
  popupInput: {
    marginTop: 64,
    fontSize: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    color: "#000",
  },
});
