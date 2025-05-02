import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import PopupModal from "../components/project_components/Modal";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';

// import { BlurView } from '@react-native-community/blur';
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import ProjectPull from "../components/project_components/ProjectPull";
import projectPush from "../components/project_components/ProjectPush";
import { AuthContext } from "../context/AuthContext";
import InfoModal from "../components/project_components/InfoModal";
// Image paths (same as before)
const logo = require("../assets/Logos/Gemini_Generated_Image_sl6i2osl6i2osl6i.jpg");

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
//
//This is the default export project component
export default function Projects() {
  //All context state and effect definitions
  const { currentUser } = useContext(AuthContext);
  const [userProjects, updateProjects] = useState();
  const [dataStatus, updateDataStatus] = useState();
  const [incompleteScan, updateScanStatus] = useState(true);
  const slide = useRef(new Animated.Value(500)).current;
  const [visible, setVisible] = useState(false);
  const [modalInfo, updateModalInfo] = useState({
    name: null,
    photo: null,
  });
  const [isVisible, updateVisible] = useState(false);
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [projectName, updateProjectName] = useState("");
  const [projectAddress, updateProjectAddress] = useState("");
  const [photoURIs, setPhotoURIs] = useState({});


  // Header Buttons: right icons buttons for Projects tab
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInDrafts, setsInDrafts] = useState(false);
  const [isInArchive, setsInArchive] = useState(false);
  const onPressEdit = () => { setIsEditMode(!isEditMode); setsInDrafts(false); setsInArchive(false);};
  const onPressDraft = () => {setsInDrafts(true); setsInArchive(false);};
  const onPressArchive= () => { setsInArchive(true); setsInDrafts(false);};
  const getProjectHeaderButtons = () => {
    return (
      <View style={{ flexDirection:"row", gap:25, paddingRight: 30, alignItems: "center", justifyContent: "center"}}>
        <TouchableOpacity onPress={() => onPressArchive()}>
          {isEditMode && (<MaterialCommunityIcons name="archive-outline" size={27} color="#673AB7" />)}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => isEditMode ? onPressDraft() : updateVisible(true)}>
          {!isEditMode && <MaterialCommunityIcons name="plus-circle-outline" size={27} color="#673AB7" />}
          {isEditMode && <MaterialCommunityIcons name="file-document-edit-outline" size={27} color="#673AB7" />}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => onPressEdit()}>
          {!isEditMode 
          ? (<Feather name="edit" size={24} color="#673AB7" />)
          : (<Feather name="x" size={26} color="#673AB7" />)}
        </TouchableOpacity>
      </View>
    )
  };
  useEffect(() => {
    navigation.setOptions({
      title: 
      !isEditMode
        ? "Projects" 
        : isInDrafts
          ? "Drafts"
          : isInArchive
            ? "Archives"
            : "Edit Projects", 
      headerRight: () => ( getProjectHeaderButtons()),
    });
  }, [isEditMode, isInDrafts, isInArchive]);


  //Start of function tools
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await ProjectPull({ currentUser: currentUser });
        updateProjects(result.query);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
    fetchProjects();
  }, [dataStatus]);

  // print out current photoURIs
  useEffect(() => {
    console.log("Updated photoURIs:");
    Object.entries(photoURIs).forEach(([index, uri]) => {
      console.log(`Index ${index}: ${uri}`);
    });
    }, [photoURIs]);


  const newProjectBox = () => {
    return (
      <View style={{flex:1, borderRadius: 20, overflow:"hidden"}}>
        <LinearGradient
        colors={["#673AB7", "#rgb(103,58,183)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        />
          <BlurView
            style={styles.newProjectBox}
            intensity={20}
          >
            <TouchableOpacity style={styles.topButton} onPress={() => {updateVisible(true);}}>
              <Text style={styles.headerText}>Archives</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.topButton}>
              <Text style={styles.headerText}>Drafts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.topButton}>
              <Text style={styles.headerText}>Edit</Text>
            </TouchableOpacity>
          </BlurView>
      </View>
    );
  };
  console.log("Current user: ", currentUser);
  return (
    <View style={styles.body}>
      <PopupModal
        isVisible={isVisible}
        updateVisible={updateVisible}
        projectName={projectName}
        projectAddress={projectAddress}
        updateProjectAddress={updateProjectAddress}
        updateProjectName={updateProjectName}
        projectPush={projectPush}
        currentUser={currentUser}
        updateDataStatus={updateDataStatus}
      />
      <Animated.View
        style={[{ transform: [{ translateX: slide }] }, styles.popupModal]}
      >
        {/* Modal content */}
        <InfoModal
          isInfoVisible={isInfoVisible}
          setInfoVisible={setInfoVisible}
        />
        <ScrollView>
          {/* title */}
          <Text style={styles.modalTitle}>{modalInfo.name}</Text>
          <TouchableOpacity
            style={styles.infoBar}
            onPress={() => {
              setInfoVisible(true);
            }}
          >
            <FontAwesome6 name="question-circle" size={25} color="white" />
          </TouchableOpacity>
          {/* photo square */}
          <View style={styles.photoModal}>
            {/* top row of photos */}
            <View style={styles.topRow}>
              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Back-left corner</Text>
              </View>

              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Back</Text>
              </View>

              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Back-right corner</Text>
              </View>
            </View>

            {/* middle row of photos with logo */}
            <View style={styles.middleRow}>
              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Left side</Text>
              </View>

              {/* logo */}

              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Right side</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Front-left corner</Text>
              </View>

              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Front</Text>
              </View>

              <View style={styles.photoButtonBox}>
                
                <Text style={styles.buttonText}>Front-right corner</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View style={styles.bottomButtons}>
          <BlurView intensity={80} tint="light" style={styles.exitButton}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to leave?",
                  "All unsaved data will be lost.",
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        toggleSlide();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>
          </BlurView>

          <BlurView intensity={80} tint="light" style={styles.exitButton}>
            <TouchableOpacity>
              <Text style={styles.exitText}>Measurements</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Animated.View>

      <FlatList
        data={userProjects}
        ListHeaderComponent={null}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listBox}
            onPress={() => {
              toggleSlide(item.project_name, item.image_links);
            }}
          >
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

            {/* image and description */}
            <View style={{flexDirection:"row", justifyContent:"flex-start", }}>
              <Image
                source={{ uri: item.cover_photo }}
                style={styles.coverImage}
              />
              <View style={styles.textBox}>
                <Text style={styles.text}>{item.project_name}</Text>
                <Text style={styles.text}>{item.created_at.slice(0, 10)}</Text>
              </View>
            </View>
            
            {/* archive and delete button */}
            <View style={{height: "100%", justifyContent:"space-around", alignItems:"center", paddingHorizontal:5 }}>
              {/* <TouchableOpacity style={{paddingVertical:20}}>
                {isEditMode && <MaterialCommunityIcons name="archive-plus-outline" size={24} color="#673AB7" />}
              </TouchableOpacity> */}
              <TouchableOpacity style={{paddingVertical:20}}>
                {isEditMode && <MaterialIcons name="do-not-disturb-on" size={30} color="#D32F2F" />}
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
    width: "90%",
    gap: 30,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  newProjectBox: {
    overflow: "hidden",
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "20%",
    justifyContent: "center",
  },
  listBox: {
    borderRadius: 25,
    height: 140,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    paddingHorizontal: 17,
    overflow:"hidden",
    borderWidth: 3,
    borderColor:"#673AB7",
    backgroundColor: "rgba(212, 212, 212, 0.4)",
  },
  textBox: {
    flexDirection: "column",
    padding:60,

  },
  text: {
    color: "black",
    fontFamily: "Condensed-Regular",
    fontSize: 17,
    marginBottom: 10,
  },
  headerText: {
    color: "white",
    fontFamily: "AppleTea",
    fontSize: 16,
  },
  topTextBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  bigText: { fontSize: 60, color: "white", alignSelf: "center" },
  date: {
    color: "white",
    fontFamily: "Condensed-Regular",
    fontSize: 15,
    marginBottom: 10,
  },
  coverImage: {
    width: "100%",
    height: 100,
    width: 100,
    marginRight: 20,
    borderRadius: 15,
    
  },
  body: {
    flex: 1,
    backgroundColor: "#fdfdfd",
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
    backgroundColor: "rgba(255,255,255,0.5)",
    width: "45%",
    height: "55%",
    borderRadius: 15,
    padding: 10,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: "5%",
    marginBottom: "5%",
    borderWidth: 2,
  },
  exitText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: 800,
    color: "white",
  },
  photoModal: {
    width: "100%",
    height: "40%",
    alignSelf: "center",
    alignContent: "center",
    gap: "8%",
    marginTop: "8%",
  },
  infoBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "93%",
  },
  topRow: { flexDirection: "row", gap: "5%", alignSelf: "center" },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "5%",
    marginRight: "5%",
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
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,

    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    height: "15%",
    justifyContent: "space-around",
  },
  closeButton: {
    padding: 10,
    height: 50,
    backgroundColor: "#131313",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 19,
  },
  buttonBox: {
    height: "15%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#131313",
    padding: 15,
  },
});
