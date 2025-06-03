import { MaterialIcons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "./api/index";
import AudioCapture from "./components/audioCapture";
import Card from "./components/card"; // Assuming you have a Card component
import ModalCardDetails from "./components/modal"; // Assuming you have a ModalCardDetails component
import Tabs from "./components/tabs";
import { useUser } from "./context/userContext"; // Assuming you have a user context
function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Memories");
  const [memories, setMemories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchUsersMemories = async () => {
      const response = await api.get(`/api/user/memories${user.userId}`);

      if (response.status !== 200) {
        console.error("Failed to fetch memories");
        setMemories([]);
        return;
      }

      setMemories(response.data);
    };
    fetchUsersMemories();
  }, []);

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    router.replace("/");
  };
  const handleCardPress = card => {
    setModalVisible(true);
    setSelectedCard(card);
  };

  const handleQuestionPress = () => {
    setShowQuestionModal(true);
    setSelectedCard({
      questionCard: true,
      question: "this is my title",
      response: "my response was this text testing to make sure it works",
    });
  };
  let content;
  if (activeTab === "Memories") {
    if (!memories || memories.length === 0) {
      content = <Text style={styles.text}>No memories found.</Text>;
    } else
      content = memories.map(memory => (
        <Card key={memory.id} time={memory.time} question={memory.question} timeleft={memory.timeleft} onPress={() => handleCardPress(memory)} />
      ));
  } else if (activeTab === "Calendar") {
    content = (
      <TouchableOpacity onPress={handleCardPress}>
        <Text style={styles.tabContent}>Calendar Screen</Text>
      </TouchableOpacity>
    );
  } else if (activeTab === "Questions") {
    content = (
      <Card
        questionCard={true}
        question="this is my title"
        response={"my response was this text testing to make sure it works"}
        onPress={() => {
          handleQuestionPress();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutIcon} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={28} color="#333" />
      </TouchableOpacity>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {content}
      <ModalCardDetails
        visible={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setSelectedCard(null);
        }}
        onDelete={() => {
          console.log("Delete pressed");
        }}
        questionModal={true}
        card={selectedCard}
        response={selectedCard?.response}
      />
      <ModalCardDetails
        visible={modalVisible}
        onClose={() => {
          setSelectedCard(null);
          setModalVisible(false);
        }}
        card={selectedCard}
      />
      <AudioCapture />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingTop: 60,
  },
  signOutIcon: {
    position: "absolute",
    top: 0,
    left: 1,
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 4,
  },
  tabModalContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 4,
    marginTop: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: "#e0e0e0",
  },
  tabButtonActive: {
    backgroundColor: "#007bff",
  },
  tabButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  tabButtonTextActive: {
    color: "#fff",
  },
  tabContent: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    minWidth: 250,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
