import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import loginFunction from "../Functions/loginFunction";
import Mylogo from "../Images/Geo.svg";
import Tagline from "../Images/Sibya.svg";
import FeedbackModal from "../Navigation/modals/FeedbackModal"; // ✅ Import Modal
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    register("email");
    register("password");
  }, [register]);

  const email = watch("email", "");
  const password = watch("password", "");
  const [loading, setLoading] = useState(false);

  // ✅ Feedback modal state
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    visible: false,
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisabled = !isValidEmail(email) || password.length < 6 || loading;

  // ✅ Updated handleLogin function
  const handleLogin = async (data) => {
    try {
      setLoading(true);
      const tryToLogin = await loginFunction(data.email, data.password);

      if (tryToLogin && tryToLogin.email) {
        reset();
        navigation.navigate("homepage");
      } else {
        setModalData({
          title: "Login Failed",
          message: "Invalid login credentials.",
          visible: true,
        });
      }
    } catch (error) {
      setModalData({
        title: "Something went wrong",
        message: error.message || "Unexpected error occurred.",
        visible: true,
      });
    } finally {
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
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
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

          <Text style={{ margin: 5 }}>or</Text>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Create Account")}
          >
            <Text style={{ margin: 10, color: "grey", textDecorationLine: "underline" }}>
              Create new Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>

      {/* ✅ Feedback Modal component */}
      <FeedbackModal
        visible={modalData.visible}
        title={modalData.title}
        message={modalData.message}
        onClose={() => setModalData({ ...modalData, visible: false })}
      />
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: "#FEFEFE" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  signupButton: {
    backgroundColor: null,
    borderRadius: 100,
    marginTop: 10,
    paddingStart: 10,
    paddingEnd: 10,
  },
  innerContainer: { alignItems: "center", width: "90%" },
  logoContainer: { alignItems: "center", justifyContent: "center", marginBottom: 50 },
  tagline: { marginTop: -5 },
  inputContainer: { width: "96%" },
  label: { fontFamily: "Poppins_500Medium", color: "gray", marginBottom: 5 },
  input: {
  backgroundColor: "#FFFFFF", // pure white
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
    width: "96%",
    marginBottom: 20,
  },
  loginText: {
    fontSize: 17,
    fontFamily: "Poppins_500Medium",
    color: "white",
  },
  forgotPassword: {
    fontFamily: "Poppins_500Medium",
    color: "#FA812F",
    fontSize: 11,
    textAlign: "center",
    marginTop: 130,
    marginBottom: 20,
  },
};
