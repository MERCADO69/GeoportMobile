import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session"; // ✅ Correct Import
import { auth } from "../firebaseConfig";
import { APP_WEB_CLIENT_ID } from "@env";

export const useGoogleAuth = () => {
  // ✅ Generate the correct redirect URI automatically
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: APP_WEB_CLIENT_ID, 
    redirectUri, // ✅ Use the generated redirect URI
    useProxy: true, // ✅ Ensures the correct Expo auth flow
  });

  console.log("WEBCLIENT ID:", APP_WEB_CLIENT_ID);
  console.log("Redirect URI:", redirectUri); // ✅ Should be an Expo-auth proxy URL

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((user) => console.log("✅ Google Sign-In Successful:", user))
        .catch((error) => console.error("❌ Google Sign-In Error:", error));
    }
  }, [response]);

  return { promptAsync };
};
