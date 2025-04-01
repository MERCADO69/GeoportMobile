import * as Location from "expo-location";
import { useState, useEffect } from "react";

export default function useLiveLocation(){
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
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                }
            );
        })();

        return () => {
            if (subscription) {
                subscription.remove(); 
            }
        };
    }, []);

    return location;
}
