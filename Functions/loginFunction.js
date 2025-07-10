import { auth } from '../firebaseConfig';
import {Alert} from 'react-native';
import {UnAuthenticatedpostRequest} from "../Functions/post"
import { signInWithEmailAndPassword } from "firebase/auth";
import {LOGIN_VALIDATION_URL} from "@env"
export default async function loginFunction(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        let id = userCredential.user.uid;
        let params = LOGIN_VALIDATION_URL + id;
        let data = ''
        let {error,message,ResponseData} = await UnAuthenticatedpostRequest(params,data);
        if(!error){
            return userCredential.user; 
        }
    } catch (error) {
        return { success: false, message: error.message, code: error.code }; 
    }
}


