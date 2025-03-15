import { FETCH_REPORT,SERVER_PORT,SERVER_IP } from '@env'
import { auth } from '../firebaseConfig';    

export default async function fetchReports() {
    try{
        const user = auth.currentUser;
        if(!user){
            throw new Error('User not logged in');
        }

        let id = user.uid;
        let token = await user.getIdToken();

         const url = `ws://${SERVER_IP}:${SERVER_PORT}/${FETCH_REPORT}?token=${token}`;
         console.log(url);
         const socket = new WebSocket(url);
       
         socket.onopen = () => {
            console.log("WebSocket Connected!");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("New Report Data:", data);
        };
        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
        socket.onclose = () => {
            console.log("WebSocket Disconnected!");
        };
        return socket;

    }catch(error){
        console.error(error);
    }
}