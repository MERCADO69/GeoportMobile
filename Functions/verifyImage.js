import { APP_COMPREFACE_API_KEY, SERVER_IP } from "@env";
import axios from "axios";
import * as FileSystem from 'expo-file-system'; // Add this import

export default async function ValidateFace(capturedID, profileImage) {

  const processImage = async (uri, name) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error(`File not found: ${uri}`);
    
    return {
      uri: fileInfo.uri,
      name: `${name}.jpg`,
      type: 'image/jpeg'
    };
  };

  try {
    const formData = new FormData();
    
    // Append processed files
    formData.append('source_image', await processImage(capturedID, 'id'));
    formData.append('target_image', await processImage(profileImage, 'face'));

    
    const response = await axios.post(
      `http://${SERVER_IP}:8000/api/v1/verification/verify`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': APP_COMPREFACE_API_KEY
        },
        timeout: 20000 
      }
    );

    if (Array.isArray(response.data.result)) {
      response.data.result.forEach((res, index) => {
    
        if (Array.isArray(res.face_matches)) {
           } else {
           }
          });
    }
    const faceMatches = response.data?.result?.[0]?.face_matches || [];
    const similarity = faceMatches.length > 0 ? faceMatches[0].similarity : null;

    return {
      success: similarity !== null && similarity >= 0.85,
      similarity,
      message: similarity !== null ? `Face match similarity: ${similarity}` : "No face match found"
    };

  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      code: error.code
    });
    
    return {
      success: false,
      error: error.response?.data?.message || 
            'Verification service unavailable'
    };
  }
}