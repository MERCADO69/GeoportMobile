import { SERVER_PORT, UPDATE_USER_STATUS, SERVER_IP } from "@env";
import axios from "axios";
import { auth } from "../firebaseConfig";
import CloudinaryUploader from "../utils/Functions/cloudinaryUploaderUtil";

class UpdateUser {
    static cloudinaryUploader = new CloudinaryUploader();
    
    static async UpdateUserStatus(profileImage) {
        console.log('running updatestatus function')
        try {
            let data = await this.cloudinaryUploader.UploadImageProfileToCloudinary(profileImage);
            console.log('The image url is ',data)
            if (!data) {
                return {
                    successfull: false,
                    message: "Image upload failed.",
                };
            }

            const user = auth.currentUser;
            if (!user) {
                return {
                    successfull: false,
                    message: "No user is signed in.",
                };
            }

            let id = user.uid;
            let token = await user.getIdToken();
            let url = `http://${SERVER_IP}:${SERVER_PORT}/${UPDATE_USER_STATUS}/${id}`;
            
            let response = await axios.patch(
                url, { imageUrl: data }, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                successfull: response.status === 200,
                message: response.data.message || "User status updated successfully!",
            };
        } catch (error) {
            console.error("❌ Update failed:", error);
            return {
                successfull: false,
                message: error.response?.data?.message || "An error occurred while updating user status.",
            };
        }
    }

    static async StoreUserData() {
        
    }
}

export default UpdateUser;
