import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Details() {
  const [data, setData] = useState(null);
  useEffect(() => {
    // Simulate fetching data

    console.log("Fetching data for details page...");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
