import React, { useState, useEffect,useReducer } from "react";
import { TouchableOpacity, StyleSheet, Alert,ActivityIndicator,View,Modal, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import ValidateReport from "../../Functions/ValidateReport";
import SuccessModal from "../modals/success"
import StoreReportToDatabase from  "../../Functions/storeReportToDatabase"
import uploadToCloudinary from "../../Functions/cloudinaryUploader"
import GetUserData from "../../Functions/getUserData"
import useLiveLocation from "../../Functions/getCurrentLocation";
import GuideModal from "../modals/guideModal"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Camera() {
  const [flashOn, setFlashOn] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reportMessage,setReportMessage] = useState('')
  const [status,setStatus] = useState('')
  const [showGuide, setShowGuide] = useState(false);
  const [buttonStatus,setButtonStatus] = useState(true)
  const [modalStatus, setModalStatus] = useState("validated");
  const loc = useLiveLocation()
  const [isCameraReady,setIsCameraAccessible] = useState(false)



    const loadSettings = async () => {
        try {
          const isCameraAccessible = await AsyncStorage.getItem('userSettings');
          if (isCameraAccessible !== null) {
            const parsedSettings = JSON.parse(isCameraAccessible);
            const isEnabled = !!parsedSettings.cameraAccess; 
            setIsCameraAccessible(isEnabled);
            console.log("The configured settings is ",JSON.stringify(isEnabled));
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      };






  const handleCameraPress = async () => {
   await loadSettings()

    if(!isCameraReady){
      Alert.alert("Camera Access Denied", "Please enable camera access in your settings.");
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
            setReportMessage("Report Successfully Validated as "+response.reportType +".")
            setModalStatus('validated')
            setModalVisible(true)
            const report_type = response.reportType;
            setTimeout(async () => {
              await submitReport(report_type);
            }, 3000);
          } else {
            setPhotoUri(null);
            Alert.alert("Invalid Report","Image not recognized as road collision or road defects.");
          }
        } catch (error) {
            setReportMessage("Failed to upload image. "+ error)
            setModalStatus('error')
            setModalVisible(true)
        } finally {
          setLoading(false); 
        }
      })();
    }
  }, [photoUri]);
  


  async function submitReport(report_type) {
    try {
      setModalStatus('processing');
      const uploadImage = await uploadToCloudinary(photoUri, report_type);
      
      if (!uploadImage) {
        setReportMessage(uploadImage.message);
        setModalStatus('error');
        return; 
      }
  
      const imageurl = uploadImage;
      console.log('Trying to save to database...');
    
      console.log("the location is ",loc)
      const store = await StoreReportToDatabase(imageurl, report_type,loc);
      console.log("submitReport function executed");
      if (!store.success) {
        console.log('Unable to upload to database');
        setReportMessage('Something went wrong. Unable to process request');
        setModalStatus('error');
        return; 
      }
  
      setModalStatus('success');
      setPhotoUri(null);
    } catch (error) {
      setReportMessage('An error occurred: ' + error.message);
      setModalStatus('error');
    }
  }
  
   useEffect(()=>{
        async function FetchData() {  
            const data = await GetUserData()
          if(data) {
                let status = data.data?.status
                if(status !== 'unverified'){
                  setButtonStatus(false)
                  setShowGuide(true);
                }else{
                  setButtonStatus(true)
                  setShowGuide(false)
                  Alert.alert("Warning", "You're not eligible for this feature. Please verify yourself first to enable this feature. Thank you.");
                }
          }
        }
        loadSettings()
        FetchData()
    },[])

  
    return (
      <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setShowGuide(true)} style={styles.helpButton}>
        <Text style={styles.helpText}>📘 How to Use This Feature</Text>
      </TouchableOpacity>
  
  
        <GuideModal showGuide={showGuide} setShowGuide={setShowGuide} />
  
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
  
      
        {/* Camera Button */}
        <TouchableOpacity onPress={handleCameraPress} style={[styles.cameraButton,{backgroundColor : buttonStatus? "#ccc":"#FA812F"}]} disabled={buttonStatus}>
          <Icon name="radio-button-off" size={80} color="white" />
        </TouchableOpacity>
  
        <SuccessModal isVisible={isModalVisible} status={modalStatus} text={reportMessage} onClose={() => setModalVisible(false)}/>
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
    // backgroundColor: "#FA812F",
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

