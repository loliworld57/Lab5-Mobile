import { useState } from "react";
import { saveToken, saveUserName } from "../../src/storage";
import { login } from "../../src/auth";
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../src/style";
import { router } from "expo-router";


export default function LoginScreen() {
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const res = await login(phone, password);
            await saveToken(res.token);
            await saveUserName(res.name);
            Alert.alert("Success", "Login Succesfully!");
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Login Failed")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>KAMI Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Phone"
                onChangeText={setPhone}
                value={phone}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}