import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

import { resizeImage } from "./resize";
import { getInfoAsync } from "expo-file-system";

import { FetchDurianDetails, Scan } from "@/api/post/scan";
import { DurianScannedDetails } from "@/types/reports";
import { Alert } from "react-native";

export const openGallery = async (
    setImageForScanning: React.Dispatch<React.SetStateAction<string | undefined>>,
    setScannedData: React.Dispatch<React.SetStateAction<DurianScannedDetails | undefined>>,
    setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>,
    setScanType: React.Dispatch<React.SetStateAction<string>>
) => {

    const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: false
    });

    const { canceled, assets } = result;

    if (!canceled && assets[0].uri) {
        setScanType("upload")
        setImageForScanning(assets[0].uri)

        const imgURI = assets[0].uri

        const resizedImageUri = await resizeImage(imgURI, 512, 512, 0.8)
        console.log("Resized Image URI:", resizedImageUri);

        if(resizedImageUri){

            const fileInfo = await getInfoAsync(resizedImageUri);
            if (!fileInfo.exists) throw new Error('File does not exist');

            const formData = new FormData();
            formData.append('captured_image_file', {
                uri:  resizedImageUri,
                name: fileInfo.uri.split('/').pop(),
                type: 'image/jpeg',

            } as any);

            const scanRespData = await Scan(formData, setCancelOrReported) 

            if(scanRespData){
                FetchDurianDetails(scanRespData.durian_disease_result)
                    .then(durianDetails =>{
                        if (durianDetails) {
                            durianDetails.scan_percentage = scanRespData.predicted_disease_percentage;
                            setScannedData(durianDetails);
                        }
                    })
                    .catch(err => console.error(err));

            } else {
                const errorMsg = "Request timeout due to slow internet connection, you will be redirected back and try to scan again.";
                Alert.alert(
                    "Error in Scanning", 
                    errorMsg,

                    [
                        {
                        text: "Return",
                        onPress: () => setCancelOrReported(true),
                        },
                    ],

                    { cancelable: false }
                );
            }
             
        }
      
    }
};
