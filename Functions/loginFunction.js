import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function loginFunction(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; 
    } catch (error) {
        return { success: false, message: error.message, code: error.code }; 
    }
}


