import React, { useState } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { Poppins_500Medium, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useFonts } from '@expo-google-fonts/poppins';
import SearchIcon from '../../Images/search.svg'; // Make sure the path is correct


export default function Homescreen() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const [searchText, setSearchText] = useState('');

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Box */}
      <View style={styles.topBox} />

    <SafeAreaView>
      <Text style={[styles.Welcomeuser]}>Welcome back user!</Text>
      <Text style={[styles.Welcomelocation]}>San Jose, Malaybalay City</Text>
      <Ionicons name="location-outline" size={20} color="#fff" style={styles.locationIcon} />
    </SafeAreaView>

      {/* History Icon */}
      <SafeAreaView>
      <TouchableOpacity
  style={styles.bellContainer}
  onPress={() => Alert.alert('Bell Icon Pressed')}
>
  <Ionicons name="notifications-outline" size={28} color="#fff" />
</TouchableOpacity>
</SafeAreaView>

      {/* Search Bar */}
      <SafeAreaView style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <SearchIcon width={25} height={35} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Location"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          textAlign="left"
        />
      </SafeAreaView>

      {/* Parent Card Container */}
      <View style={styles.parentCard}>
        {/* Total Reports Card */}
        <TouchableOpacity
          style={[styles.card, styles.cardOrange]}
          onPress={() => {
            Alert.alert(
              "Total Reports",
              "You clicked on the Total Reports card!",
              [{ text: "OK", onPress: () => console.log("Total Reports OK Pressed") }]
            );
          }}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.title, styles.orangeText]}>Reports</Text>
            <Ionicons name="bar-chart" size={24} color="#D35400" style={styles.icon} />
          </View>
          <Text style={[styles.number, styles.cardText]}>25</Text>
          <Text style={[styles.subtitle, styles.cardText]}>Last 30 Days</Text>
        </TouchableOpacity>

        {/* Resolved Card */}
        <TouchableOpacity
          style={[styles.card, styles.cardBlue]}
          onPress={() => {
            Alert.alert(
              "Resolved",
              "You clicked on the Resolved card!",
              [{ text: "OK", onPress: () => console.log("Resolved OK Pressed") }]
            );
          }}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.title, styles.blueText]}>Resolved</Text>
            <Ionicons name="calendar" size={24} color="#3498DB" style={styles.icon} />
          </View>
          <Text style={[styles.number, styles.cardText]}>15</Text>
          <Text style={[styles.subtitle, styles.cardText]}>78% Completion</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Section */}
      <View>
        <Text style={[styles.Quickie]}>Quick Action</Text>
      </View>

      {/* New Report Button with Icon */}
      <TouchableOpacity style={styles.Quickbutton} onPress={() => Alert.alert('New Report Button Pressed')}>
        <View style={styles.buttonContent}>
          <Ionicons name="camera" size={40} color="#fff" style={styles.icon} />
          <Text style={styles.QuickbuttonText}>New Report</Text>
        </View>
        <Text style={styles.submitText}>Submit an Issue</Text>
      </TouchableOpacity>

      <View>
        <Text style={[styles.Recent]}>Recent Activity</Text>
      </View>


      <ScrollView style={styles.recentActivityContainer}>
  {/* First Card */}
  <TouchableOpacity
    style={[styles.card, styles.cardNewType]}
    onPress={() => {
      Alert.alert(
        "Road Issue",
        "You clicked on the road issue card!",
        [{ text: "OK", onPress: () => console.log("Road Issue OK Pressed") }]
      );
    }}
  >
    <View style={styles.cardNewTypeContent}>
      <Ionicons name="warning" size={30} color="#FA4032" style={styles.iconLeft} />
      <View style={styles.cardTextContainer}>
        <Text style={[styles.title, { color: '#FA4032' }]}>Pothole</Text>
        <Text style={[styles.subtitle, styles.cardText]}>In Progress</Text>
        <Text style={[styles.location, styles.cardText]}>Barangay XYZ</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Ionicons name="time" size={18} color="#FA4032" style={styles.iconRight} />
      <Text style={[styles.timeAgo, styles.cardText]}>10 minutes ago</Text>
    </View>
  </TouchableOpacity>

  {/* Second Card */}
  <TouchableOpacity
    style={[styles.card, styles.cardNewType]}
    onPress={() => {
      Alert.alert(
        "Car Collision",
        "You clicked on the Car Collision card!",
        [{ text: "OK", onPress: () => console.log("Car Collision car Pressed") }]
      );
    }}
  >
    <View style={styles.cardNewTypeContent}>
      <Ionicons name="car-outline" size={30} color="#FA4032" style={styles.iconLeft} />
      <View style={styles.cardTextContainer}>
        <Text style={[styles.title, { color: '#FA4032' }]}>Car Collision</Text>
        <Text style={[styles.subtitle, styles.cardText]}>Resolved</Text>
        <Text style={[styles.location, styles.cardText]}>Barangay ABC</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Ionicons name="time" size={18} color="#FA4032" style={styles.iconRight} />
      <Text style={[styles.timeAgo, styles.cardText]}>1 hour ago</Text>
    </View>
  </TouchableOpacity>

  {/* Remaining Cards (scrollable) */}
  <TouchableOpacity
    style={[styles.card, styles.cardNewType]}
    onPress={() => {
      Alert.alert(
        "Flooding",
        "You clicked on the flooding card!",
        [{ text: "OK", onPress: () => console.log("Flooding OK Pressed") }]
      );
    }}
  >
    <View style={styles.cardNewTypeContent}>
      <Ionicons name="rainy" size={30} color="#FA4032" style={styles.iconLeft} />
      <View style={styles.cardTextContainer}>
        <Text style={[styles.title, { color: '#FA4032' }]}>Flooding</Text>
        <Text style={[styles.subtitle, styles.cardText]}>In Progress</Text>
        <Text style={[styles.location, styles.cardText]}>Barangay DEF</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Ionicons name="time" size={18} color="#FA4032" style={styles.iconRight} />
      <Text style={[styles.timeAgo, styles.cardText]}>2 hours ago</Text>
    </View>
  </TouchableOpacity>

  {/* Fourth Card */}
  <TouchableOpacity
    style={[styles.card, styles.cardNewType]}
    onPress={() => {
      Alert.alert(
        "Streetlight Outage",
        "You clicked on the streetlight outage card!",
        [{ text: "OK", onPress: () => console.log("Streetlight Outage OK Pressed") }]
      );
    }}
  >
    <View style={styles.cardNewTypeContent}>
      <Ionicons name="bulb" size={30} color="#FA4032" style={styles.iconLeft} />
      <View style={styles.cardTextContainer}>
        <Text style={[styles.title, { color: '#FA4032' }]}>Streetlight Outage</Text>
        <Text style={[styles.subtitle, styles.cardText]}>In Progress</Text>
        <Text style={[styles.location, styles.cardText]}>Barangay GHI</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      <Ionicons name="time" size={18} color="#FA4032" style={styles.iconRight} />
      <Text style={[styles.timeAgo, styles.cardText]}>3 hours ago</Text>
    </View>
  </TouchableOpacity>
