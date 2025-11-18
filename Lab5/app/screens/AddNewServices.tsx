import { addNewService } from "@/src/services";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Button, TouchableOpacity } from "react-native";

export default function AddNewServices() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);


    const handleAddService = async () => {
        if (!name || !price) {
            alert("Fields are empty");
            return;
        }
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                alert("Please Login");
                return;
            }

            await addNewService(name, parseFloat(price), token);
            alert("Service added successfully");
            router.back();
        } catch (e) {
            alert("Error adding service");
            console.log("Error: ", e);
        } finally {
            setLoading(false);
        }

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
                    onPress={handleAddService}
                    style={styles.button}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                        Add Service
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}