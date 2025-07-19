import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DisplayReportImage({ isVisible, onClose, data }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [isVisible]);

  const formattedDate = data?.DateAndTime
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(data.DateAndTime))
    : "";

  return (
    <Modal transparent visible={isVisible} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>📍 Report Details</Text>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: data?.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.label}>
              <Text style={styles.bold}>Status:</Text> {data?.status || "N/A"}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Location:</Text>{" "}
              {data?.location?.longitude}, {data?.location?.latitude}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Date:</Text> {formattedDate || "N/A"}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.88,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
    padding: 6,
    zIndex: 2,
  },
  closeText: {
    fontSize: 20,
    color: "#999",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 14,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1.4,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailSection: {
    width: "100%",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  bold: {
    fontWeight: "600",
    color: "#222",
  },
});
