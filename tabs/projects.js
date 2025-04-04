import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const fakeData = [
  { id: 1, name: "118 Wintermist Drive", images: ["1.png", "2.png", "3.png"] },
  { id: 2, name: "45 Maple Lane", images: ["4.png", "5.png", "6.png"] },
  { id: 3, name: "789 Oakwood Blvd", images: ["7.png", "8.png", "9.png"] },
  { id: 4, name: "232 Pinehill Road", images: ["10.png", "11.png", "12.png"] },
  {
    id: 5,
    name: "101 Sunset Boulevard",
    images: ["13.png", "14.png", "15.png"],
  },
  {
    id: 6,
    name: "560 Eaglecrest Drive",
    images: ["16.png", "17.png", "18.png"],
  },
  { id: 7, name: "123 Riverstone Ave", images: ["19.png", "20.png", "21.png"] },
  { id: 9, name: "12 Highland Park", images: ["25.png", "26.png", "27.png"] },
  { id: 10, name: "74 Lakeview Drive", images: ["28.png", "29.png", "30.png"] },
  { id: 11, name: "456 Birchwood Ave", images: ["31.png", "32.png", "33.png"] },
  {
    id: 12,
    name: "89 Spring Hill Road",
    images: ["34.png", "35.png", "36.png"],
  },
  {
    id: 13,
    name: "203 Redwood Boulevard",
    images: ["37.png", "38.png", "39.png"],
  },
  {
    id: 14,
    name: "620 Blueberry Lane",
    images: ["40.png", "41.png", "42.png"],
  },
  {
    id: 15,
    name: "501 Stonebridge Way",
    images: ["43.png", "44.png", "45.png"],
  },
  { id: 16, name: "33 Greenfield Ave", images: ["46.png", "47.png", "48.png"] },
  {
    id: 17,
    name: "78 Willow Creek Rd",
    images: ["49.png", "50.png", "51.png"],
  },
  { id: 18, name: "210 Sunset Ridge", images: ["52.png", "53.png", "54.png"] },
  { id: 19, name: "88 Maplewood Blvd", images: ["55.png", "56.png", "57.png"] },
  { id: 20, name: "900 Pinecrest Dr", images: ["58.png", "59.png", "60.png"] },
];

export default function Projects() {
  return (
    <View style={styles.body}>
      <FlatList
        data={fakeData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listBox}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "center",
    width: "95%",
    gap: 8,
    marginTop: 10,
  },
  listBox: {
    backgroundColor: "rgba(1, 1, 1, 0.75)",
    padding: 20,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontFamily: "Condensed-Regular",
    fontSize: 20,
  },
  body: {
    flex: 1,
    backgroundColor: "rgba(1, 1, 1, 0.75)",
  },
});
