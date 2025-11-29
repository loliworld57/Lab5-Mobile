import { getCustomerById, updateCustomerById } from "@/src/customers";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function UpdateCustomer() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCustomerById(id as string);
                setName(data.name);
                setPhone(data.phone);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // -------- Handle Save --------
    const handleSave = async () => {
        if (!name.trim()) {
            alert("Name cannot be empty");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                alert("Unauthorized");
                return;
            }

            await updateCustomerById(
                id as string,
                { name, phone },
                token
            );
            Alert.alert("Success", "Customer updated successfully", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not update customer");
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // -------- UI --------
    return (
        <View style={[styles.container, { padding: 20 }]}>

            <Text style={styles.cardTitle}>Update Customer</Text>

            <Text style={{ marginTop: 20 }}>Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Customer name"
            />

            <Text style={{ marginTop: 10 }}>Phone:</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, { marginTop: 20 }]}
            >
                <Text style={{ color: "white", textAlign: "center" }}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}
