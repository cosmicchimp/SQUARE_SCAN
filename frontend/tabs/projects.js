import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

// Image paths
const images = [
  require("../assets/Images/1fc38c94ba4f4ef18ecf32fb1b563127-cc_ft_960.jpg"),
  require("../assets/Images/84ff675c45cd1765cf0c6c8a1b592c32l-m558761304od-w640_h480.jpg"),
  require("../assets/Images/181b9491befb092027e83972e235eb9d-cc_ft_960.jpg"),
  require("../assets/Images/813cb345f2a1b0e1059f504b16cad6b6-p_c.jpg"),
  require("../assets/Images/208704c108bd441421707daca3fb7c0el-m2667743328rd-w480_h360.jpg"),
  require("../assets/Images/15469242030d45ce0e3eb326d57c7d2c-cc_ft_960.jpg"),
  require("../assets/Images/dae5414579884909689318d5567abb1ca5cc1582-15-medium.webp"),
  require("../assets/Images/ff3b8b6e2b47570abfac34b80df9ef0d-cc_ft_960.jpg"),
];

// Fake data for projects
const fakeData = [
  {
    id: 1,
    name: "118 Wintermist Drive",
    cover: images[0],
    date: new Date("2023-04-04"),
    images: ["1.png", "2.png", "3.png"],
  },
  {
    id: 2,
    name: "45 Maple Lane",
    cover: images[1],
    date: new Date("2023-04-04"),
    images: ["4.png", "5.png", "6.png"],
  },
  {
    id: 3,
    name: "789 Oakwood Blvd",
    cover: images[2],
    date: new Date("2023-04-04"),
    images: ["7.png", "8.png", "9.png"],
  },
  {
    id: 4,
    name: "232 Pinehill Road",
    cover: images[3],
    date: new Date("2023-04-04"),
    images: ["10.png", "11.png", "12.png"],
  },
  {
    id: 5,
    name: "101 Sunset Boulevard",
    cover: images[4],
    date: new Date("2023-04-04"),
    images: ["13.png", "14.png", "15.png"],
  },
  {
    id: 6,
    name: "560 Eaglecrest Drive",
    cover: images[5],
    date: new Date("2023-04-04"),
    images: ["16.png", "17.png", "18.png"],
  },
  {
    id: 7,
    name: "123 Riverstone Ave",
    cover: images[6],
    date: new Date("2023-04"),

    images: ["19.png", "20.png", "21.png"],
  },
];

export default function Projects() {
  const filter = /^20\d{2}$/;
  return (
    <View style={styles.body}>
      <FlatList
        data={fakeData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listBox}>
            <Image source={item.cover} style={styles.coverImage} />
            <View style={styles.textBox}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>
                {item.date.toString().slice(0, 16)}
              </Text>

              <TouchableOpacity style={styles.doneButton}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Uncomment to show the cover image */}
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
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 20,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: "white",
    fontFamily: "Condensed-Regular",
    fontSize: 20,
  },
  coverImage: {
    width: "100%",
    height: 85,
    width: 85,
    borderRadius: 5,
    marginTop: 10,
  },
  body: {
    flex: 1,
    backgroundColor: "rgb(1, 1, 1)",
  },
  textBox: {
    gap: 5,
  },
  doneButton: {
    backgroundColor: "rgba(24, 255, 16, 0.73)",
    borderRadius: 10,
    width: 50,
    padding: 5,
  },
  buttonText: {
    alignSelf: "center",
    color: "white",
    fontFamily: "Condensed-Regular",
  },
});
