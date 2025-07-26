import axios from "axios";
import { auth } from "../firebaseConfig";
import { SERVER_URL, SERVER_PORT, UPDATE_USER_INFO } from "@env";

export default async function updateUserInfo(name, capturedImage) {
  const user = auth.currentUser;

  if (!user) {
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
    const url = `${SERVER_URL}${UPDATE_USER_INFO}/${id}`;
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return { success: true, message: "User data updated successfully" };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
   throw new error
  }
}
