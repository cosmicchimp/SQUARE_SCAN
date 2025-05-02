import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, Image, Dimensions, Animated, LayoutAnimation} from "react-native";
const { width, height } = Dimensions.get("window");
import logo from "../assets/Logos/Gemini_Generated_Image_sl6i2osl6i2osl6i.jpg";
import { CameraIcon } from 'react-native-heroicons/solid';
import { AnimationContext } from "../context/AnimationContext";

export default function HomeScreen() {
  const reviewHeader = () => {
    return (
      <View>
        <Text>Read some of our reviews!</Text>
      </View>
    );
  };
  const {expanded, setExpanded} = useContext(AnimationContext);

  // Function to trigger the animation
  const animateButton = () => {
    setProjectIconOpacity(expanded ? 1 : 0);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded); // Toggle the expanded state
  };
  const [projectIconOpacity, setProjectIconOpacity] = useState(1);

  return (
    <>
      <ScrollView style={styles.body}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}></Text>
          <Text style={styles.bio}>
            {/* this is good we can use for on boarding screen */}
            {/* {"\u00A0\u00A0\u00A0\u00A0"} */}
            {/* SquareScan is an easy to use online
            tool designed to help you quickly scan and measure homes. Whether
            you're in real estate, construction, or just need to know the size
            of a space, SquareScan makes it simple to get accurate measurements
            without the hassle of doing it by hand. */}
            Display:Recent Projects Here Recent reviews
            Lifetime Metrics: Total scans, total square foot total users, total projects,
            
          </Text>
        </View>
 
      </ScrollView>
              
      {/* New Project Button */}
      <View style={[styles.newProjectButtonContainer, {paddingBottom: expanded ? 0 : 60 }]}>
        <TouchableOpacity onPress={animateButton}>
          <Animated.View style={[styles.newProjectButton, expanded && styles.expandedNewProjectButton]}>
            <CameraIcon size={35} color={"rgba(255, 255, 255,"+ projectIconOpacity + ")"} />          
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, backgroundColor: "#FFFFFF" },
  title: {
    fontFamily: "Semi-Bold",
    fontSize: 30,
    color: "black",
    alignSelf: "center",
    marginTop: "10%",
  },
  logo: {
    height: 40,
    width: 40,
    borderRadius: 5,
    alignSelf: "center",
    height: 60,
    width: 60,
  },
  bio: {
    fontSize: 17,
    color: "black",
    alignSelf: "center",
    marginTop: "10%",
    width: "70%",
    lineHeight: 30,
    justifyContent: "center",
    textAlign: "justify",
  },
  newProjectButtonContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)", 
  },
  newProjectButton: {
    position: 'absolute', // This makes the button absolutely positioned
    bottom: 0,
    backgroundColor: "#673AB7",
    borderRadius: 17,
    width: 75,
    height: 75,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center", 
  },
  expandedNewProjectButton: {
    backgroundColor: "#673AB7",
    borderRadius: 300,
    position: 'absolute',
    width: "1000",
    height: "1000",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: "white",
  },
});
