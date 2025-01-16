import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';

// Imported SVG assets
import Mylogo from '../Images/Geo.svg';  
import Tagline from '../Images/Sibya.svg';
import FB from '../Images/facebook.svg';
import ContinueG from '../Images/continue.svg';
import Either from '../Images/choices.svg';


export default function LoginScreen() {
  // Load custom fonts using the Expo Google Fonts API
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  // State to store email and password input values
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // If fonts are not loaded, show a loading message
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo and tagline display */}
      <Mylogo width={300} height={150} />
      <Tagline width={200} height={60} style={{ marginBottom: 40 }}/>

      {/* Login Form */}
      <SafeAreaView style={[styles.Loginform]}>
        {/* Email input field */}
        <SafeAreaView style={[styles.TextInput]}>
          <Text style={[styles.Inputlabel]}>Email address or phone</Text>
          <TextInput 
            autoCorrect={false}
            autoCapitalize="none" 
            keyboardType="email-address"
            style={[styles.InputControl]}
            value={form.email}
            placeholder="ex.Juandelacruz@gmail.com" 
            placeholderTextColor="#rgba(169, 169, 169, 0.71)"
            onChangeText={email => setForm({...form, email})}
          />
        </SafeAreaView>

        {/* Password input field */}
        <SafeAreaView style={[styles.TextInput, { marginTop: -25 }]}>
          <Text style={[styles.Inputlabel]}></Text>
          <TextInput 
            style={[styles.InputControl]}
            value={form.password}
            placeholder="Password"
            placeholderTextColor="#rgba(169, 169, 169, 0.71)"
            secureTextEntry={true}
            onChangeText={password => setForm({...form, password})}
          />
        </SafeAreaView>

        {/* Log In button */}
        <SafeAreaView style={[styles.FormAction, { marginTop: 25 }]}>
          <TouchableOpacity
            style={styles.Btn}
            onPress={() => {
              Alert.alert(
                "Success", 
                "Successfully logged in ka!", 
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
              );
            }}
          >
            <Text style={styles.Btntxt}>Log In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>

      {/* Displaying SVG with position control */}
      <SafeAreaView style={[styles.eithercontainer]}>
        <Either width={300} height={1050}/> 
      </SafeAreaView>

      {/* Facebook and Google buttons */}
      <SafeAreaView style={[styles.fbContainerGoogle]}>
        <FB width={38} height={300} />
        <ContinueG width={38} height={300} />
      </SafeAreaView>

      {/* Forgot Password link */}
      <SafeAreaView style={styles.forgotPasswordContainer}>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert("Forgot Password", "Redirecting to Forgot Password page...");
          }}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Status bar settings */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// CSS / StyleSheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE", 
    justifyContent: "flex-start", 
    alignItems: "center", 
    paddingBottom: 50,
  },
  fbContainerGoogle: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "25%", 
    marginBottom: 10,
  },
  eithercontainer: {
    position: "absolute", 
    zIndex: -1, 
  },
  Inputlabel: {
    fontFamily: "Poppins_500Medium",
    paddingTop: 15,
    marginRight: '120',
    color: 'gray',
    marginBottom: 5,
  },
  InputControl: {
    backgroundColor: '#FDFDFD', 
    height: 50,  
    width: 300, 
    paddingHorizontal: 16,  
    borderRadius: 30,  
    borderColor: 'rgba(169, 169, 169, 0.5)', 
    borderWidth: 1.5,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  Btn: {
    backgroundColor: '#FA812F', 
    borderRadius: 30,  
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(169, 169, 169, 0.5)', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  Btntxt: {
    fontSize: 18, 
    fontFamily: "Poppins_500Medium", 
    color: "white", 
  },
  forgotPasswordContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontFamily: "Poppins_500Medium",
    color: '#FA812F', 
    fontSize: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  }
});