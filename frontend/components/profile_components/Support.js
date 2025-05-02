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
  Linking,
} from "react-native";
import { useState, useRef, useEffect } from "react";
export default function Support({ supportVisible, updateSupportVisible }) {
  const slideValue = useRef(new Animated.Value(1000)).current;
  //Timing animation for the modal
  function openEmail() {
    Linking.openURL("mailto:squarescaninc@gmail.com").catch((err) =>
      console.error("Could not open email client", err)
    );
  }
  function popup() {
    Animated.timing(slideValue, {
      toValue: supportVisible ? 0 : 1000,
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
      updateSupportVisible(false);
    });
  }
  useEffect(() => {
    popup();
  }, [supportVisible]);

  return (
    <>
      {supportVisible && (
        <Animated.View
          style={[
            {
              transform: [{ translateX: slideValue }],
            },
            styles.infoModal,
          ]}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.9) " }}>
            <View style={styles.headerBox}></View>

            <ScrollView>
              <Text style={styles.modalTitle}>Support Info:</Text>
              <Text style={styles.faqText}>
                {"\u00A0\u00A0\u00A0\u00A0"} For help with SquareScan services
                or business inquiries please contact us at{" "}
                <Text style={{ fontWeight: "bold" }}>
                  squarescaninc@gmail.com{"\u00A0"}
                </Text>
                We'll get back to you as soon as possible.
              </Text>
              <View style={styles.faqBox}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    openEmail();
                    slideDown();
                  }}
                >
                  <Text style={styles.closeText}>Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    slideDown();
                  }}
                >
                  <Text style={styles.closeText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  headerBox: {
    backgroundColor: "black",
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
    width: "70%",
    alignSelf: "center",
    color: "white",
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 30,
    marginBottom: 60,
    marginTop: 20,
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
