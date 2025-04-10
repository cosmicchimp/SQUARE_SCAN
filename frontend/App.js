import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
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
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
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
