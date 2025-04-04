import { View, Text, StyleSheet, SafeAreaView } from "react-native";
export default function header() {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title}>SquareScan</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    color: "white",
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    width: "100%",
    padding: 20,
  },
});
