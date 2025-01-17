import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const ReportsHistoryScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const reports  = [ 
    { title: 'Collision', location: 'Sayre Highway Purok 2, MC', status: 'In Progress', time: '10 Mins Ago' },
    { title: 'Flooding', location: 'Barangay 3, Malaybalay', status: 'Resolved', time: '1 Hour Ago' },
    { title: 'Pothole', location: 'Main Street, Malaybalay', status: 'Pending', time: '30 Mins Ago' },
    { title: 'Broken Bridge', location: 'Sayre Highway, KM 19', status: 'Pending', time: '2 Hours Ago' },
    { title: 'Roadblock', location: 'Purok 5, Malaybalay', status: 'Resolved', time: '3 Hours Ago' },
  ];

  const filteredReports = reports.filter((report) => {
    const lowercasedSearchQuery = searchQuery.toLowerCase();
    const matchesSearchQuery =
      report.title.toLowerCase().includes(lowercasedSearchQuery) ||
      report.location.toLowerCase().includes(lowercasedSearchQuery);
  
    const matchesStatusFilter =
      selectedFilter === 'All' || report.status === selectedFilter;
  
    return matchesSearchQuery && matchesStatusFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Reports History</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['All', 'Pending', 'Resolved'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Cards */}
      {selectedFilter === 'All' && (
        <View style={styles.statsContainer}>
          {[
            { title: 'Total Reports', count: reports.length, color: '#FFCCBC' },
            { title: 'Resolved', count: reports.filter(r => r.status === 'Resolved').length, color: '#C8E6C9' },
            { title: 'Pending', count: reports.filter(r => r.status === 'Pending').length, color: '#BBDEFB' },
          ].map((stat, index) => (
            <View key={index} style={[styles.statsCard, { backgroundColor: stat.color }]}>
              <Text style={styles.statsTitle}>{stat.title}</Text>
              <Text style={styles.statsCount}>{stat.count}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Reports List */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredReports.map((report, index) => (
          <View key={index} style={styles.reportItem}>
            <Ionicons name="car-outline" size={25} color={report.status === 'In Progress' ? 'orange' : report.status === 'Resolved' ? 'green' : 'red'} />
            <View style={styles.reportDetails}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportLocation}>{report.location}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{report.status}</Text>
            </View>
            <View style={styles.reportTime}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeText}>{report.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Safe Area
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },

  // Header
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  headerText: { 
    fontSize: 16, 
    marginLeft: 16, 
    fontFamily: 'Poppins_600SemiBold', 
    color: '#333' 
  },

  // Search Bar
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f1f1', 
    borderRadius: 8, 
    margin: 16, 
    paddingHorizontal: 10 
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    height: 40, 
    fontSize: 14 
  },

  // Filter
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginHorizontal: 16, 
    fontFamily: 'Poppins_400Regular',
  },
  filterButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    backgroundColor: '#f1f1f1' 
  },
  activeFilter: { 
    backgroundColor: '#FF7043' 
  },
  filterText: { 
    fontSize: 14, 
    color: '#333' 
  },
  activeFilterText: { 
    color: '#fff' 
  },

  // Stats Cards
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 16, 
    marginTop: 10 
  },
  statsCard: { 
    flex: 1, 
    marginHorizontal: 4, 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center' 
  },
  statsTitle: { 
    fontSize: 12, 
    color: '#333' 
  },
  statsCount: { 
    fontSize: 18, 
    fontFamily: 'Poppins_600SemiBold' 
  },

  // Reports
  scrollView: { 
    padding: 16 
  },
  reportItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2, 
    marginBottom: 10 
  },
  reportDetails: { 
    flex: 1, 
    marginLeft: 10 
  },
  reportTitle: { 
    fontSize: 14, 
    fontFamily: 'Poppins_500Medium' 
  },
  reportLocation: { 
    fontSize: 12, 
    color: '#666' 
  },

  // Status Badge
  statusBadge: { 
    backgroundColor: '#7E57C2', 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  statusText: { 
    color: '#fff', 
    fontSize: 12 
  },

  // Time
  reportTime: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  timeText: { 
    fontSize: 12, 
    color: '#666', 
    marginLeft: 4 
  },
});

export default ReportsHistoryScreen;
