import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function LoadingScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [fontsLoaded] = useFonts({ Poppins_700Bold });


  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.8);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    textOpacity.value = withTiming(1, { duration: 1200 });
    textScale.value = withTiming(1, { duration: 1200 });
    progressWidth.value = withTiming(250, { duration: 3000 });
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          navigation.navigate("homepage");
        } else {
          navigation.navigate("Login");
        }
      }, 4000);
    });
  
    return () => unsubscribe();
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <View style={styles.container}>
      {/* Title */}
      <Animated.Text style={[styles.text, textStyle]}>
        GEOPORT MALAYBALAY
      </Animated.Text>

     
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FA812F", // Main color
    fontFamily: "Poppins_700Bold",
    letterSpacing: .5,
    textTransform: "uppercase",
  },
  progressContainer: {
    width: 260,
    height: 8,
    backgroundColor: "#EEEEEE", // Light gray background
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FA812F", // Orange progress bar
    borderRadius: 10,
  },
});
