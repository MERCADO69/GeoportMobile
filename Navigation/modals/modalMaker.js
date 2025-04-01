import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class ModalList {
          cameraNotAvailableModal(visible, onClose, onVerify) {
            return (
              <Modal transparent visible={visible} animationType="fade">
                <View style={styles.cameraModalBackground}>
                  <View style={styles.cameraModalContainer}>
                    <Ionicons name="alert-circle" size={50} color="#E74C3C" style={styles.cameraIcon} />
                    <Text style={styles.cameraTitle}>Verification Required</Text>
                    <Text style={styles.cameraMessage}>
                      You need to verify your account before using the report feature.
                    </Text>
                    <View style={styles.cameraButtonContainer}>
                      <TouchableOpacity style={styles.cameraCancelButton} onPress={onClose}>
                        <Text style={styles.cameraCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cameraVerifyButton} onPress={onVerify}>
                        <Text style={styles.cameraVerifyText}>Verify Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            );
          }

          static routingPromptModal(visible, onClose) {
            return (
              <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
                <View style={styles.routingModalContainer}>
                  <View style={styles.routingModalContent}>
                    <Text style={styles.routingTitle}>Select Your Destination</Text>
                    <Text style={styles.routingMessage}>
                      Please choose your desired location to proceed with smart routing.
                      Ensuring accuracy in your selection helps us provide better guidance.
                    </Text>
                    <TouchableOpacity style={styles.routingButton} onPress={onClose}>
                      <Text style={styles.routingButtonText}>OK, Select Location</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            );
          }
}

const styles = StyleSheet.create({
  cameraModalBackground: { flex: 1,justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  cameraModalContainer: { width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center',},
  cameraIcon: {marginBottom: 10, },
  cameraTitle: {fontSize: 18, fontWeight: 'bold',marginBottom: 10,},
  cameraMessage: { fontSize: 14,textAlign: 'center',color: '#555',marginBottom: 20,},
  cameraButtonContainer: { flexDirection: 'row',justifyContent: 'space-between', width: '100%',},
  cameraCancelButton: { flex: 1, padding: 12, backgroundColor: '#E0E0E0', borderRadius: 5, alignItems: 'center',marginRight: 10,},
  cameraCancelText: {  color: '#333',fontWeight: 'bold', },
  cameraVerifyButton: { flex: 1, padding: 12, backgroundColor: '#3498DB', alignItems: 'center', },
  cameraVerifyText: {color: 'white', fontWeight: 'bold',},

  routingModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  routingModalContent: { width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  routingTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  routingMessage: { fontSize: 14, textAlign: 'center', color: '#555', marginBottom: 20 },
  routingButton: { padding: 12, backgroundColor: '#FA812F', borderRadius: 5, alignItems: 'center', width: '100%' },
  routingButtonText: { color: 'white', fontWeight: 'bold' }
});