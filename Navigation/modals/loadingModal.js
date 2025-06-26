import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default function LoadingModal({ open }) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#FA812F" />
          <Text style={styles.loadingText}>Loading, please wait...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});
