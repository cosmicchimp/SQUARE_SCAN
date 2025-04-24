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
export default function AccountInfo({
  currentUser,
  profileInfoVisible,
  updateProfileInfoVisible,
  userInfo,
}) {
  console.log("COMING FROM ACCOUNT  INFO", userInfo);
  const slideValue = useRef(new Animated.Value(1000)).current;
  //  Timing animation for the modal
  function popup() {
    Animated.timing(slideValue, {
      toValue: profileInfoVisible ? 0 : 1000,
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
      updateProfileInfoVisible(false);
    });
  }
  useEffect(() => {
    popup();
  }, [profileInfoVisible]);

  return (
    <>
      {profileInfoVisible && (
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
              <Text style={styles.modalTitle}>Account Info:</Text>
            </View>

            <ScrollView>
              <View style={styles.faqBox}>
                <Text style={styles.faqTitle}>Email: {userInfo.email}</Text>
                <Text style={styles.faqTitle}>
                  Phone: {userInfo.phone === null ? "None" : userInfo.phone}
                </Text>
                <Text style={styles.faqTitle}>Password: hidden</Text>
                <Text style={styles.faqTitle}>
                  Account Creation Date: {userInfo.created_at}
                </Text>
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
