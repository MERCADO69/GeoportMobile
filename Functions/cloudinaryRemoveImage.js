import axios from "axios";
import sha1 from "js-sha1"; // ✅ Use js-sha1 instead of crypto
import { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@env";

export default async function deleteFromCloudinary(imageUrl) {
  try {
    if (!imageUrl) {
      console.error("❌ No image URL provided.");
      return { status: false, message: "No image URL provided." };
    }


    const urlParts = imageUrl.split("/");
    const publicIdWithExt = urlParts.slice(7).join("/"); 
    const publicId = publicIdWithExt.split(".")[0];

    const timestamp = Math.floor(Date.now() / 1000);

    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = sha1(signatureString); // ✅ Generate SHA-1 hash

    const CLOUDINARY_DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

    // ✅ Send delete request
    const response = await axios.post(CLOUDINARY_DELETE_URL, {
      public_id: publicId,
      timestamp: timestamp,
      api_key: CLOUDINARY_API_KEY,
      signature: signature,
    });

    if (response.data.result === "ok") {
      return { status: true, message: "Image deleted successfully." };
    } else {
      console.error("❌ Failed to delete image:", response.data);
      return { status: false, message: "Failed to delete image." };
    }
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error);
    return { status: false, message: "Cloudinary deletion failed." };
  }
}
