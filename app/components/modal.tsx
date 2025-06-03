import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Input from "./input";
import Tabs from "./tabs";

export default function ModalCardDetails({ visible, onClose, card, questionModal, response, onDelete }) {
  const [activeTab, setActiveTab] = useState("Memories");
  const [text, setText] = useState("");
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [miniModalText, setMiniModalText] = useState("");

  const handleInputChange = val => {
    setText(val);
    if (val.length > 0) {
      setShowMiniModal(true);
      setMiniModalText(val);
    } else {
      setShowMiniModal(false);
      setMiniModalText("");
    }
  };

  const handleReset = () => {
    setText("");
    setShowMiniModal(false);
    setMiniModalText("");
  };

  let content = null;
  if (activeTab === "Memories") {
    content = <Text>Memories Content</Text>;
  } else if (activeTab === "Calendar") {
    content = <Text>Calendar Content</Text>;
  } else if (activeTab === "Questions") {
    content = <Text>Questions Content</Text>;
  }

  if (questionModal) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 250,
              width: "95%",
              height: "70%",
              alignSelf: "flex-start",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              {/* Back Button */}
              <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                <MaterialIcons name="arrow-back" size={24} color="#007bff" />
              </TouchableOpacity>
              <View style={{ width: 32 }} />
            </View>
            <View
              style={{
                marginTop: 16,
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "flex-start",
                textAlign: "left",
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 8, alignItems: "center" }}>
                <Text style={{ fontSize: 15, textAlign: "left", flex: 1 }}>{card?.question}</Text>
                <TouchableOpacity onPress={onDelete}>
                  <MaterialIcons name="delete" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
              <Text style={{ color: "blue", marginTop: 4, marginBottom: 4, fontWeight: "bold" }}>Response:</Text>
              <Text>{response}</Text>

              <Text style={{ textAlign: "left", fontSize: 12, color: "lightgrey", marginTop: "100%" }}>May 17, 2025 . 2:00pm</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          style={{
            backgroundColor: "#fff",
            padding: 24,
            borderRadius: 12,
            minWidth: 250,
            width: "95%",
            height: "70%",
            alignSelf: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            {/* Back Button */}
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <MaterialIcons name="arrow-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text>00:09</Text>
            <View style={{ width: 32 }} />
          </View>
          <View
            style={{
              marginTop: 16,
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "flex-start",
              textAlign: "left",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "left" }}>{card?.question}</Text>
            <Text style={{ textAlign: "left" }}>May 17, 2025 . 2:00pm</Text>
          </View>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {content}

          {showMiniModal && (
            <View
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 110,
                backgroundColor: "#222",
                padding: 12,
                borderRadius: 8,
                zIndex: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff", flex: 1 }}>{miniModalText}</Text>
                <TouchableOpacity onPress={handleReset} style={{ marginLeft: 12 }}>
                  <MaterialIcons name="refresh" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Input text={text} setText={handleInputChange} />
        </View>
      </View>
    </Modal>
  );
}
