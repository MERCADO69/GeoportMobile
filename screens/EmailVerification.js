import { auth } from "../firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { Alert, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CREATE_USER_ACCOUNT } from "@env";
import { AuthenticatedpostRequest } from "../Functions/post";
import { useState,useRef,useEffect } from "react";
import TimerClass from "../utils/Functions/timer";
export default function EmailVerificationCheck({ route, navigation }) {
  const { payload } = route.params;
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [formattedTime, setFormattedTime] = useState("");
  const timerRef = useRef(null);

 const startCooldownTimer = () => {
  setCanResend(false);
  timerRef.current = new TimerClass(
    60,
    (remaining) => {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setFormattedTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    },
    () => {
      setCanResend(true);
      setFormattedTime("");
    }
  );

  timerRef.current.start();
};

  const onCheckVerification = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        Alert.alert("Error", "No user signed in.");
        return;
      }
      await currentUser.reload();

      if (currentUser.emailVerified) {
        let uid = currentUser.uid
        let {confirmPassword,  ...cleanedData } = payload;
        let finalData = { ...cleanedData, uid, };
        const { error, message, responseData } = await AuthenticatedpostRequest(CREATE_USER_ACCOUNT, finalData);
       
        if (!error) {
        Alert.alert(
            "Email Verified",
            `Welcome, ${finalData.name}! Your email has been successfully verified. You can now start using the app.`
            );
          setTimeout(() => {
            navigation.navigate("homepage");
          }, 3000);
        } else {
          Alert.alert("Error", message || "Something went wrong.");
        }
      } else {
        Alert.alert(
          "Email Not Verified",
          "Please check your inbox and click the verification link before continuing."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
const handleResend = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "No user signed in.");
      return;
    }

    await sendEmailVerification(currentUser);
    Alert.alert("Verification Email Sent", `A new verification link was sent to ${currentUser.email}.`);
    startCooldownTimer();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Could not send verification email.");
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        A verification link has been sent to your email address. Once you've verified, tap the button below to continue.
      </Text>
    
      <TouchableOpacity
        style={styles.button}
        onPress={onCheckVerification}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>I've Verified My Email</Text>
        )}
      </TouchableOpacity>

     <TouchableOpacity
        style={[styles.resendbutton, !canResend && { opacity: 0.6 }]}
        onPress={handleResend}
        disabled={!canResend}
        >
        <Text style={styles.resendText}>
            {canResend ? "Resend Verification Email" : `Retry in ${formattedTime}`}
        </Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    marginStart:15,
    textAlign: 'start',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'start',
    marginStart:15,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FA812F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },resendbutton:{
    color:"blue",
    backgroundColor: null,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop:30
  },resendText: {
  fontSize: 14,
  color: "#007BFF",
  textAlign: "center",
}

});
