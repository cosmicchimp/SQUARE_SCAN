import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome6,
  Entypo,
  Feather,
} from "@expo/vector-icons";
// Image paths (same as before)
const logo = require("../assets/Logos/Gemini_Generated_Image_sl6i2osl6i2osl6i.jpg");
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

// Fake data for projects (same as before)
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
  const slide = useRef(new Animated.Value(500)).current;
  const [visible, setVisible] = useState(false);
  const [modalInfo, updateModalInfo] = useState({
    name: null,
    photo: null,
  });
  const toggleSlide = (name, photo) => {
    updateModalInfo({
      name,
      photo,
    });
    Animated.timing(slide, {
      toValue: visible ? 500 : 0, // Slide out if visible, slide in if hidden
      duration: 300,
      useNativeDriver: true,
    }).start();
    setVisible(!visible);
  };

  return (
    <View style={styles.body}>
      <Animated.View
        style={[{ transform: [{ translateX: slide }] }, styles.popupModal]}
      >
        <ScrollView>
          {/* Modal content */}
          <Text style={styles.modalTitle}>{modalInfo.name}</Text>
          <View style={styles.photoModal}>
            <View style={styles.topRow}>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Back-left corner</Text>
              </View>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Back</Text>
              </View>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Back-right corner</Text>
              </View>
            </View>

            <View style={styles.middleRow}>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Left side</Text>
              </View>

              <TouchableOpacity style={styles.photoModalButton}>
                <Image source={logo} style={styles.photoModalButton} />
              </TouchableOpacity>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Right side</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Front-left corner</Text>
              </View>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Front</Text>
              </View>
              <View style={styles.photoButtonBox}>
                <TouchableOpacity
                  style={styles.photoModalButton}
                ></TouchableOpacity>
                <Text style={styles.buttonText}>Front-right corner</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            onPress={() => {
              toggleSlide(null, null);
            }} // Call toggleSlide here
            style={styles.exitButton}
          >
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.exitText}>Measurements</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FlatList
        data={fakeData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listBox}
            onPress={() => {
              toggleSlide(item.name, item.cover);
            }}
          >
            <Image source={item.cover} style={styles.coverImage} />
            <View style={styles.textBox}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.date}>
                <Text>Date: {item.date.toString().slice(0, 16)}</Text>
              </Text>
              <TouchableOpacity style={styles.doneButton}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
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
    gap: 60,
    marginTop: 20,
  },
  listBox: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "rgba(158, 158, 158, 0.15)",
  },
  text: {
    color: "white",
    fontFamily: "Condensed-Regular",
    fontSize: 17,
    marginBottom: 10,
  },
  date: {
    color: "white",
    fontFamily: "Condensed-Regular",
    fontSize: 15,
    marginBottom: 10,
  },
  coverImage: {
    width: "100%",
    height: 95,
    width: 95,
    borderRadius: 5,
    marginTop: 10,
  },
  body: {
    flex: 1,
    backgroundColor: "rgb(1, 1, 1)",
  },
  textBox: {
    gap: 0,
    alignContent: "center",
    justifyContent: "center",
  },
  doneButton: {
    backgroundColor: "rgba(24, 255, 16, 0.73)",
    borderRadius: 10,
    width: 70,
    padding: 11,
  },
  buttonText: {
    alignSelf: "center",
    color: "white",
    fontFamily: "Condensed-Regular",
  },
  popupModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    zIndex: 1000,
    backgroundColor: "black",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  modalTitle: {
    color: "white",
    padding: 10,
    alignSelf: "center",
    marginTop: "2%",
    fontSize: 20,
    fontWeight: 600,
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  exitButton: {
    backgroundColor: "white",
    width: "40%",
    height: "60%",
    borderRadius: 5,
    padding: 10,
    alignSelf: "center",
    marginTop: "5%",
    marginBottom: "5%",
  },
  exitText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: 800,
  },
  photoModal: {
    width: "100%",
    height: "40%",
    alignSelf: "center",
    alignContent: "center",
    gap: "8%",
    marginTop: "15%",
  },
  topRow: { flexDirection: "row", gap: "5%", alignSelf: "center" },
  middleRow: {
    flexDirection: "row",
    gap: "5%",
    alignSelf: "center",
  },
  bottomRow: { flexDirection: "row", gap: "5%", alignSelf: "center" },
  buttonText: {
    fontWeight: 800,
    fontSize: 12,
    color: "white",
    alignSelf: "center",
    marginTop: "4%",
  },
  photoModalButton: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: "white",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
