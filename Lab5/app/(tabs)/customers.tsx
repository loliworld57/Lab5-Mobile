import { getAllCustomers } from "@/src/customers";
import { styles } from "@/src/style";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function CustomersScreen() {
    const [customers, setCustomers] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (err) {
            alert("Cannot load customers");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#f0f4f5', padding: 10, borderRadius: 8, marginBottom: 12 }}>
                <Text style={styles.cardTitle}>Danh Sách Khách Hàng</Text>

                <TouchableOpacity onPress={() => router.push("/screens/AddNewCustomer")}>
                    <Ionicons name="add-circle" size={28} color="#4d7688ff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {item.name} - {item.phone}
                        </Text>
                        <Text>Loyalty: {item.loyalty}</Text>
                        <Text style={styles.cardPrice}>Total Spent: {item.totalSpent} VND</Text>
                    </View>
                )}
            />
        </View >
    );
}
