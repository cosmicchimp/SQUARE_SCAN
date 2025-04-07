import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // FIX: Correct import
import Navigator from "./navigation/tabs";
import { useFonts } from "expo-font";
import Header from "./components/header";
import Login from "./components/login";
export default function App() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("./assets/fonts/LilitaOne-Regular.ttf"),
    "Condensed-Regular": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
    "Semi-Bold": require("./assets/fonts/RobotoCondensed-SemiBold.ttf"),
    "Lill-Lill": require("./assets/fonts/LilitaOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Or splash screen / loader
  }
  return (
    <Login />
    // <NavigationContainer>
    //   <Navigator />
    //   <StatusBar style="auto" />
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
