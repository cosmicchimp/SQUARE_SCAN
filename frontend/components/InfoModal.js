import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { useState, useRef, useEffect } from "react";

export default function InfoModal({ isInfoVisible, setInfoVisible }) {
  const slideValue = useRef(new Animated.Value(1000)).current;
  //  Timing animation for the modal
  function popup() {
    Animated.timing(slideValue, {
      toValue: isInfoVisible ? 0 : 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  function slideDown() {
    Animated.timing(slideValue, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setInfoVisible(false);
    });
  }
  useEffect(() => {
    popup();
  }, [isInfoVisible]);
  return (
    <>
      {isInfoVisible && (
        <Animated.View
          style={[
            {
              transform: [{ translateY: slideValue }],
            },
            styles.infoModal,
          ]}
        >
          <View style={{ flex: 1, backgroundColor: "#055" }}>
            <Text style={styles.modalTitle}>SquareScan FAQ:</Text>
            <ScrollView>
              <View style={styles.faqBox}>
                <Text style={styles.faqTitle}>How do I take a photo?</Text>
                <Text style={styles.faqText}>
                  By clicking on each of the 8 squares provided in the project
                  page, you can open your camera and take a photo for each face
                  of the house.
                </Text>
              </View>
              <View style={styles.faqBox}>
                <Text style={styles.faqTitle}>
                  How do I get my measurements?
                </Text>
                <Text style={styles.faqText}>
                  At the bottom of each project there should be a "Measurements"
                  button. Clicking this will prompt you for a payment method,
                  upon payment it will process and return measurements for each
                  of your submitted photos.
                </Text>
              </View>
              <View style={styles.bottomFaqBox}>
                <Text style={styles.faqTitle}>
                  How long to get measurements?
                </Text>
                <Text style={styles.faqText}>
                  The time is takes to recieve all your measurements may vary.
                  However at SquareScan we do our best to optimize all our
                  processes and make sure it's the best experience possible for
                  the user. If you experience any unusually long wait times
                  please contact support.
                </Text>
              </View>
            </ScrollView>
            {/* bottom buttons */}
            <View style={{ flex: 1, justifyContent: "flex-end", top: 2 }}>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  onPress={() => slideDown()}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  infoModal: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 200000,
  },
  closeButton: {
    paddingHorizontal: 20, // Horizontal padding for left and right
    paddingVertical: 12, // Vertical padding for top and bottom
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 5,
    alignSelf: "center", // Centers the button within its container
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
    height: 50, // Fixed height for the button
    width: "60%", // Use a relative width (not fixed percentage)
  },
  buttonBox: {
    height: "15%",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#131313",
    padding: "10%",
    justifyContent: "center",
  },
  closeText: {
    color: "black",
    fontSize: 22,
    fontWeight: 800,
  },
  modalTitle: {
    color: "white",
    fontWeight: 900,
    fontSize: 25,
    padding: "4%",
    alignSelf: "center",
    letterSpacing: 2,
    lineHeight: 40,
  },
  faqTitle: {
    color: "white",
    fontWeight: 900,
    fontSize: 20,
    alignSelf: "center",
    marginTop: "10%",
  },
  faqText: {
    width: "80%",
    alignSelf: "center",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 25,
  },
  faqBox: {
    paddingBottom: "10%",
    gap: 20,
  },
  bottomFaqBox: {
    paddingBottom: "30%",
    gap: 20,
  },
});
