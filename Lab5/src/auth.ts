import axios from "axios";

const URL = "https://kami-backend-5rs0.onrender.com";

export interface LoginResponse {
    _id: string;
    phone: string;
    password: string;
    name: string;
    token: string;
}

export const login = async (
    phone: string,
    password : string
): Promise<LoginResponse> => {
    const res = await axios.post<LoginResponse>(
        `${URL}/auth`, {
            phone,
            password,
    });
    console.log("Login API response:", res.data);
    return res.data;
}