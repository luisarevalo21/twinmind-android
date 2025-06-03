import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function Card({ questionCard, time, question, timeleft, onPress, response }) {
  if (!questionCard) {
    return (
      <View style={cardStyles.card} onTouchEnd={onPress}>
        <Text style={{ marginRight: 5 }}>{time}</Text>
        <Text style={{ textAlign: "center" }}>{question}</Text>
        <Text> {timeleft}</Text>
      </View>
    );
  }

  return (
    <View style={cardStyles.card} onTouchEnd={onPress}>
      <MaterialIcons name="search" size={22} color="#888" style={{ marginRight: 8 }} />
      <View style={{ display: "flex", alignItems: "left", flexDirection: "column", width: "100%", marlginLeft: 10 }}>
        <Text style={{ textAlign: "left" }}>{question}</Text>
        <Text style={cardStyles.response} numberOfLines={1} ellipsizeMode="tail">
          {response}
        </Text>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    shadowRadius: 8,
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    display: "flex",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    marginTop: 5,
  },
});

export default Card;
