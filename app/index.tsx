import { GoogleSignin, GoogleSigninButton, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "./api/index";
import { useUser } from "./context/userContext";
export default function Index() {
  // const [user, setUser] = useState(null);
  const { user, setUser } = useUser();
  const router = useRouter();
  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      // console.log("Google Sign-In Response:", response);
      if (isSuccessResponse(response)) {
        const user = response.data;
        const { id, name, email } = user.user;
        const newResponse = await api.post("/api/user/newUser", { userId: id, name, email });
        setUser(newResponse.data);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.error("errpr", error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({ webClientId: "894785707749-qstkfhn4qkbmvgvphgj915l42245favc.apps.googleusercontent.com" });

    const userInfo = GoogleSignin.getCurrentUser();

    if (userInfo) {
      setUser(userInfo.user);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user]);

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome, {user.name}!</Text>
        <Text style={styles.text}>Email: {user.email}</Text>

        <TouchableOpacity
          onPress={() => {
            GoogleSignin.signOut().then(() => {
              setUser(null);
            });
          }}
        >
          <Text style={styles.button}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/twinmind.png")} style={{ width: 400, height: 200 }} />
      <Text style={styles.text}>Welcome to TwinMind</Text>
      <Text style={styles.subtext}>Please sign in to continue</Text>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    borderRadius: 5,
    backgroundColor: "#3b3b3b",
  },
  subtext: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "rgb(107 114 128/var(--tw-text-opacity,1))",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
