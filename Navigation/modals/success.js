import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");

export default function SuccessModal({ isVisible, status, text, onClose }) {
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
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
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
                            <Text style={styles.successText}>Successfully submitted your report. Please wait for the admin's response. Thank you</Text>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={onClose}
                                activeOpacity={0.85}
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
                            <Text style={styles.errorText}>{text}</Text>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={onClose}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.okButtonText}>Done</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
    reportTitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#222',
        fontWeight: '600',
        marginTop: 15,
    },
    processingText: {
        marginTop: 15,
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
    },
    successText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '700',
        color: '#4CAF50',
        textAlign: 'center',
        lineHeight: 22,
    },
    errorText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '700',
        color: '#E74C3C',
        textAlign: 'center',
        lineHeight: 22,
    },
    okButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 50,
        marginTop: 25,
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '100%',
    },
    okButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});