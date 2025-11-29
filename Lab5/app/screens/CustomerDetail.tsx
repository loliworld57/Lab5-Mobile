import { deleteCustomerById, getCustomerById } from "@/src/customers";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function CustomerDetail() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false); 

    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this customer?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            if (!token) {
                                alert("Unauthorized");
                                return;
                            }
                            await deleteCustomerById(id as string, token);
                            alert("Customer deleted");
                            router.back();
                        } catch (e) {
                            alert("Error deleting customer");
                            console.log(e);
                        }
                    }
                }
            ]
        );
    };
    const handleUpdate = () => {
        router.push({
            pathname: "/screens/UpdateCustomer",
            params: { id }
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Customer Detail",
            headerRight: () => (
                <TouchableOpacity onPress={() => setShowMenu(prev => !prev)} style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 26 }}>⋮</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);



    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCustomerById(id as string,);
                setCustomer(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showMenu && (
                <View style={[styles.container, styles.dropdown, {
                    position: "absolute",
                    right: 10,
                    top: 10,
                    zIndex: 999,
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 5 },
                    shadowOpacity: 0.5,
                }]}>
                    <TouchableOpacity
                        onPress={() => { setShowMenu(false); handleUpdate(); }}
                        style={{ paddingVertical: 10 }}
                    >
                        <Text style={{ fontWeight: "bold" }}>Update Customer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { setShowMenu(false); handleDelete(); }}
                        style={{ paddingVertical: 10 }}
                    >
                        <Text style={{ color: "red", fontWeight: "bold" }}>Delete Customer</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ----- Customer Info ----- */}
            <View style={[styles.card, { marginBottom: 16 }]}>
                <Text style={styles.cardTitle}>{customer.name}</Text>
                <Text>Phone: {customer.phone}</Text>
                <Text>Loyalty: {customer.loyalty}</Text>
                <Text style={[styles.cardPrice, { marginBottom: 16 }]}>Total Spent: {customer.totalSpent.toLocaleString()} VND</Text>
                <Text>Created At: {new Date(customer.createdAt).toLocaleString()}</Text>
                <Text>Updated At: {new Date(customer.updatedAt).toLocaleString()}</Text>
            </View>

            {/* ----- Transaction List ----- */}
            <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Transactions</Text>

            <FlatList
                data={customer.transactions}
                keyExtractor={(t) => t._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDesc}>ID: {item.id} - {new Date(item.createdAt).toLocaleString()}</Text>
                        <Text style={styles.cardPrice}>Status: {item.status}</Text>
                        <Text style={[styles.button, { color: "white" }]}>Total: {item.price.toLocaleString()} VND</Text>

                        <Text style={{ marginTop: 10, fontWeight: "bold" }}>Services:</Text>
                        {item.services.map((s: any) => (
                            <Text key={s._id}>• {s.name} — {s.price.toLocaleString()} VND x {s.quantity}</Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
}
