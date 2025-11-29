import { styles } from "@/src/style";
import { cancelTransactionById, getTransactionDetail } from "@/src/transactions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function TransactionDetail() {
    const { id } = useLocalSearchParams();
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false); // Dropdown toggle
    const navigation = useNavigation();

    // Load transaction detail
    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                const res = await getTransactionDetail(String(id));
                setDetail(res);
            } catch (err) {
                alert("Failed to load transaction detail");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    // Cancel transaction
    const handleCancel = async () => {
        Alert.alert(
            "Confirm Cancel",
            "Are you sure you want to cancel this transaction?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                        const token = await AsyncStorage.getItem("token");
                        if (!token) return alert("Unauthorized");

                        try {
                            await cancelTransactionById(String(id), token);
                            Alert.alert("Success", "Transaction cancelled!", [
                                { text: "OK", onPress: () => navigation.goBack() }
                            ]);
                        } catch (err) {
                            console.log(err);
                            alert("Failed to cancel transaction");
                        }
                    }
                }
            ]
        );
    };

    // Header button
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Transaction Detail",
            headerRight: () => (
                <TouchableOpacity onPress={() => setShowMenu(prev => !prev)}>
                    <Text style={{ fontSize: 26 }}>⋮</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

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
            {showMenu && (
                <View style={[styles.container, styles.dropdown, {
                    position: "absolute",
                    right: 10,
                    top: 10,
                    zIndex: 999,
                    shadowColor: "#000",
                    shadowOffset: { width: 5, height: 10 },
                    shadowOpacity: 0.86,
                }]}>
                    <TouchableOpacity
                        onPress={() => { setShowMenu(false); handleCancel(); }}
                        style={{ paddingVertical: 10 }}
                    >
                        <Text style={{ color: "red", fontWeight: "bold" }}>Cancel Transaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowMenu(false)}
                        style={{ paddingVertical: 10 }}
                    >
                        <Text style={{ fontWeight: "bold" }}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ----- Transaction Detail ----- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Transaction</Text>
                <Text style={styles.cardPrice}>#{detail.id}</Text>

                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: "bold" }}>Customer</Text>
                <Text>Name: <Text style={{ fontWeight: 'bold' }}>{detail.customer?.name}</Text></Text>
                <Text>Phone: <Text style={{ fontWeight: 'bold' }}>{detail.customer?.phone}</Text></Text>

                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: "bold" }}>Services</Text>
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
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                        Total Price: {detail.price.toLocaleString()}đ
                    </Text>
                    <Text style={styles.cardPrice}>Status: {detail.status}</Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        Date: {new Date(detail.createdAt).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
}
