import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Camera() {
  const [flashOn, setFlashOn] = useState(false); // State to toggle flash

  const handleFlashToggle = () => {
    setFlashOn((prev) => !prev); // Toggle flash state
    Alert.alert('Flash', `You clicked the flash: ${flashOn ? 'Off' : 'On'}`); // Show alert
  };

  const handleCameraPress = () => {
    Alert.alert('Camera', 'Camera button clicked!'); // Alert for camera button
  };

  return (

    <SafeAreaView style={styles.container}>

    <Text style={[styles.Issue]}>
      Point the camera at the Road issue{'\n'}or at the Collision
    </Text>

      {/* Flash Icon */}
      <TouchableOpacity onPress={handleFlashToggle} style={styles.flashButton}>
        <Icon
          name={flashOn ? 'flash' : 'flash-outline'}
          size={30}
          color="#FA812F" // Orange color for flash icon
        />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity onPress={handleCameraPress} style={styles.cameraButton}>
        <Icon
          name="radio-button-off"
          size={90}
          color="#FA812F" // Orange color for camera icon
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE', // White background
  },
  flashButton: {
    position: 'absolute',
    top: 660, // Adjust position as needed
    right: 30, // Flash icon on the top-right corner
    padding: 15,
    borderRadius: 50, // Round button shape
  },
  cameraButton: {
    position: 'absolute',
    alignSelf: 'center', // Center horizontally
    bottom: 30, // Position near the bottom of the screen
    width: 90, // Width of the circular button
    height: 90, // Height of the circular button
    borderRadius: 45, // Half of the width/height for a circle
    justifyContent: 'center', // Center the icon inside the button
    alignItems: 'center', // Center the icon inside the button
  },
  Issue:{
    fontFamily: 'Poppins_400Regular',
    marginTop: 20,
    color: 'gray',
    textAlign: 'center',
  }
});
