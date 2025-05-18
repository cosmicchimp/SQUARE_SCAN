import 'react-native-gesture-handler'; // must be first
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("./assets/fonts/LilitaOne-Regular.ttf"),
    "Condensed-Regular": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
    "Semi-Bold": require("./assets/fonts/RobotoCondensed-SemiBold.ttf"),
    "Lill-Lill": require("./assets/fonts/LilitaOne-Regular.ttf"),
    "AppleTea": require("./assets/fonts/AppleTea.ttf"),

  });

  if (!fontsLoaded) {
    return null; // Or splash screen / loader
  }
  return (
    <AuthProvider>
      <RootNavigator/>
    </AuthProvider>
  );
}
