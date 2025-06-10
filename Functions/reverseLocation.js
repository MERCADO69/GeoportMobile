import { REVERSE_LOCATION } from "@env";
import api from "../api/auth/api";
import { auth } from "../firebaseConfig";
const reverseLocation = async (latitude, longitude) => {
  try {
    let user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }
    let id = user.uid;
    let url = `${REVERSE_LOCATION}/${id}`;

    let response = await api.post(url, { latitude, longitude });
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Error in reverse location API:", response.status);
    }
    return response.data;
  } catch (error) {
    throw new Error("Error in reverseLocation function: " + error.message);
  }
};

export default reverseLocation;
