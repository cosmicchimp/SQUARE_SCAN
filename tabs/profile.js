import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function profile() {
  return (
    <ScrollView
      style={{
        backgroundColor: "rgba(1, 1, 1, 0.78)",
      }}
      contentContainerStyle={{ justifyContent: "space-around", flex: 1 }}
    >
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Account Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Language</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Reset Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Legal</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.seperator}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  seperator: {
    marginVertical: 10, // Optional: Add margin for spacing between the sections
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignSelf: "center",
    width: "100%",
    justifyContent: "center", // Vertically center the content
    alignItems: "center", // Horizontally center the content
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.65)",
  },
  text: {
    fontSize: 20,
    fontFamily: "Semi-Bold",
    textAlign: "center",
    color: "white",
  },
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.65)",
    width: "80%",
    alignSelf: "center",
  },
});
