import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native"; // ✅ Add this
import { useContext } from "react";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { AuthContext } from "../context/AuthContext";
const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const { isAuthenticated, AuthenticateUser } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
export default RootNavigator;
