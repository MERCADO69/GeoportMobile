import { GENERATE_ROOM_ID } from "@env";
import api from "../api/auth/api";
import { auth } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export default async function submitGeneratedRoomId() {
  try {
    let user = auth.currentUser;
    if (!user) {
      return;
    }
    let id = user.uid;
    let room_id = generateRoomId();
    let url = `${GENERATE_ROOM_ID}/${id}`;
    const response = await api.post(url, { room_id });
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

function generateRoomId() {
  return `room_${uuidv4()}`;
}
