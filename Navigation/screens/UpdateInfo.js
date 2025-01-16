import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const UpdateInformationScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
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
      <TouchableOpacity style={styles.profilePictureContainer}>
        <View style={styles.profilePicture}>
          <Ionicons name="person-outline" size={40} color="#666" />
        </View>
        <Text style={styles.profilePictureText}>Tap to change Profile Picture</Text>
      </TouchableOpacity>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Name Fields */}
        <View style={styles.nameContainer}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              
              
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
             
            />
          </View>
        </View>

        {/* Email/Phone Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address/Phone Number</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIconField}
              
            />
          </View>
        </View>

        {/* Address Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Barangay address</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIconField}
    
            />
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 16,
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
  },
});

export default UpdateInformationScreen;