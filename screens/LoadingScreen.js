import React, { useEffect } from "react";
import { View, Text, StyleSheet,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { ActivityIndicator } from "react-native";
import Logo from "../assets/geoport_splash_bg_removed.png"
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";


export default function LoadingScreen() {
  const navigation = useNavigation();
  
  const [fontsLoaded] = useFonts({
  Poppins_700Bold,
});

if (!fontsLoaded) {
  return null; 
}

 useEffect(() => {
  const timer = setTimeout(() => {
    checkIsAuthenticated();
  }, 4000);

  return () => clearTimeout(timer);
}, []);


  const checkIsAuthenticated = () =>{
   try{
      const isAuthenticated = auth.currentUser
      if(isAuthenticated){
        navigation.navigate("homepage");
      }else {
          navigation.navigate("Login");
        }}catch(error){
          console.error(error);
        }
  }


  return (
    <View style={styles.container}>
      <Image source={Logo} style={{ width: 100, height: 100,marginBottom:3 }} />
      <ActivityIndicator color="white" />
      <Text style={{fontSize:8,color:"white",marginTop:3}}>Checking if Authenticated</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FA812F",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FA812F",
    fontFamily: "Poppins_700Bold",
    letterSpacing: .5,
    textTransform: "uppercase",
  },
  progressContainer: {
    width: 260,
    height: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FA812F", 
    borderRadius: 10,
  },
});
