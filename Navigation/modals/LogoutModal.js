// Navigation/modals/LogoutModal.js
import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function LogoutModal({ visible, onCancel, onConfirm }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.title}>Log out</Text>
          <Text style={styles.message}>Are you sure you want to log out?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#111",
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Poppins_500Medium",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF4444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
});
