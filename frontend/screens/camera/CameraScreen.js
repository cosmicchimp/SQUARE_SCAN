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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { PhotoIcon, PaperAirplaneIcon, XMarkIcon } from "react-native-heroicons/solid";
import { CircularSlider } from '../../components/camera_components/CircularSlider';
import Animated, { withTiming, withSpring,interpolate, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const {width} = Dimensions.get("screen");
const _itemSize = width * 0.25;

const CameraScreen = () => {
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const { setExpanded } = useContext(AnimationContext);
  const cameraRef = useRef(null); useEffect(() => { return () => { cameraRef.current = null; };}, []);
  const isFocused = useIsFocused(); // is camera focused

  //////////////////
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Photo taking logic
  const takePhoto = async () => {
    if (isCapturing || !cameraRef.current) return;
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: false });
        console.log("Photo taken:", photo.uri);
        setPhotos(prev => [...prev, photo.uri]);
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
  const sliderScrollX = useSharedValue(0); // the value of the current index as a float from 0.0 to length

  //////////////////
  // UI opacity animation
   useEffect(() => {
    const targetOpacity = (isLandscape && !isCarouselVisible) ? 0 : 1;
    uiOpacityShared.value = withSpring(targetOpacity, { duration: 300 });
  }, [isLandscape]);

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
          sliderScrollX.value, [0, 0.5, 1], [1, 0.2, 0]
        ),
        transform: [
          {
            scale: Math.max(0.3, Math.min(1.25, interpolate(
              sliderScrollX.value,
              [0, 0.5, 1],
              [1, 0.3, 0]
            )
        )),},],
      };
  });


  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

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

    return () => {
      subscription.remove();
    };
  }, []);

  // Determine if the camera should be active based on focus, permissions, and app state.
  // Controls the rendering of CameraView.
  const shouldCameraBeActive = isFocused && permission?.granted && appIsActive;
 function consoleLogReason(reason) {
    console.log(` > Reason: ${reason}`);
  }
  useEffect(() => {
    if (shouldCameraBeActive) {
      console.log('Camera should be active and rendered.');
    } else {
      console.log('Camera should NOT be active. It will be unmounted or not rendered.');
      if (!isFocused) consoleLogReason('Screen not focused.');
      if (!permission?.granted) consoleLogReason('Permission not granted.');
      if (!appIsActive) consoleLogReason('App not active.');
    }
  }, [shouldCameraBeActive, isFocused, permission, appIsActive]);

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
          <View style={styles.centered}>
            <Text style={styles.infoText}>
              {isFocused ? "Camera paused" : "Camera not active (screen not focused)"}
            </Text>
          </View>
        )}

        {/* header */}
        <Animated.View style={[styles.header, UIAnimatedStyle]}>
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

          <TouchableOpacity style={styles.headerButton} onPress={() => {/* TODO: Help Action */}}>
            <Octicons name="question" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={() => {
            
            navigation.goBack();
            setTimeout(() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpanded(false); }, 50);
          }}>
            <Octicons name="x" size={27} color="#fff" />
          </TouchableOpacity>

        </Animated.View>


        {/* main footer */}
        <Animated.View style={[styles.footerContainer2, UIAnimatedStyle]}>
          <BlurView intensity={0} tint="light" style={StyleSheet.absoluteFill} />

          {/* carousel */}
          <Animated.View style={[
            styles.carouselContainerStyle, carouselContainerAnimatedStyle
          ]}>
              <CircularSlider 
                photos={photos}
                setPhotos={setPhotos} 
                scrollX={sliderScrollX}
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
                style={[styles.footerButton, { backgroundColor: isCarouselVisible ? "rgba(255,80,80,0.35)" : "rgba(255,255,255,0.2)", maxHeight:_itemSize, maxWidth:_itemSize, }]}
                onPress={toggleCarousel}
              >
                {isCarouselVisible ? <XMarkIcon size={28} color="#fff" /> : <PhotoIcon size={28} color={"#fff"} />}
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
                style={[styles.footerButton, { backgroundColor: "rgba(160,32,240,0.8)" }]}
                onPress={toggleCarousel}
                disabled={isCarouselVisible}
              >
                <PaperAirplaneIcon size={28} color={"#fff"} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* photo button */}
        <Animated.View style={[oppositeUIAnimatedStyle, {flex: 1 }]}>
          <TouchableOpacity onPress={takePhoto} style={styles.photoButton} disabled={isCarouselVisible}>
            <View style={{width: 50, height: 50, borderRadius: 30, backgroundColor: '#fff',}}/>
          </TouchableOpacity>
        </Animated.View>

        {/* info  */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
          {rotation ? (
            <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
              α (Z - Yaw): {(rotation.alpha * 180 / Math.PI).toFixed(2)}°{'\n'}
              β (X - Pitch): {(rotation.beta * 180 / Math.PI).toFixed(2)}°{'\n'}
              γ (Y - Roll): {(rotation.gamma * 180 / Math.PI).toFixed(2)}°{'\n'}
            </Text>
          ) : (
            <Text>Waiting for orientation...</Text>
          )}
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Ensure background for text visibility
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
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
    justifyContent:"space-between",
    zIndex: 10,
  },
  headerButton:{
    paddingVertical:15,
    paddingHorizontal:30,
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