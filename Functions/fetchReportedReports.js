import { auth } from "../firebaseConfig";
import axios from "axios";
import {
  FETCH_REPORTED_REPORTS,
  SERVER_PORT,
  SERVER_IP,
  NGROK_URL,
} from "@env";

export default async function FetchReportedReports() {
  console.log("Env Vars:", SERVER_IP, SERVER_PORT, FETCH_REPORTED_REPORTS);
  const user = auth.currentUser;
  let id = user.uid;
  const token = await user.getIdToken();

  if (!id || !token) {
    console.log("id and token null");
    return true;
  }

  const url = `http://${SERVER_IP}:${SERVER_PORT}/${FETCH_REPORTED_REPORTS}?id=${id}`;

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
