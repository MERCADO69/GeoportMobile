import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { GEOPORT_USER_CLIENT_ID } from '@env';
import fetchUserInfo from '../Functions/fetchGoogleData';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function useGoogleAuth() {
  const [userData, setUserData] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({
    native: 'geoportmalaybalay:/oauthredirect',
    useProxy: false,
  });

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: GEOPORT_USER_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        try {
          const profile = await fetchUserInfo(response.authentication.accessToken);
          setUserData({
            profile,
            accessToken: response.authentication.accessToken,
          });
        } catch (error) {
          console.error('❌ Failed to fetch Google user data:', error);
        }
      }
    };
    handleAuthSuccess();
  }, [response]);

  return { promptAsync, request, response, userData };
}
