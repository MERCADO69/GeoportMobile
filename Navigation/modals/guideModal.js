import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GuideModal({ showGuide, setShowGuide }) {
  return (
    <Modal transparent={true} visible={showGuide} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📷 How to Use the Camera</Text>
          <Text style={styles.modalText}>
            - Open camera by clicking the button.{"\n"}
            - Ensure good lighting for clear images.{"\n"}
            - Point the camera at the road issue or collision.{"\n"}
            - Keep the camera steady to avoid blurriness.{"\n"}
            - Press the capture button to take a photo.
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowGuide(false)}
          >
            <Text style={styles.buttonText}>Got It!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 12,
    color: "gray",
    textAlign: "left",
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#FA812F",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
