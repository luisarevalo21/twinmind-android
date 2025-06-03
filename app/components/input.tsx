import { StyleSheet, TextInput, View } from "react-native";

const Input = ({ setText, text }) => {
  // const [text, setText] = useState("");
  // const [savedText, setSavedText] = useState("");

  // const handleSave = () => {
  //   setSavedText(text);
  // };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="memory details " value={text} onChangeText={setText} />
      {/* <Button title="Save" onPress={handleSave} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: "auto" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    padding: 8,
    marginBottom: 8,
  },
  savedText: {
    marginTop: 12,
    color: "green",
    fontWeight: "bold",
  },
});

export default Input;
