import axios from "axios";

export default async function connectCall(url) {
  try {
    const response = await axios.post(url);
    return { error: false, status: response.status };
  } catch (error) {
    return {
      error: true,
      status: error?.response?.status || null,
      message: error?.message,
    };
  }
}
