import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export async function resizeImage(imgSrc: string, width: number, height: number, compressionQuality: number){

    try {
        const compressedImage = await manipulateAsync(
            imgSrc,
            [{ resize: { width: width, height: height } }], 
            { compress: compressionQuality, base64: false, format: SaveFormat.JPEG }
        );
        
        console.log("height of img", compressedImage.height)
        console.log("width of img", compressedImage.width)
        
        return compressedImage.uri

    } catch (error) {
        console.error(error)
        throw error;
    }
   
}
