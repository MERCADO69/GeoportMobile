import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const AboutGeoportscreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About Geoport</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Section 1: Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Overview</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Geoport is a community-driven app designed to make roads safer and more navigable. Report road incidents, car collisions, and infrastructure issues such as potholes or repairs using Geoport's machine learning features.
            </Text>
          </View>
        </View>

        {/* Section 2: Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          {/* Feature Items */}
          <View style={styles.featureItem}>
            <Ionicons name="alert-circle-outline" size={24} color="#FF7F00" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Report Incidents</Text>
              <Text style={styles.featureDescription}>
                Quickly report car collisions and get immediate assistance.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="location-outline" size={24} color="#FF7F00" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Geotag Road Issues</Text>
              <Text style={styles.featureDescription}>
                Pinpoint potholes, road hazards, and construction zones.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={24} color="#FF7F00" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Real-Time Updates</Text>
              <Text style={styles.featureDescription}>
                See current reports and avoid trouble spots.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={24} color="#FF7F00" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Community Involvement</Text>
              <Text style={styles.featureDescription}>
                Engage with other users to make your city safer.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="navigate-outline" size={24} color="#FF7F00" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Rerouting</Text>
              <Text style={styles.featureDescription}>
                Find the best alternative routes in real-time, avoiding areas affected by reported collisions and ongoing repairs.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
            Using Geoport is simple . Just take a photo of the issue, and Geoport’s system will automatically identify the type of problem and notify the CDRRMO and other users in real time.
            </Text>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <View style={styles.supportsection}>
            <Text style={styles.supporttitle}>Contact and Support</Text>
              <View style={styles.contactRow}>
            <Ionicons name="mail" size={20} color="#000" />
              <Text style={styles.emailText}>geoportmalaybalay@gmail.com</Text>
                </View>
                </View> 
          <View style={styles.card}>
            <Text style={styles.cardText}>
            Geoport was developed by passionate by a team of IT Students from BuKSU dedicated to making our roads safer and improving city infrastructure. together, we aim to empower communities with tools for a better future.
            </Text>
              </View>
               </View>
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
  },
  headerText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  scrollView: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 4,
  },
  // Styling for the Contact and Support section
  supportsection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center the section vertically
    alignItems: 'center', // Center the section horizontally
  },
  supporttitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold', // Use Poppins font for title
    textAlign: 'center', // Center the title text
    marginBottom: -5,
    marginTop: -25,
    color: '#333',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the icon and email address horizontally
  },
  emailText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular', // Use Poppins font for email text
    color: '#000',
  },
});

export default AboutGeoportscreen;

