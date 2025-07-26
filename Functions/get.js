import wAuth from "../api/auth/api" ;
import NAuth from "../api/noauth/api"


export async function AuthenticatedgetRequest(params){
  try {
    const response = await wAuth.get(params,{});
    const isSuccess = response.status >= 200 && response.status < 300;
    if(isSuccess) return {error: false,message: response.data?.message || '',  responseData: response.data || null, }
  } catch (error) {
    return {error: true, message: error.response?.data?.details || error.message,responseData: null};
  }
}


export async function UnAuthenticatedgetRequest(params){
  try {

    const response = await NAuth.get(params, {});
    const isSuccess = response.status >= 200 && response.status < 300;
    if(isSuccess) return {error: false,message: response.data?.message || '',  responseData: response.data || null, }
  } catch (error) {
    return {error: true, message: error.response?.data?.details || error.message,responseData: null};
  }
}