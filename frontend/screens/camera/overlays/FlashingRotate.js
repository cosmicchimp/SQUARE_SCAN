import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const FlashingRotate = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
          
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.flashIcon, { opacity }]}>
      <MaterialCommunityIcons name="phone-rotate-landscape" size={40} color="white" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flashIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }], // half icon size
    zIndex: 10,
  },
});

export default FlashingRotate;
