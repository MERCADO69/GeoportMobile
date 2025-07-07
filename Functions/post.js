import wAuth from "../api/auth/api" ;
import NAuth from "../api/noauth/api"


export async function AuthenticatedpostRequest(params, data){
  try {

    console.log('Data',data)
    console.log('parameter is ',params)
    const response = await wAuth.post(params, data);
    const isSuccess = response.status >= 200 && response.status < 300;
    if(isSuccess) return {error: false,message: response.data?.message || '',  responseData: response.data || null, }
  } catch (error) {
    return {error: true, message: error.response?.data?.details || error.message,responseData: null};
  }
}


export async function UnAuthenticatedpostRequest(params, data){
  try {

    console.log('Data',data)
    console.log('parameter is ',params)
    const response = await NAuth.post(params, data);
    const isSuccess = response.status >= 200 && response.status < 300;
    if(isSuccess) return {error: false,message: response.data?.message || '',  responseData: response.data || null, }
  } catch (error) {
    return {error: true, message: error.response?.data?.details || error.message,responseData: null};
  }
}