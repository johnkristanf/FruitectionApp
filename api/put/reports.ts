import axios from 'axios';


export const UpdateReportStatus = async (report_id: number): Promise<boolean | undefined> => {
  try {
    const response = await axios.put(`https://clamscanner.com/go/update/report/status/${report_id}`, {});
    return response.status === 200;

  } catch (error) {
    throw error;
  }
};
