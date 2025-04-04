import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";
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
          fontFamily: "Semi-Bold",
          height: 125,
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        },
        headerTitleStyle: {
          fontFamily: "Semi_bold", // Set your desired font family here
          fontSize: 24, // Change the font size
          color: "#333", // Change the text color
        },
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const imageSource = focused
              ? require("../assets/home-svgrepo-com (1).png")
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
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.focusedView : null,
              ]}
            >
              <Image
                style={styles.navIcon}
                source={require("../assets/plus-square-on-square-svgrepo-com.png")}
              />
            </View>
          ),
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
    marginTop: 70,
    width: 50, // Explicit width for the icon container
    height: 50, // Explicit height for the icon container
  },
  navIcon: {
    maxWidth: 40,
    resizeMode: "contain",
    marginTop: 70,
    opacity: 0.8,
  },
  profileIcon: {
    maxWidth: 35,
    resizeMode: "contain",
    marginTop: 70,
    opacity: 0.8,
  },
});

export default Navigator;
