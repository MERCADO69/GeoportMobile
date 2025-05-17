import { SEND_REPORT_ENDPOINT, SERVER_PORT, SERVER_IP } from "@env";
import GetUserData from "../Functions/getUserData";
import { auth } from "../firebaseConfig";
import deleteFromCloudinary from "../Functions/cloudinaryRemoveImage"
import axios from "axios";

export default async function StoreReportToDatabase(imageurl, report_type,loc) {

  const url = `http://${SERVER_IP}:${SERVER_PORT}/${SEND_REPORT_ENDPOINT}`;
 
  let user = auth.currentUser;

  if (!user) {
    console.log('current user is not authenticated')
    return {
      success: false,
      message: "User not authenticated.",
    };
  }

  const token = await user.getIdToken();
  let email = user.email;
  let id = user.uid;
  let dateTime = getCurrentTimestamp();
 
  let { latitude, longitude } = loc;
  const user_data = await GetUserData();
  let name = user_data.data.name;
  
  if (!user_data.data) {
    return {success: false,message: "Failed to retrieve user data."};
  }

  

  const dataTobeSave = {
    DateAndTime: dateTime,   
    Severity: "true",
    TypeOfReport: report_type, 
    image: imageurl,           
    location: {              
      latitude: latitude.toString(),  
      longitude: longitude.toString() 
    },
    email:email,
    passable: "true",
    reference: id,             
    reporter: name,          
    status: "Pending"    
  };
  
  

  console.log("Submitting data:", dataTobeSave);

  try {
    const response = await axios.post(url, dataTobeSave, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.data) {
      console.log(response.message)

       const removeImage = await deleteFromCloudinary(imageurl)
       if(!removeImage){
         return {
           success: false,
           message: "No response from server. Check your network connection.Unable to remove the image to image hosting platform.",
         };
       }
      return {
        success: false,
        message: "No response from server. Check your network connection.",
      };
    }
    console.log('successfull submitted the report')
    return {
      success: true,
      message: response.data.response_message || "Report submitted successfully.",
    };
  } catch (error) {
    console.error("Error submitting report:", error);
    return {
      success: false,
      message: "Something went wrong while processing your request.",
    };
  }
}

function getCurrentTimestamp(){
  return new Date().toISOString().slice(0, 19);
};


