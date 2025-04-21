import axios from "axios";
import { auth } from "../firebaseConfig";
import {SERVER_IP,SERVER_PORT,CHANGE_PHONE_SEND_PIN,CHANGE_PHONE_PIN_VERIFY,CHANGE_PHONE_NUMBER} from '@env'


export default class changeNumber{

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
            const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_PHONE_SEND_PIN}/${id}`;
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
                    console.log('trying to verify pin ',inputted_pin)
                    const {id,token} = await this.credentials();
                    const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_PHONE_PIN_VERIFY}/${id}`;
                    const response = await axios.post(url,{inputted_pin},{
                        headers:{
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    });
                    if(response.status !== 200){
                        throw new Error('Failed to verify pin');
                    }
                    return response.data;
                }catch(error){
                    throw new Error('Failed to verify pin');
                }
        }


        async changePhoneNumber(new_number){
            try{
                const {id,token} = await this.credentials();
                const url = `http://${SERVER_IP}:${SERVER_PORT}/${CHANGE_PHONE_NUMBER}/${id}`;
                const response = await axios.post(url,{new_number},{
                    headers:{
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                if(response.status !== 200){
                    throw new Error('Failed to change phone number');
                }
                return response.data;
            }catch(error){
                console.error('Error in changing phone number ',error);
            }
        }

}