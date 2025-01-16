import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,SafeAreaView,ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {useFonts,Poppins_400Regular,Poppins_500Medium,Poppins_600SemiBold,} from "@expo-google-fonts/poppins";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FF7F00" />;
  }

  const handleSendVerificationCode = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    Alert.alert("Success", "Verification code sent to your email.");
  };

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
          <Text style={styles.label}>Create New Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Your New password"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Confirm New password"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendVerificationCode}
          >
            <Text style={styles.buttonText}>Confirm Verification</Text>
          </TouchableOpacity>
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
    },
  });

export default ForgotPasswordScreen;
