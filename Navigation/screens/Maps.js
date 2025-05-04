import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Text, StatusBar,Alert } from 'react-native';
import { Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import polyline from "@mapbox/polyline";
import MapView, { UrlTile, Marker } from 'react-native-maps';
import SearchIcon from '../../Images/search.svg';
import useLiveLocation from '../../Functions/getCurrentLocation';
import GetUserData from "../../Functions/getUserData";
import fetchReports from "../../Functions/fetchReports";
import RoutingFunction from "../../Functions/routingFunction"
import ModalList from "../modals/modalMaker"
import { getDistance as geolibGetDistance } from 'geolib';


export default function MapsScreen() {
  const mapRef = useRef(null);  
  const [isSmartTraveling, setIsSmartTraveling] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [reportData, setReportData] = useState([]);
  const location = useLiveLocation(); 
  const [status, setStatus] = useState('');
  const [route,setRoute] = useState([])
  const [initialRegion, setInitialRegion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const routingFunction = new RoutingFunction();
  const prevReportData = useRef([]);
  const [isReroutingEnabled, setIsReroutingEnabled] = useState(false);
  const [isLocationAvailable,setIsLocationAvailable] = useState(false)

    const loadSettings = async () => {
      try {
        const savedSmartRerouting = await AsyncStorage.getItem('userSettings');
        if (savedSmartRerouting !== null) {
          const parsedSettings = JSON.parse(savedSmartRerouting);
          const isEnabled = !!parsedSettings.smartRerouting; 
          const isLocationEnabled = !!parsedSettings.locationServices;
          setIsReroutingEnabled(isEnabled);
          setIsLocationAvailable(isLocationEnabled);
            }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };


  useEffect(() => {
    async function fetchData() {
      try {
        if (location && !initialRegion) {
          setInitialRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
        await fetchReports(setReportData);
        const data = await GetUserData();
        if (data) {
          setStatus(data.data?.status);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    loadSettings();
    fetchData();
    
  }, [location]); 



  useEffect(() => {
    if (selectedLocation && reportData.length > 0) {
        const isChanged = JSON.stringify(prevReportData.current) !== JSON.stringify(reportData);

        if (isChanged) {
            handleRerouting(selectedLocation);
            prevReportData.current = reportData; 
        }
    }
}, [reportData]);




    async function handleRerouting(destinationLocation) {
      let startLocation = { latitude: location.latitude, longitude: location.longitude };
      let endLocation = { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude };
          try {
            const data = await routingFunction.requestRoute(startLocation, endLocation);
            const repairedRoads = await getUnpassableRoadCoordinates();

            if (data && data.routes && data.routes.length > 0) {
              const encodedPolyline = data.routes[0].geometry;
              const decodedCoordinates = polyline.decode(encodedPolyline).map(coord => ({
                latitude: coord[0],
                longitude: coord[1]
              }));

              const rerouteNeeded = checkForRepairedRoads(decodedCoordinates, repairedRoads);

                  if (rerouteNeeded ) {
                    Alert.alert("Route adjusted", "We adjusted your route due to reported road issues.");
                    const alternativeRoute = await findAlternativeRoute(startLocation, endLocation,repairedRoads);
                    
                            if (alternativeRoute && alternativeRoute.length > 0) {  
                              console.log("Alternative route:", alternativeRoute);
                              setRoute([]); 
                              setTimeout(() => { setRoute(alternativeRoute)}, 50);
                            } else {
                              console.warn("No alternative route found.");
                            }
                          } else {
                            console.log("No repair on route. Using default route.");
                            setRoute(decodedCoordinates);
                          }
                    } else {
                    Alert.alert("No route found",'No route found from the current location to the destination.');
                  }
          } catch (error) {
            Alert.alert("Something went wrong",'Error fetching route. Please try again later.');
          }
    }

  
  function checkForRepairedRoads(routeCoordinates, repairedRoads) {
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const segmentStart = routeCoordinates[i];
      const segmentEnd = routeCoordinates[i + 1];
      
      for (let repairedRoad of repairedRoads) {
        if (isSegmentNearRepair(segmentStart, segmentEnd, repairedRoad)) {
          return true; 
        }
      }

    }
    return false; 
  }
  
  function isSegmentNearRepair(segmentStart, segmentEnd, repairedRoad) {
    const repairThreshold = 20;

    if (!Array.isArray(repairedRoad)) {
      repairedRoad = [repairedRoad];
    }
  
    return repairedRoad.some(repairPoint => {
      const distanceStart = geolibGetDistance(segmentStart, repairPoint);
      const distanceEnd = geolibGetDistance(segmentEnd, repairPoint);
      return distanceStart < repairThreshold || distanceEnd < repairThreshold;
    });
  }
  
  
  
  
  async function findAlternativeRoute(startLocation, endLocation) {
    try {
      const defectNode = await getUnpassableRoadCoordinates();
      setRoute([]);
      const data = await routingFunction.requestReroute(startLocation, endLocation,defectNode);
      
      if (!data || data.length === 0) {
        console.warn("No geometry or routes found in the response:", data);
        return { mainRoute: null, alternatives: [] };
      }
  
      const encodedPolyline = data;
  
      if (!encodedPolyline || typeof encodedPolyline !== "string") {
        console.warn("No encoded polyline found:", encodedPolyline);
        return [];
      }
  
      console.log("Encoded polyline:", encodedPolyline);

      const decodedCoordinates = polyline.decode(encodedPolyline).map(coord => ({
        latitude: coord[0],
        longitude: coord[1]
      }));
  
      return decodedCoordinates;
    } catch (error) {
      console.error("Error in findAlternativeRoute:", error);
      return [];
    }
  }
  
  

    async function getUnpassableRoadCoordinates() {
      const coordinates = reportData
        .filter(report => {
          if (report.type === 'vehicle collision') {
            return report.passable === 'false';
          } else if (report.type === 'road defects') {  
            return report.passable === 'false';
          }
          return false; 
        })
        .map(report => ({
          latitude: parseFloat(report.latitude),
          longitude: parseFloat(report.longitude),
        }));
      console.log("Coordinates array:", coordinates);
      return coordinates;
    }

  
  
  
function handleCloseModal(){
  setShowModal(false)
}

async function handleOpenModal(){
 loadSettings();
  if(!isReroutingEnabled){
    Alert.alert("Smart Rerouting is disabled", `To use this feature. Please enable smart routing in the settings. ${isReroutingEnabled}`);
    return;
  }

  if(!isLocationAvailable){
    Alert.alert("Location Services Disabled", "Please enable location services in your settings.");
    return;
  }
  
  if(!isSmartTraveling){
    setIsSmartTraveling(true);
    setShowModal(true)
  }else{
    setIsSmartTraveling(false);
    setSelectedLocation(null);
    setRoute([]); 
  }
}

const onMapPress = (e) => {
  if (!isSmartTraveling) return;
  const { latitude, longitude } = e.nativeEvent.coordinate;
  setSelectedLocation({ latitude, longitude });
  let destinationLocation = { latitude, longitude };
  handleRerouting(destinationLocation);
};

  return (
    <SafeAreaView style={styles.container}>

      {ModalList.routingPromptModal(showModal, handleCloseModal)}

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
        <MapView ref={mapRef} style={styles.map} 
          initialRegion={initialRegion || {
            latitude: 7.9266,
            longitude: 125.0876,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={onMapPress}
        >
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

          {!isSmartTraveling && reportData.map((report, index) => (
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


  {selectedLocation && (  <Marker coordinate={selectedLocation} title="Selected Location" description="You selected this location" pinColor="green" />)}

        {route.length > 0 && (
            <Polyline  coordinates={route} strokeColor="blue" strokeWidth={4} />
          )}
        </MapView>
      )}

      {/* Status Message */}
      {isSmartTraveling && <Text style={styles.statusMessage}>You are now smart traveling</Text>}
  
  
  
    


      {/* Button Positioned Over the Map */}
      <TouchableOpacity style={styles.button} onPress={() => handleOpenModal()}>
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
  },  geotagButton: {
    position: 'absolute',
    bottom: 80, // Adjust position above the rerouting button
    left: '5%',
    right: '5%',
    backgroundColor: '#4CAF50', // Green color for geotagging
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonText: { color: '#fff', fontSize: 16 },
});
