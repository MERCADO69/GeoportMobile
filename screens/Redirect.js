import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MobileNumberInput = () => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const [phoneNumber, setPhoneNumber] = useState('+63');
  const [address, setAddress] = useState('');
  const [barangay, setBarangay] = useState('');
  const [purok, setPurok] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleFinishSetup = () => {
    if (!profileImage) {
      Alert.alert('Profile Required', 'Please take a profile photo.');
      return;
    }
    if (phoneNumber.replace(/[^\d]/g, '').length !== 12) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number.');
      return;
    }
    if (!address || !barangay || !purok) {
      Alert.alert('Missing Fields', 'Please fill in all details.');
      return;
    }

    console.log('Profile Image:', profileImage);
    console.log('Phone Number:', phoneNumber);
    console.log('Address:', address);
    console.log('Barangay:', barangay);
    console.log('Purok:', purok);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.infoText}>
          This section collects information to verify that you are a resident of Malaybalay.
        </Text>

        {/* Profile Photo Section */}
        <TouchableOpacity onPress={takePhoto} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to Take Photo</Text>
          )}
        </TouchableOpacity>

        {/* Input Fields with Labels */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={16}
          placeholder="Enter Mobile Number"
        />

        <Text style={styles.label}>Enter Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter Address"
        />

        <Text style={styles.label}>Enter Barangay</Text>
        <TextInput
          style={styles.input}
          value={barangay}
          onChangeText={setBarangay}
          placeholder="Enter Barangay"
        />

        <Text style={styles.label}>Purok or Block</Text>
        <TextInput
          style={styles.input}
          value={purok}
          onChangeText={setPurok}
          placeholder="Enter Purok or Block"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleFinishSetup}>
          <Text style={styles.buttonText}>Finish Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 60,
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    lineHeight: 20, // Adjust line spacing for better readability
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  label: {
    width: '120%',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '125%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#FF7143',
    borderRadius: 25,
    paddingVertical: 15,
    width: '125 %',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
});

export default MobileNumberInput;
