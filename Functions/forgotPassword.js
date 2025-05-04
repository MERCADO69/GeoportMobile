import { auth } from "../firebaseConfig"
import api from "../api/noauth/api"
import {FORGOT_PASSWORD_SEND_PIN,FORGOT_PASSWORD_VERIFY_PIN} from "@env"
export default class ForgotPasswordFunctions{

    async forgotPasswordSendPin(email){
        try{
                
                let isPinSend = await api.post(FORGOT_PASSWORD_SEND_PIN,{email})
                if(isPinSend.status >= 200 && isPinSend.status < 300){
                    return true
                }else{
                    return false
                }

        }catch(error){
             console.error( 'Something went wrong while processing the request in frontend:',error);
             throw error
        }
    }



    async forgotPasswordVerifyPin(pin,email){
        try{
            let data = {pin,email}
            let isPinVerified = await api.post(FORGOT_PASSWORD_VERIFY_PIN,data)
                if(isPinVerified.status >= 200 && isPinVerified.status < 300){
                    return true
                }else{
                    return false
                }
        }catch(error){
            throw error
        }
    }



    async forgotPasswordChangePassword(){
        try{

        }catch(error){
            
        }
    }








}