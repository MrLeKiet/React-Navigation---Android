import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";

const OrderScreen = ({ navigation, route }: TabsStackScreenProps<"Order">) => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");

    const handleOrder = () => {
        // Handle order submission logic here
        console.log("Order submitted with address:", { address, city, state, zipCode });
        // Navigate to the next screen or show a success message
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <Text style={styles.title}>Enter Your Shipping Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={state}
                            onChangeText={setState}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Zip Code"
                            value={zipCode}
                            onChangeText={setZipCode}
                            keyboardType="numeric"
                        />
                        <Pressable style={styles.button} onPress={handleOrder}>
                            <Text style={styles.buttonText}>Submit Order</Text>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#FFC72C",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default OrderScreen;