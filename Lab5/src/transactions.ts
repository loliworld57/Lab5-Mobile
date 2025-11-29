import axios from "axios";

const BASE_URL = "https://kami-backend-5rs0.onrender.com";

export interface Transaction {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    createdAt: string;
}

export interface TransactionDetail {
    _id: string;
    id: string;
    customer: {
        name: string;
        phone: string;
    };
    services: {
        _id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    priceBeforePromotion: number;
    price: number;
    status: string;
    createdAt: string;
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
    const res = await axios.get(`${BASE_URL}/transactions`);
    return res.data;
};

export const getTransactionDetail = async (_id: string): Promise<TransactionDetail> => {
    const res = await axios.get(`${BASE_URL}/transactions/${_id}`);
    return res.data;
};
export const cancelTransactionById = async (id: string, token: string) => {
    const res = await axios.patch(
        `${BASE_URL}/transactions/${id}`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

export const addTransaction = async (data: any, token: string) => {
  const res = await axios.post(`${BASE_URL}/transactions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};