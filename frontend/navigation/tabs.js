import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View, SafeAreaView } from "react-native";
import ProjectScreen from "../tabs/projects.js";
import ProfileScreen from "../tabs/profile.js";
import HomeScreen from "../tabs/home.js";
import NewScreen from "../tabs/new.js";

const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          fontFamily: "Lill-Lill",
          height: 110,
          display: "flex",
          flexDirection: "row",
          backgroundColor: "rgba(255, 255, 255, 0.89)",
          alignItems: "center",
        },
        headerTitleStyle: {
          fontFamily: "Condensed-Regular",
          fontSize: 24, // Change the font size
          color: "black", // Change the text color
          textTransform: "uppercase", // This makes the text uppercase
        },
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const imageSource = focused
              ? require("../assets/home-svgrepo-(1).png")
              : require("../assets/home-svgrepo-com.png");
            return (
              <View
                style={[
                  styles.iconContainer,
                  focused ? styles.focusedView : null,
                ]}
              >
                <Image style={styles.navIcon} source={imageSource} />
              </View>
            );
          },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={"Projects"}
        component={ProjectScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const imageSource = focused
              ? require("../assets/grid-search-svgrepo-com-filled.png") // Focused state image
              : require("../assets/grid-search-svgrepo-com.png"); // Default image
            return (
              <View
                style={[
                  styles.iconContainer,
                  focused ? styles.focusedView : null,
                ]}
              >
                <Image style={styles.navIcon} source={imageSource} />
              </View>
            );
          },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={"New Project"}
        component={NewScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const imageSource = focused
              ? require("../assets/plus-square-fill-on-square-fill-svgrepo-com.png") // Focused state image
              : require("../assets/plus-square-on-square-svgrepo-com.png"); // Default image
            return (
              <View
                style={[
                  styles.iconContainer,
                  focused ? styles.focusedView : null,
                ]}
              >
                <Image style={styles.navIcon} source={imageSource} />
              </View>
            );
          },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name={"Profile"}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const imageSource = focused
              ? require("../assets/profile-svgrepo-com (2).png") // Focused state image
              : require("../assets/profile-svgrepo-com.png"); // Default image
            return (
              <View style={[styles.iconContainer]}>
                <Image style={styles.profileIcon} source={imageSource} />
              </View>
            );
          },
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 45,
    marginTop: 40,
    width: 50, // Explicit width for the icon container
    height: 50, // Explicit height for the icon container
  },
  navIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    opacity: 0.8,
  },
  profileIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    opacity: 0.8,
  },
});

export default Navigator;
