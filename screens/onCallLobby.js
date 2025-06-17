import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import HangupIcon from "../assets/end_call.svg";

const { width } = Dimensions.get("window");

export default function OnCallPage({ navigation, room_token }) {
  const [callTime, setCallTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.callerName}>Akali</Text>
      <Text style={styles.callStatus}>On Call • {formatTime(callTime)}</Text>

      <LottieView
        source={require("../assets/voice_animation.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      <TouchableOpacity
        style={styles.hangupButton}
        onPress={() => {
          navigation.navigate("homepage");
        }}
      >
        <HangupIcon width={34} height={34} fill="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  callerName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Poppins_600SemiBold",
  },
  callStatus: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
    marginBottom: 30,
  },
  lottie: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 60,
  },
  hangupButton: {
    backgroundColor: "#E53935",
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
