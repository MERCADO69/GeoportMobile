
import axios from "axios";
import { SERVER_URL } from "@env";

export default api = axios.create({
   baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
