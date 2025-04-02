import axios from "axios";
import {SERVER_IP} from "@env"

export default class RoutingFunction{
  async requestRoute(currentLocation,destinationLocation){
    console.log('running requestRoute')
    console.log(destinationLocation)
        let location = this.storeCurrentLocation(currentLocation, destinationLocation)
        try{
            let startLatitude = location.start?.latitude;
            let startLongitude = location.start?.longitude;
            let endLatitude = location.end?.latitude;
            let endLongitude = location.end?.longitude;

            let url = `http://${SERVER_IP}:5000/route/v1/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?overview=full`;
            const response = await axios.get(url, { timeout: 30000 })

            if (response.data && response.data.routes) {
               console.log('the response data is',response.data)
                return response.data
              } else {
                console.error('No route data available');
              }
        }catch(error){
            console.error("Error fetching route data: ", error);
        }
    }
    storeCurrentLocation(currentLocation, destinationLocation) {
        const start = currentLocation;
        const end = destinationLocation;
        return { start, end };
    }    
}
