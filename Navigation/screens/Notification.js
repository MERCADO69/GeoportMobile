import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const NotificationsScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Or a loading spinner
  }

  const notifications = [
    {
      id: 1,
      message: 'Your report has been received. Thank you for helping the community!',
      time: '11:47 AM',
      isNew: true,
    },
    {
      id: 2,
      message: 'The maintenance team is now checking your reported pothole.',
      time: '09:31 AM',
      isNew: true,
    },
    {
      id: 3,
      message: 'Your report about the collision in Sayre Highway has been validated.',
      time: 'Yesterday - 10:00 AM',
      isNew: false,
    },
    {
      id: 4,
      message: 'New report has been detected in your area.',
      time: 'Yesterday - 10:00 AM',
      isNew: false,
    },
    {
      id: 5,
      message: 'Your Previous report has been resolved. Thank you for your Contribution!',
      time: 'Yesterday - 10:00 AM',
      isNew: false,
    },
    {
      id: 6,
      message: 'Your Previous report has been resolved. Thank you for your Contribution!',
      time: 'Wednesday - 10:00 AM',
      isNew: false,
    },
    {
      id: 7,
      message: 'Your Previous report has been resolved. Thank you for your Contribution!',
      time: 'Wednesday - 10:00 AM',
      isNew: false,
    },
    {
      id: 8,
      message: 'Your Previous report has been resolved. Thank you for your Contribution!',
      time: 'Wednesday - 10:00 AM',
      isNew: false,
    },
    {
      id: 9,
      message: 'Your Previous report has been resolved. Thank you for your Contribution!',
      time: 'Wednesday - 10:00 AM',
      isNew: false,
    },
  ];

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete notification:', id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={() => console.log('Clear all')}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              {notification.isNew && <View style={styles.newDot} />}
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium', // Ensures the correct font is used
  },
  container: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationContent: {
    flexDirection: 'column',
    flex: 1,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium', // Ensures the correct font is used
  },
  time: {
    fontSize: 12,
    color: '#FF7F00',
    fontFamily: 'Poppins_400Regular', // Ensures the correct font is used
  },
});

export default NotificationsScreen;
