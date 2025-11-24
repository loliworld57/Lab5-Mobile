import axios from "axios";

const BASE_URL = "https://kami-backend-5rs0.onrender.com";

export interface Customer {
    _id: string;
    name: string;
    phone: string;
    loyalty: number;
    totalSpent: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllCustomers = async (): Promise<Customer[]> => {
    const res = await axios.get<Customer[]>(`${BASE_URL}/customers`);
    return res.data;
}

export const addCustomer = async (name: string, phone: string, token: string) => {
    const res = await axios.post(
        `${BASE_URL}/customers`,
        { name, phone },    
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}
