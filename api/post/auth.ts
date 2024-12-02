import { LoginCredentials } from '@/types/auth';
import { setData } from '@/helpers/store';
import axios from 'axios'
import { DOMAIN_NAME_GO } from '../domain';

export const Signup = async (signupFormData: FormData): Promise<string> => {

    try {
        const response = await axios.post(`${DOMAIN_NAME_GO}/auth/signup`, signupFormData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });

        console.log("response signup: ", response.data);
        

        if (response.status === 200) return "success";

        return ""

    } catch (error: any) {
        if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
            
            // You can return or handle specific errors based on the status
            if (error.response.status === 400) {
                return "email_taken";
            } else if (error.response.status === 500) {
                return "server_error";
            } else {
                return `Error: ${error.response.status}`;
            }
        } 

        return ""
    }
}


export const Login = async (loginFormData: LoginCredentials): Promise<string | undefined> => {

    try {
        const response = await axios.post(`${DOMAIN_NAME_GO}/auth/login`, loginFormData);
        if (response.status === 200){
            setData("user_id", response.data.user_id.toString())
            return response.data.role
        } 


    } catch (error) {
        console.error(error)
        return "login_failure"
    }
}