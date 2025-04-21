
import axios from "axios";

import { auth } from "../firebaseConfig";
import { REMOVE_PUSH_NOTIFICATION, SERVER_IP, SERVER_PORT } from '@env';

export default async function removePushNotification(){
    try{
        const user = auth.currentUser;
        if (!user) {
            console.log('User not authenticated');
            return;
          }
      
        const id = user.uid;
        const authToken = await user.getIdToken(); 
        const url = `http://${SERVER_IP}:${SERVER_PORT}/${REMOVE_PUSH_NOTIFICATION}/${id}`;

        const isSubmitSuccess = await axios.post(url,{},{
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              }
        })
            
            if(isSubmitSuccess.status !== 200){
                throw new Error('Failed to remove push notification token');
            }

            return isSubmitSuccess.data

        }catch(error){
        console.log('Error',error)
    }
}