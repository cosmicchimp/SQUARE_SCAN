import { BlurView } from 'expo-blur';
import React, { useEffect, useState, } from 'react';
import {ImageBackground, Text, View, Image, Dimensions, Animated as NormalAnimated, TouchableOpacity, LayoutAnimation } from 'react-native';
import { FlatList, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS, withSpring, clamp, withSequence, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming, withRepeat,FadeIn, FadeOut, LinearTransition, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Octicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("screen");

const _itemSize = width * 0.25;
const _spacing = 15;
const _headerHeight = 100;

const DELETE_BUTTON_SIZE = 24; 
const PURPLE_COLOR = '#9C27B0'

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function CarouselItem({ imageUri, item, index, scrollX, isEditMode, setIsEditMode, onToggleEditMode, onDeleteAnimationComplete}) {
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const itemOpacity = useSharedValue(0);
  const jigglePhase = useSharedValue(0);
  const isMarkedForDeletion = useSharedValue(false); 
  const exitScale = useSharedValue(1); // For delete exit animation
  const exitOpacity = useSharedValue(1); 

  // start/stop jiggle animation based on edit mode
   useEffect(() => {
    if (isEditMode) {
      jigglePhase.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 130 }),
          withTiming(2, { duration: 130 }),
          withTiming(-2, { duration: 130 }),
          withTiming(2, { duration: 130 })
        ),
        -1, // Repeat forever
        true // Reverse 
      );
    } else {
      jigglePhase.value = withTiming(0, { duration: 100 }); // Reset
    }
  }, [isEditMode, jigglePhase]);

  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(500)
    .activeOffsetX([-100, 100]) 
    .activeOffsetY([-100, 100]) 
    .onStart(() => {
      'worklet';
      runOnJS(triggerHapticFeedback)();
      isDragging.value = true;

      // add overlay
      itemOpacity.value = withTiming(0.3, { duration: 500 });
    })
    .onChange((event) => {
      'worklet';
      dragX.value += event.changeX;
      dragY.value += event.changeY;

    })
    .onEnd(() => {
      'worklet';
      isDragging.value = false;

      // Enter edit mode on long press start
      runOnJS(onToggleEditMode)(true);

      // remove overlay
      itemOpacity.value = withTiming(0, { duration: 500 });

      // return item
      dragX.value = withSpring(0, { damping: 25, stiffness: 400 });
      dragY.value = withSpring(0, { damping: 25, stiffness: 400 });

    });

  const handleDeletePress = () => {
    'worklet';
    runOnJS(triggerHapticFeedback)(); // Haptic feedback on delete press
    isMarkedForDeletion.value = true; // Signal to start exit animation

    // Start the exit animation values
    exitScale.value = withTiming(0, { duration: 300 });
    exitOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        // Callback after opacity animation finishes
        if (finished) {
            runOnJS(onDeleteAnimationComplete)(item); // Notify parent to remove item by id
        }
    });
  };

   // Animated style for the delete button appearance
  const deleteButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isEditMode ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isEditMode ? 1 : 0, { damping: 15, stiffness: 150 }) }],
      // Make button non-interactive when not visible
      pointerEvents: isEditMode ? 'auto' : 'none',
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: itemOpacity.value,
    };
  });

  const finalItemStyle = useAnimatedStyle(() => {
    // Apply exit animation style if marked for deletion
    if (isMarkedForDeletion.value) {
        return {
            opacity: exitOpacity.value,
            transform: [{ scale: exitScale.value }],
            // Keep it elevated during deletion animation
            zIndex: 100,
        };
    } else {
        // Apply normal state styles (scroll, drag, jiggle, border)

        // Interpolate border color based on scroll position
        const scrollDrivenBorderColor = interpolateColor(
            scrollX.value,
            [index - 1, index, index + 1],
            ['transparent', '#fff', 'transparent']
        );
        // Interpolate Y translation for bobbing effect based on scroll position
        const scrollDrivenTranslateY = interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [_itemSize / 9, 0, _itemSize / 9]
        );

        // Determine scale based on dragging state
        const currentScale = isDragging.value ? 1.05 : 1;
        // Determine border width based on dragging state
        const newActiveIndex = Math.round(scrollX.value);
        // Show border when active or when in edit mode (if not dragging)
        const currentBorderWidth = (newActiveIndex === index) ? (isDragging.value ? 2 : (isEditMode ? 2 : 5)) : (isEditMode ? 2 : 0); // Show border in edit mode

        // Apply jiggle if editing
        const rotateZ = isEditMode ? jigglePhase.value : 0;

        return {
            borderWidth: withSpring(currentBorderWidth),
            borderColor: isDragging.value ? '#fff' : (isEditMode ? PURPLE_COLOR : scrollDrivenBorderColor), // White border when dragging, Purple in edit mode
            transform: [
                { translateY: scrollDrivenTranslateY },
                { translateX: dragX.value },
                { translateY: dragY.value },
                { scale: withSpring(currentScale) },
                { rotateZ: `${rotateZ}deg` }, //  jiggle anim
            ],
            // Elevate the item when dragging or editing
            zIndex: isDragging.value || isEditMode ? 100 : 0,
            // Ensure item is visible if not marked for deletion
            opacity: 1, // Explicitly set opacity to 1 in non-deleting state
        };
      }
  });

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedView
        style={[
          {
            zIndex:1000,
            width: _itemSize,
            height: _itemSize,
            borderRadius: _itemSize / 5,
            pointerEvents: 'box-none',
          },
          finalItemStyle,
        ]}
        Layout={LinearTransition.easing(Easing.ease).duration(300)}
      >
          <ImageBackground
            source={{ uri: imageUri }}
            style={{ flex: 1 }}
            imageStyle={{ borderRadius: _itemSize / 5 }} 
          >
          {/* Overlay with animated opacity */}
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: 'black',
                borderRadius: _itemSize / 4,
              }, overlayAnimatedStyle, // AnimateS opacity to 0 → 0.5 → 0
            ]}
          />

          {/* item delete button when long pressed*/}
          <AnimatedTouchableOpacity
                style={[
                    {
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: DELETE_BUTTON_SIZE,
                      height: DELETE_BUTTON_SIZE,
                      borderRadius: DELETE_BUTTON_SIZE / 2,
                      backgroundColor: PURPLE_COLOR,
                      top: -DELETE_BUTTON_SIZE / 3, // Position near the top-right corner
                      right: -DELETE_BUTTON_SIZE / 3,
                      zIndex: 101, // Ensure button is above the item
                    },
                    deleteButtonAnimatedStyle, // Animate appearance
                ]}
                onPress={runOnJS(handleDeletePress)} // Run handleDeletePress on the UI thread
                // pointerEvents is controlled by deleteButtonAnimatedStyle
            >
                <Octicons name="x" size={DELETE_BUTTON_SIZE * 0.6} color="white" />
            </AnimatedTouchableOpacity>

        </ImageBackground>
      </AnimatedView>
    </GestureDetector>
  );
}

