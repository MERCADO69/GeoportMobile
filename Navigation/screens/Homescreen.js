import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "react-native-vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList
} from "react-native";
import FetchReportedReports from "../../Functions/fetchReportedReports";
import useLiveLocation from "../../Functions/getCurrentLocation";
import { useNavigation } from "@react-navigation/native";
import DisplayReportImage from "../modals/displayReport";
import {AuthenticatedgetRequest} from "../../Functions/get";
import { auth } from "../../firebaseConfig";
import { FETCH_USER_DATA } from "@env"; 

export default function Homescreen() {

  const [data, setUserData] = useState({});
  const location = useLiveLocation();
  const [address, setAddress] = useState("");
  const [total, TotalReports] = useState("");
  const [totalSolved, setTotalSolvedReports] = useState("");
  const [percentSolved, setPercentSolved] = useState("");
  const [lastdateReported, setLastReportedDate] = useState("");
  const [listofReports, setListReports] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    try{
    async function FetchAllData() {
      await Promise.all([fetchedData(), fetch()]);
    }
    FetchAllData();}catch (error) {
      throw new Error("Error fetching data: " + error.message);
    }
  }, []);

  async function fetchedData() {
                   let user = auth.currentUser;
                    if (!user) {
                        throw error("User not logged in");
                    }
                    let id = user.uid;
                    let params = `${FETCH_USER_DATA}?id=${id}`
                    const {error,message,responseData} = await AuthenticatedgetRequest(params);
                    if(!error){
                          console.log("User data fetched successfully:", responseData);
                          setUserData(responseData.data);
                    }else{
                        throw new Error(message);
                    }
  }

  async function fetch() {
    const reportedReports = await FetchReportedReports();
    if (reportedReports) {
      const reports = reportedReports.data?.data || {};
      setListReports(reports);
      const totalReports = Object.keys(reports).length;
      const solvedReports = Object.values(reports).filter(
        (report) => report.status === "Solved"
      );
      const completionPercentage =
        totalReports > 0
          ? Math.round((solvedReports.length / totalReports) * 100)
          : 0;
      setTotalSolvedReports(solvedReports.length);
      setPercentSolved(completionPercentage);
      const dates = Object.values(reports)
        .map((report) => new Date(report.DateAndTime + "Z"))
        .sort((a, b) => b - a);

      if (dates.length > 0) {
        const lastReportedDate = dates[0];
        const currentDate = new Date();
        const timeDifference = currentDate - lastReportedDate;
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
        TotalReports(totalReports);
        if (daysDifference != 0) {
          setLastReportedDate("Last " + daysDifference + " ago");
        } else {
          setLastReportedDate("Last " + hoursDifference + " hours ago");
        }
      } else {
        console.log("No reports found.");
      }
    }
  }

  function getTimePassed(dateString) {
    const reportDate = new Date(dateString + "Z");
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - reportDate.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchedData(), fetch()]);
    } catch (error) {
      Alert.alert("Error", "Unable to refresh data. Please try again later.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.topBox} />

        <SafeAreaView>
          <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    style={styles.Welcomeuser}
  >
    Welcome back {data.name}!
  </Text>
          <Text style={[styles.Welcomelocation]}>
            {location?.latitude + " " + location?.longitude}
          </Text>
          <Ionicons
            name="location-outline"
            size={20}
            color="#fff"
            style={styles.locationIcon}
          />
        </SafeAreaView>


        <View style={styles.parentCard}>
  <TouchableOpacity 
    style={[styles.card, styles.cardOrange]}
    onPress={() => navigation.navigate("History", { filter: "All" })}
  >
    <View style={styles.cardContent}>
      <Text style={[styles.title, styles.orangeText]}>Reports</Text>
      <Ionicons
        name="bar-chart"
        size={24}
        color="#D35400"
        style={styles.icon}
      />
    </View>
    <Text style={[styles.number, styles.cardText]}>{total || 0}</Text>
    <Text style={[styles.subtitle, styles.cardText]}>
      {lastdateReported}
    </Text>
  </TouchableOpacity>

  {/* Resolved Card */}
  <TouchableOpacity 
    style={[styles.card, styles.cardBlue]}
    onPress={() => navigation.navigate("History", { filter: "Solved" })}
  >
    <View style={styles.cardContent}>
      <Text style={[styles.title, styles.blueText]}>Resolved</Text>
      <Ionicons
        name="calendar"
        size={24}
        color="#3498DB"
        style={styles.icon}
      />
    </View>
    <Text style={[styles.number, styles.cardText]}>
      {totalSolved || 0}
    </Text>
    <Text style={[styles.subtitle, styles.cardText]}>
      {percentSolved + "% Completion"}
    </Text>
  </TouchableOpacity>
</View>

        <View>
          <Text style={[styles.Quickie]}>Quick Action</Text>
        </View>

        <DisplayReportImage
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          data={selectedReport}
        />

        <TouchableOpacity
          style={styles.Quickbutton}
          onPress={() => navigation.navigate("Camera")}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="camera"
              size={40}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.QuickbuttonText}>Report an Incident</Text>
          </View>
          
        </TouchableOpacity>

        <View>
          <View style={styles.recentHeader}>
            <Text style={[styles.Recent]}>Recent Activity</Text>
          </View>
        </View>

        <View style={styles.recentActivityContainer}>
          {total && Object.keys(listofReports).length > 0 ? (
            <>
              {Object.values(listofReports)
                .slice(0, 2)
                .map((report, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.card, styles.cardNewType]}
                      onPress={() => {
                        setSelectedImage(report);
                        setIsModalVisible(true);
                      }}
                    >
                      <View style={styles.cardNewTypeContent}>
                        <Ionicons
                          name="warning"
                          size={30}
                          color="#FA4032"
                          style={styles.iconLeft}
                        />
                        <View style={styles.cardTextContainer}>
                          <Text style={[styles.title, { color: "#FA4032" }]}>
                            {report.TypeOfReport}
                          </Text>
                          <Text style={[styles.subtitle, styles.cardText]}>
                            {report.status}
                          </Text>
                          <Text style={[styles.location, styles.cardText]}>
                            {report?.location.latitude +
                              " " +
                              report?.location.longitude || "Fetching location..."}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardRight}>
                        <Ionicons
                          name="time"
                          size={18}
                          color="#FA4032"
                          style={styles.iconRight}
                        />
                        <Text style={[styles.timeAgo, styles.cardText]}>
                          {getTimePassed(report.DateAndTime)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              
              {Object.keys(listofReports).length > 2 && (
                <TouchableOpacity 
                  style={styles.seeMoreButton}
                  onPress={() => navigation.navigate("History")}
                >
                  <Text style={styles.seeMoreButtonText}>See More Reports</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FF7F50" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.norecent}>No recent activity</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  historyIconContainer: {
    position: "absolute",
    top: 10, 
    left: 20,
    zIndex: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  topBox: {
    backgroundColor: "#FF7F50",
    height: 200,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  parentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -120,
    shadowColor: "#000",
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
    shadowColor: "#FEE2CF",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    fontFamily: "Poppins_400Regular",
  },
  cardOrange: {
    backgroundColor: "#FFE8D6",
  },
  cardBlue: {
    backgroundColor: "#E2EDFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  number: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  orangeText: {
    color: "#D35400",
  },
  blueText: {
    color: "#3498DB",
  },
  Quickie: {
    paddingTop: 20,
    paddingLeft: 25,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  Quickbutton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15, // Adjust vertical padding to make the button more balanced
    width: "90%", // Make button 90% of screen width
    maxWidth: 350, // Optional: you can still limit the width on larger screens
    borderRadius: 10,
    marginTop: 20,
    marginLeft: "5%", // Center the button horizontally on smaller screens
  },

  QuickbuttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Poppins_500Medium",
    paddingLeft: 4,
    paddingTop: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 55,
  },
  submitText: {
    fontSize: 9,
    fontFamily: "Poppins_400Regular",
    marginTop: -14,
    color: "#fff",
    paddingLeft: 65,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  Recent: {
    paddingTop: -5,
    paddingLeft: 1,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  bellContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(245, 245, 245, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,

    position: "absolute",
    top: -160,
    right: 20,
  },

  Welcomeuser: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    position: "absolute",
    marginTop: -170,
    marginLeft: 25,
    color: "#fff",
  },

  locationIcon: {
    marginTop: 12,
    position: "absolute",
    marginTop: -148,
    marginLeft: 22,
  },
  cardNewTypeContent: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    backgroundColor: "#FEFEFE",
  },
  iconLeft: {
    marginRight: 10,
  },
  cardTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flexShrink: 0,
    width: "60%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 200,
    right: 0,
    top: 50,
    marginLeft: "auto",
    marginRight: "auto",
  },

  iconRight: {
    marginRight: 5,
  },

  timeAgo: {
    fontSize: 12,
    color: "#FA4032",
  },
  Welcomelocation: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    position: "absolute",
    marginTop: -148,
    marginLeft: 40,
    color: "#fff",
  },
  recentActivityContainer: {
    backgroundColor: "#FEFEFE",
  },
  norecent: {
    fontFamily: "Poppins_400Regular",
    paddingLeft: 11,
    marginStart: 15,
    fontSize: 14,
    color: "#555",
  },
  TextContainer:{
    zIndex:10
  },
 seeMoreButton: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10, // Reduced padding
  marginHorizontal: 13,
  marginTop: 10,
  marginBottom: -10, // Explicitly set to 0
  borderRadius: 8,
  backgroundColor: '#FFF5F0',
  borderWidth: 1,
  borderColor: '#FF7F50',
},
  seeMoreButtonText: {
    color: '#FF7F50',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginRight: 7,
  },
});