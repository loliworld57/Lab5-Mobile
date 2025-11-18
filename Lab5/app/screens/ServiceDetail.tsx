import { deleteServiceById, getServiceById } from "@/src/services";
import { styles } from "@/src/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, TouchableOpacity, View } from "react-native";


export default function ServiceDetail() {

    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServiceById(id as string);
                setService(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure ?",
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
                            await deleteServiceById(id as string, token);
                            alert("Service deleted successfully");
                            router.back();
                        } catch (e) {
                            alert("Error deleting service");
                            console.log("Error: ", e);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleUpdate = () => {
        router.push({
            pathname: "/screens/UpdateService",
            params: { id }
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Service Detail",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Options",
                            "Select an action",
                            [
                                { text: "Update", onPress: handleUpdate },
                                { text: "Delete", style: "destructive", onPress: handleDelete },
                                { text: "Cancel", style: "cancel" },
                            ],
                            { cancelable: true }
                        );
                    }}
                >
                    <Text style={{fontSize: 26}}>⋮</Text>
                </TouchableOpacity>
            ),
        });
    }, [service]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
            <View
                style={styles.card}
            >
                <Text style={styles.cardTitle}>{service.name}</Text>
                <Text style={styles.cardPrice}>{service.price.toLocaleString()} VND</Text>

                <Text>Created By: {service.user?.name || "Unknown"}</Text>
                <Text>Phone: {service.user?.phone}</Text>

                <Text>Created At: {new Date(service.createdAt).toLocaleString()}</Text>
                <Text>Last Updated: {new Date(service.updatedAt).toLocaleString()}</Text>
            </View>
        </View>
    );
}