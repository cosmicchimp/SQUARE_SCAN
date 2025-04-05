import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function profile() {
  return (
    <ScrollView
      style={{
        backgroundColor: "rgb(1, 1, 1)",
      }}
      contentContainerStyle={{ justifyContent: "space-around", flex: 1 }}
    >
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Account info</Text>
          <MaterialIcons name="account-circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Theme</Text>
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Language</Text>
          <FontAwesome name="language" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Write a review</Text>
          <MaterialIcons name="reviews" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Support</Text>
          <Entypo name="phone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Clear data</Text>
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Legal</Text>
          <FontAwesome name="legal" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Log out</Text>
          <FontAwesome6 name="door-open" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignSelf: "center",
    width: "100%",
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.65)",
    display: "Flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontFamily: "Semi-Bold",
    color: "white",
  },
  seperator: {
    width: "80%",
    alignSelf: "center",
  },
});
