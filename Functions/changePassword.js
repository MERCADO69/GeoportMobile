import api from "../api/noauth/api"
import {CHANGE_PASSWORD_SENDPIN,CHANGE_PASSWORD_VERIFY_PIN,CHANGE_PASSWORD} from "@env"

export default class ChangePassword{
        async changePassSendpin(email){
                try{
                  console.log('trying to send pin',email)
                    const isPinSend = await api.post(CHANGE_PASSWORD_SENDPIN,{email})

                    if (isPinSend.status >= 200 && isPinSend.status < 300) {
                        return true
                      } else {
                        console.error('Error sending pin:', isPinSend.status);
                        return false;
                      }
                }catch(error){
                   console.error( 'Something went wrong while processing the request in frontend:',error);
                }
        } 
        
        async changePassVerifyPin(pin,email){
            try{
                let data = {pin,email}
                const isPinVerified = await api.post(CHANGE_PASSWORD_VERIFY_PIN,data)

                if (isPinVerified.status >= 200 && isPinVerified.status < 300) {
                  console.log('success & verified')
                    return true
                  } else {
                    console.error('Error verifying pin:', isPinVerified.status);
                    return false;
                  }
            }catch(error){
                console.error('Error verifying PIN:', error.response?.data || error.message);
                return null;
            }
        }

        async changePassword(new_password,email){
            try{
              console.log('changing password')
              let data = {new_password,email}
                const isPasswordChanged = await api.post(CHANGE_PASSWORD,data)

                if (isPasswordChanged.status >= 200 && isPasswordChanged.status < 300) {
                    return isPasswordChanged.data;
                  } else {
                    console.error('Error changing password:', isPasswordChanged.status);
                    return null;
                  }
            }catch(error){
                console.error('Something went wrong while processing request in frontend')
            }
        }
      
}