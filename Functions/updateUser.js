import UserRequest from "../utils/Requests/updateUser";
import {SERVER_PORT,UPDATE_USER_STATUS,SERVER_IP} from '@env'
import axios from "axios";
import { auth } from '../firebaseConfig';  


// updated structure sa controller
class UpdateUser{
   static user_function = new UserRequest()


        static async UpdateUserStatus(data){
                try{
                    const user = auth.currentUser;
                    let id = user.uid;
                    let token = await user.getIdToken();
                    let url = `http://${SERVER_IP}:${SERVER_PORT}/${UPDATE_USER_STATUS}?id=${id}`
                    let response  = await axios.patch(url,{ status: "verified" },{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    })
                    if(response.status === 200){
                        return{
                            'successfull':true,
                            'message':response.message
                        }
                    }   else{
                        return{
                            'successfull':false,
                            'message':response.message
                        }
                    }
                }catch(error){
                    return{
                        'successfull':false,
                        'message':error
                    }
                }
            }



   static async StoreUserData(){

    }


}
export default UpdateUser;