import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SexSelector from "../utils/SexSelector";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoadingModal from "../Navigation/modals/loadingModal";
import { ROLE, STATUS } from "@env";
import { defaultProfile, femaleProfile } from "../utils/constants";
import { register } from "../utils/Functions/existingUserCheck";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

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

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = contactNumber.length === 11 && contactNumber.startsWith("09") &&
    String(age).trim().length > 0 && age >= 15 && age <= 100 && sex != null &&
    isValidEmail(email) && password.length > 8 && password === confirmPassword;
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [load, setLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);

  useEffect(() => {
    if (sex === "Female") {
      setProfileImage(femaleProfile);
    } else {
      setProfileImage(defaultProfile);
    }
  }, [sex]);

  const onSubmit = async (formData) => {
    const imageToUse = formData.sex === "Female" ? femaleProfile : defaultProfile;
    const payload = { ...formData, image: imageToUse, role: ROLE, status: STATUS };
    try {
      setLoading(true)
      const { success, verified } = await register(payload.email, payload.password)
      if (success && verified) {
        navigation.navigate('Email Verification', { payload })
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>

          <View style={styles.body}>
            <Text style={styles.title}>Create New Account Form</Text>
            
            <View style={styles.profileContainer}>
              <Image style={styles.profileImage} source={{ uri: profileImage }} />
            </View>
            
            <Text style={styles.imageText}>
              "Default profile image. Update it after account verification.
            </Text>

            {/* Full Name Input */}
            <Text style={styles.label}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />

            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Email Address"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Password | min-length 8"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={isPasswordHidden}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordHidden(prev => !prev)}
                    style={styles.eyeIcon}
                  >
                    <Text style={styles.showHideText}>
                      {isPasswordHidden ? 'Show' : 'Hide'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Confirm Password Input */}
            <Text style={styles.label}>Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={isConfirmPasswordHidden}
                  />
                  <TouchableOpacity
                    onPress={() => setIsConfirmPasswordHidden(prev => !prev)}
                    style={styles.eyeIcon}
                  >
                    <Text style={styles.showHideText}>
                      {isConfirmPasswordHidden ? 'Show' : 'Hide'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Age Input */}
            <Text style={styles.label}>Age</Text>
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
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#888" />
                    <TextInput
                      placeholder="Age"
                      keyboardType="numeric"
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
            />

            {/* Sex Selector */}
            <Text style={styles.label}>Gender</Text>
            <Controller
              control={control}
              name="sex"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <SexSelector onSelect={onChange} initialValue={value} />
              )}
            />

            {/* Contact Number Input */}
            <Text style={styles.label}>Phone Number</Text>
            <Controller
              control={control}
              name="contactNumber"
              rules={{ required: true, minLength: 11, maxLength: 11 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Phone number"
                    maxLength={11}
                    keyboardType="numeric"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              style={[styles.button, { opacity: isValid ? 1 : 0.5 }]}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      {load && <LoadingModal open={true} />}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  body: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  profileContainer: {
    alignSelf: "center",
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
  imageText: {
    fontSize: 10,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
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
    height: 50,
    color: "black",
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  showHideText: {
    color: '#FF7F00',
    fontSize: 11,
  },
  button: {
    backgroundColor: "#FF7F00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 6,
    fontFamily: "Poppins_400Regular",
  },
  scrollContent: {
  paddingHorizontal: 16,
  paddingBottom: 40,
  flexGrow: 1,
},

});