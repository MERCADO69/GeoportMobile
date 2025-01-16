import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const UpdateEmailPhoneScreen = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleConfirm = () => {
    if (!currentEmail || !verificationCode || !newEmail || !confirmEmail) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert('Error', 'New email and confirmation email do not match.');
      return;
    }

    Alert.alert('Success', 'Your email/phone has been updated.');
    // Implement actual backend update logic here
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Phone Number</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Current Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your current Phone"
            value={currentEmail}
            onChangeText={setCurrentEmail}
          />
        </View>

        {/* Verification Code Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
        </View>

        {/* New Email/Phone Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new phone"
            value={newEmail}
            onChangeText={setNewEmail}
          />
        </View>

        {/* Confirm New Email/Phone Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your new phone"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
          />
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Update</Text>
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
    fontSize: 20,
    marginLeft: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
  buttonContainer: {
    marginTop: 'auto',
    padding: 20,
  },
  confirmButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF7F00',
  },
  confirmButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default UpdateEmailPhoneScreen;
