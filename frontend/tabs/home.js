import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import logo from "../assets/Logos/Gemini_Generated_Image_sl6i2osl6i2osl6i.jpg";
export default function home() {
  return (
    <ScrollView style={styles.body}>
      <View>
        <Text style={styles.title}>Welcome to SquareScan</Text>
        <Text style={styles.bio}>
          SquareScan is an easy-to-use online tool designed to help you quickly
          scan and measure homes. Whether you're in real estate, construction,
          or just need to know the size of a space, SquareScan makes it simple
          to get accurate measurements without the hassle of doing it by hand.
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  body: { flex: 1, backgroundColor: "rgb(0, 0, 0)" },
  title: {
    fontFamily: "Semi-Bold",
    fontSize: 30,
    color: "white",
    alignSelf: "center",
    marginTop: "10%",
  },
  logo: {
    height: 40,
    width: 40,
    borderRadius: 5,
    alignSelf: "center",
    height: 60,
    width: 60,
  },
  bio: {
    fontSize: 17,

    color: "white",
    alignSelf: "center",
    marginTop: "10%",
    width: "70%",
    lineHeight: 30,
  },
});
