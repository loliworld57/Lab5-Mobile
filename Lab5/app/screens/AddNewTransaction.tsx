import { Customer, getAllCustomers } from "@/src/customers";
import { getAllServices, Service } from "@/src/services";
import { styles } from "@/src/style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";

interface SelectedService {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    userId: string;
}

export default function AddNewTransaction() {
    const { customerId } = useLocalSearchParams();
    const router = useRouter();


    const [services, setServices] = useState<Service[]>([]);
    const [users, setUsers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>();
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

    // Load services and users
    useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesData, usersData] = await Promise.all([getAllServices(), getAllCustomers()]);
                setServices(servicesData);
                setUsers(usersData);
            } catch (err) {
                alert("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleService = (service: Service, checked: boolean) => {
        if (checked) {
            setSelectedServices(prev => [...prev, { ...service, quantity: 1, userId: "" }]);
        } else {
            setSelectedServices(prev => prev.filter(s => s._id !== service._id));
        }
    };

    const updateQuantity = (_id: string, quantity: number) => {
        setSelectedServices(prev =>
            prev.map(s => (s._id === _id ? { ...s, quantity } : s))
        );
    };

    const updateStaff = (_id: string, userId: string) => {
        setSelectedServices(prev =>
            prev.map(s => (s._id === _id ? { ...s, userId } : s))
        );
    };

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);

    const goToSummary = () => {
        const customerToUse = selectedCustomerId || customerId;
        if (!customerToUse) return alert("Customer not selected");
        if (selectedServices.length === 0) return alert("Select at least one service");

        const missingStaff = selectedServices.some(s => !s.userId);
        if (missingStaff) return alert("Assign a staff for all selected services");

        router.push({
            pathname: "/screens/TransactionSummary",
            params: {
                customerId: customerToUse,
                selectedServices: JSON.stringify(selectedServices),
            },
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { padding: 20 }]}>
            <Text style={styles.cardTitle}>Add New Transaction</Text>

            {/* Select customer for the transaction (or use one passed in params) */}
            <Dropdown
                data={users.map(u => ({ label: `${u.name}${u.phone ? ` (${u.phone})` : ''}`, value: u._id }))}
                labelField="label"
                valueField="value"
                placeholder="Select Customer"
                value={selectedCustomerId}
                onChange={item => setSelectedCustomerId(item.value)}
                style={[styles.input,{ marginVertical: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 }]}
            />

            {/* Service selection */}
            <FlatList
                data={services}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                    const isSelected = selectedServices.some(s => s._id === item._id);
                    const quantity = selectedServices.find(s => s._id === item._id)?.quantity || 1;
                    const userId = selectedServices.find(s => s._id === item._id)?.userId || "";

                    return (
                        <View style={[styles.card, { marginBottom: 10 }]}>
                            <BouncyCheckbox
                                isChecked={isSelected}
                                onPress={(checked: boolean) => toggleService(item, checked)}
                                text={`${item.name} - ${item.price.toLocaleString()}đ`}
                                fillColor="green"
                            />

                            {isSelected && (
                                <>
                                    {/* Quantity */}
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="number-pad"
                                        value={quantity.toString()}
                                        onChangeText={text => updateQuantity(item._id, Number(text))}
                                        placeholder="Quantity"
                                    />

                                    {/* Staff dropdown */}
                                    <Dropdown
                                        data={users.map(u => ({ label: u.name, value: u._id }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Assign Staff"
                                        value={userId}
                                        onChange={staff => updateStaff(item._id, staff.value)}
                                        style={{ marginVertical: 5, borderWidth: 1, borderColor: "#2ab3dcff", borderRadius: 8, paddingHorizontal: 10 }}
                                    />

                                </>
                            )}
                        </View>
                    );
                }}
            />

            <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 10 }}>
                Total Price: {totalPrice.toLocaleString()}đ
            </Text>

            <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={goToSummary}
            >
                <Text style={{ color: "white", textAlign: "center" }}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
