import { Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import React from 'react';
import  { useState,useEffect ,useCallback} from 'react';
import { View, Text, StyleSheet, SafeAreaView,ScrollView, TouchableOpacity, RefreshControl,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GetUserData from "../../Functions/getUserData";
import { auth } from "../../firebaseConfig";
import GetReverseLocation from "../../Functions/reverseLocationLookup"
import useLiveLocation from '../../Functions/getCurrentLocation';
import FetchReportedReports from "../../Functions/fetchReportedReports"


export default function Morescreen({ navigation }) {
   const user = auth.currentUser;
   const [data, setUserData] = useState({});
   const location = useLiveLocation();
   const [address,setAddress] = useState('')
   const [status,setStatus] = useState()
   const [reportTotal,setReportTotal] = useState(0)
   const [solvedTotal,setSolvedTotal] = useState(0)
   const [refreshing, setRefreshing] = useState(false);
   
  useEffect(()=>{
    if(data.status){
        if(data.status != 'verified'){
            setStatus('Unverified Resident')
            return
        }else{
          setStatus('Verified Resident')
        }
    }
  })



    useEffect(()=>{
      async function fetchedData(){
        const fetch = await GetUserData()
        if(fetch){
          setUserData(fetch.data)
        }
      }
      fetchedData()
    },[])

  
    useEffect(()=>{
     async function reverse() {
      if(location){
        const location_data = await GetReverseLocation(location.latitude,location.longitude)
        setAddress(location_data);
      }
     }
     reverse()
    },[location])


    useEffect(()=>{
      console.log('running')
        async function fetchReports() {
          const result =  await FetchReportedReports()
          if(result && result.data){
            let data = result.data?.data || {}
            const total = Object.keys(data).length;
            setReportTotal(total)
            const solvedReports = Object.values(data).filter(report => report.status === "Solved");
            setSolvedTotal(solvedReports.length)
          }
        }
        fetchReports()
    },[])

 

    const onRefresh = useCallback(async () => {
       setRefreshing(true);
       await fetchData();
       await fetchReports();
       await reverse();
       setRefreshing(false);
    }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
         >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* Add your profile image inside this container later */}
        </View>
        <Text style={styles.Username}>{data.name || 'Loading ...'}</Text>
        <Text style={[styles.Usergmail]}>{data.email || 'Loading ...'}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="gray" />
          <Text style={styles.locationText}>{address.city + ', '+ address.region + ', ' + address.country || 'Fetching location'}</Text>
        </View>
      </View>

      <View style={styles.parentCard}>
        {/* Total Reports Card */}
        <TouchableOpacity style={[styles.card, styles.cardOrange]}>
          <View style={styles.cardContent}>
            <Ionicons name="bar-chart" size={24} color="#D35400" style={styles.icon} />
            <Text style={[styles.number, styles.orangeText]}>{reportTotal}</Text>
          </View>
          <Text style={[styles.cardTitle, styles.orangeText]}>Total Reports</Text>
        </TouchableOpacity>

        {/* Total Resolved Card */}
        <TouchableOpacity style={[styles.card, styles.cardGreen]}>
          <View style={styles.cardContent}>
            <Ionicons name="calendar" size={24} color="#34A853" style={styles.icon} />
            <Text style={[styles.number, styles.greenText]}>{solvedTotal}</Text>
          </View>
          <Text style={[styles.cardTitle, styles.greenText]}>Total Resolved</Text>
        </TouchableOpacity>
      </View>

      {/* Verified Resident Card */}
      <TouchableOpacity
          style={styles.verifiedCard}
          onPress={() => {
            if (status === "Unverified Resident") {
              navigation.navigate("VerifyAccount");
            } else {
              Alert.alert("Verified Resident", "You are a verified resident!");
            }
          }}
        >
  <View style={styles.verifiedContent}>
    {status === "Verified Resident" ? (
      <>
        <Ionicons name="checkmark-circle" size={30} color="#34A853" style={styles.icon} />
        <Text style={styles.verifiedText}>{status}</Text>
      </>
    ) : status === "Unverified Resident" ? (
      <>
        <Ionicons name="close-circle" size={30} color="#E74C3C" style={styles.icon} />
        <Text style={[styles.verifiedText, { color: "#E74C3C" }]}>{status}</Text>
      </>
    ) : (
      <Text style={styles.verifiedText}>Loading...</Text>
    )}
  </View>
</TouchableOpacity>


      <View style={styles.menuContainer}>
        {/* Member Since */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="calendar-outline" size={24} color="#FA812F" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Member Since</Text>
              <Text style={styles.menuSubtitle}>{user.metadata.creationTime || 'Not yet member'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              "Notifications",
              "Manage your notification preferences",
              [{ text: "OK", onPress: () => console.log("Notifications OK Pressed") }]
            )
          }
        >
          <View style={styles.menuItemContent}>
            <Ionicons name="notifications-outline" size={24} color="#FA812F" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuSubtitle}>Managed Alerts</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              "Settings",
              "Configure your app preferences",
              [{ text: "OK", onPress: () => console.log("Settings OK Pressed") }]
            )
          }
        >
          <View style={styles.menuItemContent}>
            <Ionicons name="settings-outline" size={24} color="#FA812F" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>App preferences</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  profileContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  Username: {
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    fontSize: 13,
    color: 'gray',
    fontFamily: 'Poppins_500Medium',
  },
  parentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  cardOrange: {
    backgroundColor: '#FFE8D6',
  },
  cardGreen: {
    backgroundColor: '#B9EFC8',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  orangeText: {
    color: '#D35400',
  },
  greenText: {
    color: '#34A853',
  },
  verifiedCard: {
    backgroundColor: '#FEFEFE',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: '#000',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: 25,
  },
  verifiedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#000000',
  },
  menuContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginHorizontal: 25,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTextContainer: {
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#000000',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: -1.5,
    fontFamily: 'Poppins_400Regular'
  },
  Usergmail:{
    fontFamily: 'Poppins_400Regular',
    color: '#666666',
    marginTop: -10,
    marginBottom: 10,

  }
});