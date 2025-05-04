import axios from "axios";
import {SERVER_IP,APIkEY,mapbox_secret,auto_generated_mapbox_key} from "@env"

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
      console.log('====================================REROUTING==============================');
      const url = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
      console.log('defect node is ', defectNode);
    
      if (!currentLocation || !destinationLocation) {
        throw new Error('Both current and destination locations are required');
      }
    
      const coordinates = [
        `${currentLocation.longitude},${currentLocation.latitude}`,
        `${destinationLocation.longitude},${destinationLocation.latitude}`
      ].join(';');
    
      let excludeParam = '';
      let apiUrl = '';
      if (defectNode && Array.isArray(defectNode) && defectNode.length > 0) {
        const exclusionPoints = defectNode
          .filter(node => !isNaN(node.latitude) && !isNaN(node.longitude))
          .map(node =>
            `point(${node.longitude.toFixed(6)}%20${node.latitude.toFixed(6)})`
          );
    
        if (exclusionPoints.length > 0) {
          excludeParam = `exclude=${exclusionPoints.join(',')}`;
        }
      }
    
   
    
      if (excludeParam) {
        apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?alternatives=true&${excludeParam}&access_token=${auto_generated_mapbox_key}`;
      }
    
      try {
        console.log('the request reroute api url is ', apiUrl);
    
        // Send the request to Mapbox API
        const response = await axios.get(apiUrl, {
          timeout: 5000
        });
    
        // Check if the response contains valid routes
        if (!response.data?.routes?.length) {
          throw new Error('No routes found in response');
        }
    
        const mainRoute = {
          distance: response.data.routes[0].distance,
          duration: response.data.routes[0].duration,
          geometry: response.data.routes[0].geometry
        };
    
        // Process alternative routes if available
        const alternatives = response.data.routes.slice(1).map(route => ({
          distance: route.distance,
          duration: route.duration,
          geometry: route.geometry
        }));
    
        if (alternatives.length > 0) {
          return alternatives.map(route => route.geometry);
        } else {
          console.log('No alternative routes available, returning main route');
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
