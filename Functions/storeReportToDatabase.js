import { SEND_REPORT_ENDPOINT, SERVER_PORT, SERVER_IP } from "@env";
import GetUserData from "../Functions/getUserData";
import { auth } from "../firebaseConfig";
import axios from "axios";

export default async function StoreReportToDatabase(imageurl, report_type,loc) {

  const url = `http://${SERVER_IP}:${SERVER_PORT}/${SEND_REPORT_ENDPOINT}`;
  let user = auth.currentUser;
  console.log("Submitting report to:", url);

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

  console.log(email)
  console.log(id)
  console.log(dateTime)
 
  let { latitude, longitude } = loc;
  const user_data = await GetUserData();
  let name = user_data.data.name;
  if (!user_data.data) {
    console.log('Null user data '+user_data.data);
    console.log('user data is missing')
    return {
      success: false,
      message: "Failed to retrieve user data.",
    };
  }
  console.log(name)

  

  const dataTobeSave = {
    DateAndTime: dateTime,   
    Severity: "true",
    TypeOfReport: report_type, 
    image: imageurl,           
    location: {              
      latitude: latitude.toString(),  
      longitude: longitude.toString() // ✅ Convert to string
    },
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
      console.log('unsuccessfull submission of report')
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

// ✅ Helper function for timestamps
const getCurrentTimestamp = () => {
  return new Date().toISOString().slice(0, 19);
};


