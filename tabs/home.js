import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
export default function home() {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>Welcome to SquareScan</Text>
    </View>
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
});
