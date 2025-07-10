import { getAuth, signOut } from "firebase/auth";

const LogoutFunction = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export default LogoutFunction;
