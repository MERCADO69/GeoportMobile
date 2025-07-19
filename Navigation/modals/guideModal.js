import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

export default function GuideModal({ showGuide, setShowGuide }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showGuide) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [showGuide]);

  return (
    <Modal transparent visible={showGuide} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.modalTitle}>How to Use the Camera</Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Tap the camera button to open the camera.</Text>
            <Text style={styles.bullet}>• Make sure the area is well-lit.</Text>
            <Text style={styles.bullet}>• Focus on the road issue or collision.</Text>
            <Text style={styles.bullet}>• Hold your phone steady for a clear photo.</Text>
            <Text style={styles.bullet}>• Tap the capture button to take a picture.</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowGuide(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  bulletList: {
    alignSelf: "flex-start",
    marginBottom: 25,
  },
  bullet: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: "#FA812F",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    shadowColor: "#FA812F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
