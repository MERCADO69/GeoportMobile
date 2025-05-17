import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';


;
import Maincontainer from './Navigation/Maincontainer';
import LoginScreen from './screens/Loginscreen';
import Forgetpass from './screens/Forgetpass';
import LoadingScreen from './screens/LoadingScreen';
import MobileNumberInput from "./screens/Redirect"
import AboutGeoportscreen from "./Navigation/screens/AboutGeoport"
import HelpSupportScreen from "./Navigation/screens/Helpandsupport"
import NotificationSettingScreen from "./Navigation/screens/Notifsettings"
import UpdatePhoneScreen from "./Navigation/screens/PhoneUpdate"
import ReportsHistoryScreen from "./Navigation/screens/History"
import UpdateEmail from "./Navigation/screens/Emailupdate"
import ForgotPasswordScreen from "./screens/Forgetpass"
import NewForgotPasswordScreen from "./screens/Newpassword"
import UpdateInformationScreen from "./Navigation/screens/UpdateInfo"

const Stack = createStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
function app() {
  

  useEffect(() => {
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;
      console.log("Foreground Notification Title:", title);
      console.log("Foreground Notification Body:", body);
      console.log("Foreground Notification Extra Data:", data);
  
      Alert.alert(title || 'No Title', body || 'No Body');
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { title, body, info } = response.notification.request.content.data;
      console.log("Background Notification Title:", title);
      console.log("Background Notification Body:", body);
      console.log("Background Notification Extra Data:", info);
    
    });
 
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="homepage" component={Maincontainer} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPass" component={Forgetpass} />
        <Stack.Screen name="VerifyAccount" component={MobileNumberInput} />
        <Stack.Screen name="AboutGeoport" component={AboutGeoportscreen} options={{ headerShown: false }}  />
        <Stack.Screen name="HelpAndSupport" component={HelpSupportScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="UpdatePhone" component={UpdatePhoneScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="ReportsHistory" component={ReportsHistoryScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="NewForgotPass" component={NewForgotPasswordScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="ForgotPass" component={ForgotPasswordScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="UpdateEmail" component={UpdateEmail} options={{ headerShown: false }}  />
        <Stack.Screen name="UpdateUserInfo" component={UpdateInformationScreen} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default app;