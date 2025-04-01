
import axios from "axios";
import { auth } from "../../firebaseConfig";
import { CLOUD_NAME } from "@env";


class CloudinaryUploader{

    async UploadImageProfileToCloudinary(imageUri) {
        let userId = this.getCurrentUserId();
        if (!userId) return false;
        
        try {
            const formData = new FormData();
            formData.append("file", { uri: imageUri, type: "image/jpeg", name: userId });
            formData.append("upload_preset", "REPORTS");
            formData.append("folder", `PROFILE IMAGES/${userId}`);
            let url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;


            const response = await axios.post(`${url}/image/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        
            return response.data.secure_url;
        } catch (error) {
            console.error("❌ Upload failed:", error);
            return null;
        }
    }



    getCurrentUserId(){
        let user = auth.currentUser
        if(!user){
            console.error("No user is signed in.");
            return
        }
        return user.uid
    }

}
export default CloudinaryUploader;