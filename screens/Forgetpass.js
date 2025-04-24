import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,SafeAreaView,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ChangePassword from "../Functions/changePassword"

import {useFonts,Poppins_400Regular,Poppins_500Medium,Poppins_600SemiBold,} from "@expo-google-fonts/poppins";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [disable,setDisabled] = useState(true)
  const [pin, setPin] = useState(""); // <- NEW
  const [showPinField, setShowPinField] = useState(false);
  const navigation = useNavigation();



  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  async function handleSendVerificationCode(){
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    try{
      const change_password = new ChangePassword()
      let isSuccess = await change_password.changePassSendpin(email)
      if(!isSuccess){
        Alert.alert(`Something went wrong`,'Unable to process your request')
        return
      }
      setShowPinField(true)
    }catch(error){
      console.error('Something went wrong. Cannot process your request',error)
    }
  };

  async function handleConfirmPin() {
    try {
      const change_password = new ChangePassword();
      const result = await change_password.changePassVerifyPin(pin,email);
      if (!result) {
        Alert.alert("Error", "Invalid or expired PIN");
        return;
      }
      navigation.navigate("NewForgotPass",{email});
    } catch (error) {
      console.error("PIN verification failed:", error);
    }
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Forgot password</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.body}>
        {showPinField ? (
  <>
    <Text style={[styles.label, { marginTop: 16 }]}>Enter Verification Code</Text>
    <View style={styles.pinContainer}>
      {Array(6).fill().map((_, index) => (
        <TextInput
          key={index}
          style={styles.pinInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(value) => {
            const newPin = pin.split("");
            newPin[index] = value;
            setPin(newPin.join(""));
            setDisabled(pin < 6);
          }}
        />
      ))}
    </View>
    <TouchableOpacity style={styles.button} onPress={handleConfirmPin} disabled={disable}>
      <Text style={styles.buttonText}>Confirm Verification</Text>
    </TouchableOpacity>
  </>
) : (
  <>
    <Text style={styles.label}>Email Address</Text>
    <View style={styles.inputContainer}>
      <Ionicons name="mail-outline" size={20} color="#888" />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setDisabled(!text.includes("@"));
        }}
        keyboardType="email-address"
      />
    </View>
    <TouchableOpacity
      style={[styles.button, disable && { backgroundColor: "#ccc" }]}
      onPress={handleSendVerificationCode}
      disabled={disable}
    >
      <Text style={styles.buttonText}>Send Verification Code</Text>
    </TouchableOpacity>
  </>
)}

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 60, // Fixed the value here (removed quotes)
      marginBottom: 8,
    },
    headerText: {
      fontSize: 16,
      marginLeft: 8,
      fontFamily: "Poppins_600SemiBold",
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    body: {
      marginTop: 16,
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 8,
      fontFamily: "Poppins_400Regular",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      height: 50, // Added fixed height to stabilize the input field
    },
    button: {
      backgroundColor: "#FF7F00",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
    },pinContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    pinInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      width: 40,
      height: 50,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Poppins_500Medium",
    },
    
  });

export default ForgotPasswordScreen;
