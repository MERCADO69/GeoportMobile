import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert ,Dimensions,View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { auth } from "../firebaseConfig";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";
import ErrorMessage from "../utils/errorMessage"
import { BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  
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

    if(tryToLogin.success) {
      navigation.navigate('homepage');
      return
    }else{
      const customErrorMessage = ErrorMessage(tryToLogin.code)
      Alert.alert('Error', customErrorMessage);
    }}catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    }
  } 

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigation.replace("homepage"); 
    }
  });
  return () => unsubscribe(); 
}, []);



return (
  <View 
    style={[
      styles.container, 
      { 
        paddingBottom: Platform.OS === 'android' ? 0 : insets.bottom 
      }
    ]}
  > 
    <StatusBar 
      barStyle="dark-content"
      backgroundColor="transparent"
      translucent={true}
    />
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Mylogo width={width * 0.7} height={height * 0.2} />
          <Tagline width={width * 0.6} height={height * 0.07} style={styles.tagline} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email addre</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="email-address" 
            placeholder="example@gmail.com" 
            placeholderTextColor="#A9A9A9"
            value={form.email} 
            onChangeText={(email) => setForm({ ...form, email })}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            placeholder="" 
            placeholderTextColor="#A9A9A9"
            value={form.password} 
            onChangeText={(password) => setForm({ ...form, password })}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Either width={width * 0.8} height={height * 0.05} style={styles.either} />

        <View style={styles.authContainer}>
          <TouchableOpacity style={styles.authButton} onPress={() => {}}>
            <FB width={40} height={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton} onPress={promptAsync}>
            <ContinueG width={40} height={40} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Forgetpass')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  </View>
);
}

// CSS / StyleSheet for the component
const styles = {
  container: { 
    flex: 1, 
    backgroundColor: "#FEFEFE",
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  innerContainer: { 
    alignItems: "center", 
    width: "90%" 
  },
  logoContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 50 
  },
  tagline: { marginTop: -5 },
  inputContainer: { width: "97%" },
  label: { 
    fontFamily: 'Poppins_500Medium', 
    color: "gray", 
    marginBottom: 5 
  },
  input: {
    backgroundColor: "#FDFDFD",
    height: 50,
    width: "100%",
    paddingHorizontal: 16,
    borderRadius: 30,
    borderColor: "rgba(169, 169, 169, 0.5)",
    borderWidth: 1.5,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#FA812F",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "97%",
    marginBottom: 20,
  },
  loginText: { 
    fontSize: 18, 
    fontFamily: "Poppins_500Medium", 
    color: "white" 
  },
  
  either: { marginVertical: 15 },
  authContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 20, 
    marginTop: 20 
  },
  authButton: { alignItems: "center" },
  forgotPassword: {
    fontFamily: "Poppins_500Medium", 
    color: "#FA812F", 
    fontSize: 12, 
    textAlign: "center", 
    marginTop: 60, 
    marginBottom: 20,
  },
};