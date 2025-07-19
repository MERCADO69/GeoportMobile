import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Modal,
  Text,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import ValidateReport from "../../Functions/ValidateReport";
import SuccessModal from "../modals/success";
import StoreReportToDatabase from "../../Functions/storeReportToDatabase";
import uploadToCloudinary from "../../Functions/cloudinaryUploader";
import GetUserData from "../../Functions/getUserData";
import useLiveLocation from "../../Functions/getCurrentLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Camera() {
  const [flashOn, setFlashOn] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("validated");
  const [buttonStatus, setButtonStatus] = useState(true);
  const loc = useLiveLocation();
  const [isCameraReady, setIsCameraAccessible] = useState(false);

  const loadSettings = async () => {
    try {
      const isCameraAccessible = await AsyncStorage.getItem("userSettings");
      if (isCameraAccessible !== null) {
        const parsedSettings = JSON.parse(isCameraAccessible);
        const isEnabled = !!parsedSettings.cameraAccess;
        setIsCameraAccessible(isEnabled);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "Failed to load settings:");
    }
  };

  const handleCameraPress = async () => {
    await loadSettings();

    if (!isCameraReady) {
      Alert.alert(
        "Camera Access Denied",
        "Please enable camera access in your settings."
      );
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your camera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      await processImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (photoUri) {
      (async () => {
        setLoading(true);
        try {
          const response = await ValidateReport(photoUri);
          if (response.success) {
            setReportMessage(
              "Report Successfully Validated as " + response.reportType + "."
            );
            setModalStatus("validated");
            setModalVisible(true);
            const report_type = response.reportType;
            setTimeout(async () => {
              await submitReport(report_type);
            }, 3000);
          } else {
            setPhotoUri(null);
            Alert.alert(
              "Invalid Report",
              "Image not recognized as road collision or road defects."
            );
          }
        } catch (error) {
          setReportMessage("Failed to upload image. " + error);
          setModalStatus("error");
          setModalVisible(true);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [photoUri]);

  async function submitReport(report_type) {
    try {
      setModalStatus("processing");
      const uploadImage = await uploadToCloudinary(photoUri, report_type);

      if (!uploadImage) {
        setReportMessage(uploadImage.message);
        setModalStatus("error");
        return;
      }
      const imageurl = uploadImage;
      const store = await StoreReportToDatabase(imageurl, report_type, loc);
      if (!store.success) {
        setReportMessage("Something went wrong. Unable to process request");
        setModalStatus("error");
        return;
      }

      setModalStatus("success");
      setPhotoUri(null);
    } catch (error) {
      setReportMessage("An error occurred: " + error.message);
      setModalStatus("error");
    }
  }

  useEffect(() => {
    async function FetchData() {
      const data = await GetUserData();
      if (data) {
        let status = data.data?.status;
        if (status !== "unverified") {
          setButtonStatus(false);
        } else {
          setButtonStatus(true);
          Alert.alert(
            "Warning",
            "You're not eligible for this feature. Please verify yourself first to enable this feature. Thank you."
          );
        }
      }
    }
    loadSettings();
    FetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Instructional Guide */}
      <View style={styles.guideContainer}>
        <Text style={styles.guideTitle}>How to Use</Text>
        <Text style={styles.bullet}>• Tap the camera button to open the camera.</Text>
        <Text style={styles.bullet}>• Make sure the area is well-lit.</Text>
        <Text style={styles.bullet}>• Focus on the road issue or collision.</Text>
        <Text style={styles.bullet}>• Hold your phone steady for a clear photo.</Text>
        <Text style={styles.bullet}>• Tap the capture button to take a picture.</Text>
      </View>

      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FA812F" />
            <Text style={styles.loadingText}>Scanning image...</Text>
          </View>
        </View>
      </Modal>

      {/* Display Captured Image */}
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
      )}

      {/* Camera Button */}
      <TouchableOpacity
        onPress={handleCameraPress}
        style={[
          styles.cameraButton,
          { backgroundColor: buttonStatus ? "#ccc" : "#FA812F" },
        ]}
        disabled={buttonStatus}
      >
        <Icon name="radio-button-off" size={80} color="white" />
      </TouchableOpacity>

      {/* Status Modal */}
      <SuccessModal
        isVisible={isModalVisible}
        status={modalStatus}
        text={reportMessage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    alignItems: "center",
    justifyContent: "center",
  },
  guideContainer: {
    backgroundColor: "#FFF8F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FA812F",
    marginBottom: 8,
    textAlign: "center",
  },
  bullet: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  cameraButton: {
    position: "absolute",
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 300,
    height: 350,
    borderRadius: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    width: 200,
  },
  loadingText: {
    marginTop: 10,
    color: "black",
    fontSize: 16,
  },
});
