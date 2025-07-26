import axios from "axios";
import { VALIDATE_IMAGE_ENDPOINT,SERVER_URL } from '@env'

export default async function ValidateReport(reportImage) {
    try {
        const url = `${SERVER_URL}${VALIDATE_IMAGE_ENDPOINT}`;
        const formData = new FormData();
        formData.append("image", {
            uri: reportImage,
            name: "image.jpg",  
            type: "image/jpeg"
        });
                
        const response = await axios.post(url,formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const data = response.data;

        if(data.status === "success"){
            return{
                success: true,
                reportType: data.report_type
            }
        }
        else{
            return{
                success: false,
                reportType: data.report_type,
                reportMessage: data.message || "No valid detections found."
            }
        }
      

    } catch (error) {
        console.error("Error validating report:", error);

        if (error.response) {
            return {
                success: false,
                status: error.response.status,
                message: error.response.data.message || "Backend error occurred.",
            };
        } else {
            return {
                success: false,
                status: null,
                message: "No response from server. Check your network connection.",
            };
        }
    }
}
