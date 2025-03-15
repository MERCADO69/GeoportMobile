import * as Location from "expo-location";

export default async function GetReverseLocation(latitude,longitude){
    try{
        const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode) {
            return {
                barangay: geocode.district || "Loading",
                city: geocode.city || "Loading",
                region: geocode.region || "Loading",
                country: geocode.country || "Loading",
            };
        } else {
            return { barangay: "Not found", city: "Not found" };
        }
    }catch(error){
        return { barangay: "Error", city: "Error" };
    }
}
