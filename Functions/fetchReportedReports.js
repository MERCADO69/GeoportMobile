import { auth } from "../firebaseConfig";
import axios from "axios";
import {
  FETCH_REPORTED_REPORTS,
  SERVER_URL,
} from "@env";

export default async function FetchReportedReports() {
  const user = auth.currentUser;
  let id = user.uid;
  const token = await user.getIdToken();

  if (!id || !token) {
    return true;
  }

  const url = `${SERVER_URL}${FETCH_REPORTED_REPORTS}?id=${id}`;
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("fetch reported reports ", error.message);
  }
}
