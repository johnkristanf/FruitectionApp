import { requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";

interface Address {
    city: string;
    province: string;
    street: string;
}
  
export const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {

    let { status } = await requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }
  
    let location = await getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
  
    return { latitude, longitude };
};


export const getAddressFromLocation = async (latitude: number, longitude: number): Promise<Address> => {
    
    let address: Address = { city: '', province: '', street: '' };
    
    try {

        let result = await reverseGeocodeAsync({
            latitude,
            longitude,
        });

        if (result.length > 0) {
            console.log("location result: ", result);
            
            const { city, region, street } = result[0];

            address = {
                city: city || '',
                province: region || '',
                street: street || '',
            };

        }

    } catch (error) {
      console.log(error);
    }
    
    return address;

};


// export const getAddressFromGoogle = async (latitude: number, longitude: number): Promise<Address> => {
//     const API_KEY = 'AIzaSyDlgGqUgdx7y6XqEybrvh0O21KtsRbV2HU';
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.results.length > 0) {
//             const addressComponents = data.results[0].address_components;

//             console.log("addressComponents: ", addressComponents);

//             addressComponents.forEach((component: { long_name: string; types: string[] }) => {
//                 console.log(`Component: ${component.long_name}`);
//                 console.log(`Types: ${component.types.join(', ')}`);
//             });

//             // Get city, province, and fallback for district if 'neighborhood' not found
//             const city = addressComponents.find((component: { types: string[] }) => component.types.includes('locality'))?.long_name || '';
//             const province = addressComponents.find((component: { types: string[] }) => component.types.includes('administrative_area_level_1'))?.long_name || '';
            
//             // If district is not available, fallback to administrative_area_level_2 or route
//             let district = addressComponents.find((component: { types: string[] }) => component.types.includes('neighborhood'))?.long_name || '';

//             if (!district) {
//                 // If 'neighborhood' is not available, check for administrative_area_level_2 (which is typically the sub-province or district level)
//                 district = addressComponents.find((component: { types: string[] }) => component.types.includes('administrative_area_level_2'))?.long_name || '';
//             }

//             // If district still not found, fall back to the route (street name)
//             if (!district) {
//                 district = addressComponents.find((component: { types: string[] }) => component.types.includes('route'))?.long_name || '';
//             }

//             return {
//                 city,
//                 province,
//                 district
//             };
//         }

//     } catch (error) {
//         console.log(error);
//     }

//     return { city: '', province: '', district: '' };
// };


