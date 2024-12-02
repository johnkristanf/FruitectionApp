import { ReportedCasesTypes } from "@/types/reports";
import axios from "axios";
import { DOMAIN_NAME_GO } from "../domain";

export async function FetchReports(): Promise<ReportedCasesTypes[] | undefined> {
    try {
        const response = await axios.get(`${DOMAIN_NAME_GO}/fetch/reports`);
        const statusOK = response.status === 200;

        if(statusOK) return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
