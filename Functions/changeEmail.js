import { auth } from '../firebaseConfig';  
import { CHANGE_EMAIL_SEND_PIN,SERVER_PORT,SERVER_IP,CHANGE_EMAIL_VERIFY_PIN,CHANGE_EMAIL } from '@env'
import axios from 'axios';

export default class ChangeEmail{

  async credentials(){
        const user = auth.currentUser;
        if(!user){
            throw new Error('User not logged in');
        }
        let id = user.uid;
        let token = await user.getIdToken();

        return {id,token};
    }

  async handleSendpin(){    
        try{
            console.log('trying to send pin')
            const {id,token} = await this.credentials();
            const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_EMAIL_SEND_PIN}/${id}`;
            const response = await axios.post(url,{},{
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
      
            if(response.status !== 200){
                throw new Error('Failed to send pin');
            }
            return response.data;
        }catch(error){
            console.error('Error in sending pin ',error);
        }
    }


   async handleVerifyPin(inputted_pin){
            try{
                const {id,token} = await this.credentials();
                const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_EMAIL_VERIFY_PIN}/${id}`;
                const isVerified = await axios.post(url,{inputted_pin},{
                    headers:{
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                })

                if(isVerified.status !== 200){
                    throw new Error('Failed to verify pin');
                }
                console.log('Response:',isVerified.data)
                return isVerified.data
            }catch(error){
                console.error('Error in verifying pin ',error);
            }
    }


  async handleChangeEmail(new_email){
        try{
            console.log(typeof new_email);
            const {id,token} = await this.credentials();
            const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_EMAIL}/${id}`;
            const isEmailUpdated = await axios.post(url,{new_email},{
                headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }})

            if(isEmailUpdated.status !== 200){
                throw new Error('Failed to update email');
            }
            return isEmailUpdated.data
        }catch(error){
            console.error('Error in updating email ',error);
        }
    }

}