import axios from "axios";
import { DOMAIN_NAME_GO, DOMAIN_NAME_PY } from "../domain";

export const Scan = async (capturedImageFormData: FormData, setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>) => {

    console.log("setCancelOrReported:", setCancelOrReported)

    try {
        const response = await axios.post(`${DOMAIN_NAME_PY}/image/scan`, capturedImageFormData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
            },
            timeout: 10000,
        });

        if (response.status === 200) return response.data;

    } catch (error: any) {
        console.log("ERROR IN AXIOS REQUEST SCAN");
        console.error(error.message || error); 

        return false;

    }
}


export const FetchDurianDetails = async (durian_name:string) => {
    
    try {

        const response = await axios.get(`${DOMAIN_NAME_GO}/fetch/durian/${durian_name}`, {
            headers: { 
                'Content-Type': 'application/json'
            }
        })


        if(response.status === 200) return response.data
        
    } catch (error) {
        console.error(error)
    }
}