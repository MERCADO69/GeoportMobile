import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from "../../firebaseConfig";
import { Alert } from 'react-native';

export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await sendEmailVerification(user);
      Alert.alert(
        "Email Verification",
        "A verification link has been sent to your email. Please verify before continuing."
      );
      console.log("User registered:", user.email);
      return { success: true, verified: true };  
    }
    return { success: false, verified: false };
  } catch (error) {
      
    switch (error.code) {
      case 'auth/email-already-in-use':
        Alert.alert("Email In Use", "This email is already registered.");
        break;
      case 'auth/invalid-email':
        Alert.alert("Invalid Email", "Please enter a valid email.");
        break;
      case 'auth/weak-password':
        Alert.alert("Weak Password", "Password should be at least 6 characters.");
        break;
      default:
        console.error("Registration error:", error.code, error.message);
        Alert.alert("Registration Failed", error.message);
        break;
    }

    return { success: false, verified: false };
  }
}
