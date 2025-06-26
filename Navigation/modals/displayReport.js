import Modal from "react-native-modal";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function DisplayReportImage({ isVisible, onClose, data }) {
  const formattedDate = data?.DateAndTime
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(data.DateAndTime))
    : "";

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.2}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modal}
    >
      <View style={styles.card}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color="#555" />
        </TouchableOpacity>

        <Text>Report details</Text>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: data?.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.label}>Status: {data?.status}</Text>
        <Text style={styles.label}>
          Location: {data?.location?.longitude + " " + data?.location?.latitude}
        </Text>
        <Text style={styles.label}>Date: {formattedDate}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    zIndex: 2,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    alignSelf: "start",
    marginTop: 16,
    fontSize: 15,
    color: "#333",
    fontWeight: "400",
  },
});
