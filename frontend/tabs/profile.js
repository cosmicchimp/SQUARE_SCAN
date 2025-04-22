import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Entypo,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
export default function Profile() {
  const { AuthenticateUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const modalValue = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(modalValue, {
      toValue: visible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleButtonPress = () => {
    setVisible(true);
  };
  const handleLogOut = () => {
    AuthenticateUser(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#055" }}>
      {/* Modal */}
      <Animated.View
        style={[styles.modal, { transform: [{ translateX: modalValue }] }]}
      >
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={styles.exitButton}
        >
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
        <Text style={{ color: "black", fontSize: 20 }}>
          This is the modal content
        </Text>
      </Animated.View>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.section, { marginTop: "8%" }]}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Account info</Text>
            <MaterialIcons name="account-circle" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
            <Text style={styles.text}>Theme</Text>
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Language</Text>
            <FontAwesome name="language" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Payment</Text>
            <FontAwesome6 name="money-check-dollar" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Support</Text>
            <Entypo name="phone" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Write a review</Text>
            <MaterialIcons name="reviews" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Clear data</Text>
            <Feather name="trash-2" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Legal</Text>
            <FontAwesome name="legal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleLogOut();
            }}
          >
            <Text style={styles.text}>Log out</Text>
            <FontAwesome6 name="door-open" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 50,
  },
  section: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignSelf: "center",
    width: "100%",
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.65)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontFamily: "System", // Update this to your actual font
    color: "white",
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  exitButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  exitText: {
    fontSize: 16,
    color: "black",
  },
});
