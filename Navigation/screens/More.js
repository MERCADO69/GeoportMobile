import React, { useEffect, useState } from 'react';
import { View,Text,StyleSheet,SafeAreaView,TouchableOpacity,Switch,ScrollView,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogoutFunction from "../../Functions/logoutFunction"
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    smartRerouting: true,
    darkMode: false,
    locationServices: false,
    cameraAccess: false,
  });


  const handleLogout = async () => {
    await LogoutFunction();
    navigation.navigate("Login");
  };


  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem('userSettings');
        if (saved) {
          setSettings(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };
    loadSettings();
  }, []);



  const toggleSwitch = (key, newValue) => {
    try {
      const updatedSettings = { 
        ...settings,
        [key]: newValue,
      };
      setSettings(updatedSettings);       
      saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error in toggling switch:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (e) {
     Alert.alert("Something went wrong","Failed to save settings", e);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Rerouting</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="git-network-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Smart Rerouting</Text>
                  <Text style={styles.settingDescription}>Rerouting based on the user reports</Text>
                </View>
              </View>
              <Switch
                value={settings.smartRerouting}
                onValueChange={() => toggleSwitch('smartRerouting', !settings.smartRerouting)}
                trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="person-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Personal Information</Text>
                  <Text style={styles.settingDescription}>Update your Profile name and location</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('UpdateUserInfo')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Email</Text>
                  <Text style={styles.settingDescription}>Update your email</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('UpdateEmail')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="call-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Phone</Text>
                  <Text style={styles.settingDescription}>Update your phone number</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('UpdatePhone')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>


          {/* Preferences Section */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}> 
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>Manage alerts and notifications</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Settings Section */}
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="location-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Location Services</Text>
                  <Text style={styles.settingDescription}>Manage location access</Text>
                </View>
              </View>
              <Switch
                value={settings.locationServices}
                onValueChange={() => toggleSwitch('locationServices', !settings.locationServices)}
                trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="camera-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Camera Access</Text>
                  <Text style={styles.settingDescription}>Manage camera permission</Text>
                </View>
              </View>
              <Switch
                value={settings.cameraAccess}
                onValueChange={() => toggleSwitch('cameraAccess', !settings.cameraAccess)}
                trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Support and About Section */}
          <Text style={styles.sectionTitle}>Support and About</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="help-circle-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Help and Support</Text>
                  <Text style={styles.settingDescription}>Get help or contact support</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('HelpAndSupport')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>About Geoport</Text>
                  <Text style={styles.settingDescription}>Version 1.0.0</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('AboutGeoport')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity style={styles.logoutButton}  onPress={async () => handleLogout()}>
            <Ionicons name="log-out-outline" size={27} color="#FF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  scrollView: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Poppins_500Medium',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF1F1',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 17,
    marginLeft: 8,
    fontFamily: 'Poppins_500Medium',
  },
});

export default SettingsScreen;

