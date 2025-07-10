import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  StatusBar,
  Alert,
} from "react-native";
import Mapbox from "@rnmapbox/maps";

import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../modals/loadingModal";
import useLiveLocation from "../../Functions/getCurrentLocation";
import GetUserData from "../../Functions/getUserData";
import fetchReports from "../../Functions/fetchReports";
import { mapbox_secret } from "@env";
import { requestRoute, requestReroute } from "../../Functions/routingFunction";
import ModalList from "../modals/modalMaker";
import { getDistance as geolibGetDistance } from "geolib";
import LoadingModal from "../modals/loadingModal"
export default function MapsScreen() {
  Mapbox.setAccessToken(mapbox_secret);
  const mapRef = useRef(null);
  const [isSmartTraveling, setIsSmartTraveling] = useState(false);
  const [reportData, setReportData] = useState([]);
  const location = useLiveLocation();
  const [status, setStatus] = useState("");
  const [regionAvailable, setRegionAvailable] = useState(false);
  const [route, setRoute] = useState([]);
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [initialRegion, setInitialRegion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const prevReportData = useRef([]);
  const [isReroutingEnabled, setIsReroutingEnabled] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadSettings = async () => {
    try {
      const savedSmartRerouting = await AsyncStorage.getItem("userSettings");
      if (savedSmartRerouting !== null) {
        const parsedSettings = JSON.parse(savedSmartRerouting);
        const isEnabled = !!parsedSettings.smartRerouting;
        const isLocationEnabled = !!parsedSettings.locationServices;
        setIsReroutingEnabled(isEnabled);
        setIsLocationAvailable(isLocationEnabled);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setRegionAvailable(true);
        if (location && !initialRegion) {
          setRegionAvailable(false);
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
      const isChanged =
        JSON.stringify(prevReportData.current) !== JSON.stringify(reportData);

      if (isChanged) {
        handlerouting(selectedLocation);
        prevReportData.current = reportData;
      }
    }
  }, [reportData]);

  async function handlerouting(destinationLocation) {
    let startLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    let endLocation = {
      latitude: destinationLocation.latitude,
      longitude: destinationLocation.longitude,
    };
    try {
      let repaired_roads = await getUnpassableRoadCoordinates();
      setLoading(true);
      const { decoded_data, latLngCoordinates, duration, distance } =
        await requestRoute(startLocation, endLocation);

      let isReroutingNeeded = checkForRepairedRoads(
        latLngCoordinates,
        repaired_roads
      );

      if (isReroutingNeeded) {
        Alert.alert(
          "Road Repair Detected",
          "A road repair has been detected along your route. Finding an alternative route..."
        );
        await findAlternativeRoute(startLocation, endLocation);
        return;
      }
      const distanceKm = (distance / 1000).toFixed(2);
      const durationHour = formatDuration(duration);
      setDistance(distanceKm);
      setDuration(durationHour);
      setRoute(latLngCoordinates);
      Alert.alert(
        "Route Found",
        `Your route has been successfully found.\n\nDistance: ${distanceKm} km\nDuration: ${durationHour}`
      );
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Error fetching route. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) return `${hours} h ${minutes} m`;
    if (hours > 0 && minutes === 0) return `${hours} h`;
    return `${minutes} m`;
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

    return repairedRoad.some((repairPoint) => {
      const distanceStart = geolibGetDistance(segmentStart, repairPoint);
      const distanceEnd = geolibGetDistance(segmentEnd, repairPoint);
      return distanceStart < repairThreshold || distanceEnd < repairThreshold;
    });
  }

  async function findAlternativeRoute(startLocation, endLocation) {
    try {
      const defectNode = await getUnpassableRoadCoordinates();
      setRoute("");
      setLoading(true);
      const { geojsonFeature, latLngCoordinates, duration, distance } =
        await requestReroute(startLocation, endLocation, defectNode);

      const distanceKm = (distance / 1000).toFixed(2);
      const durationHour = formatDuration(duration);
      setDistance(distanceKm);
      setDuration(durationHour);
      setRoute(latLngCoordinates);
      Alert.alert(
        "Route Found",
        "Your route has been successfully found. \n\n Distance: " +
        distanceKm +
        " km \n Duration: " +
        durationHour +
        " minutes"
      );
    } catch (error) {
      console.error("Error in findAlternativeRoute:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function getUnpassableRoadCoordinates() {
    const coordinates = reportData
      .filter((report) => {
        return (
          ["vehicle collision", "road defects"].includes(report.type) &&
          report.passable === "false"
        );
      })
      .map((report) => ({
        latitude: parseFloat(report.latitude),
        longitude: parseFloat(report.longitude),
      }));
    console.log("Coordinates array:", coordinates);
    return coordinates;
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleOpenModal() {
    loadSettings();
    if (!isReroutingEnabled) {
      Alert.alert(
        "Smart Rerouting is disabled",
        `To use this feature. Please enable smart routing in the settings. ${isReroutingEnabled}`
      );
      return;
    }

    if (!isLocationAvailable) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable location services in your settings."
      );
      return;
    }

    if (!isSmartTraveling) {
      setIsSmartTraveling(true);
      setShowModal(true);
    } else {
      setIsSmartTraveling(false);
      setSelectedLocation(null);
      setRoute([]);
    }
  }

  const onMapPress = (e) => {
    if (!isSmartTraveling) return;
    const [longitude, latitude] = e.geometry.coordinates;
    const selected = { latitude, longitude };
    setSelectedLocation(selected);
    handlerouting(selected);
  };

  return (
    <SafeAreaView style={styles.container}>
      {ModalList.routingPromptModal(showModal, handleCloseModal)}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: "yellow" }]}
          />
          <Text style={styles.legendLabel}>Road Defects</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: "red" }]} />
          <Text style={styles.legendLabel}>Vehicle Collision</Text>
        </View>
      </View>
      <LoadingModal open={loading} />
      {isSmartTraveling && route.length > 0 && (
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeInfoText}>Distance: {distance} km</Text>
          <Text style={styles.routeInfoText}>Duration: {duration}</Text>
        </View>
      )}
      {initialRegion ?(<LoadingModal open={regionAvailable}/>) : (
        <Mapbox.MapView
          logoEnabled={false}
          attributionEnabled={false}
          ref={mapRef}
          style={styles.map}
          onPress={onMapPress}
        >
          <Mapbox.Camera
            zoomLevel={11}
            centerCoordinate={[
              initialRegion?.longitude ?? 125.118091,
              initialRegion?.latitude ?? 8.163884,
            ]}
          />

          {!isSmartTraveling &&
            reportData.map((report, index) => {
              const markerColor =
                report.type.toLowerCase() === "road defects" ? "red" : "yellow";

              return (
                <Mapbox.PointAnnotation
                  key={`report-${index}`}
                  id={`report-${index}`}
                  coordinate={[
                    parseFloat(report.longitude),
                    parseFloat(report.latitude),
                  ]}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: markerColor,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  />
                </Mapbox.PointAnnotation>
              );
            })}

          {selectedLocation && (
            <Mapbox.PointAnnotation
              id="selected-location"
              coordinate={[
                selectedLocation.longitude,
                selectedLocation.latitude,
              ]}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "green",
                  borderRadius: 15,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              />
            </Mapbox.PointAnnotation>
          )}

          {isSmartTraveling && (
            <Mapbox.PointAnnotation
              id="user-location"
              coordinate={[location.longitude, location.latitude]}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "orange",
                  borderRadius: 15,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              />
            </Mapbox.PointAnnotation>
          )}

          {/* Route Line */}
          {isSmartTraveling && route.length > 0 && (
            <Mapbox.ShapeSource
              id="routeSource"
              shape={{
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: route.map((coord) => [
                    coord.longitude,
                    coord.latitude,
                  ]),
                },
              }}
            >
              <Mapbox.LineLayer
                id="routeLineLayer"
                style={{
                  lineColor: "blue",
                  lineWidth: 4,
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      )}
      {isSmartTraveling && (
        <Text style={styles.statusMessage}>You are now smart traveling</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={handleOpenModal}
      >
        <Text style={styles.buttonText}>
          {isSmartTraveling
            ? "Disable Smart Rerouting"
            : "Enable Smart Rerouting"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  searchInput: { flex: 1, height: 50, fontSize: 14, color: "#000" },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  statusMessage: {
    color: "green",
    fontSize: 14,
    textAlign: "center",
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 80,
    left: 10,
    right: 10,
  },

  button: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    right: "5%",
    backgroundColor: "#FA812F",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  geotagButton: {
    position: "absolute",
    bottom: 80,
    left: "5%",
    right: "5%",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16 },
  legendContainer: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 9999,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  legendLabel: {
    fontSize: 14,
    color: "#333",
  },
  routeInfoContainer: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 80 : 100,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    padding: 10,
    width: "50%",
    alignItems: "start",
    justifyContent: "start",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 9998,
  },

  routeInfoText: {
    fontSize: 14,
    fontWeight: 400,
    color: "#333",
  },
});
