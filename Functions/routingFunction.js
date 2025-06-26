import api from "../api/auth/api";
import { REQUEST_ROUTE, REQUEST_REROUTE } from "@env";
import polyline from "@mapbox/polyline";
import { auth } from "../firebaseConfig";

export async function requestRoute(currentLocation, destinationLocation) {
  console.log("requesting route");
  let location = storeCurrentLocation(currentLocation, destinationLocation);
  try {
    let user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    let id = user.uid;

    let start_latitude = location.start?.latitude;
    let start_longitude = location.start?.longitude;
    let end_latitude = location.end?.latitude;
    let end_longitude = location.end?.longitude;

    let url = `${REQUEST_ROUTE}/${id}`;
    const response = await api.post(url, {
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
    });

    if (response.data && response.data.data && response.data.data.geometry) {
      let geometry = response.data.data.geometry;
      let duration = response.data.data.duration;
      let distance = response.data.data.distance;
      let { encodedPolyline, latLngCoordinates } = await ConvertToPolyline(
        geometry
      );

      const decoded_data = polyline
        .decode(encodedPolyline)
        .map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
      return { decoded_data, latLngCoordinates, duration, distance };
    }
  } catch (error) {
    console.error("Error fetching route data: ", error);
  }
}

async function ConvertToPolyline(geometry) {
  try {
    if (!geometry || !geometry.coordinates || geometry.type !== "LineString") {
      console.warn("Invalid geometry data provided");
      return null;
    }

    const latLngCoordinates = geometry.coordinates.map((coord) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    const encodedPolyline = polyline.encode(
      geometry.coordinates.map((coord) => [coord[1], coord[0]])
    );

    return { encodedPolyline, latLngCoordinates };
  } catch (error) {
    console.error("Error converting to polyline:", error);
    return null;
  }
}

export async function requestReroute(
  currentLocation,
  destinationLocation,
  defectNode
) {
  try {
    let location = storeCurrentLocation(currentLocation, destinationLocation);
    let user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    let id = user.uid;

    let start_latitude = location.start?.latitude;
    let start_longitude = location.start?.longitude;
    let end_latitude = location.end?.latitude;
    let end_longitude = location.end?.longitude;

    let defectCoordinates = Array.isArray(defectNode)
      ? defectNode.map(({ latitude, longitude }) => ({ latitude, longitude }))
      : [{ latitude: defectNode.latitude, longitude: defectNode.longitude }];

    let url = `${REQUEST_REROUTE}/${id}`;
    const response = await api.post(url, {
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
      defect_nodes: defectCoordinates,
    });

    if (response.data && response.data.data && response.data.data.geometry) {
      let geojsonFeature = response.data.data;
      let route_data = geojsonFeature.geometry;
      let duration = response.data.data.properties.duration;
      let distance = response.data.data.properties.distance;
      let { encodedPolyline, latLngCoordinates } = await ConvertToPolyline(
        route_data
      );

      return { geojsonFeature, latLngCoordinates, duration, distance };
    }
  } catch (error) {
    console.error("Error in requestReroute:", error);
    return null;
  }
}

function storeCurrentLocation(currentLocation, destinationLocation) {
  const start = currentLocation;
  const end = destinationLocation;
  return { start, end };
}
