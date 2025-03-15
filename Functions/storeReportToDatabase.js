import { SEND_REPORT_ENDPOINT,SERVER_PORT,SERVER_IP } from '@env'
import axios from 'axios';

export default async function StoreReportToDatabase() {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/${SEND_REPORT_ENDPOINT}`;
    
    try{
        const submit = await axios.post( url,{
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!submit){
            return{
                success: false,
                message: "No response from server. Check your network connection."
            }
        }
        const data = submit.data;
       
            return{
                success: true,
                message: data.response_message
            }

    }catch(error){
        return{
            success: false,
            message: "Somenthing went wrong while processing your request."
        }
    }
}