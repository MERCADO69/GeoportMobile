import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Alert,ActivityIndicator,View,Modal, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import ValidateReport from "../../Functions/ValidateReport";

export default function Camera() {
  const [flashOn, setFlashOn] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Open Camera and Capture Image
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your camera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square photo
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      await processImage(result.assets[0].uri); // Process the image
    }
  };

  useEffect(() => {
    if (photoUri) {
      (async () => {
        setLoading(true); // ✅ Start loading
        try {
          const response = await ValidateReport(photoUri);
          if (response.success) {
            Alert.alert("Image recognized", response.reportType);
            setPhotoUri(null);
          } else {
            setPhotoUri(null);
            Alert.alert("Invalid Report","Image not recognized as road collision or road defects.");
          }
        } catch (error) {
          console.error("Upload Error:", error);
          Alert.alert("Error", "Failed to upload image.");
        } finally {
          setLoading(false); // ✅ Stop loading
        }
      })();
    }
  }, [photoUri]);
  

  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Issue}>
        Point the camera at the Road issue{"\n"}or at the Collision
      </Text>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FA812F" />
            <Text style={styles.loadingText}>Scanning image...</Text>
          </View>
        </View>
      </Modal>

      {/* Display Captured Image */}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}

      {/* Flash Icon */}
      <TouchableOpacity onPress={() => setFlashOn(!flashOn)} style={styles.flashButton}>
        <Icon name={flashOn ? "flash" : "flash-outline"} size={30} color="#FA812F" />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity onPress={handleCameraPress} style={styles.cameraButton}>
        <Icon name="camera" size={40} color="white" />
      </TouchableOpacity>

     
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    alignItems: "center",
    justifyContent: "center",
  },
  flashButton: {
    position: "absolute",
    top: 50,
    right: 30,
    padding: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 30,
    width: 80,
    height: 80, 
    borderRadius: 40,
    backgroundColor: "#FA812F",
    justifyContent: "center",
    alignItems: "center",
  },
  Issue: {
    marginTop: 20,
    color: "gray",
    textAlign: "center",
  },
  previewImage: {
    width: 300,
    height: 350,
    borderRadius: 10,
    marginTop: 20,
  },
  predictionText: {
    marginTop: 20,
    color: "black",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
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

