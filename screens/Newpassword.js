import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useFonts,Poppins_400Regular,Poppins_500Medium,Poppins_600SemiBold,} from "@expo-google-fonts/poppins";
import ChangePassword from "../Functions/changePassword"


export default function  NewForgotPasswordScreen({ navigation }){
  
 

  const route = useRoute();
  const { email } = route.params;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = useWatch({ control, name: "newPassword" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onSubmit = async (data) => {
    Alert.alert('running','sending new password')
    if (data.newPassword !== data.confirmPassword) {
      console.log('running error 1')
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
   
    console.log('running 2')
      try{  
        let new_password = data.newPassword;
        let change_pass = new ChangePassword()
        const isChanged = await change_pass.changePassword(new_password,email)
        if(!isChanged){
          console.log('running error 2')
          Alert.alert('Something went wrong','Cannot change password')
          return
        }
        Alert.alert('Success','Successfully change password')
        navigation.navigate("Login");

      }catch (error) {
        console.error('There is something wrong in frontend ', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      
  };
  useEffect(() => {
    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword);
    const isConfirmFilled = confirmPassword && confirmPassword.length > 0;
  
    const shouldDisable = !(isStrongPassword && isConfirmFilled);
  
    setButtonDisabled(shouldDisable);
  }, [newPassword, confirmPassword]);
  
  
  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "" };
    if (password.length < 8) return { label: "Too short", color: "red" };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      return { label: "Strong", color: "green" };
    }
       else if (/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password)) {
      return { label: "Medium", color: "orange" };
    } else {
      return { label: "Weak", color: "red" };
    }
  };
  const passwordStrength = getPasswordStrength(newPassword);

  
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
            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: true,
                minLength: 8,
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message: "Password must include upper, lower, number, and special character"
                }
              }}
              
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Your new password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  <Text style={{ color: passwordStrength.color, marginTop: 4 }}>
                    {passwordStrength.label}
                  </Text>
                  {errors.newPassword?.type === "minLength" && (
                    <Text style={{ color: "red", fontSize: 12 }}>Password must be at least 8 characters</Text>
                  )}
                </>
              )}
            />

          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <TouchableOpacity
          style={[
            styles.button,
            (!newPassword || !confirmPassword) && { backgroundColor: "#ccc" },
          ]}
          disabled={!newPassword || !confirmPassword || buttonDisabled}
          onPress={handleSubmit(onSubmit)}
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
      marginTop: 60, 
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