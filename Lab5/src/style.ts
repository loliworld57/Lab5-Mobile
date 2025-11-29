import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#c0d7e3ff",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#ffffff",
        borderWidth: 2,
        borderColor: "#66afc3ff",
        padding: 10,
        marginBottom: 12,
        borderRadius: 8,
    },
    card: {
        width: "90%",
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#4d7688ff"
    },

    cardPrice: {
        fontSize: 13,
        fontWeight: "400",
        color: "#db2525ff",
        marginBottom: 5,
    },

    cardDesc: {
        fontSize: 13,
        color: "#17ade3ff",
    },
    homeTitle: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    tabBar: {
        backgroundColor: "#66afc3ff",
        height: 60,
        borderTopWidth: 0,
        elevation: 4,
    },
    headerTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#4d7688ff",  
        paddingVertical: 12,           
        paddingHorizontal: 20,        
        borderRadius: 8,           
        alignItems: "center",       
        marginTop: 12
    },
    dropdown: {
        backgroundColor: "#ffffff",
        borderWidth: 2,
        borderColor: "#66afc3ff",
        padding: 10,
    }
});
