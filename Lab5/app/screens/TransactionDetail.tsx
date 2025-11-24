import { styles } from "@/src/style";
import { getTransactionDetail } from "@/src/transactions";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function TransactionDetail() {
    const { id } = useLocalSearchParams();
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await getTransactionDetail(String(id));
            setDetail(res);
        } catch (e) {
            alert("Failed to load transaction detail");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!detail) return null;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Transaction</Text>
                <Text style={styles.cardPrice}>#{detail.id}</Text>

                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: "bold" }}>
                    Customer
                </Text>
                <Text>Name: <Text style={{ fontWeight: 'bold' }}>{detail.customer?.name}</Text></Text>
                <Text>Phone: <Text style={{ fontWeight: 'bold' }}>{detail.customer?.phone}</Text></Text>

                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: "bold" }}>
                    Services
                </Text>

                <FlatList
                    data={detail.services}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                            <Text>Price: {item.price.toLocaleString()}đ</Text>
                            <Text>Quantity: {item.quantity}</Text>
                        </View>
                    )}
                />

                <View>
                    <Text style={{ color: "green", fontWeight: "bold" }}>Total Price: {detail.price.toLocaleString()}đ</Text>
                    <Text style = {styles.cardPrice}>Status: {detail.status}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Date: {new Date(detail.createdAt).toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
}
