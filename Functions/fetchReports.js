import { FETCH_REPORT, SERVER_PORT, SERVER_IP } from '@env'
import { auth } from '../firebaseConfig';    

let socket = null;

export default async function fetchReports(setReportData) {
    const user = auth.currentUser;
    if (!user) {
        console.error('User not logged in');
        return;
    }

    try {
        let token = await user.getIdToken();
        const url = `ws://${SERVER_IP}:${SERVER_PORT}/${FETCH_REPORT}?token=${token}`;

        if (!socket || socket.readyState === WebSocket.CLOSED) {
            socket = new WebSocket(url);
        
            socket.onopen = () => {
                console.log("WebSocket Connected!");
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setReportData(data);  // ✅ Updates the state in MapsScreen
                } catch (error) {
                    console.error("Error parsing WebSocket data:", error);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket Error:", error);
            };

            socket.onclose = () => {
                console.log("WebSocket Disconnected! Reconnecting...");
                setTimeout(() => fetchReports(setReportData), 5000);  // Auto-reconnect
            };
        }
    } catch (error) {
        console.error("Error in fetchReports:", error);
    }
}
