import { Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from 'react-native';

const MobileNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState('+63');

  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters except the leading +
    const number = text.replace(/[^\d+]/g, '');

    // Ensure it starts with +63
    if (!number.startsWith('+63')) {
      return '+63';
    }

    // Get all digits after +63
    const remainingDigits = number.substring(3);

    // Format the remaining digits in groups
    let formatted = '';
    if (remainingDigits.length > 0) {
      // First group (3 digits)
      formatted += remainingDigits.substring(0, 3);

      // Second group (3 digits)
      if (remainingDigits.length > 3) {
        formatted += ' ' + remainingDigits.substring(3, 6);
      }

      // Third group (4 digits)
      if (remainingDigits.length > 6) {
        formatted += ' ' + remainingDigits.substring(6, 10);
      }
    }

    return '+63' + (formatted ? ' ' + formatted : '');
  };

  const handlePhoneNumberChange = (text) => {
    // Only update if within length limits (prefix + 10 digits + 2 spaces max)
    if (text.length <= 16) {
      const formatted = formatPhoneNumber(text);
      setPhoneNumber(formatted);
    }
  };

  const handleFinishSetup = () => {
    // Remove spaces for validation
    const digitsOnly = phoneNumber.replace(/[^\d]/g, '');
    if (digitsOnly.length === 12 && digitsOnly.startsWith('63')) {
      // +63 replaces the local "0"
      console.log('Valid phone number:', phoneNumber);
      // Add your submission logic here
    } else {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Add your Mobile Number{'\n'}
        to receive nearby reports
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          maxLength={16} // +63 xxx xxx xxxx
          editable={true}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFinishSetup}
      >
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: 'Poppins_500Medium',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF7143',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
});

export default MobileNumberInput;
