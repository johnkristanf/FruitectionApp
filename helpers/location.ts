import { requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";

interface Address {
    city: string;
    province: string;
    street: string;
    farmName: string;
}


// WALA PAY CAGANGOHAN FARM
const farmLocations = {
    cagangohanFarm: { latitude: 7.2950, longitude: 125.6700 }, 
    jpLaurelFarm: { latitude: 7.276094, longitude: 125.677476 }, 
};


// const farmLocations = {
//     cagangohanFarm: { latitude: 7.2950, longitude: 125.6700 }, 
//     jpLaurelFarm: { latitude: 7.2847055, longitude: 125.6770541 }, 
// }
  
export const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {

    let { status } = await requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }
  
    let location = await getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log("latitude: ", latitude);
    console.log("longitude: ", longitude);
    
  
    return { latitude, longitude };
};


export const getAddressFromLocation = async (latitude: number, longitude: number): Promise<Address> => {
    
    let address: Address = { city: '', province: '', street: '', farmName: '' };
    
    try {

        let result = await reverseGeocodeAsync({
            latitude,
            longitude,
        });

        if (result.length > 0) {
            console.log("location result: ", result);
            
            const { city, region, street } = result[0];
            const farmName = await getFarmIndicator(latitude, longitude)

            console.log("farmName: ", farmName);
            

            address = {
                city: city || '',
                province: region || '',
                street: street || '',
                farmName
            };

        }

    } catch (error) {
      console.log(error);
    }
    
    return address;

};


const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};


const getFarmIndicator = async (latitude: number, longitude: number) => {
    const distanceToCagangohan = haversineDistance(latitude, longitude, farmLocations.cagangohanFarm.latitude, farmLocations.cagangohanFarm.longitude);
    const distanceToJPLaurel = haversineDistance(latitude, longitude, farmLocations.jpLaurelFarm.latitude, farmLocations.jpLaurelFarm.longitude);

    const threshold = 0.5; // Threshold in kilometers

    let farmName = '';
    if (distanceToCagangohan < threshold) {
        farmName = 'Cagangohan Farm';
    } else if (distanceToJPLaurel < threshold) {
        farmName = 'J.P.Laurel Farm';
    } else {
        farmName = 'Unknown Farm';
    }

    return farmName;
};




// export const getAddressFromGoogle = async (latitude: number, longitude: number): Promise<Address> => {
//     console.log('google ni part');
    
//     const API_KEY = 'AIzaSyDlgGqUgdx7y6XqEybrvh0O21KtsRbV2HU';
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.results.length > 0) {
//             const addressComponents = data.results[0].address_components;

//             console.log("data.results[0]:", data.results[0]);
            

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
//                 street: district
//             };
//         }

//     } catch (error) {
//         console.log(error);
//     }

//     return { city: '', province: '', street: '' };
// };


