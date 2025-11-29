import { Customer, getAllCustomers } from "@/src/customers";
import { getToken } from "@/src/storage";
import { styles } from "@/src/style";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

const BASE_URL = "https://kami-backend-5rs0.onrender.com";

interface SelectedService {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    staffID?: string;
    userId?: string;
}

export default function TransactionSummary() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const customerId = (params.customerId as string) || null;
    const selectedServicesParam = (params.selectedServices as string) || "[]";

    const [selectedServices, setSelectedServices] = useState<SelectedService[]>(() => {
        try {
            return JSON.parse(selectedServicesParam) as SelectedService[];
        } catch {
            return [];
        }
    });

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [users, setUsers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const all = await getAllCustomers();
                setUsers(all);
                const found = all.find(c => c._id === customerId) || null;
                setCustomer(found);
            } catch (err) {
                console.warn("Failed to load customers", err);
            }
        };
        load();
    }, [customerId]);

    const getUserName = (id: string) => {
        return users.find(u => u._id === id)?.name || "(unknown)";
    };

    const totalPrice = selectedServices.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);

    const confirmTransaction = async () => {
        if (!customerId) return Alert.alert("Error", "Customer not selected");

        setLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return Alert.alert("Authentication", "You are not logged in");
            }

            const servicesPayload = selectedServices.map(s => ({ _id: s._id, quantity: s.quantity, userId: (s as any).userId || (s as any).staffID || "" }));

            const body = {
                customerId,
                services: servicesPayload,
            };

            const res = await axios.post(`${BASE_URL}/transactions`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Success", "Transaction created successfully", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (err: any) {
            console.warn(err);
            const message = err?.response?.data?.message || err.message || "Failed to create transaction";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { padding: 20 }]}> 
            <Text style={styles.cardTitle}>Transaction Summary</Text>

            <View style={[styles.card, { marginVertical: 10 }]}> 
                <Text style={{ fontWeight: "bold" }}>Customer</Text>
                {customer ? (
                    <>
                        <Text style={{ fontSize: 16 }}>{customer.name}</Text>
                        <Text>Phone: {customer.phone}</Text>
                        <Text>Loyalty: {String((customer as any).loyalty ?? "-")}</Text>
                        <Text>Total Spent: {(customer as any).totalSpent ?? 0}</Text>
                        <Text>Status: {(customer as any).status ?? "-"}</Text>
                    </>
                ) : (
                    <Text>{customerId}</Text>
                )}
            </View>

            <View style={[styles.card, { marginVertical: 10 }]}> 
                <Text style={{ fontWeight: "bold" }}>Services</Text>
                <FlatList
                    data={selectedServices}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View style={{ paddingVertical: 8 }}>
                            <Text style={{ fontSize: 16 }}>{item.name}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <Text>Unit Price: {item.price?.toLocaleString()}đ</Text>
                            <Text>Subtotal: {(item.price * item.quantity)?.toLocaleString()}đ</Text>
                            <Text>Staff: {getUserName((item as any).userId || (item as any).staffID)}</Text>
                        </View>
                    )}
                />

                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Price Before Promotion: {totalPrice.toLocaleString()}đ</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 4 }}>Price: {totalPrice.toLocaleString()}đ</Text>
            </View>

            <TouchableOpacity
                style={[styles.button, { marginTop: 20, opacity: loading ? 0.7 : 1 }]}
                onPress={confirmTransaction}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white", textAlign: "center" }}>Confirm</Text>}
            </TouchableOpacity>
        </View>
    );
}
