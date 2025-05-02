import React, { use, useContext, useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, TouchableOpacity, StatusBar, Text} from "react-native";

import { useRoute, useNavigationState, useIsFocused } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import { AnimationContext } from "../context/AnimationContext";

import ProjectScreen from "../tabs/projects";
import ProfileScreen from "../tabs/profile";
import HomeScreen from "../tabs/HomeScreen";

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HomeModernIcon, UserIcon, Squares2X2Icon, } from "react-native-heroicons/solid";
import { HomeModernIcon as HomeModernIconOutline, UserIcon as UserIconOutline, Squares2X2Icon as Squares2X2IconOutline, } from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

const screens = [
  {
    name: "Projects",
    component: ProjectScreen,
    icons: { solid: Squares2X2Icon, outline: Squares2X2IconOutline },
    },
  {
    name: "Square Scan",
    component: HomeScreen,
    icons: { solid: HomeModernIcon, outline: HomeModernIconOutline },
  },
  {
    name: "Profile",
    component: ProfileScreen,
    icons: { solid: UserIcon, outline: UserIconOutline },
  },
];

const Navigator = ({navigation, route}) => {
  const { currentUser } = useContext(AuthContext);
  const { expanded } = useContext(AnimationContext);
  const [isEditMode, setIsEditMode] = useState(false);

  // Icon Style: color based on the tab, focused state, and expanded state
  const getIcon = (focused, expanded, icons) => {
    const IconComponent = focused ? icons.solid : icons.outline;
    const color = expanded
      ? (focused ? "#ffffff" : "rgba(255,255,255,0.5)")
      : (focused ? "#673AB7" : "#000000");
    return <IconComponent size={34} color={color} />;
  };

    

  const onPressEdit = () => {
    setIsEditMode(!isEditMode);
  }

  // Get active tab index
  const tabIndex = useNavigationState((state) => {
    const tabState = state.routes.find(r => r.name === "Main")?.state;
    return tabState?.index ?? 1;
  });


  return (
    <>
    <StatusBar barStyle={(tabIndex === 1) ? "light-content" : "dark-content"} />
    <Tab.Navigator
      initialRouteName="Square Scan"
      screenOptions={{
        tabBarStyle: expanded ? styles.purpleTabStyle : styles.whiteTabStyle,
        headerShadowVisible: (!(tabIndex === 1)) ? true : false,
        headerStyle: { 
          backgroundColor: (tabIndex === 1) ? "#673AB7" : "#FFFFFF",
          height: 100,
        },
        headerTitleStyle: 
        {
          color: (tabIndex === 1) ? "#FFF" : "#000",
          fontFamily: "AppleTea", 
          fontSize: 23,
        },
        headerTitleAlign: (tabIndex === 1) ? "center" : "left",

      }}
    >
      {screens.map(({ name, component, icons, title }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          initialParams={{ currentUser }}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {getIcon(focused, expanded, icons)}
              </View>
            ),
            tabBarShowLabel: false,
          }}
          
        />
      ))}
    </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  whiteTabStyle: {
    fontFamily: "Lill-Lill",
    height: 80,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.89)",
    alignItems: "center",
  },
  purpleTabStyle: {
    fontFamily: "Lill-Lill",
    height: 80,
    flexDirection: "row",
    backgroundColor: "#673AB7",
    borderTopColor: "#673AB7",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 45,
    marginTop: 30,
    width: 50,
    height: 50,
  },
});

export default Navigator;
