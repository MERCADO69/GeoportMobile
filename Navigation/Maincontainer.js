import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Screens
import Homescreen from './screens/Homescreen';
import Camera from './screens/Camera';
import Maps from './screens/Maps';
import Profile from './screens/Profile';
import More from './screens/More';

// Screen names
const homeName = 'Home';
const cameraName = 'Camera';
const mapsName = 'Maps';
const profilename = 'User';
const MoreName = 'More';

const Tab = createBottomTabNavigator();

export default function Maincontainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        const rn = route.name;

                        if (rn === homeName) {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (rn === cameraName) {
                            iconName = focused ? 'camera' : 'camera-outline';
                        } else if (rn === mapsName) {
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (rn === profilename) {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (rn === MoreName) {
                            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
                        }

                        return <Ionicons name={iconName} size={28} color={color} />;
                    },
                    tabBarActiveTintColor: '#FA812F',
                    tabBarInactiveTintColor: 'grey',
                    tabBarLabelStyle: {
                        paddingBottom: 15,
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                    },
                    tabBarStyle: { padding: 10, height: 60 },
                })}
            >
                <Tab.Screen name={homeName} component={Homescreen} options={{ headerShown: false }} />
                <Tab.Screen name={cameraName} component={Camera} options={{ headerShown: false }} />
                <Tab.Screen name={mapsName} component={Maps} options={{ headerShown: false }} />
                <Tab.Screen name={profilename} component={Profile} options={{ headerShown: false }}/>
                <Tab.Screen name={MoreName} component={More} options={{ headerShown: false }}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
