import axios from "axios";

const URL = "https://kami-backend-5rs0.onrender.com";

export interface Service {
    _id: string;
    name: string;
    price: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        _id: string;
        name: string;
        phone: string;
    };
}

export const getAllServices = async (): Promise<Service[]> => {
    const res = await axios.get<Service[]>(`${URL}/services`);
    return res.data
};
export const getServiceById = async (id: string) => {
    const res = await axios.get(`${URL}/services/${id}`);
    return res.data;
};

export const addNewService = async (name: string, price: number, token: string) => {
    const res = await axios.post(
        `${URL}/services`,
        { name, price },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

export const deleteServiceById = async (id: string, token: string) => {
    const res = await axios.delete(`${URL}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const updateServiceById = async (id: string, name: string, price: number, token: string) => {
    const res = await axios.put(
        `${URL}/services/${id}`,
        { name, price },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};