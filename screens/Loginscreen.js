import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button } from "react-native";
import { useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import loginFunction from "../Functions/loginFunction";
import Mylogo from "../Images/Geo.svg";
import Tagline from "../Images/Sibya.svg";
import FB from "../Images/facebook.svg";
import ContinueG from "../Images/continue.svg";
import Either from "../Images/choices.svg";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const { register, handleSubmit, setValue, watch,reset } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
  register("email");
  register("password");
}, [register]);

  const email = watch("email", "");
  const password = watch("password", "");
  const [loading, setLoading] = useState(false);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisabled = !isValidEmail(email) || password.length < 6 || loading;

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      const tryToLogin = await loginFunction(data.email, data.password);
      if (tryToLogin && tryToLogin.email) {
        setLoading(false);
         reset();
        navigation.navigate("homepage");
      } else {
        Alert.alert("Error", "Invalid login credentials.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Platform.OS === "android" ? 0 : insets.bottom },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Mylogo width={width * 0.7} height={height * 0.2} />
            <Tagline
              width={width * 0.6}
              height={height * 0.07}
              style={styles.tagline}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              placeholder="example@gmail.com"
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setValue("email", text)}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Password (Min. 6 characters)"
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setValue("password", text)}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isDisabled && { opacity: 0.5 }]}
            onPress={handleSubmit(handleLogin)}
            disabled={isDisabled}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

            <Text style={{margin:5}}>or</Text>
            <TouchableOpacity style={styles.signupButton} onPress={() =>{navigation.navigate("Create Account")}}>
              <Text style={{margin:"10",color:"green"}}>Create new Account</Text> 
            </TouchableOpacity>
         
         
          {/* <Either
            width={width * 0.8}
            height={height * 0.05}
            style={styles.either}
          /> */}

          {/* <View style={styles.authContainer}>
            <TouchableOpacity style={styles.authButton} onPress={() => {}}>
              <FB width={40} height={40} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => promptAsync()}
            >
              <ContinueG width={40} height={40} />
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },signupButton:{
    backgroundColor:null,
    borderRadius:100,
    marginTop:10,
    paddingStart:10,
    paddingEnd:10
  },
  innerContainer: {
    alignItems: "center",
    width: "90%",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  tagline: { marginTop: -5 },
  inputContainer: { width: "97%" },
  label: {
    fontFamily: "Poppins_500Medium",
    color: "gray",
    marginBottom: 5,
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
    color: "white",
  },

  either: { marginVertical: 15 },
  authContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
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
