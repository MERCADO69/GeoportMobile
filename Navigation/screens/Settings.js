import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    smartRerouting: true,
    darkMode: false,
    locationServices: true,
    cameraAccess: true,
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const toggleSwitch = (key) => {
    setSettings((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {/* Rerouting Section */}
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
                onValueChange={() => toggleSwitch('smartRerouting')}
                trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="person-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Personal Information</Text>
                  <Text style={styles.settingDescription}>Update your Profile information</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('PersonalInfo')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences Section */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.section}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Enjoy a more comfortable, dimmed display</Text>
                </View>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => toggleSwitch('darkMode')}
                trackColor={{ false: '#E5E5E5', true: '#FF7F00' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={24} color="#FF7F00" />
                <View style={styles.textContainer}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>Manage alerts and notifications</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
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
                onValueChange={() => toggleSwitch('locationServices')}
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
                onValueChange={() => toggleSwitch('cameraAccess')}
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
              <TouchableOpacity onPress={() => navigation.navigate('Help')}>
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
              <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout pressed')}>
            <Ionicons name="log-out-outline" size={20} color="#FF4444" />
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
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  settingDescription: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF1F1',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SettingsScreen;
