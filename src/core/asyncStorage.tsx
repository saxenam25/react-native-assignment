import AsyncStorage from '@react-native-async-storage/async-storage';

const saveData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

const getData = async (key: string): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
};

// delete data
const deleteDataByKey = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error deleting data:", error);
    }
};

// delete all data
const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error("Error clearing all data:", error);
    }
};

const asyncStorage = {
    saveData,
    getData,
    deleteDataByKey,
    clearAllData
};


export default asyncStorage;