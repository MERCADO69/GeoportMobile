import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Maincontainer from './Navigation/Maincontainer';
import LoginScreen from './screens/Loginscreen';
import Forgetpass from './screens/Forgetpass';
import DebugScreen from './screens/ScreenDebugger';


const Stack = createStackNavigator();

function app() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="homepage" component={Maincontainer} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPass" component={Forgetpass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default app;