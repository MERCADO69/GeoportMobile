import React, { useState,useEffect} from 'react';
import {View,Text,StyleSheet,SafeAreaView,TouchableOpacity,Switch, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import applyForPushNotification from "../../Functions/savePushNotificationToken"
import removePushNotification from "../../Functions/removePushnotification"
const NotificationSettingScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    pushNotifications: false,
    statusChanged: true,
    nearbyReports: true,
    emergencyAlerts: true,
    communityActivity: false,
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('userSettings');
        if (storedSettings !== null) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
       throw new error
      }
    };
  
    loadSettings();
  }, []);
  

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
      } catch (error) {
        throw new error
      }
    };
  
    saveSettings();
  }, [settings]); 


  async function handleApplyNotification() {
    try{
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications to receive updates.');
        return;
      }
        const isapply = await applyForPushNotification()
        if(!isapply){
          Alert.alert('Failed to apply for notification')
          return
        }
    }catch(error){
      throw new error
    }
  }



  async function HandleDelete(){
    try{
      const isRemoved = await removePushNotification()
      if(!isRemoved){
        Alert.alert('Error',"Can't remove report")
      }
    }catch(error){
      throw new error
    }
  }


  const toggleSwitch = (key) => {
    if (key === 'pushNotifications') {
      if (settings.pushNotifications) {
        HandleDelete()
        setSettings({
          pushNotifications: false,
          statusChanged: true,
          nearbyReports: true,
          emergencyAlerts: true,
          communityActivity: false,
        });
      } else {
        handleApplyNotification()
        setSettings({
          pushNotifications: true,
          statusChanged: true,
          nearbyReports: true,
          emergencyAlerts: true,
          communityActivity: true,
        });
      }
    } else {
      setSettings(prevState => ({
        ...prevState,
        [key]: !prevState[key],
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification settings</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#FF7F00" />
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Enable all notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() =>toggleSwitch('pushNotifications')}
              trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Report Updates</Text>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="time-outline" size={24} color="#FF7F00" />
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Status Changed</Text>
                <Text style={styles.settingDescription}>When your reports are updated</Text>
              </View>
            </View>
            <Switch
              value={settings.statusChanged}
              onValueChange={() => toggleSwitch('statusChanged')}
              trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Area Alerts</Text>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location-outline" size={24} color="#FF7F00" />
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Nearby Reports</Text>
                <Text style={styles.settingDescription}>New reports in your area</Text>
              </View>
            </View>
            <Switch
              value={settings.nearbyReports}
              onValueChange={() => toggleSwitch('nearbyReports')}
              trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="warning-outline" size={24} color="#FF7F00" />
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Emergency Alerts</Text>
                <Text style={styles.settingDescription}>Urgent community notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.emergencyAlerts}
              onValueChange={() => toggleSwitch('emergencyAlerts')}
              trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Community Updates</Text>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="people-outline" size={24} color="#FF7F00" />
              <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>Community Activity</Text>
                <Text style={styles.settingDescription}>New reports in your area</Text>
              </View>
            </View>
            <Switch
              value={settings.communityActivity}
              onValueChange={() => toggleSwitch('communityActivity')}
              trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Poppins_500Medium',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  settingDescription: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
});

export default NotificationSettingScreen;
