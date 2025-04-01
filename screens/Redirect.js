import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import ValidateId from "../Functions/validateImage";
import ValidateFace from "../Functions/verifyImage";
import UpdateUser from "../Functions/updateUser"

export default function IdentityVerification() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedID, setCapturedID] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idValidated, setIdValidated] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const openCameraForID = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission required", "Camera access is needed");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
        base64: false
      });
  
      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }
  
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      setLoading(true);
      try {
        const validation = await ValidateId(imageUri);
        if (validation.success) {
          setCapturedID(imageUri);
          setIdValidated(true);
          setCapturedImage(null);

          
          Alert.alert("Success", "ID validated successfully");
        } else {
          throw new Error(validation.error || "ID validation failed");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera");
    }
  };
  

  const validateCapturedID = async () => {
    try {
      setLoading(true);
      console.log(capturedID)
      const validation = await ValidateId(capturedImage);
      
      if (validation.success) {
        setCapturedID(capturedImage);
        setIdValidated(true);
        setCapturedImage(null);
        Alert.alert("Success", "ID validated successfully");
      } else {
        throw new Error(validation.error || "ID validation failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const takeFacePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
      if (!cameraPermission.granted) {
        Alert.alert("Permission required", "We need camera permissions to take photos");
        return;
      }
  
      let result = await ImagePicker.launchCameraAsync({ 
        allowsEditing: true, 
        quality: 1,
        aspect: [4, 3],
        base64: true
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        setLoading(true); 
  
        try {
          const response = await ValidateFace(capturedID, imageUri);
          if (response?.success) {
            setValidationSuccess(true)
            handleUpdateUserStatus(imageUri)
          } else {
            Alert.alert(
              "Verification Failed", 
              response?.error || "Could not verify your identity. Please try again."
            );
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          Alert.alert("Network Error", "Could not connect to verification service");
        }
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      Alert.alert("⚠️ Error", "Failed to capture face photo. Please try again.");
    } finally {
      setLoading(false); 
    }
  };
  

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }


  async function handleUpdateUserStatus(imageUri){

    if(!imageUri){
      console.error('no profile image')
      return false
    }
    Alert.alert('Processing','Running the update function')
    let updateStatus = await UpdateUser.UpdateUserStatus(imageUri);

    if (updateStatus.successfull) {
      Alert.alert("Success", "User status updated successfully!");
  } else {
      Alert.alert("Error", updateStatus.message);
  }
  }

  return (
    <View style={{ flex: 1 }}>
      
      {idValidated ? (
         <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.header}>Face Verification</Text>
         <Text style={styles.infoText}>Please verify your face to complete the process</Text>
     
         {loading ? (
           <View style={styles.loadingContainer}>
             <LottieView 
               source={require('../assets/loading_animation.json')}
               autoPlay 
               loop 
               style={styles.loadingAnimation} 
             />
             <Text style={styles.infoText}>Verifying face...</Text>
           </View>
         ) : (
           <Animated.View style={[styles.buttonCard, { opacity: fadeAnim }]}>
             <TouchableOpacity onPress={takeFacePhoto} style={styles.button}>
               <LottieView source={require('../assets/face_animation.json')} autoPlay loop style={styles.lottie} />
               <Text style={styles.buttonText}>Start Face Verification</Text>
             </TouchableOpacity>
           </Animated.View>
         )}
       </ScrollView>
      ) : capturedImage ? (
        <ScrollView contentContainerStyle={styles.container}>
  
        {loading ? (
          <View style={styles.loadingContainer}>
            <LottieView 
              source={require('../assets/loading_animation.json')}
              autoPlay 
              loop 
              style={styles.loadingAnimation} 
            />
            <Text style={styles.infoText}>Validating your ID...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Identity Verification</Text>
          <Text style={styles.infoText}>Capture your ID first, then scan your face for verification.</Text>
      
          <Animated.View style={[styles.buttonCard, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={openCameraForID} style={styles.button}>
              <LottieView 
                source={require('../assets/id_scanning.json')}
                autoPlay 
                loop 
                style={styles.lottie} 
              />
              <Text style={styles.buttonText}>Capture ID</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        )}
      </ScrollView>
    ) : (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Identity Verification</Text>
        <Text style={styles.infoText}>Capture your ID first, then scan your face for verification.</Text>
    
        <Animated.View style={[styles.buttonCard, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={openCameraForID} style={styles.button}>
            <LottieView 
              source={require('../assets/id_scanning.json')}
              autoPlay 
              loop 
              style={styles.lottie} 
            />
            <Text style={styles.buttonText}>Capture ID</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: { fontSize: 14, marginTop: 10, textAlign: 'center', color: '#666' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#f5f5f5' },
  guideContainer: { 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 20, 
    marginTop: 20,
    width: '100%',
    elevation: 2,
  },
  guideTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  guideText: { fontSize: 14, color: '#555', marginBottom: 3 },
  buttonCard: { 
    backgroundColor: 'white',
    width: '100%', 
    maxWidth: 350,
    height: 140,   
    borderRadius: 10, 
    elevation: 3, 
    marginTop: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  previewImage: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
    resizeMode: 'contain'
  },
  lottie: { 
    width: 90, 
    height: 90 
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  loadingAnimation: { 
    width: 70, 
    height: 70,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});