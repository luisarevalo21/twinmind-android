import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Tabs({ activeTab, setActiveTab }) {
  return (
    <View style={[styles.tabsContainer]}>
      <TabButton label="Memories" active={activeTab === "Memories"} onPress={() => setActiveTab("Memories")} />
      <TabButton label="Calendar" active={activeTab === "Calendar"} onPress={() => setActiveTab("Calendar")} />
      <TabButton label="Questions" active={activeTab === "Questions"} onPress={() => setActiveTab("Questions")} />
    </View>
  );
}
// TabButton component
function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
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
});

export default Tabs;
