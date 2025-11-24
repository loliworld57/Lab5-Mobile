import { addCustomer, getAllCustomers } from "@/src/customers";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function addNewCustomer() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const handleAddNewCustomer = async () => {
    if (!name || !phone) {
        alert("Fields are empty");
        return;
    }

    try {
        setLoading(true);

        const token = await AsyncStorage.getItem("token");
        if (!token) {
            alert("Please Login");
            setLoading(false);
            return;
        }

        await addCustomer(name, phone, token);

        alert("Customer added successfully!");

        setLoading(false);

        router.back();

    } catch (err) {
        console.log(err);
        alert("Failed to add customer");
        setLoading(false);
    }
};
    const loadData = async () => {
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (err) {
            alert("Cannot load customer list");
        }
    };


    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.cardTitle}>Add New Customer</Text>

            <TextInput
                placeholder="Customer Name"
                value={name}
                onChangeText={setName}
                style={[styles.input, { marginBottom: 12 }]}
            />

            <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                style={[styles.input, { marginBottom: 12 }]}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <TouchableOpacity
                    onPress={handleAddNewCustomer}
                    style={styles.button}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                        Add Service
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}