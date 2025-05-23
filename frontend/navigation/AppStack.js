import Navigator from "./tabs"; 
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import CameraScreen from "../screens/camera/CameraScreen"; 
import { AnimationProvider } from "../context/AnimationContext";
import { CarouselProvider } from "../context/CarouselContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AnimationProvider>
      <CarouselProvider>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade',}}>
          
          {/* Main tabs */}
          <Stack.Screen name="Main" component={Navigator} />

          {/* Full-screen camera modal */}
            <Stack.Screen name="Camera" component={CameraScreen} 
              options={{
                presentation: "fullScreenModal",
                animation: "fade",
              }}
            />
            
        </Stack.Navigator>
      </CarouselProvider>
    </AnimationProvider>
  </GestureHandlerRootView>
);

export default AppStack;
