
export default function ErrorMessage(errorCode){
    const errorMessages = {
        "auth/user-not-found": "No account found with this email. Please sign up.",
        "auth/wrong-password": "Incorrect password. Try again or reset your password.",
        "auth/invalid-email": "Invalid email format. Please enter a valid email.",
        "auth/user-disabled": "This account has been disabled. Contact support.",
        "auth/too-many-requests": "Too many failed attempts. Try again later.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
    };

    return errorMessages[errorCode] || "Login failed. Please try again.";
}