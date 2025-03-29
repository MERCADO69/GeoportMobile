import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Text ,StatusBar} from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import SearchIcon from '../../Images/search.svg';
import useLiveLocation from '../../Functions/getCurrentLocation';
import GetUserData from "../../Functions/getUserData"
import fetchReports from "../../Functions/fetchReports";

export default function MapsScreen() {
  const mapRef = useRef(null);  
  const [isSmartTraveling, setIsSmartTraveling] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [reportData, setReportData] = useState([]);
  const location = useLiveLocation(); 
  const [status,setStatus] = useState('')
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

  

  useEffect(()=>{
      async function FetchData() {  
          const data = await GetUserData()
        if(data){
          let status = data.data?.status
          setStatus(status)
        }
      }
      FetchData()
  },[])

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

      {/* MapView Filling Entire Screen */}
      {initialRegion && (
        <MapView
          ref={mapRef}
          style={styles.map} // ✅ Extends map fully
          initialRegion={initialRegion || {
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
              pinColor={report.type.toLowerCase() === 'road defects' ? 'red' : 'blue'}
            />
          ))}
        </MapView>
      )}

      {/* Status Message */}
      {isSmartTraveling && <Text style={styles.statusMessage}>You are now smart traveling</Text>}

      {/* Button Positioned Over the Map */}
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
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    zIndex: 1,
  },

  iconContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 14, color: '#000' },

  map: {
    ...StyleSheet.absoluteFillObject, 
  },

  statusMessage: { 
    color: 'green', 
    fontSize: 14, 
    textAlign: 'center',
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 80,
    left: 10,
    right: 10,
  },

  button: {
    position: 'absolute', 
    bottom: 20, 
    left: '5%',
    right: '5%',
    backgroundColor: '#FA812F',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonText: { color: '#fff', fontSize: 16 },
});