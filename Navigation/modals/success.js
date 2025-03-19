import Modal from 'react-native-modal';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SuccessModal({ isVisible, status,text,onClose  }) {
    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" style={styles.modal}>
            <View style={styles.modalContainer}>
            {status === "validated" && (
                    <>
                        <LottieView 
                            source={require('../../assets/success animation.json')} 
                            autoPlay 
                            loop={false}
                            style={{ width: 80, height: 80 }} 
                        />
                        <Text style={styles.reportTitle}>{text}</Text>
                    </>
                )}

                {status === "processing" && (
                    <>
                        <ActivityIndicator size="large" color="#FA812F" />
                        <Text style={styles.processingText}>Submitting your report...</Text>
                    </>
                )}

                {status === "success" && (
                    <>
                        <LottieView 
                            source={require('../../assets/success animation.json')} 
                            autoPlay 
                            loop={false}
                            style={{ width: 90, height: 90 }} 
                        />
                        <Text style={styles.successText}>Successfully submitted your report. Please wait for the admin's response. Thankyou</Text>
                        <TouchableOpacity 
                            style={styles.okButton} 
                            onPress={onClose}
                        >
                            <Text style={styles.okButtonText}>Done</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === "error" && (
                    <>
                        <LottieView 
                            source={require('../../assets/error animation.json')} 
                            autoPlay 
                            loop={false}
                            style={{ width: 80, height: 80 }} 
                        />
                        <Text style={styles.successText}>{text}</Text>
                        <TouchableOpacity 
                            style={styles.okButton} 
                            onPress={onClose}
                        >
                            <Text style={styles.okButtonText}>Done</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    reportTitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    reportText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
    },
    processingText: {
        marginTop: 10,
        fontSize: 13,
        color: 'black',
        textAlign: 'center',
    },
    successText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
    },
  okButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
},
okButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
}});