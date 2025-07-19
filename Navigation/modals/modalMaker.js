import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class ModalList {
  
  cameraNotAvailableModal(visible, onClose, onVerify) {
    const AnimatedModal = ({ visible, onClose, onVerify }) => {
      const scaleAnim = useRef(new Animated.Value(0.8)).current;
      const opacityAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        if (visible) {
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
      }, [visible]);

      return (
        <Modal transparent visible={visible} animationType="none">
          <View style={styles.cameraModalBackground}>
            <Animated.View 
              style={[
                styles.cameraModalContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              <Ionicons name="alert-circle" size={50} color="#E74C3C" style={styles.cameraIcon} />
              <Text style={styles.cameraTitle}>Verification Required</Text>
              <Text style={styles.cameraMessage}>
                You need to verify your account before using the report feature.
              </Text>
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity 
                  style={styles.cameraCancelButton} 
                  onPress={onClose}
                  activeOpacity={0.85}
                >
                  <Text style={styles.cameraCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cameraVerifyButton} 
                  onPress={onVerify}
                  activeOpacity={0.85}
                >
                  <Text style={styles.cameraVerifyText}>Verify Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      );
    };

    return <AnimatedModal visible={visible} onClose={onClose} onVerify={onVerify} />;
  }

  static routingPromptModal(visible, onClose) {
    const AnimatedRoutingModal = ({ visible, onClose }) => {
      const scaleAnim = useRef(new Animated.Value(0.8)).current;
      const opacityAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        if (visible) {
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
      }, [visible]);

      return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
          <View style={styles.routingModalContainer}>
            <Animated.View 
              style={[
                styles.routingModalContent,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              <Text style={styles.routingTitle}>Select Your Destination</Text>
              <Text style={styles.routingMessage}>
                Please choose your desired location to proceed with smart routing.
                Ensuring accuracy in your selection helps us provide better guidance.
              </Text>
              <TouchableOpacity 
                style={styles.routingButton} 
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={styles.routingButtonText}>OK, Select Location</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      );
    };

    return <AnimatedRoutingModal visible={visible} onClose={onClose} />;
  }
}

const styles = StyleSheet.create({
  cameraModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  cameraModalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  cameraIcon: {
    marginBottom: 15,
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  cameraMessage: {
    fontSize: 15,
    textAlign: 'center',
    color: '#444',
    marginBottom: 25,
    lineHeight: 22,
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cameraCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#E0E0E0',
    borderRadius: 50,
    alignItems: 'center',
    marginRight: 10,
  },
  cameraCancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraVerifyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#3498DB',
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cameraVerifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  routingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  routingModalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  routingTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  routingMessage: {
    fontSize: 15,
    textAlign: 'center',
    color: '#444',
    marginBottom: 25,
    lineHeight: 22,
  },
  routingButton: {
    backgroundColor: '#FA812F',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#FA812F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  routingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});