export function CircularSlider({ photos, setPhotos, scrollX, orientation, isEditMode, setIsEditMode }) {

  // const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = clamp(event.contentOffset.x / (_itemSize + _spacing), 0 , photos.length -1);
      const newActiveIndex = Math.round(scrollX.value);

      if (activeIndex !== newActiveIndex) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });


  const imageRotation = useSharedValue('0deg');
  const growAnim = useSharedValue(1);

  // Update rotation based on orientation
  // useEffect(() => {
  //   if (orientation === 'LANDSCAPE_LEFT') {
  //     imageRotation.value = withTiming('90deg', { duration: 300 });
  //     growAnim.value = withTiming(1.80, { duration: 500 });
  //   } else if (orientation === 'LANDSCAPE_RIGHT') {
  //     imageRotation.value = withTiming('-90deg', { duration: 300 });
  //     growAnim.value = withTiming(1.8, { duration: 500 });
  //   } else {
  //     growAnim.value = withTiming(1, { duration: 300 });
  //     imageRotation.value = withTiming('0deg', { duration: 300 });

  //   }
  // }, [orientation]);

  // Animated style using the shared rotation value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: imageRotation.value }, { scale: growAnim.value, }],
    };
  });

  // Function to handle toggling edit mode
  const handleToggleEditMode = (editing) => {
      setIsEditMode(editing);
      // Optional: Scroll to the closest item when exiting edit mode
      // if (!editing && flatListRef.current) {
      //     const newActiveIndex = Math.round(scrollX.value);
      //     flatListRef.current.scrollToIndex({ index: newActiveIndex, animated: true });
      // }
  };

  // Function to handle item deletion AFTER its exit animation
  const handleDeleteAnimationComplete = (uriToDelete) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPhotos(prevPhotos => {
      const newPhotos = prevPhotos.filter(uri => uri !== uriToDelete);

      // Exit edit mode if list becomes empty after deletion
      if (newPhotos.length === 0 && isEditMode) setIsEditMode(false);
      
      return newPhotos;
    });
  };

  // height: height * 1.61, width: '100%',
  return (
    <View style={{ flex: 1 }}>
      <BlurView intensity={20} tint="light" style={{ position: 'absolute', top: -200, left: -100, right: -100, bottom: -100, }} />

      {photos.length > 0 &&
        (
          <AnimatedView 
            style={[
              animatedStyle,
              {
                position: 'absolute',
                top: "28%",
                height: `${26}%`,
                backgroundColor: "transparent",
                borderRadius: 0
              }]}
              
          >
            {/* //style={{overflow:'hidden',width:"100%", height:"100%", borderRadius:20, aspectRatio: 16 / 9}}  /> */}
            <Animated.Image 
              source={{ uri: photos[activeIndex] }} 
              style={{ overflow: 'hidden', width: "100%", height: "100%", borderRadius: 0, aspectRatio: 16 / 9 }}
              key={`image-${activeIndex}`}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
           />

          </AnimatedView>
        )}

      <AnimatedView
        Layout={LinearTransition.easing(Easing.ease).duration(300)}
        style={{ flex: 1 }} // Ensure the container takes space
      >
        <AnimatedFlatList
          style={{ backgroundColor: "transparent", height: height - _headerHeight, paddingBottom: 0, }}
          removeClippedSubviews={false}
          contentContainerStyle={{
            gap: _spacing,
            paddingHorizontal: (width - _itemSize) / 2,
            alignItems: "flex-end",
            paddingBottom: 60,
          }}
          data={photos}
          keyExtractor={(item) => item} 
          renderItem={({ item, index }) => {
            return (
              <CarouselItem 
                imageUri={item}
                item={item}
                index={index}
                scrollX={scrollX}
                isEditMode={isEditMode}
                onToggleEditMode={handleToggleEditMode} 
                onDeleteAnimationComplete={handleDeleteAnimationComplete}      
              />
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          //Scrolling
          onScroll={onScroll}
          scrollEventThrottle={1000 / 60}
          snapToInterval={_itemSize + _spacing}
          decelerationRate="fast"
          bounces={true}
          scrollEnabled={photos.length <= 0 ? false : true}
        />
      </AnimatedView>
    </View>
  );
}