import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class ModalList {
  cameraNotAvailableModal(visible, onClose, onVerify) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle" size={50} color="#E74C3C" style={styles.icon} />
            <Text style={styles.title}>Verification Required</Text>
            <Text style={styles.message}>
              You need to verify your account before using the report feature.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
                <Text style={styles.verifyText}>Verify Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: { flex: 1,justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  modalContainer: { width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center',},
  icon: {marginBottom: 10, },
  title: {fontSize: 18, fontWeight: 'bold',marginBottom: 10,},
  message: { fontSize: 14,textAlign: 'center',color: '#555',marginBottom: 20,},
  buttonContainer: { flexDirection: 'row',justifyContent: 'space-between', width: '100%',},
  cancelButton: { flex: 1, padding: 12, backgroundColor: '#E0E0E0', borderRadius: 5, alignItems: 'center',marginRight: 10,},
  cancelText: {  color: '#333',fontWeight: 'bold', },
  verifyButton: { flex: 1, padding: 12, backgroundColor: '#3498DB',    alignItems: 'center', },
  verifyText: {color: 'white', fontWeight: 'bold',},
});