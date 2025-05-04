import { auth } from "../firebaseConfig";  
import api from "../api/auth/api"
import { CHANGE_EMAIL_SEND_PIN,SERVER_PORT,SERVER_IP,CHANGE_EMAIL_VERIFY_PIN,CHANGE_EMAIL } from '@env'


export default class ChangeEmail{

  async credentials(){
        const user = auth.currentUser;
        if(!user){
            throw new Error('User not logged in');
        }
        let id = user.uid;
        return id;
    }

  async handleSendpin(){    
        try{
            const id = await this.credentials();
            const url = `${CHANGE_EMAIL_SEND_PIN}/${id}`;
            const response = await api.post(url);
      
            if(response.status !== 200){
                throw new Error('Failed to send pin');
            }
            return response.data;
        }catch(error){
            console.error('Error in sending pin ',error);
            throw error;
        }
    }


   async handleVerifyPin(inputted_pin){
            try{
                const id = await this.credentials();
                const url = `${CHANGE_EMAIL_VERIFY_PIN}/${id}`;
                const isVerified = await api.post(url,{inputted_pin})

                if(isVerified.status !== 200){
                    throw new Error('Failed to verify pin');
                }
                return isVerified.data
            }catch(error){
                console.error('Error in verifying pin ',error);
                throw error;
            }
    }


  async handleChangeEmail(new_email){
        try{
            const id = await this.credentials();
            const url = `${CHANGE_EMAIL}/${id}`;
            const isEmailUpdated = await api.post(url,{new_email})

            if(isEmailUpdated.status !== 200){
                throw new Error('Failed to update email');
            }

            return isEmailUpdated.data
        }catch(error){
            console.error('Error in updating email ',error);
            throw error;
        }
    }
}