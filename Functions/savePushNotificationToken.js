import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import { auth } from "../firebaseConfig";
import { PUSH_NOTIFICATION, SERVER_URL, SERVER_PORT } from '@env';

export default async function applyForPushNotification() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const id = user.uid;
    const authToken = await user.getIdToken(); 

    if (!Device.isDevice) {
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission not granted');
      return;
    }

    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

    const url = `${SERVER_URL}${PUSH_NOTIFICATION}/${id}`;
    const response = await axios.post( url, { expoPushToken },{
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }});

    if (response.status !== 200) {
      throw new Error('Failed to save push notification token');
    }

    return response.data;
  } catch (error) {
     throw new error
  }
}
