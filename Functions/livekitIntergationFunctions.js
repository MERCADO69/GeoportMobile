import { RoomEvent } from "livekit-client";
import { useRoomContext } from "@livekit/react-native";
import { createLocalAudioTrack, createLocalVideoTrack } from "livekit-client";
import { useEffect,useState } from "react";
import { Alert,View,StyleSheet,TouchableOpacity,Text } from "react-native";

const ParticipantEvents = ({ onUserDisconnected }) => {
  const room = useRoomContext();


  useEffect(() => {
    const handleParticipantConnected = (participant) => {
     Alert.alert(
        "You're Now on a Call",
        "Please speak clearly and respectfully while providing the necessary information. This will help us take action on your report more quickly."
        );
    };

    const handleParticipantDisconnected = (participant) => {
      Alert.alert("Call Completed", "Thank you for taking the time to answer the call and providing the information we needed. Your cooperation helps us verify reports efficiently and continue serving the community. We appreciate your assistance.");
      onUserDisconnected?.();
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room, onUserDisconnected]);

  return null; 
};

const RoomCleanup = () => {
  const room = useRoomContext();
  useEffect(() => {
    return () => {
      room?.disconnect?.();
    };
  }, []);
  return null;
};



const PublishTracks = () => {
  const room = useRoomContext();

  useEffect(() => {
    const publish = async () => {
      try {
        if (!room.localParticipant) {
          Alert.alert("Something went wrong.","localParticipant is not ready");
          return;
        }
            try{
                 const audioPublished = room.localParticipant.audioTracks.size > 0;
                    if (!audioPublished) {
                        const audioTrack = await createLocalAudioTrack();
                        await room.localParticipant.publishTrack(audioTrack);
                    }
                } catch (error) {
                throw error
              }
            try{
                 const videoPublished = room.localParticipant.videoTracks.size > 0;
                  if (!videoPublished) {
                            const videoTrack = await createLocalVideoTrack();
                            await room.localParticipant.publishTrack(videoTrack);
                        }
              } catch (error) {
                throw new error
                }

      } catch (err) {
         Alert.alert("Failed to publish tracks", err.message || "An unknown error occurred while publishing tracks.");

      }
    };
    publish();
  }, [room]);
  return null;
};


const CallControls = ({ navigation }) => {
  const room = useRoomContext();

  const hangUp = async () => {
    try {
      await room.disconnect();
    } catch (error) {
      throw new error
    }finally{
      navigation.navigate('homepage')
       Alert.alert(
      'Call Ended',
      'Thank you for answering the call and providing the needed information. We appreciate your cooperation.'
    );
    }
  };
  return (
    <View style={styles.controls}>
      <TouchableOpacity onPress={hangUp} style={styles.controlButton}>
        <Text style={styles.controlText}>Hang Up</Text>
      </TouchableOpacity>
    </View>
  );
};


const CallTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const remSecs = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${remSecs}`;
  };

  return (
    <Text style={styles.callTimer}>{formatTime(seconds)}</Text>
  );
};


export { ParticipantEvents , RoomCleanup,PublishTracks,CallControls ,CallTimer}



const styles = StyleSheet.create({
  controls: {
     position: 'absolute',
    bottom: 40, 
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }, controlButton: {   
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
    width:"70%",
  },
  controlText: {
    color: "#fff",
    fontSize: 16,
    margin:3,
    fontWeight: "600",
    alignSelf:"center"
  }})
