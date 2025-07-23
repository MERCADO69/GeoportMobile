// Navigation/modals/VerifiedModal.js

import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");

export default function VerifiedModal({ isVisible, status, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible]);

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
          ]}
        >
          <LottieView
            source={require('../../assets/success animation.json')}
            autoPlay
            loop={false}
            style={{ width: 90, height: 90 }}
          />
          <Text style={styles.statusText}>You are a verified resident!</Text>
          <TouchableOpacity style={styles.okButton} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.okButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  okButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    marginTop: 25,
    width: '100%',
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
