import * as SecureStore from 'expo-secure-store';

export const setData = async (key: string, data: string): Promise<void>  => {
    try {
        await SecureStore.setItemAsync(key, data);
    } catch (error) {
        console.error('Error storing JWT token:', error);
    }
};

export const getData = async (key: string): Promise<string | undefined> => {

    try {
        const data = await SecureStore.getItemAsync(key);
        if(data) return data
    
    } catch (error) {
        console.error(error)
    }
   
};