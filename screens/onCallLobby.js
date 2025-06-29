import React, { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Alert,
} from "react-native";
import { AudioSession, LiveKitRoom } from "@livekit/react-native";
import { LIVEKIT_WS_URL } from "@env";
import {
  ParticipantEvents,
  RoomCleanup,
  PublishTracks,
  CallControls,
  CallTimer
} from "../Functions/livekitIntergationFunctions";

export default function OnCallPage({ navigation, route }) {
  const { room_token } = route.params;

  useEffect(() => {
    if (!room_token) {
      Alert.alert(
        "Cannot proceed to call",
        "No room token was provided or it has expired",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      return;
    }

    const start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, [room_token]);

  if (!room_token) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.callHeader}>
          <Text style={styles.adminText}>Geoport Admin</Text>
          <CallTimer />
        </View>

        <LiveKitRoom
          style={styles.liveKitRoom}
          serverUrl={LIVEKIT_WS_URL}
          token={room_token}
          connect={true}
          options={{ adaptiveStream: { pixelDensity: "screen" } }}
          video={true}
          audio={true}
          onDisconnected={() => {
            Alert.alert(
              'Call Ended',
              'Thank you for answering the call. Your response helps us verify the report more efficiently. We appreciate your cooperation.'
            );
          }}
          onError={(err) => {
            Alert.alert("Something went wrong!", err.message || "Unknown error");
            navigation.navigate('homepage');
          }}
        >
          <PublishTracks />
          <ParticipantEvents
            onUserDisconnected={() => {
              Alert.alert(
                "Call Completed",
                "Thank you for taking the time to answer the call and providing the information we needed. Your cooperation helps us verify reports efficiently and continue serving the community. We appreciate your assistance."
              );
              navigation.navigate('homepage');
            }}
          />
          <RoomCleanup />
          <CallControls navigation={navigation} />
        </LiveKitRoom>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  container: {
    flex: 1,
  },
  callHeader: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  adminText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  liveKitRoom: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  controlText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
