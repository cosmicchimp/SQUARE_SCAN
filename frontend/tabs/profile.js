import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
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
import AccountInfo from "../components/profile_components/AccountInfo";
import Theme from "../components/profile_components/Theme";
import Language from "../components/profile_components/Language";
import Support from "../components/profile_components/Support";
import Review from "../components/profile_components/Review";
export default function Profile() {
  const { AuthenticateUser } = useContext(AuthContext);
  const [profileInfoVisible, updateProfileInfoVisible] = useState(false);
  const [themeVisible, updateThemeVisible] = useState(false);
  const [languageVisible, updateLanguageVisible] = useState(false);
  const [supportVisible, updateSupportVisible] = useState(false);
  const [reviewVisible, updateReviewVisible] = useState(false);
  const [userInfo, updateUserInfo] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const handleLogOut = () => {
    AuthenticateUser(false);
  };
  async function clearData() {
    const databaseClear = await fetch(
      "https://square-scan.onrender.com/cleardata",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUser }),
      }
    );
    const message = await databaseClear.json();
    alert(
      "Data successfully deleted. You may need to restart your app to see some changes take place"
    );
  }
  async function grabUserInfo() {
    try {
      const res = await fetch(
        "https://square-scan.onrender.com/grabaccountinfo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: currentUser,
          }),
        }
      );
      const data = await res.json();
      updateUserInfo(data.data[0]);
      console.log(data);
    } catch (e) {
      console.log("Error in grabuserinfo profile page:", e);
    }
  }

  const iconColor = "#673AB7";
  return (
    <>
      <AccountInfo
        currentUser={currentUser}
        profileInfoVisible={profileInfoVisible}
        updateProfileInfoVisible={updateProfileInfoVisible}
        userInfo={userInfo}
      />
      <Theme
        themeVisible={themeVisible}
        updateThemeVisible={updateThemeVisible}
      />
      <Language
        languageVisible={languageVisible}
        updateLanguageVisible={updateLanguageVisible}
      />
      <Support
        supportVisible={supportVisible}
        updateSupportVisible={updateSupportVisible}
      />
      <Review
        reviewVisible={reviewVisible}
        updateReviewVisible={updateReviewVisible}
      />
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Settings List */}
        <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
          <View style={[styles.section, { marginTop: "8%" }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await grabUserInfo();
                updateProfileInfoVisible(true);
              }}
            >
              <Text style={styles.text}>Account info</Text>
              <MaterialIcons name="account-circle" size={24} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                updateThemeVisible(true);
              }}
              style={styles.button}
            >
              <Text style={styles.text}>Theme</Text>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                updateLanguageVisible(true);
              }}
            >
              <Text style={styles.text}>Language</Text>
              <FontAwesome name="language" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                updateSupportVisible(true);
              }}
            >
              <Text style={styles.text}>Support</Text>
              <Entypo name="phone" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                updateReviewVisible(true);
              }}
            >
              <Text style={styles.text}>Write a review</Text>
              <MaterialIcons name="reviews" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to clear all data?",
                  "This will remove all projects and photos associated with your account.",
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: async () => {
                        try {
                          await clearData();
                        } catch (e) {
                          console.log("onPress Error: ", e);
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.text}>Clear data</Text>
              <Feather name="trash-2" size={24} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Legal</Text>
              <FontAwesome name="legal" size={24} color={iconColor} />
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
              <FontAwesome6 name="door-open" size={24} color={iconColor} />
            </TouchableOpacity>
    
          </View>
        </ScrollView>
      </View>
    </>
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
    borderTopColor: "rgba(0, 0, 0, 0.65)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontFamily: "System", // Update this to your actual font
    color: "black",
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
