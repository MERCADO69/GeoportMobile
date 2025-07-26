import React,{useEffect, useState} from 'react';
import { View, Text, TouchableOpacity,StyleSheet,TextInput,Image, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';import ValidateFace from '../../Functions/verifyImage'; 
import GetUserData from "../../Functions/getUserData"
import useLiveLocation from '../../Functions/getCurrentLocation';
import GetReverseLocation from "../../Functions/reverseLocationLookup"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator } from 'react-native';
import updateUserInfo from "../../Functions/updateUserInfo"


const UpdateInformationScreen = ({ navigation }) => {
  const [user_data,setUserData] = useState('')
  const location = useLiveLocation(); 
  const [address,setAddress] = useState();
  const [capturedImage,setCapturedImage] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false)
  const isChanged = (originalData && firstName !== originalData.name) || capturedImage !== '' || firstName.trim() === '';



  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([
          handleFetchData(),
          reverse()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAll();
  }, []);
  

   
   async function reverse() {
      if(location){
            const location_data = await GetReverseLocation(location.latitude,location.longitude)
            setAddress(location_data);
   }}
      

  const handleFetchData = async () =>{
    const data = await GetUserData();
    if(!data){
      return;
    }
    setUserData(data.data);
    setOriginalData(data.data);
    setFirstName(data.data.name);
   }



   const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your camera.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16], 
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      setUserData(prev => ({ ...prev, image: imageUri }));
    }
  };
  


  const handleValidateProfile = async ()  =>{
    let profileImage = user_data.image;
    setLoading(true);
   if (typeof profileImage === 'string' && profileImage.startsWith('http')) {
      const localUri = `${FileSystem.cacheDirectory}profileImage.jpg`;
      const downloadResumable = FileSystem.createDownloadResumable(profileImage, localUri);
      const { uri: downloadedUri } = await downloadResumable.downloadAsync();
      profileImage = downloadedUri;
    }
    try{
      const validateFace = await ValidateFace(capturedImage,profileImage);

      if(validateFace?.success){
       Alert.alert('Success','Your profile picture has been successfully updated.');
       return capturedImage;
      }else{
        Alert.alert( 'Face Not Matched','For your security, we compared your current photo with the existing one on file. Unfortunately, they did not match. Please retake the photo and ensure your face is clearly visible.');        
        setCapturedImage('');
        setUserData(prev => ({ ...prev, image: user_data.image }));
      }}catch(error){
         Alert.alert('Error','Failed to validate image. Please try again.')
         throw new error
       }
    finally{
      setLoading(false);
    }
  } 

  const handleCancel = () => {
    setFirstName(originalData?.name || '');
    setCapturedImage('');
    setUserData(originalData);
    navigation.goBack();
  };
  


  const HandleSubmitUpdate = async () => {
    let image = capturedImage ? await handleValidateProfile() : originalData?.image;
    let name = firstName !== originalData?.name ? firstName : originalData?.name;
    return { image, name };
  };



  async function HandleDataSubmission(){
    try{
      setLoading(true);
        const { image, name } = await HandleSubmitUpdate();
        const UpdateData = await updateUserInfo(name, image);
        if(UpdateData?.success){
          Alert.alert('Success','Your information has been successfully updated.');
          navigation.goBack();
        }else {
          Alert.alert('Error', UpdateData?.message || 'Failed to update data.');
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message || 'Failed to update data. Please try again.';
         Alert.alert('Error', errorMessage);
      }finally{
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Information</Text>
      </View>

      {/* Profile Picture Section */}
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleCameraPress}>
        <View style={styles.profilePictureWrapper}>
          {user_data?.image ? (
            <Image
              source={{ uri: user_data.image }}
              style={styles.profileFallback}
            />
          ) : (
            <View style={styles.profileFallback}>
              <Ionicons name="person-outline" size={40} color="#666" />
            </View>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FF7F00" />
            </View>
          )}
        </View>
        <Text style={styles.profilePictureText}>Tap to change Profile Picture</Text>
      </TouchableOpacity>


 

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Name Fields */}
        <View style={styles.nameContainer}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder={user_data.name}
              value={firstName}
               onChangeText={setFirstName}
            />
          </View>
          
        </View>

        {/* Email/Phone Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address/Phone Number</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <Text
              style={styles.inputWithIconField}
            >{user_data.email}</Text>
          </View>
        </View>

        {/* Address Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Barangay address</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <Text style={styles.inputWithIconField}> 
               {address?.city && address?.region
              ? `${address.city} ${address.region}`
              : "Fetching address..."} 
    </Text>
          </View>
        </View>
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity  style={[styles.saveButton, { backgroundColor: (firstName.trim() && (capturedImage || firstName !== originalData?.name)) ? '#FF7F00' : '#ccc' }]}
          onPress={HandleDataSubmission}
          disabled={!firstName.trim() || !isChanged}
        >
      <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"} </Text>
    </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 17,
    marginLeft: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  
  profilePictureText: {
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    fontSize: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputHalf: {
    flex: 1,
    marginRight: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Poppins_500Medium',
    fontSize: 17,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIconField: {
    flex: 1,
    padding: 12,
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 'auto',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF7F00',
  },
  cancelButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },profilePictureWrapper: {
    width: 100,
  height: 100,
  borderRadius: 50,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative', 
  backgroundColor: '#f0f0f0',
  },profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  profileFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  
});

export default UpdateInformationScreen;