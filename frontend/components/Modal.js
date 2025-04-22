import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
export default function NewProject({
  isVisible,
  updateVisible,
  projectName,
  updateProjectName,
  projectPush,
  projectAddress,
  updateProjectAddress,
  currentUser,
  updateDataStatus,
}) {
  const slideValue = useRef(new Animated.Value(1000)).current;
  //  Timing animation for the modal
  function popup() {
    Animated.timing(slideValue, {
      toValue: isVisible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  function slideDown() {
    Animated.timing(slideValue, {
      toValue: 1000,
      duration: 500,
      gap: 20,
      useNativeDriver: true,
    }).start(() => {
      updateVisible(false);
    });
  }
  // runs modal on visible update
  useEffect(() => {
    if (isVisible) {
      updateProjectName("");
    }
    popup();
  }, [isVisible]);

  //Creating states for the form information

  return (
    <>
      {isVisible && (
        <Animated.View
          style={[
            { transform: [{ translateY: slideValue }] },
            styles.popupModal,
            { backgroundColor: "rgba(1, 1, 1, 0.73)" },
          ]}
        >
          {/* Creation of the form view inside the modal */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Create a new project:</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of project"
              placeholderTextColor="rgba(255, 255, 255, 0.81)"
              onChangeText={(val) => {
                updateProjectName(val);
              }}
              value={projectName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="rgba(255, 255, 255, 0.81)"
              onChangeText={(val) => {
                updateProjectAddress(val);
              }}
              value={projectAddress}
            />
          </View>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => {
                projectPush({
                  project_name: projectName,
                  creator_email: currentUser,
                  address: projectAddress,
                  updateDataStatus: updateDataStatus,
                }),
                  slideDown();
              }}
            >
              <Text style={styles.text}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => {
                slideDown();
              }}
            >
              <Text style={styles.text}>Exit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
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
    borderColor: "grey",
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
    fontSize: 15,
    fontWeight: 900,
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
    borderColor: "grey",
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
    height: "50%",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "grey",
  },
  formTitle: {
    padding: "10%",
    width: "90%",
    alignSelf: "center",

    fontSize: 24,
    fontWeight: 900,
  },
  input: {
    backgroundColor: "#055",
    borderWidth: 2,
    borderColor: "grey",
    padding: "5%",
    width: "90%",
    alignSelf: "center",
    marginBottom: "10%",
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 900,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: "5%",
  },
});
