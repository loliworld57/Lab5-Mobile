import { styles } from "@/src/style";
import { getAllTransactions } from "@/src/transactions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Transactions() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getAllTransactions();
      setData(res);
    } catch (e) {
      alert("Cannot load transactions");
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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: '#f0f4f5', padding: 10, borderRadius: 8, marginBottom: 12 }}>
        <Text style={styles.cardTitle}>Danh Sách Giao Dịch</Text>

        <TouchableOpacity onPress={load}>
          <Ionicons name="refresh" size={28} color="#4d7688ff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/AddNewTransaction")}>
          <Ionicons name="add-circle" size={28} color="#4d7688ff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/screens/TransactionDetail",
                params: { id: item._id },
              })
            }
          >
            <Text style={styles.cardTitle}>ID: {item.id}</Text>
            <Text style={{ fontWeight: "bold" }}>{item.customer?.name}</Text>
            <Text>{new Date(item.updatedAt).toLocaleDateString()} - <Text style={{ color: "red", fontWeight: "bold" }}>
              {item.status}
            </Text></Text>
            <Text style={{ marginTop: 8, fontWeight: "bold" }}>Services:</Text>
            {item.services?.map((s: any) => (
              <Text key={s._id}>
                {s.name} - <Text style={{ fontWeight: "bold" }}>x{s.quantity} </Text>
              </Text>
            ))}
            <Text style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Price: </Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>
                {item.price.toLocaleString()}đ
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 
