import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
export default function NewProject() {
  const [isVisible, updateVisible] = useState(true);
  const slideValue = useRef(new Animated.Value(1000)).current;
  //  Timing animation for the modal
  function popup() {
    Animated.timing(slideValue, {
      toValue: isVisible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  // runs modal on mount
  useEffect(() => {
    updateProjectName("");
    updateVisible(true);
  }, []);
  // runs modal on visible update
  useEffect(() => {
    updateProjectName("");
    popup();
  }, [isVisible]);

  //Creating states for the form information
  const [projectName, updateProjectName] = useState("");
  return (
    <View style={styles.body}>
      {/* Animated modal view */}
      <Animated.View
        style={[{ transform: [{ translateY: slideValue }] }, styles.popupModal]}
      >
        {/* Creation of the form view inside the modal */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name of project"
            placeholderTextColor="rgba(1, 1, 1, 0.76)"
            onChangeText={(val) => {
              updateProjectName(val);
            }}
            value={projectName}
          />
        </View>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            updateVisible(!isVisible);
          }}
        >
          <Text style={styles.text}>Exit</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Normal page view */}
      <View style={styles.textBox}>
        <Text style={styles.pageText}>
          Use this page to create a new project, where you can take photos, scan
          them, and recieve measurements.
        </Text>
        <TouchableOpacity
          onPress={() => {
            updateVisible(true);
          }}
          style={styles.button}
        >
          <Text style={styles.text}>New Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    height: "100%",
    backgroundColor: "rgb(0, 0, 0)",
  },
  textBox: {
    backgroundColor: "rgb(255, 255, 255)",
    height: "40%",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    marginTop: "10%",
    gap: "5%",
    borderWidth: 3,
    borderColor: "rgb(30, 167, 202)",
  },
  button: {
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "rgba(77, 77, 77, 0.25)",
    padding: "4%",
    alignSelf: "center",
    width: "60%",
    borderRadius: 5,
    marginTop: "20%",
    borderWidth: 2,
    borderColor: "rgb(30, 167, 202)",
  },
  pageText: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
    marginTop: "5%",
  },
  text: {
    color: "black",
    alignSelf: "center",
  },
  exitButton: {
    backgroundColor: "white",
    width: "25%",
    padding: "4%",
    borderRadius: 5,
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    borderWidth: 2,
    borderColor: "rgb(30, 167, 202)",
  },
  popupModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    zIndex: 1000,
    backgroundColor: "black",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  form: {
    height: "60%",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "rgb(30, 167, 202)",
  },
  input: {
    backgroundColor: "rgba(30, 168, 202, 0.7)",
    padding: "5%",
    width: "90%",
    alignSelf: "center",
    marginTop: "10%",
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 900,
  },
});
