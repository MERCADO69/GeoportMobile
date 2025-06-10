import axios from "axios";
import {
  SERVER_IP,
  APIkEY,
  mapbox_secret,
  auto_generated_mapbox_key,
} from "@env";
import polyline from "@mapbox/polyline"; // Required for decodePolyline to work

export default class RoutingFunction {
  async requestRoute(currentLocation, destinationLocation) {
    console.log("running requestRoute");
    console.log(destinationLocation);
    let location = this.storeCurrentLocation(
      currentLocation,
      destinationLocation
    );
    try {
      let startLatitude = location.start?.latitude;
      let startLongitude = location.start?.longitude;
      let endLatitude = location.end?.latitude;
      let endLongitude = location.end?.longitude;

      let url = `http://${SERVER_IP}:5000/route/v1/driving/${startLongitude},${startLatitude};${endLongitude},${endLatitude}?overview=full`;
      const response = await axios.get(url, { timeout: 30000 });

      if (response.data && response.data.routes) {
        console.log("Route data:", response.data.routes[0]);
        console.log(
          "============================================success routing====================================="
        );
        return response.data;
      } else {
        console.error("No route data available");
      }
    } catch (error) {
      console.error("Error fetching route data: ", error);
    }
  }

  async decodePolyline(encoded, source = "ors") {
    if (!encoded || typeof encoded !== "string") {
      console.warn("Invalid polyline input:", encoded);
      return [];
    }
    try {
      const coordinates = polyline.decode(encoded);
      return source === "mapbox"
        ? coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        : coordinates.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    } catch (err) {
      console.error("Failed to decode polyline:", err);
      return [];
    }
  }

  async requestReroute(currentLocation, destinationLocation, defectNode) {
    console.log(
      "====================================REROUTING=============================="
    );
    const url = "https://api.mapbox.com/directions/v5/mapbox/driving/";
    console.log("defect node is ", defectNode);

    if (!currentLocation || !destinationLocation) {
      throw new Error("Both current and destination locations are required");
    }

    const coordinates = [
      `${currentLocation.longitude},${currentLocation.latitude}`,
      `${destinationLocation.longitude},${destinationLocation.latitude}`,
    ].join(";");

    let excludeParam = "";
    let apiUrl = "";
    if (defectNode && Array.isArray(defectNode) && defectNode.length > 0) {
      const exclusionPoints = defectNode
        .filter((node) => !isNaN(node.latitude) && !isNaN(node.longitude))
        .map(
          (node) =>
            `point(${node.longitude.toFixed(6)}%20${node.latitude.toFixed(6)})`
        );

      if (exclusionPoints.length > 0) {
        excludeParam = `exclude=${exclusionPoints.join(",")}`;
      }
    }

    if (excludeParam) {
      apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?alternatives=true&${excludeParam}&access_token=${auto_generated_mapbox_key}`;
    }

    try {
      console.log("the request reroute api url is ", apiUrl);

      const response = await axios.get(apiUrl, {
        timeout: 5000,
      });

      if (
        !response.data ||
        !response.data.routes ||
        response.data.routes.length === 0
      ) {
        console.error("No routes found in response:", response.data);
        throw new Error("No routes found.");
      }

      const mainRoute = {
        distance: response.data.routes[0].distance,
        duration: response.data.routes[0].duration,
        geometry: response.data.routes[0].geometry,
      };

      const alternatives = response.data.routes.slice(1).map((route) => ({
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
      }));

      if (alternatives.length > 0) {
        const decoded = await Promise.all(
          alternatives.map(
            async (route) => await this.decodePolyline(route.geometry, "mapbox")
          )
        );
        return decoded;
      } else {
        return await this.decodePolyline(mainRoute.geometry, "mapbox");
      }
    } catch (error) {
      console.error("Rerouting failed:", error.response?.data || error.message);
      throw error;
    }
  }

  storeCurrentLocation(currentLocation, destinationLocation) {
    const start = currentLocation;
    const end = destinationLocation;
    return { start, end };
  }
}
