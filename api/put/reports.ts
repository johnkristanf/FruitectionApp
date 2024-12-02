import axios from 'axios';
import { DOMAIN_NAME_GO } from '../domain';


export const UpdateReportStatus = async (report_id: number): Promise<boolean | undefined> => {
  try {
    const response = await axios.put(`${DOMAIN_NAME_GO}/update/report/status/${report_id}`, {});
    return response.status === 200;

  } catch (error) {
    throw error;
  }
};
