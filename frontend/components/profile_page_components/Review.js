import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  Animated,
  Modal,
} from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Review({ reviewVisible, updateReviewVisible }) {
  const { currentUser } = useContext(AuthContext);
  const slideValue = useRef(new Animated.Value(1000)).current;
  //Timing animation for the modal
  async function submitReview() {
    slideDown();
  }
  function popup() {
    Animated.timing(slideValue, {
      toValue: reviewVisible ? 0 : 1000,
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
      updateReviewVisible(false);
    });
  }
  useEffect(() => {
    popup();
  }, [reviewVisible]);

  return (
    <>
      {reviewVisible && (
        <Animated.View
          style={[
            {
              transform: [{ translateX: slideValue }],
            },
            styles.infoModal,
          ]}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.9) " }}>
            <View style={styles.headerBox}>
              <Text style={styles.modalTitle}>Leave A Review!</Text>
            </View>

            <ScrollView>
              <View style={styles.faqBox}>
                <View>
                  <TextInput
                    multiline={true}
                    style={styles.input}
                    placeholder="Share your thoughts..."
                  />
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    submitReview();
                  }}
                >
                  <Text style={styles.closeText}>Submit Review</Text>
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
    width: "70%", // Use a relative width (not fixed percentage)
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
  input: {
    backgroundColor: "white",
    width: "70%",
    alignSelf: "center",
    borderRadius: 5,
    height: 200,
    textAlignVertical: "top",
  },
});
