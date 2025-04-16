import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
export default function NewProject() {
  const [isVisible, updateVisible] = useState(true);
  const slideValue = useRef(new Animated.Value(1000)).current;

  function popup() {
    Animated.timing(slideValue, {
      toValue: isVisible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  useEffect(() => {
    updateVisible(true);
  }, []);
  useEffect(() => {
    popup();
  }, [isVisible]);
  return (
    <View style={styles.body}>
      <Animated.View
        style={[{ transform: [{ translateY: slideValue }] }, styles.popupModal]}
      >
        <TouchableOpacity
          onPress={() => {
            updateVisible(!isVisible);
          }}
        >
          <Text>Exit</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        onPress={() => {
          updateVisible(true);
        }}
        style={styles.button}
      >
        <Text style={styles.text}>New Project</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    height: "100%",
    backgroundColor: "rgb(0, 0, 0)",
  },
  button: {
    backgroundColor: "white",
    padding: "2%",
    borderRadius: 5,
  },
  text: {
    color: "black",
  },
  popupModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    zIndex: 1000,
    backgroundColor: "white",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
});
