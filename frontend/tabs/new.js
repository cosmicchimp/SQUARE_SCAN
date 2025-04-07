import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
export default function newProject() {
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: "auto", marginBottom: "10%" }}
      >
        <Image
          style={{
            maxWidth: 50,
            maxHeight: 50,
          }}
          source={require("../assets/plus-square-on-square-svgrepo-com.png")}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)",
  },
});
