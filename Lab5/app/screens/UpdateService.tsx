import { addNewService, getServiceById, updateServiceById } from "@/src/services";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Button, TouchableOpacity } from "react-native";

export default function UpdateService() {

    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServiceById(id as string);
                setName(data.name);
                setPrice(data.price.toString());
            } catch (e) {
                alert("Error loading service");
                console.log("Error: ", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleUpdate = async () => {
        if (!name || !price) {
            alert("Fields are empty");
            return;
        }
        try {
            setSaving(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                alert("Please Login");
                return;
            }
            await updateServiceById(id as string, name, parseFloat(price), token);
            alert("Service updated successfully");
            router.back();
        } catch (e) {
            alert("Error updating service");
            console.log("Error: ", e);
        } finally {
            setSaving(false);
        }
    }
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Text style={styles.cardTitle}>Add New Service</Text>

            <TextInput
                placeholder="Service name"
                value={name}
                onChangeText={setName}
                style={[styles.input, { marginBottom: 12 }]}
            />

            <TextInput
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { marginBottom: 12 }]}
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <TouchableOpacity
                    onPress={handleUpdate}
                    style={styles.button}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                        Update Service
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}