import { auth } from '../firebaseConfig';  
import { FETCH_USER_DATA,SERVER_PORT,SERVER_IP } from '@env'
import axios from 'axios';


export default async function GetUserData() {
    
        try{
            const user = auth.currentUser;
            if(!user){
                throw new Error('User not logged in');
            }
            let id = user.uid;
            let token = await user.getIdToken();
            const url = `http://${SERVER_IP}:${SERVER_PORT}/${FETCH_USER_DATA}?id=${id}`;

            const response = await axios.get(url,{
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
           return response.data;

        }catch(error){
            console.error(error);
        }
}


