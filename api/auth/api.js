import axios from "axios";
import { SERVER_PORT, SERVER_IP,SERVER_URL } from "@env";
import { auth } from "../../firebaseConfig";

export default api = axios.create({
  // baseURL: `http://${SERVER_IP}:${SERVER_PORT}`,
   baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