</ScrollView>



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  historyIconContainer: {
    position: 'absolute',
    top: 10, // Adjust as needed for vertical placement
    left: 20, // Adjust as needed for horizontal placement
    zIndex: 15,
  },
  searchContainer: {
    position: 'absolute',
    top: 105, 
    left: '5%',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    zIndex: 10, // Ensures the search bar appears on top
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    paddingLeft: 5,
    textAlign: 'left',
  },
  topBox: {
    backgroundColor: '#FF7F50',
    height: 200,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  parentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    flex: 1,
    padding: 7,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#FEE2CF',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    fontFamily: 'Poppins_400Regular',
  },
  cardOrange: {
    backgroundColor: '#FFE8D6',
  },
  cardBlue: {
    backgroundColor: '#E2EDFF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  orangeText: {
    color: '#D35400',
  },
  blueText: {
    color: '#3498DB',
  },
  Quickie: {
    paddingTop: 30,
    paddingLeft: 25,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  Quickbutton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 15,  // Adjust vertical padding to make the button more balanced
    width: '90%',         // Make button 90% of screen width
    maxWidth: 350,        // Optional: you can still limit the width on larger screens
    borderRadius: 10,
    marginTop: 20,
    marginLeft: '5%',     // Center the button horizontally on smaller screens
  },
  
  QuickbuttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins_500Medium',
    paddingLeft: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  submitText: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
    marginTop: -15,
    color: '#fff',
    paddingLeft: 65,
  },
  Recent: {
    paddingTop: 30,
    paddingLeft: 25,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  bellContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,

    position: 'absolute',
    top: -160,  // Adjust top value to place the icon correctly
    right: 20,  // Use 'right' instead of 'marginLeft' for flexible positioning
  },
  
  Welcomeuser:{
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    position: 'absolute',
    marginTop: -155,
    marginLeft: 25,
    color: '#fff',

  },
  locationIcon: {
    marginTop: 10, // Space between the text and the icon
    position: 'absolute',
    marginTop: -135,
    marginLeft: 20,
  },
  cardNewTypeContent: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    backgroundColor: 'FEFEFE'
  },
  
  iconLeft: {
    marginRight: 10,
  },
  
  cardTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
    width: '60%',
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 200,
    right: 0,
    top: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  
  iconRight: {
    marginRight: 5,
  },
  
  timeAgo: {
    fontSize: 12,
    color: '#FA4032', 
  },
  Welcomelocation:{
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    position: 'absolute',
    marginTop: -135,
    marginLeft: 40,
    color: '#fff',
  },
  recentActivityContainer: {
    backgroundColor: '#FEFEFE',
  }
});
