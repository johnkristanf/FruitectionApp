import { ReportedCasesTypes } from "@/types/reports";
import axios from "axios";

export async function FetchReports(): Promise<ReportedCasesTypes[] | undefined> {
    try {
        const response = await axios.get("https://clamscanner.com/go/fetch/reports");
        const statusOK = response.status === 200;

        if(statusOK) return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
