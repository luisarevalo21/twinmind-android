import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Slot, Tabs } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../context/userContext"; // Assuming you have a user context

export default function TabLayout() {
  // const [user, setUser] = useState(null);

  const { user, setUser } = useUser();
  useEffect(() => {
    GoogleSignin.configure({ webClientId: "894785707749-qstkfhn4qkbmvgvphgj915l42245favc.apps.googleusercontent.com" });
    const userInfo = GoogleSignin.getCurrentUser();

    setUser(userInfo?.user);
  }, []);

  if (!user) {
    return <Slot />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      {/* <Tabs.Screen name="index" options={{ title: "Home" }} /> */}
      {/* <Tabs.Screen name="about" options={{ title: "About" }} /> */}
    </Tabs>
  );
}
