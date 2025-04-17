import axios from "axios";
import { auth } from "../firebaseConfig";
import { CLOUD_NAME } from "@env";

export default async function uploadToCloudinary(photoUri, report_type) {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is signed in.");
    return null;
  }

  const id = user.uid; 
  if (!id) {
    console.error("No ID found.");
    return null;
  }

  try {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    let folderPath = report_type === "vehicle collision" 
      ? `REPORTS/COLLISION_REPORTS/${id}` 
      : `REPORTS/ROAD_DEFECTS_REPORTS/${id}`;

    const timestamp = Date.now();
    const fileName = `${id}_${timestamp}.jpg`;

    const formData = new FormData();
    formData.append("file", { uri: photoUri, type: "image/jpeg", name: fileName });
    formData.append("upload_preset", "REPORTS"); 
    formData.append("folder", folderPath); 


    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Uploaded image URL:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}
