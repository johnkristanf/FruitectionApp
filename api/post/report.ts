import { REPORT_DETAILS } from '@/types/reports';
import axios from 'axios'
import { DOMAIN_NAME_GO } from '../domain';


export const REPORT = async (reportDetails: REPORT_DETAILS): Promise<boolean> => {

    try {
        const response = await axios.post(`${DOMAIN_NAME_GO}/insert/report`, reportDetails, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("response: ", response.data)

        if (response.status === 200) return true

        return false

    } catch (error) {
        console.error(error)
        return false
    }
}