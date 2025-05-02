import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { getHouseImage } from "../../constants/CameraNodeDefaultImages";

const CameraNode = ({ index, styleButton, onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Request Camera Permission
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Default if permission is not granted
  if (hasPermission === false || hasPermission === null) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  // Function to open the camera
  const openCamera = async () => {
    setIsCameraOpen(true);

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera denied");
      return;
    }

    // open the camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    // set image
    if (!result.canceled && result.assets?.[0]?.uri) {
      onPhotoTaken(result.uri);  // <-- **give project uri 

      console.log(`Result: ${result}, Assets: ${result.assets[0].uri}`);
      setImageUri(result.assets[0].uri);
    }

    setIsCameraOpen(false);
  };

  const placeholderImage = getHouseImage(index);
  return (
    <View style={styles.container}>
      {/* display imageURI else the placeholder */}
      <TouchableOpacity
        style={styles.photoModalButton}
        onPress={() => {
          !imageUri ? openCamera() : setShowImageModal(true);
        }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Image source={placeholderImage} style={styles.placeholderimage} />
        )}
      </TouchableOpacity>

      {/* Modal shows image and becomes visible when imageURI is present*/}
      <Modal visible={showImageModal} transparent={true}>
        {/* display taken image */}
        <View style={styles.imageView}>
          <Image
            source={{ uri: imageUri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
        {/* bottom buttons */}
        <View style={{ flex: 1, justifyContent: "flex-end", top: 2 }}>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              onPress={() => setShowImageModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowImageModal(false);
                setTimeout(() => {
                  openCamera();
                }, 100);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 111,
    height: 111,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgb(255, 255, 255)",
    // opacity:0.5
  },
  placeholderimage: {
    width: "50%",
    height: "50%",
    overflow: "hidden",
    borderRadius: 12,
    opacity: 0.5,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  photoModalButton: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "rgb(255, 255, 255)",

    justifyContent: "center",
    alignItems: "center",
  },
  imageView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "column",
    zIndex: -1,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
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

export default CameraNode;
