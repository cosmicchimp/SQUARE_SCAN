import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS,} from "react-native-reanimated";
import { CameraIcon } from 'react-native-heroicons/solid';
import { AnimationContext } from "../context/AnimationContext";
import { useNavigation } from '@react-navigation/native';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

// Initial and Expanded Button Dimensions/Styles
const INITIAL_BUTTON_SIZE = 75;
const INITIAL_BORDER_RADIUS = 17;
const EXPANDED_SIZE_SCALE_FACTOR = 15; // Adjust to ensure it covers the screen, windowHeight * 2 might be safer for large screens
const EXPANDED_BORDER_RADIUS_DIVISOR = 2; // To make it a circle when expanded

const INITIAL_CONTAINER_PADDING_BOTTOM = 60;
const EXPANDED_CONTAINER_PADDING_BOTTOM = 0;


export default function HomeScreen() {
  const navigation = useNavigation();
  const { expanded, setExpanded } = useContext(AnimationContext);

  // Shared values for animation
  const animationProgress = useSharedValue(expanded ? 1 : 0); // 0 for initial, 1 for expanded
  const animationPaddingProgress = useSharedValue(expanded ? 1 : 0); // 0 for initial, 1 for expanded
  const iconOpacity = useSharedValue(expanded ? 0 : 1);

  // Update shared values if 'expanded' from context changes externally
  useEffect(() => {
    animationProgress.value = withTiming(expanded ? 1 : 0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    animationPaddingProgress.value = withTiming(expanded ? 1 : 0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    iconOpacity.value = withTiming(expanded ? 0 : 1, { duration: 300 / 2, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  }, [expanded, animationProgress, iconOpacity]);

  const animateButton = () => {
    const targetExpandedState = !expanded;

    if (targetExpandedState) {
      iconOpacity.value = withTiming(0, { duration: 200 / 1.5, easing: Easing.ease });
      animationPaddingProgress.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.4, 0.0, 0.2, 1) });
      animationProgress.value = withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }, (finished) => {
        if (finished) {
          runOnJS(navigation.navigate)("Camera");
          runOnJS(setExpanded)(targetExpandedState);
        }
      });
    } else {
      iconOpacity.value = withTiming(1, { duration: 200 / 2.5, easing: Easing.ease });
      animationPaddingProgress.value = withTiming(0, { duration: 500, easing: Easing.bezier(0.4, 0.0, 0.2, 1) });
      animationProgress.value = withTiming(0, { duration: 1000, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }, (finished) => {
        if (finished) {
          runOnJS(navigation.navigate)("Camera");
          runOnJS(setExpanded)(targetExpandedState);
        }
      });
    }


    
  };

  // Animated styles for the button
  const animatedButtonStyle = useAnimatedStyle(() => {
    const size = INITIAL_BUTTON_SIZE + (windowHeight * EXPANDED_SIZE_SCALE_FACTOR - INITIAL_BUTTON_SIZE) * animationProgress.value;
    const borderRadius = INITIAL_BORDER_RADIUS + (1000) * (1-iconOpacity.value);

    return {
      width: size,
      height: size,
      borderRadius: borderRadius,
      backgroundColor: "#673AB7", // Stays the same
    };
  });

  // Animated styles for the button container (for padding)
  const animatedContainerStyle = useAnimatedStyle(() => {
    const paddingBottom =  ((EXPANDED_CONTAINER_PADDING_BOTTOM - INITIAL_CONTAINER_PADDING_BOTTOM)-100) * animationPaddingProgress.value;
    return {
      paddingBottom: INITIAL_CONTAINER_PADDING_BOTTOM ,
      marginBottom: paddingBottom ,
    };
  });

  // Animated style for the CameraIcon's opacity
  // We wrap the icon in an Animated.View to control its opacity,
  // as directly animating the 'color' prop's alpha with reanimated is more complex.
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    };
  });

  return (
    <View style={{flex: 1, backgroundColor: ""}}>
      <Animated.View style={[styles.newProjectButtonContainer, animatedContainerStyle]}>
        <TouchableOpacity onPress={animateButton} activeOpacity={0.9}>
          <Animated.View style={[styles.newProjectButtonBase, animatedButtonStyle]}>
            <Animated.View style={animatedIconStyle}>
              <CameraIcon size={35} color={"#FFFFFF"} />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
    
    // <>
    //   <ScrollView style={styles.body} contentContainerStyle={{ flexGrow: 1 }}>
    //     <View style={{ flex: 1, justifyContent: 'center' /* Example content alignment */ }}>
    //       <Text style={styles.title}>Recent Projects</Text>
    //       <Text style={styles.bio}>
    //         Display: Recent Projects Here. Recent reviews.
    //         Lifetime Metrics: Total scans, total square foot, total users, total projects.
    //       </Text>
    //     </View>
    //   </ScrollView>

    //   {/* New Project Button */}

    // </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: "Semi-Bold", // Ensure this font is linked in your project
    fontSize: 30,
    color: "black",
    alignSelf: "center",
    marginTop: "10%",
    marginBottom: 20,
  },
  bio: {
    fontSize: 17,
    color: "black",
    alignSelf: "center",
    width: "80%", // Increased width a bit
    lineHeight: 30,
    textAlign: "justify",
  },
  newProjectButtonContainer: {
    alignItems: "center",
    justifyContent:"flex-end",
    backgroundColor: "transparent", // Ensure this doesn't visually clash with the button during animation
    position: 'absolute', // Make container absolute to overlay ScrollView
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  newProjectButtonBase: { // Renamed from newProjectButton for clarity
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // Position is handled by its container aligning center and paddingBottom
    // Absolute positioning removed from here to allow container to manage its bottom space for the initial state
  },
  // expandedNewProjectButton is now handled by animatedButtonStyle
  buttonText: { // Not used in current snippet, but kept if you add text
    fontSize: 30,
    color: "white",
  },
});