import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";


const developers = [
  {
    name: "Gerome Aljas",
    role: "Project Manager",
    image: require("../../assets/gerome.png"),
  },
  {
    name: "Mart Ervin Dahao",
    role: "Lead Developer",
    image: require("../../assets/mart2.png"),
  },
  {
    name: "Davy Jones Mercado",
    role: "UI/UX Designer / Frontend",
    image: require("../../assets/davy.jpg"),
  },
  {
    name: "John Symaiah Dagooc",
    role: "AI Specialist",
      image: require("../../assets/dagooc.jpg"),
  },
];

export default function AboutDevelopersComponent() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Credits</Text>
      {developers.map((dev, index) => (
        <View key={index} style={styles.card}>
          <Image source={dev.image} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{dev.name}</Text>
            <Text style={styles.role}>{dev.role}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.footer}>
        © 2025 Geoport Malaybalay. All Rights Reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: "#222",
  },
  role: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#777",
    marginTop: 2,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#999",
    textAlign: "center",
  },
});
