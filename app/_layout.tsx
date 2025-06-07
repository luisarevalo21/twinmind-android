import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { UserProvider, useUser } from "./context/userContext";

function RootLayoutInner() {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({ webClientId: "894785707749-qstkfhn4qkbmvgvphgj915l42245favc.apps.googleusercontent.com" });
    const userInfo = GoogleSignin.getCurrentUser();
    setUser(userInfo?.user ?? null);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutInner />
    </UserProvider>
  );
}
