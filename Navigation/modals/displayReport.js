import Modal from 'react-native-modal';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function DisplayReportImage({ isVisible, onClose, imageUrl }) {
    const [loading, setLoading] = useState(true);

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                
                {/* Loader Animation */}
                <View style={styles.loaderContainer}>
                    <LottieView 
                        source={require('../../assets/loading.json')}  
                        autoPlay
                        loop
                        style={styles.lottie}
                        opacity={loading ? 1 : 0}  // Hide when image is loaded
                    />
                </View>

                {/* Image */}
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.image} 
                    resizeMode="contain" 
                    onLoadStart={() => setLoading(true)}  
                    onLoadEnd={() => setLoading(false)}  
                />

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 150,
        height: 150,
    },
    image: {
        width: 300,
        height: 300,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FA4032',
        borderRadius: 5,
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
