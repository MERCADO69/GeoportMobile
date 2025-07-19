import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import FetchReportedReports from "../../Functions/fetchReportedReports";
import DisplayReportImage from "../modals/displayReport";

export default function History() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [refreshing, setRefreshing] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const response = await FetchReportedReports();
      if (response?.data?.data) {
        const allReports = Object.values(response.data.data);
        const sortedReports = allReports.sort((a, b) => 
          new Date(b.DateAndTime) - new Date(a.DateAndTime)
        );
        setReports(sortedReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    if (filter === "All") return true;
    return report.status === filter;
  });

  const solvedCount = reports.filter(r => r.status === "Solved").length;
  const pendingCount = reports.filter(r => r.status === "Pending").length;

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

  function formatTime(dateString) {
    const date = new Date(dateString + "Z");
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function simplifyReportType(type) {
    if (type.includes("Pothole") || type.includes("Road Damage")) return "Road Defects";
    if (type.includes("Collision") || type.includes("Accident")) return "Vehicle Collision";
    return type;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#FF7F50"]}
          />
        }
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF7F50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports History</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>View and track all reported issues</Text>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["All", "Pending", "Solved"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, filter === tab && styles.activeTab]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.filterText, filter === tab && styles.activeText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Total Reports {reports.length}</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Solved</Text>
              <Text style={styles.summaryCardNumber}>{solvedCount}</Text>
              <Text style={styles.summaryCardSubtitle}>
                {reports.length > 0 ? Math.round((solvedCount / reports.length) * 100) : 0}% Completion
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Pending</Text>
              <Text style={styles.summaryCardNumber}>{pendingCount}</Text>
            </View>
          </View>
        </View>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reportCard}
              onPress={() => {
                setSelectedReport(report);
                setIsModalVisible(true);
              }}
            >
              <View style={styles.reportHeader}>
                <Text style={styles.reportType}>
                  {simplifyReportType(report.TypeOfReport)}
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={[
                    styles.statusText,
                    report.status === "Solved" && styles.solvedStatus,
                    report.status === "In Progress" && styles.inProgressStatus
                  ]}>
                    {report.status}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.reportLocation}>
                {report.location?.address || `${report.location?.latitude}, ${report.location?.longitude}`}
              </Text>
              
              <View style={styles.reportFooter}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={16} color="#FF7F50" />
                  <Text style={styles.timeText}>
                    {getTimePassed(report.DateAndTime)}
                  </Text>
                </View>
                <Text style={styles.reportTime}>
                  {formatTime(report.DateAndTime)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              No {filter.toLowerCase()} reports found
            </Text>
          </View>
        )}

        <DisplayReportImage
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          data={selectedReport}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  filterContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF7F50",
  },
  filterText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#666",
  },
  activeText: {
    color: "#FF7F50",
    fontFamily: "Poppins_600SemiBold",
  },
  summaryContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  summaryCardTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#666",
    marginBottom: 5,
  },
  summaryCardNumber: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 5,
  },
  summaryCardSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#666",
  },
  reportCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reportType: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#FFE8D6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#D35400",
  },
  solvedStatus: {
    color: "#27AE60",
  },
  inProgressStatus: {
    color: "#3498DB",
  },
  reportLocation: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginBottom: 15,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#FF7F50",
    marginLeft: 5,
  },
  reportTime: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#999",
    marginTop: 10,
  },
});