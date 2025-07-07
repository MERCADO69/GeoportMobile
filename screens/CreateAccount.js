import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SexSelector from "../utils/SexSelector";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingModal from "../Navigation/modals/loadingModal";
import { ROLE,STATUS } from "@env";
import {defaultProfile,femaleProfile} from "../utils/constants"
import {register} from "../utils/Functions/existingUserCheck"

export default function AccountSetup({ navigation }) {
  const { handleSubmit, setValue, watch, control } = useForm({ mode: "onChange" });
  const [age = "", sex = "", email = "", password = "", confirmPassword = "", contactNumber = ""] = watch([
  'age',
  'sex',
  'email',
  'password',
  'confirmPassword',
  'contactNumber'
]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = contactNumber.length === 11 && contactNumber.startsWith("09") &&
  String(age).trim().length > 0 &&  age >= 15 && age <= 100 && sex != null &&
  isValidEmail(email) &&  password.length > 8 && password === confirmPassword;
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [load, setLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  useEffect(() => {
  if (sex === "Female") {
    setProfileImage(femaleProfile);
  } else {
    setProfileImage(defaultProfile);
  }
}, [sex]);


  const onSubmit = async (formData) => {
   const imageToUse = formData.sex === "Female" ? femaleProfile : defaultProfile;
   const payload = {...formData,image: imageToUse, role: ROLE,status: STATUS};
   try{
   setLoading(true)
   const { success, verified } = await register(payload.email,payload.password)
      if(success && verified){
      navigation.navigate('Email Verification',{payload})
      }
   }catch(error){ 
    throw error
   }finally{
    setLoading(false)
   }
  };

  return (
    <>
     <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <SafeAreaView style={styles.safeArea}>
        
        <Text style={styles.title}>Create New Account Form</Text>
            <View style={styles.profileContainer}>
                  <Image style={styles.profileImage} source={{ uri: profileImage }}/>
            </View>
       <Text style={styles.imageText}>Your profile image is currently set to the default. To update it, please verify your account in Settings after signing up.</Text>
        <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Full Name"
                  style={styles.inputBox}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

       <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email Address"
              style={styles.inputBox}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

     <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View style={{ width: '100%', position: 'relative' }}>
            <TextInput
              placeholder="Password | min-length 8"
              style={[styles.inputBox, { paddingRight: 50 }]}
              value={value}
              onChangeText={onChange}
              secureTextEntry={isPasswordHidden}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordHidden(prev => !prev)}
              style={{
                position: 'absolute',
                right: 10,
                top: 25, 
              }}
            >
              <Text style={{ color: 'blue', fontSize: 11 }}>
                {isPasswordHidden ? 'Show' : 'Hide'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />


      <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Confirm Password"
              style={styles.inputBox}
              value={value}
              onChangeText={onChange}
            />
          )}
        />


       <View style={styles.row}>
            <View style={styles.half}>
             <Controller
                  control={control}
                  name="age"
                  rules={{
                    required: "Age is required",
                    min: { value: 15, message: "Minimum age is 15" },
                    max: { value: 100, message: "Maximum age is 100" },
                    pattern: {
                      value: /^\d+$/,
                      message: "Age must be a valid number",
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <TextInput
                        placeholder="Age"
                        keyboardType="numeric"
                        style={styles.inputBox}
                        value={value}
                        onChangeText={onChange}
                      />
                      {error && <Text style={styles.errorText}>{error.message}</Text>}
                    </>
                  )}
                />

            </View>
            <View style={styles.half}>
              <Controller
                control={control}
                name="sex"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <SexSelector onSelect={onChange} initialValue={value}  />
                )}
              />
            </View>
      </View>


        <Controller  control={control}
                name="contactNumber" rules={{ required: true, minLength: 11 ,maxLength:11}}
                render={({ field: { onChange, value } }) => (
                  <TextInput placeholder="Phone number"
                   maxLength={11}
                    keyboardType="numeric" style={styles.inputBox}
                    value={value} onChangeText={onChange}
                  /> )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          style={[styles.submitButton, { opacity: isValid ? 1 : 0.5 ,fontSize: isValid ? 10 : 5}]}
        >
          <Text style={styles.submitText}>Create Account</Text>
        </TouchableOpacity>
        
      </SafeAreaView>
                  </ScrollView>
      {load && <LoadingModal open={true} />} 
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingTop:0
  },imageText:{
    fontSize:8,
    color:"red",
    textAlign:"center",
    width:"90%"
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    marginTop:0
  },
  profileContainer: {
    borderRadius: 100,
    height: 130,
    width: 130,
    overflow: "hidden",
    marginBottom: 10,
  },
  profileImage: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  inputBox: {
    height: 50,
    width: "100%",
    fontSize:11,
    color:"black",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    letterSpacing:5,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: "#FA812F",
    padding: 12,
    width:"100%",
    borderRadius: 8,
    alignItems:"center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontSize: 16,
  },row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
half: {
  width: '48%',
},errorText: {
  color: 'red',
  fontSize: 12,
  marginTop: -6,
  marginBottom: 6,
},


});
