import * as Location from "expo-location";
import { useState, useEffect } from "react";

export default function useLiveLocation() {
    const [location, setLocation] = useState(null);

    useEffect( () => {
        let subscription;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Required", "Please allow access to your location.");
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest, // High precision
                    timeInterval: 1000, // Update every 1 second
                    distanceInterval: 1, // Update when user moves 1 meter
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                    console.log("Updated Location:", newLocation.coords);
                }
            );
        })();

        return () => {
            if (subscription) {
                subscription.remove(); // Stop tracking on unmount
            }
        };
    }, []);

    return location;
}
