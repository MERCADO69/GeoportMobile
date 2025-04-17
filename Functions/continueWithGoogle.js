import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';
import { auth } from '../firebaseConfig';  // Your Firebase config import
import { APP_WEB_CLIENT_ID } from '@env';  // Google Web Client ID from your environment

export default function useGoogleAuth() {
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: APP_WEB_CLIENT_ID,  
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params; 
      const credential = GoogleAuthProvider.credential(id_token);  
      signInWithCredential(auth, credential)
        .then((userCred) => {
          console.log('✅ Signed in!', userCred.user);  
        })
        .catch((err) => {
          console.error('❌ Sign-in error', err); 
        });
    }
  }, [response]);

  return { promptAsync };
}
