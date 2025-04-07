import {
  StyleSheet,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logos/Gemini_Generated_Image_sl6i2osl6i2osl6i.jpg";

export default function LoginScreen() {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [signupVisible, updateSignupVisible] = useState(false);
  const slideValue = useRef(new Animated.Value(1000)).current;

  // Trigger the slide animation when signupVisible changes
  useEffect(() => {
    Animated.timing(slideValue, {
      toValue: signupVisible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true, // Ensure useNativeDriver is set to true for performance
    }).start();
  }, [signupVisible]);

  function handleSignUp() {
    updateSignupVisible(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={Logo} />
      </View>

      {/* Modal with a transparent background to show behind content */}
      {signupVisible && (
        <Animated.View
          style={[
            styles.modalBackground,
            {
              opacity: signupVisible ? 0.5 : 0, // Fade in/out
            },
          ]}
        />
      )}

      {/* Animated modal container */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateX: slideValue }],
            opacity: signupVisible ? 1 : 0, // Fade in/out with the sliding effect
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            updateSignupVisible(false);
          }}
        >
          <Text style={styles.text}>Exit</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.form}>
        <TextInput
          value={username}
          onChangeText={updateUsername}
          placeholder="Username"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={updatePassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>Don't have an account?</Text>

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={[styles.signupText, styles.textBtn]}>Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "rgb(1,1,1)",
    borderRadius: 5,
    width: 100,
    padding: 8,
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  text: {
    color: "white",
    fontWeight: "800", // Ensure correct font weight
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  form: {
    alignItems: "center",
    marginBottom: 30,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: "80%",
    padding: 10,
    marginBottom: 15,
  },
  signupBtn: {
    alignSelf: "center",
    marginTop: 10,
  },
  signupText: {
    alignSelf: "center",
    marginBottom: 10,
  },
  textBtn: {
    color: "black",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject, // Covers the whole screen
    backgroundColor: "black",
    zIndex: 1000, // Ensures it's on top of other elements
  },
  modal: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    padding: 20,
    backgroundColor: "white", // Background color for the modal content
    borderRadius: 10,
    zIndex: 1001, // Make sure modal is on top of the background
  },
});
