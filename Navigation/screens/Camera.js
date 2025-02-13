import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

export default function Camera() {
  const [flashOn, setFlashOn] = useState(false); // State to toggle flash
  const [photoUri, setPhotoUri] = useState(null); // State to store captured photo

  const handleFlashToggle = () => {
    setFlashOn((prev) => !prev); // Toggle flash state
    Alert.alert('Flash', `You clicked the flash: ${flashOn ? 'Off' : 'On'}`); // Show alert
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square photo
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Alert.alert('Photo Captured', `Photo saved at: ${result.assets[0].uri}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Issue}>
        Point the camera at the Road issue{'\n'}or at the Collision
      </Text>

      {/* Display captured image */}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}

      {/* Flash Icon */}
      <TouchableOpacity onPress={handleFlashToggle} style={styles.flashButton}>
        <Icon
          name={flashOn ? 'flash' : 'flash-outline'}
          size={30}
          color="#FA812F"
        />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity onPress={handleCameraPress} style={styles.cameraButton}>
        <Icon name="camera" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    padding: 10,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FA812F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Issue: {
    fontFamily: 'Poppins_400Regular',
    marginTop: 20,
    color: 'gray',
    textAlign: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});
