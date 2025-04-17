import axios from "axios";
import { auth } from "../firebaseConfig";
import { SERVER_IP, SERVER_PORT, UPDATE_USER_INFO } from "@env";

export default async function updateUserInfo(name, capturedImage) {
  const user = auth.currentUser;

  if (!user) {
    console.log("Current user is not authenticated");
    return { success: false, message: "User not authenticated." };
  }
  const token = await user.getIdToken();
  const id = user.uid;


  const formData = new FormData();
  formData.append("new_name", name);
  if (capturedImage.startsWith("http")) {
    formData.append("cloudinary_url", capturedImage);
  } else {
    formData.append("new_image", { uri: capturedImage,  type: "image/jpeg",name: "profile.jpg"});
  }
 
  try {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/${UPDATE_USER_INFO}/${id}`;
    console.log("URL:", url); 
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      console.log("User data updated successfully");
      return { success: true, message: "User data updated successfully" };
    } else {
      console.log("Failed to update user data");
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.log("Update user info error:", error.message);
  }
}
