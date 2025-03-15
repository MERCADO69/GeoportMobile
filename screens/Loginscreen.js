import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';


//functions
import loginFunction from '../Functions/loginFunction';
import { useGoogleAuth } from '../Functions/continueWithGoogle';


// Imported SVG assets
import Mylogo from '../Images/Geo.svg';  
import Tagline from '../Images/Sibya.svg';
import FB from '../Images/facebook.svg';
import ContinueG from '../Images/continue.svg';
import Either from '../Images/choices.svg';

export default function LoginScreen({ navigation }) {
  const { promptAsync } = useGoogleAuth();
  
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

  const  handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Missing Credentials', 'Email and password are required.');
      return;
  }

  if (!isValidEmail(form.email)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    return;
  }

  if(form.password.length < 6) {
    Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
    return
  }


  try {
    const tryToLogin =  await loginFunction(form.email, form.password);

    if(tryToLogin) {
      navigation.navigate('homepage');
    }
    else{
      Alert.alert('Error', 'Invalid Credentials');
      return;
    }}catch (error) {
      Alert.alert('Error', 'Invalid Credentials');
      return;
    }
  } 

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



  return (

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
         
          <TouchableOpacity  style={styles.Btn} onPress={() => handleLogin()} >
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
        <ContinueG width={38} height={300} onPress={()=> promptAsync()}/>
      </SafeAreaView>

      {/* Forgot Password link */}
      <SafeAreaView style={styles.forgotPasswordContainer}>
      <TouchableOpacity  onPress={() => { navigation.navigate('Forgetpass'); }}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      </SafeAreaView>

      {/* Status bar settings */}
      <StatusBar style="auto" />
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
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
  },
  eithercontainer: {
    position: "absolute",
    bottom: -200, 
    zIndex: -1, 
    alignSelf: "center",
  }
  ,
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
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontFamily: "Poppins_500Medium",
    color: '#FA812F', 
    fontSize: 12,
    textDecorationLine: 'none',
    textAlign: 'center',
  }
});