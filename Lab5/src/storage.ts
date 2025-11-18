import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem("token", token);
}

export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem("token");
}

export const removeToken = async (): Promise<void> => {
    await AsyncStorage.removeItem("token");
}
export const saveUserName = async (name: string) => {
    await AsyncStorage.setItem("userName", name);
}

export const getUserName = async (): Promise<string | null> => {
    return await AsyncStorage.getItem("userName");
}
