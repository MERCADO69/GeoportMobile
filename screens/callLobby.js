import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
const { width } = Dimensions.get("window");

export default function CallLobby({ navigation, route }) {
  const { type, room_token } = route.params;
  const sound = useRef(null);

  useEffect(() => {
    const playRingtone = async () => {
      try {
        const { sound: ringtone } = await Audio.Sound.createAsync(
          require("../assets/call_alarm.mp3"),
          {
            shouldPlay: true,
            isLooping: true,
          }
        );
        sound.current = ringtone;
        await sound.current.playAsync();
      } catch (error) {
        console.warn("Error playing sound:", error);
      }
    };

    playRingtone();

    return () => {
      if (sound.current) {
        sound.current.stopAsync();
        sound.current.unloadAsync();
      }
    };
  }, []);

  const handleAnswer = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
    }
    console.log("the type sssssss ", type);
    if (type === "call" || type === "Call") {
      navigation.navigate("CallScreen", { room_token });
    } else {
      navigation.navigate("VideoCallLobby", { room_token });
    }
  };

  const handleDecline = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.callerName}>Geoport Admin</Text>
      <Text style={styles.callStatus}>
        {type === "call" ? "Incoming Call" : "Incoming Video Call"}
      </Text>
      {type === "call" ? (
        <LottieView
          source={require("../assets/admin_calling.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      ) : (
        <LottieView
          source={require("../assets/videocall_animation.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      )}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 16,
    color: "#7b7b7b",
    marginBottom: 30,
  },
  lottie: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 60,
  },
  iconAnimation: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    marginTop: 60,
  },
  declineButton: {
    backgroundColor: "#E53935",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  answerButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
