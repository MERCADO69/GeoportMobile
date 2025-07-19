import * as React from "react";
import { StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { registerGlobals } from '@livekit/react-native';
import Constants from "expo-constants";
import { useEffect } from "react";

// Screens
import CallLobby from "./screens/callLobby";
import LoginScreen from "./screens/Loginscreen";
import Forgetpass from "./screens/Forgetpass";
import OnCallPage from "./screens/onCallLobby";
import OnVideoCallPage from "./screens/onVideoCallLobby";
import ForgotPasswordScreen from "./screens/Forgetpass";
import NewForgotPasswordScreen from "./screens/Newpassword";
import LoadingScreen from "./screens/LoadingScreen";
import MobileNumberInput from "./screens/Redirect";
import Maincontainer from "./Navigation/Maincontainer";
import AboutGeoportscreen from "./Navigation/screens/AboutGeoport";
import HelpSupportScreen from "./Navigation/screens/Helpandsupport";
import NotificationSettingScreen from "./Navigation/screens/Notifsettings";
import UpdatePhoneScreen from "./Navigation/screens/PhoneUpdate";
import ReportsHistoryScreen from "./Navigation/screens/History";
import UpdateEmail from "./Navigation/screens/Emailupdate";
import UpdateInformationScreen from "./Navigation/screens/UpdateInfo";
import AccountSetup from "./screens/CreateAccount"
import { navigationRef, navigate } from "./navigationRef";
import EmailVerificationCheck from "./screens/EmailVerification"

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function App() {
  registerGlobals();
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
      } else {
        console.log("🔐 Notification permission granted");
      }
    })();
  }, []);


  useEffect(() => {
  Notifications.setNotificationCategoryAsync("incoming-call", [
    {
      identifier: "ANSWER",
      buttonTitle: "Answer",
      options: { opensAppToForeground: true },
    },
    {
      identifier: "DECLINE",
      buttonTitle: "Decline",
      options: { isDestructive: true },
    },
  ]);
}, []);


  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Push notification permission not granted");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas?.projectId ||
          Constants.easConfig?.projectId,
      });
      console.log("Expo Push Token:", tokenData.data);
    };

    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        const { type, room_token } = notification.request.content.data;
        
        if (type?.toLowerCase() === "call" || type?.toLowerCase() === "video") {
          navigate("CallLobby", { type, room_token });
        }
      });

   const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { type, room_token } = response.notification.request.content.data;
        const action = response.actionIdentifier;
        const normalizedType = type?.toLowerCase();
        if (normalizedType === "call" || normalizedType === "video") {
          if (action === "ANSWER" || action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            navigate("CallScreen", { room_token });
          } else if (action === "DECLINE") {
           navigate("homepage");
          }
        } else {
          navigate("homepage");
        }
      });


    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CallLobby"
          component={CallLobby}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoCallLobby"
          component={OnVideoCallPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CallScreen"
          component={OnCallPage}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Email Verification"
          component={EmailVerificationCheck}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="homepage"
          component={Maincontainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ForgetPass" component={Forgetpass} />
        <Stack.Screen name="VerifyAccount" component={MobileNumberInput} />
        <Stack.Screen
          name="AboutGeoport"
          component={AboutGeoportscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpAndSupport"
          component={HelpSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdatePhone"
          component={UpdatePhoneScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={ReportsHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewForgotPass"
          component={NewForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPass"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateEmail"
          component={UpdateEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create Account"
          component={AccountSetup}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UpdateUserInfo"
          component={UpdateInformationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
