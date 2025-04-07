import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useRef } from "react";
const Modal = ({ visible, modalContent, setVisible }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setVisible(false);
        }}
      >
        <Text>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Modal;
