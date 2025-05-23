// ../screens/CameraScreen.js
import React, { useState, useEffect, useRef, useContext, } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { DeviceMotion } from 'expo-sensors';
import { BlurView } from 'expo-blur';
import { Animated as NormalAnimated , View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Dimensions, TouchableWithoutFeedback, AppState} from 'react-native'; // Easing might not be directly used if spring is the main driver
import Octicons from '@expo/vector-icons/Octicons';
import FlashingIcon from './overlays/FlashingRotate';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { AnimationContext } from "../../context/AnimationContext";
import { CarouselContext } from "../../context/CarouselContext";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { PhotoIcon, PaperAirplaneIcon } from "react-native-heroicons/solid";
import { CircularSlider } from '../../components/camera_components/CircularSlider';
import Animated, { withTiming, withSpring,interpolate, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';

const {width} = Dimensions.get("screen");
const _itemSize = width * 0.25;
const _deleteColorTransparent = "rgba(255,80,80,0.35)";
const _deleteColor= "rgba(255,80,80,1)";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CameraScreen = () => {
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const cameraRef = useRef(null); useEffect(() => { return () => { cameraRef.current = null; };}, []);
  const isFocused = useIsFocused(); // for: is camera focused

  //////////////////
  const { setExpanded } = useContext(AnimationContext);
  const { photos, setPhotos, deletePhoto, isEditMode, setIsEditMode, scrollX, } = useContext(CarouselContext);

  //////////////////

  const [isCapturing, setIsCapturing] = useState(false);

  // Photo taking logic
  const takePhoto = async () => {
    if (isCapturing || !cameraRef.current) return;
    try {
      if(isLandscape){
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: false });
        console.log("Photo taken:", photo.uri);
        setPhotos(prev => [...prev, photo.uri]);
      }
    } catch (err) {
      console.warn("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  /////////////////

  const [rotation, setRotation] = useState(null);

  // Device rotation capture (pitch, roll, yaw)
  useEffect(() => {
    const subscription = DeviceMotion.addListener((motion) => {
      // motion.rotation = { alpha (z), beta (x), gamma (y) } in radians
      setRotation(motion.rotation);
    });

    DeviceMotion.setUpdateInterval(100); // ms
    return () => subscription.remove();
  }, []);


  ////////////////////
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Track recent interactions
  const handleInteraction = () => {
    setLastInteraction(Date.now());
    // do nothing for now
  };

  ///////////////////
  const [isLandscape, setIsLandscape] = useState(false);

  // Updates when Device Orientation changes: opacity of UI element, landscape bool captured)
  useEffect(() => {
    // set landscape bool
    const gammaDeg = rotation ? (rotation.gamma * 180) / Math.PI : 0;
    const isLandscapeAndTilted = (
      (orientation === 'LANDSCAPE_LEFT' || orientation === 'LANDSCAPE_RIGHT') &&
      Math.abs(gammaDeg) > 45
    );

    // set bool value if in landscape or not
    if (isLandscape !== isLandscapeAndTilted) setIsLandscape(isLandscapeAndTilted);

}, [orientation, rotation]);

  
  //////////////////
  // shared values
  const uiOpacityShared = useSharedValue(1); // For general UI elements based on orientation
  const carouselToggleShared = useSharedValue(0); // 0 for carousel closed, 1 for carousel open
  const headerIconsAnimation = useSharedValue(0); // 0 for default icons, 1 for carousel-visible icons

  //////////////////
  // UI opacity animation
   useEffect(() => {
    if (!isCapturing){
      const targetOpacity = (isLandscape && !isCarouselVisible) ? 0 : 1;
      uiOpacityShared.value = withSpring(targetOpacity, { duration: 300 });
    }
  }, [isLandscape, isCapturing]);

  /////////////////
  // Carosuel toggle animation
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);

  const toggleCarousel = () => {
    const show = !isCarouselVisible;
    setIsCarouselVisible(show);
    setIsEditMode(false);
    handleInteraction(); // Reset inactivity timer

    carouselToggleShared.value = (show
      ? withSpring(1, {  duration: 300 }) 
      : withSpring(0, {  duration: 200 })); 
  };

  // Effect to animate header icons based on carousel visibility
  useEffect(() => {
    headerIconsAnimation.value = withTiming(isCarouselVisible ? 1 : 0, { duration: 250 });
  }, [isCarouselVisible, headerIconsAnimation]);



  /////////////////
  // Animation Styles

  // UI style: (header, footer)
  const UIAnimatedStyle = useAnimatedStyle(() => ({
    opacity: uiOpacityShared.value,
    transform: [{ scale: interpolate(uiOpacityShared.value, [0, 1], [0.8, 1]) }],
  }));

  // Opposit UI style: (photo button)
  const oppositeUIAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(uiOpacityShared.value, [0, 1], [1, 0]), // Opposite opacity
    transform: [{ scale: interpolate(-uiOpacityShared.value, [0, 1], [1, 0])}]
  }));

    // Interpolations for Carousel 
  const carouselContainerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: carouselToggleShared.value, 
    transform: [{ scale: interpolate(carouselToggleShared.value, [0, 1], [0.8, 1]) }],
  }));

  // Interpolations for Send button
  const sendButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(carouselToggleShared.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(carouselToggleShared.value, [0, 1], [1, 0.7]) }],
  }));

  // Interpolations for Close button
  const closeButtonStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          scrollX.value, [0, 0.5, 1], [1, 0.2, 0]
        ),
        transform: [
          {
            scale: Math.max(0.3, Math.min(1.25, interpolate(
              scrollX.value,
              [0, 0.5, 1],
              [1, 0.3, 0]
            )
        )),},],
      };
  });

   // Header Icon Animation Styles
  const questionIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(headerIconsAnimation.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(headerIconsAnimation.value, [0, 1], [1, 0.8]) }],
  }));

  const trashIconStyle = useAnimatedStyle(() => ({
    opacity: headerIconsAnimation.value,
    transform: [{ scale: interpolate(headerIconsAnimation.value, [0, 1], [0.8, 1]) }],
  }));

  const xIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(headerIconsAnimation.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(headerIconsAnimation.value, [0, 1], [1, 0.8]) }],
  }));

  const editIconStyle = useAnimatedStyle(() => ({
    opacity: headerIconsAnimation.value,
    transform: [{ scale: interpolate(headerIconsAnimation.value, [0, 1], [0.8, 1]) }],
  }));

  const downloadButtonContainerStyle = useAnimatedStyle(() => {
    const opacity = headerIconsAnimation.value;
    return {
      opacity: opacity,
      transform: [{ scale: interpolate(opacity, [0, 1], [0.8, 1]) }],
    };
  });

   const photoButtonAnimatedStyle = useAnimatedStyle(() => {
    const animationDuration = 200; 
    return {
      borderColor: withTiming(isCapturing ? "#ddd" : '#fff', { duration: animationDuration }),
      borderWidth: withTiming(isCapturing ? 2 : 5, { duration: animationDuration }),
    };
  });

  const innerViewAnimatedStyle = useAnimatedStyle(() => {
    const animationDuration = 100; 
    return {
      width: withTiming(isCapturing ? 60 : 50, { duration: animationDuration }),
      height: withTiming(isCapturing ? 60 : 50, { duration: animationDuration }),
      borderRadius: withTiming(30, { duration: animationDuration }),
      backgroundColor: withTiming(isCapturing ? "#ddd" : '#fff', { duration: animationDuration }),
    };
  });

  const [scrollEnabled, setScrollEnabled] = useState(true);

  /////////////////
  //Request Permissions
  const [permission, requestPermission] = useCameraPermissions();

  // request permission on mount or permission status changes
  useEffect(() => {
    if (!permission) {  return; }
    if (!permission.granted) {
      console.log('Requesting camera permissions...');
      requestPermission();
    } else {
      console.log('Camera permission already granted.');
    }
  }, [permission, requestPermission]);


  // helps manage camera state if the app is backgrounded/foregrounded.
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      setAppIsActive(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => { subscription.remove(); };
  }, []);

  // Determine if the camera should be active based on focus, permissions, and app state.
  // Controls the rendering of CameraView.
  const shouldCameraBeActive = isFocused && permission?.granted && appIsActive;
  function consoleLogReason(reason) {console.log(` > Reason: ${reason}`);}

  // log state of camera (focused, not focused, no permission or app not active)
  useEffect(() => {
    if (shouldCameraBeActive) {
      console.log('Camera should be active and rendered.');
    } else {
      console.log('Camera NOT active. Unmounted.');
      if (!isFocused) consoleLogReason('Screen not focused.');
      if (!permission?.granted) consoleLogReason('Permission not granted.');
      if (!appIsActive) consoleLogReason('App not active.');
    }
  }, [shouldCameraBeActive, isFocused, permission, appIsActive]);

  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsPlaceholderVisible(true);
    }, 1000); 
    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout if the component unmounts
  }, [isFocused]);

  /////////////////

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsEditMode(false) 
      }}
    >
      <View onTouchStart={handleInteraction} style={{ flex: 1, backgroundColor: '#000' }}>

        {/* camera view object */}
        {shouldCameraBeActive ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}

          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }]}>
            {isPlaceholderVisible && 
              (<Text style={styles.infoText}>
                {(isFocused) ? "Camera paused" : "Camera not active"}
              </Text>)
            }
          </View>
        )}

      
        {/* main footer */}
        <Animated.View style={[styles.footerContainer2, UIAnimatedStyle]}>
          <BlurView intensity={0} tint="light" style={StyleSheet.absoluteFill} />

          {/* carousel */}
          <Animated.View style={[
            styles.carouselContainerStyle, carouselContainerAnimatedStyle
          ]}>
              <CircularSlider 
                scrollEnabled={scrollEnabled}
                setScrollEnabled={setScrollEnabled}
                orientation={orientation}   
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
          </Animated.View>

          {/* footer buttons */}
          <View style={styles.containerFill}>

            {/* images button */}
            <Animated.View style={[closeButtonStyle, { pointerEvents:"auto "}]}>
              <TouchableOpacity
                style={[styles.footerButton, { backgroundColor: isCarouselVisible ? _deleteColorTransparent : "rgba(255,255,255,0.2)", maxHeight:_itemSize, maxWidth:_itemSize, }]}
                onPress={toggleCarousel}
              >
                {isCarouselVisible ? <Octicons name="x" size={28} color="#fff" /> : <PhotoIcon size={28} color={"#fff"} />}
                <Text style={styles.footerText}>{isCarouselVisible ? "Close" : "Images"}</Text>
              </TouchableOpacity>
              {!isCarouselVisible && photos.length > 0 && (
                <View style={[styles.deleteButton]}>
                  <Text style={{color:"#fff"}}>{photos.length}</Text>
                </View>
              )}
            </Animated.View>

            {/* send button */}
            <Animated.View style={
              [sendButtonAnimatedStyle,]
            }>
              <TouchableOpacity
                style={[styles.footerButton, { backgroundColor: (photos.length <= 0) ? "rgba(160,32,240,0.5)" : "rgba(160,32,240,0.8)" }]}
                onPress={toggleCarousel}
                disabled={(photos.length <= 0)}
              >
                <PaperAirplaneIcon size={28} color={"#fff"} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Header */}
        <Animated.View style={[styles.header, UIAnimatedStyle]}>
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

            {/* Left Button: Question / Trash */}
            <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                    if (isCarouselVisible) deletePhoto(); // delete 
                    else {
                        console.log("Help Action Triggered"); // TODO: Implement actual help action
                    }
                }}
            >
                <Animated.View style={[styles.headerButton, questionIconStyle, {display: !isCarouselVisible ? 'flex': "none"}]}>
                    <Octicons name="question" size={24} color="#fff" />
                </Animated.View>
                <Animated.View style={[styles.headerButton, trashIconStyle, {display: isCarouselVisible ? 'flex': "none"}]}>
                    <Feather name="trash-2" size={24} color={_deleteColor} />
                </Animated.View>
            </TouchableOpacity>

            {/* Right Button Group */}
            <View style={{ paddingHorizontal:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              {/* Download Button (appears with Edit) */}
                <Animated.View style={[downloadButtonContainerStyle, {display: isCarouselVisible ? 'flex': "none"}]}>
                    <TouchableOpacity
                        style={[styles.headerButton]} // Adjusted padding
                        onPress={() => {
                            if (isCarouselVisible) {
                                console.log("Download Action Triggered"); // TODO: Implement actual download action
                            }
                        }}
                    >
                        <Feather name="download" size={24} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Edit Button (replaces X) */}
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        if (isCarouselVisible) {
                            console.log("Edit Action Triggered (does nothing for now)");
                        } else {
                            navigation.goBack();
                            setTimeout(() => { 
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); 
                                setExpanded(false); 
                            }, 50);
                        }
                    }}
                >
                    <Animated.View style={[styles.headerButton, xIconStyle, {display: !isCarouselVisible ? 'flex': "none"}]}>
                        <Octicons name="x" size={27} color="#fff" />
                    </Animated.View>
                    <Animated.View style={[styles.headerButton, editIconStyle, {display: isCarouselVisible ? 'flex': "none"}]}>
                        <Feather name="edit-3" size={24} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
            </View>

        </Animated.View>

        {/* photo button */}
        <Animated.View style={[oppositeUIAnimatedStyle, { flex: 1 }]}>
          <AnimatedTouchableOpacity disabled={isCapturing} onPress={takePhoto} style={[styles.photoButton, photoButtonAnimatedStyle]} >
            <Animated.View style={innerViewAnimatedStyle} />
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* info  */}
        {/* <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
          {rotation ? (
            <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
              α (Z - Yaw): {(rotation.alpha * 180 / Math.PI).toFixed(2)}°{'\n'}
              β (X - Pitch): {(rotation.beta * 180 / Math.PI).toFixed(2)}°{'\n'}
              γ (Y - Roll): {(rotation.gamma * 180 / Math.PI).toFixed(2)}°{'\n'}
            </Text>
          ) : (
            <Text>Waiting for orientation...</Text>
          )}
        </View> */}

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: 'flex-end',
    backgroundColor: 'red', // Ensure background for text visibility
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
    fontFamily: "AppleTea", 
  },
  containerFill: {
    flex: 1, flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal:50,
    paddingBottom: 60,
  },
  carouselContainerStyle: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    bottom:0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    top:0,
    position:"absolute",
    flexDirection:"row",
    width:"100%",
    height:100,
    alignItems:"flex-end",
    paddingBottom:15,
    justifyContent:"space-between",
    zIndex: 10,
  },
  headerButton:{
    paddingHorizontal:15,
    justifyContent:"center",
    alignItems:"center"
  },
  footerContainer2: {
    bottom:0,
    position:"absolute",
    backgroundColor:"transparent",
    width:"100%",
    top:100,
    bottom:0,
    zIndex: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'System',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  footerButton:{
    borderRadius: 16,
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  photoButton:{
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#a020f0',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  }
});

export default CameraScreen;