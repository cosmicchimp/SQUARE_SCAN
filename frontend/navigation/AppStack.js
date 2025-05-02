import React from "react";
import Navigator from "./tabs";  // Your TabNavigator
import { AnimationProvider } from "../context/AnimationContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

const AppStack = () => (
  <AnimationProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Navigator} />
    </Stack.Navigator>
  </AnimationProvider>
);

export default AppStack;
