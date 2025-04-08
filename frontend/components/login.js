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
import AntDesign from "@expo/vector-icons/AntDesign";

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

  function handleSignUpBtn() {
    updateSignupVisible(true);
  }
  function handleSignUpForm() {
    submitForm();
  }
  const handleLogin = async (user, pass) => {
    const loginPush = await fetch("https://square-scan.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password: password }),
    });
  };
  //Sign up data
  const [signupEmail, updateSignupEmail] = useState("");
  const [signupPass, updateSignupPass] = useState("");
  const [verifyPass, updateVerifyPass] = useState("");
  const [signupPhone, updateSignupPhone] = useState("");
  const submitForm = async () => {
    const dataPush = await fetch("https://square-scan.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: signupEmail, password: signupPass }),
    });
  };
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
        <View style={styles.signupHeader}>
          <TouchableOpacity
            onPress={() => {
              updateSignupVisible(false);
            }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.signupTitle}>Create an account</Text>
        </View>
        <View style={styles.signupForm}></View>
        <TextInput
          value={signupEmail}
          onChangeText={updateSignupEmail}
          placeholder="Email"
          style={styles.input}
        />
        <TextInput
          value={signupPass}
          onChangeText={updateSignupPass}
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
        />
        <TextInput
          value={verifyPass}
          onChangeText={updateVerifyPass}
          placeholder="Verify password"
          style={styles.input}
          secureTextEntry={true}
        />
        <Text style={styles.passInfo}>
          A password requires 9+ characters, one number, and one symbol
        </Text>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            handleSignUpForm();
          }}
        >
          <Text style={styles.text}>Create Account</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.form}>
        <TextInput
          value={username}
          onChangeText={updateUsername}
          placeholder="Email"
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleLogin();
        }}
      >
        <Text style={styles.text}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>Don't have an account?</Text>

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUpBtn}>
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
    backgroundColor: "rgb(0, 0, 0)",
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
    alignSelf: "center",
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
  signupTitle: {
    fontWeight: 600,
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 20,
    marginLeft: 30,
    marginBottom: 30,
  },
  passInfo: {
    color: "black",
    alignSelf: "center",
  },
  signupForm: {
    gap: 10,
  },
  buttonBox: {
    alignContent: "center",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  signupHeader: {
    flexDirection: "row",
    alignContent: "center",
  },
  nextButton: {
    backgroundColor: "rgb(1,1,1)",
    borderRadius: 5,
    width: 200,
    padding: 8,
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 20,
  },
});
