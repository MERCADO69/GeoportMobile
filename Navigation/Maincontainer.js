import * as React from 'react';
import { useEffect,useState,useContext } from 'react';
import {FETCH_USER_DATA} from "@env";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetUserData from "../Functions/getUserData";
import AuthenticatedgetRequest from "../Functions/get"
import { auth } from '../firebaseConfig';
// Screens
import Homescreen from './screens/Homescreen';
import Camera from './screens/Camera';
import Maps from './screens/Maps';
import Profile from './screens/Profile';
import More from './screens/More';

const homeName = 'Home';
const cameraName = 'Camera';
const mapsName = 'Maps';
const profilename = 'Profile';
const MoreName = 'More';

const Tab = createBottomTabNavigator();

export default function Maincontainer() {
    
    const [data,setData] = useState('')

        useEffect(()=>{
             async function getdata() {
                let user = auth.currentUser;
                if (!user) {
                    throw new Error("User not logged in");
                }
                let id = user.uid;
                let params = `${FETCH_USER_DATA}?id=${id}`
                const {error,message,responseData} = await AuthenticatedgetRequest(params);
                if(!error){
                    setData(responseData);
                }else{
                    throw new Error(message);
                }}
            getdata()
        },[])
    
    

    return (
   
            <Tab.Navigator initialRouteName={homeName}
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

                        return <Ionicons name={iconName} size={25} color={color} />;
                    },
                    tabBarActiveTintColor: '#FA812F',
                    tabBarInactiveTintColor: 'grey',
                    tabBarLabelStyle: {
                        paddingBottom: 3,
                        fontSize: 12,
                        fontFamily: "Poppins_400Regular",
                    },
                    tabBarStyle: { padding: 10, height: 60 },
                })}
            >
                <Tab.Screen name={homeName} component={Homescreen} options={{ headerShown: false }} initialParams={{ user_data: data }}/>
                <Tab.Screen name={cameraName} component={Camera} options={{ headerShown: false }} />
                <Tab.Screen name={mapsName} component={Maps} options={{ headerShown: false }} />
                <Tab.Screen name={profilename} component={Profile} options={{ headerShown: false }}/>
                <Tab.Screen name={MoreName} component={More} options={{ headerShown: false }}/>
            </Tab.Navigator>

                    
    );
}
