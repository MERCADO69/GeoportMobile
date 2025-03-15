import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function loginFunction(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; 
    } catch (error) {
        console.log("Login Error:", error.message);
    }
}
