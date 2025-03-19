import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import SearchIcon from '../../Images/search.svg';
import useLiveLocation from '../../Functions/getCurrentLocation';
import fetchReports from "../../Functions/fetchReports";

export default function MapsScreen() {
  const mapRef = useRef(null);  // Reference to the MapView
  const [isSmartTraveling, setIsSmartTraveling] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [reportData, setReportData] = useState([]);
  const location = useLiveLocation(); 

  const [initialRegion, setInitialRegion] = useState(null);

  // Set initial region only ONCE when location is available
  useEffect(() => {
    if (location && !initialRegion) {
      setInitialRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [location]);

  useEffect(() => {
    fetchReports(setReportData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <SearchIcon width={25} height={35} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a place around Malaybalay"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* OpenStreetMap Integration */}
      {initialRegion && (
        <MapView
          ref={mapRef}  // Assign ref to the MapView
          style={styles.map}
          initialRegion={initialRegion|| {
            latitude: 7.9266, 
            longitude: 125.0876, 
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

          {/* Display Reports */}
          {reportData.map((report, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(report.latitude),
                longitude: parseFloat(report.longitude),
              }}
              title={report.type}
              description={report.details}
              pinColor={report.type.toLowerCase() === 'road defects' ? 'red' : 'blue'} // ✅ Updated condition
            />
          ))}

        </MapView>
      )}

      {/* Status Message */}
      {isSmartTraveling && <Text style={styles.statusMessage}>You are now smart traveling</Text>}

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => setIsSmartTraveling(!isSmartTraveling)}>
        <Text style={styles.buttonText}>
          {isSmartTraveling ? 'Disable Smart Rerouting' : 'Enable Smart Rerouting'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
  },
  iconContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 14, color: '#000' },
  map: { flex: 1, width: '100%', height: '100%' },
  statusMessage: { color: 'green', fontSize: 14, marginTop: 5, textAlign: 'center' },
  button: {
    backgroundColor: '#FA812F',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    paddingHorizontal: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
