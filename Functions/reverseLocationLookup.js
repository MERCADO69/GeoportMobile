import * as Location from "expo-location";

export default async function GetReverseLocation(latitude, longitude) {
  try {
    // Ensure they are numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    if (geocode) {
      return {
        barangay: geocode.district || " ",
        city: geocode.city || " ",
        region: geocode.region || " ",
        country: geocode.country || " ",
      };
    } else {
      return { barangay: "Not found", city: "Not found" };
    }
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return { barangay: "Error", city: "Error" };
  }
}
