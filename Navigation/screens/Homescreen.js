import  { useState,useEffect,useCallback } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { Poppins_500Medium, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, TextInput, ScrollView,RefreshControl} from 'react-native';
import { useFonts } from '@expo-google-fonts/poppins';
import SearchIcon from '../../Images/search.svg'; 
import GetUserData from "../../Functions/getUserData";
import FetchReportedReports from "../../Functions/fetchReportedReports"
import useLiveLocation from '../../Functions/getCurrentLocation';
import { useNavigation } from '@react-navigation/native';
import DisplayReportImage from "../modals/displayReport"
import savePushNotificationToken from "../../Functions/savePushNotificationToken"

export default function Homescreen() {
     const [fontsLoaded] = useFonts({  Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium,});
     const [searchText, setSearchText] = useState('');
     const [data, setUserData] = useState({});
     const location = useLiveLocation();
     const [address,setAddress] = useState('')
     const [total,TotalReports] = useState('')
     const [totalSolved,setTotalSolvedReports] = useState('')
     const [percentSolved,setPercentSolved] = useState('')
     const [lastdateReported,setLastReportedDate] = useState('')
     const [listofReports,setListReports] = useState('')
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [selectedImage, setSelectedImage] = useState(null); 
     const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
  

  useEffect(() => {
    async function FetchAllData(){
        await Promise.all([
          fetchedData(),
          fetch()
        ])
    }  
  FetchAllData()
 },[])


    async function fetchedData(){
      const fetch = await GetUserData()
      if(fetch){
        setUserData(fetch.data)
      }
    }
 
  
  
  
      async function fetch(){
        const reportedReports = await FetchReportedReports();
          if(reportedReports){
            const reports = reportedReports.data?.data || {};
            setListReports(reports)
            const totalReports = Object.keys(reports).length;
            const solvedReports = Object.values(reports).filter(report => report.status === "Solved");
            const completionPercentage = totalReports > 0 ? Math.round((solvedReports.length / totalReports) * 100) : 0;
            setTotalSolvedReports(solvedReports.length)
            setPercentSolved(completionPercentage)
            const dates = Object.values(reports) .map(report => new Date(report.DateAndTime+ "Z")) .sort((a, b) => b - a); 
            
            if (dates.length > 0) {
              const lastReportedDate = dates[0];
              const currentDate = new Date();
              const timeDifference = currentDate - lastReportedDate;
              const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
              const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); 
              TotalReports(totalReports)
              if(daysDifference != 0){
              setLastReportedDate('Last ' +daysDifference+ " ago")}
              else{
                setLastReportedDate('Last ' +hoursDifference+ " hours ago")
              }
            } else {
              console.log("No reports found.");
            }
          }
      }

    

    function getTimePassed(dateString) {
   
      const reportDate = new Date(dateString + "Z");
      const currentDate = new Date();
   
      // Convert both to UTC time
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
          try{
          await Promise.all([
                fetchedData(),
              fetch()
        ])
      }catch(error){
          Alert.alert("Error", "Unable to refresh data. Please try again later.");
        }finally{
          setRefreshing(false);
        }
    },[])



  return (
    <SafeAreaView style={styles.container}   >
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing}
           onRefresh={onRefresh} />} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.topBox} />

    <SafeAreaView>
      <Text style={[styles.Welcomeuser]}>Welcome back {data.name}!</Text>
      <Text style={[styles.Welcomelocation]}>{location?.latitude + " " + location?.longitude}</Text>
      <Ionicons name="location-outline" size={20} color="#fff" style={styles.locationIcon} />
    </SafeAreaView>

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
          placeholder="Search"
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
          <Text style={[styles.number, styles.cardText]}>{total || 0}</Text>
          <Text style={[styles.subtitle, styles.cardText]}>{lastdateReported}</Text>
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
          <Text style={[styles.number, styles.cardText]}>{totalSolved || 0}</Text>
          <Text style={[styles.subtitle, styles.cardText]}>{percentSolved + '% Completion'}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Section */}
      <View>
        <Text style={[styles.Quickie]}>Quick Action</Text>
      </View>


      <DisplayReportImage  isVisible={isModalVisible}  onClose={() => setIsModalVisible(false)} imageUrl={selectedImage}/>

      {/* New Report Button with Icon */}
      <TouchableOpacity style={styles.Quickbutton} onPress={() => navigation.navigate('Camera')}>
        <View style={styles.buttonContent}>
          <Ionicons name="camera" size={40} color="#fff" style={styles.icon} />
          <Text style={styles.QuickbuttonText}>New Report</Text>
        </View>
        <Text style={styles.submitText}>Submit an Issue</Text>
      </TouchableOpacity>

      <View>
        <Text style={[styles.Recent]}>Recent Activity</Text>
      </View>

      <View style={styles.recentActivityContainer}>

      {total && Object.keys(listofReports).length > 0 ? (
        Object.values(listofReports).map((report, index) => {
          
          return (
            <TouchableOpacity key={index} style={[styles.card, styles.cardNewType]} onPress={() => {setSelectedImage(report.image); setIsModalVisible(true)}}>
              <View style={styles.cardNewTypeContent}>
                <Ionicons name="warning" size={30} color="#FA4032" style={styles.iconLeft} />
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.title, { color: '#FA4032' }]}>{report.TypeOfReport}</Text>
                  <Text style={[styles.subtitle, styles.cardText]}>{report.status}</Text>
                  <Text style={[styles.location, styles.cardText]}>
                    {report?.location.latitude + " " + report?.location.longitude|| "Fetching location..."}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Ionicons name="time" size={18} color="#FA4032" style={styles.iconRight} />
                <Text style={[styles.timeAgo, styles.cardText]}>{getTimePassed(report.DateAndTime)}</Text>
              </View>
            </TouchableOpacity>
                  );
                })
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
    top: -160, 
    right: 20, 
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
    marginTop: 10, 
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
    backgroundColor: '#FEFEFE'
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
  },
  norecent: {
    fontFamily: 'Poppins_400Regular',
    paddingLeft: 24,
    marginStart:15,
    fontSize: 14,
    color: '#555', 
  },
  
});
