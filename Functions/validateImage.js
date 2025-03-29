import axios from "axios";
import * as FileSystem from 'expo-file-system';
import { Platform } from "react-native";
import { APP_FACE_DETECTION_API_KEY, SERVER_IP } from "@env";
import CompreFaceServices from "../utils/Functions/compreFaceConfigurations"


export default async function ValidateId(imageUri) {
console.log('The image uri is ',imageUri)
  try {

    if(!imageUri){
      console.error('null image uri')
      return 
    }
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) {
      throw new Error("Image file does not exist");
    }

    const fileUri = Platform.OS === "android" ? imageUri : imageUri.replace("file://", "");

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const response = await axios.post(`http://${SERVER_IP}:8000/api/v1/detection/detect`, formData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "x-api-key": APP_FACE_DETECTION_API_KEY,
      },
      transformRequest: (data) => data,
      timeout: 30000, 
    });

    if (response.status === 200 && response.status < 300)
      {
      // let data = response.data

      // // if (!validatorServices.duplicateFaceChecker(data)) {
      // //   return { success: false, message: "Please upload an image with exactly one face." };
      // // }
        return { success: true, message: "ID validated successfully"};
      
    } else {
      return {
        success: false,
        message: "ID not validated",
      };
    }
  } catch (error) {
    console.log('valdiate image error is running')
    return {
      success: false,
      error: error.response?.data?.message || "Validation failed",
      details: error.response?.data || error.message,
    };
  }
}
