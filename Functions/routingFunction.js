import axios from "axios";
import {SERVER_IP,APIkEY} from "@env"

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
              console.log('Route data:', response.data.routes[0]);
                return response.data
              } else {
                console.error('No route data available');
              }
        }catch(error){
            console.error("Error fetching route data: ", error);
        }
    }

    
    async requestReroute(currentLocation, destinationLocation, defectNode) {
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
      
      
      if (!currentLocation || !destinationLocation) {
        throw new Error('Both current and destination locations are required');
      }
    
      const coordinates = [
        [currentLocation.longitude, currentLocation.latitude],
        [destinationLocation.longitude, destinationLocation.latitude]
      ];
    
      let requestBody = {
        coordinates: coordinates,
        alternative_routes: {
          target_count: 2, 
          weight_factor: 1.8,
          share_factor: 0.2  
        },
        instructions: false // Reduces response size if you don't need turn-by-turn
      };
    
      if (defectNode && Array.isArray(defectNode) && defectNode.length === 2) {
        const [defectLatitude, defectLongitude] = defectNode;
        
        if (!isNaN(defectLatitude) && !isNaN(defectLongitude)) {
        
          const bufferSize = 0.003;
          requestBody.options = {
            avoid_polygons: {
              type: "Polygon",
              coordinates: [[
                [defectLongitude - bufferSize, defectLatitude - bufferSize],
                [defectLongitude + bufferSize, defectLatitude - bufferSize],
                [defectLongitude + bufferSize, defectLatitude + bufferSize],
                [defectLongitude - bufferSize, defectLatitude + bufferSize],
                [defectLongitude - bufferSize, defectLatitude - bufferSize]
              ]]
            }
          };
        } else {
          console.warn('Invalid defectNode values:', defectNode);
        }
      }
    
      try {
        const response = await axios.post(url, requestBody, {
          headers: {
            'Authorization': APIkEY,
            'Content-Type': 'application/json',
          },
          timeout: 5000 
        });
    
        if (!response.data?.routes?.length) {
          throw new Error('No routes found in response');
        }
    
        const mainRoute = {
          distance: response.data.routes[0].summary.distance,
          duration: response.data.routes[0].summary.duration,
          geometry: response.data.routes[0].geometry
        };
    
        const alternatives = response.data.routes.slice(1).map(route => ({
          distance: route.summary.distance,
          duration: route.summary.duration,
          geometry: route.geometry
        }));
    
        if (alternatives.length > 0) {
        return alternatives.geometry;  
        } else {
          console.log('No alternative routes available, returning main route', mainRoute.geometry);
          return mainRoute.geometry;  
        }
      } catch (error) {
        console.error('Rerouting failed:', error.response?.data || error.message);
        throw error;
      }
    }


    storeCurrentLocation(currentLocation, destinationLocation) {
        const start = currentLocation;
        const end = destinationLocation;
        return { start, end };
    }    
}
