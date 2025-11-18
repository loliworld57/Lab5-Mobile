import { useEffect, useLayoutEffect, useState } from "react";
import { getAllServices, Service } from "../../src/services";
import { ActivityIndicator, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../src/style";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function HomeScreen() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await getAllServices();
            setServices(data);
        } catch (e) {
            console.log("Error: ", e);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadServices();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" , backgroundColor: '#f0f4f5', padding: 10, borderRadius: 8, marginBottom: 12}}>
                <Text style={styles.cardTitle}>Danh Sách Dịch Vụ</Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity onPress={loadServices}>
                        <Ionicons name="refresh" size={28} color="#4d7688ff" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/screens/AddNewServices")}>
                        <Ionicons name="add-circle" size={28} color="#4d7688ff" />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({
                        pathname: "/screens/ServiceDetail",
                        params: { id: item._id }
                    })}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardPrice}>{item.price.toLocaleString()} VND</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}