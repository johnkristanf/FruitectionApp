import { MolluskSightingsType } from "@/types/mollusk";
import axios from "axios";

export async function FetchMolluskCommonSightings(scientificName: string): Promise<MolluskSightingsType[] | undefined> {
    try {
        const response = await axios.get(`https://api.obis.org/v3/occurrence?scientificname=${encodeURIComponent(scientificName)}&fields=decimalLatitude%2CdecimalLongitude%2Ccountry&size=8`);
        const statusOK = response.status === 200;

        if(statusOK) return response.data.results;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
