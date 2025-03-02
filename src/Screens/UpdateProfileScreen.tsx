import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../Navigation/RootNavigator";

type Props = {};

const UpdateProfileScreen = ({ navigation, route }: RootStackScreenProps<"UpdateProfile">) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) {
                    setError("No authentication token found. Please log in again.");
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(
                    "http://192.168.68.107:9000/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send token as Bearer token
                        },
                    }
                );

                const { user: userData } = response.data;
                setForm({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    mobileNo: userData.mobileNo || "",
                });
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSave = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found. Please log in again.");
                setIsSubmitting(false);
                return;
            }

            const response = await axios.put(
                "http://192.168.68.107:9000/user/updateProfile",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token as Bearer token
                    },
                }
            );

            Alert.alert("Success", response.data.message || "Profile updated successfully!");
            
            // Refetch the updated profile data
            const updatedResponse = await axios.get(
                "http://192.168.68.107:9000/user/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { user: updatedUserData } = updatedResponse.data;
            setForm({
                firstName: updatedUserData.firstName || "",
                lastName: updatedUserData.lastName || "",
                email: updatedUserData.email || "",
                mobileNo: updatedUserData.mobileNo || "",
            });

            // Navigate back to ProfileScreen and trigger a refresh
            navigation.goBack(); // Go back to ProfileScreen
        } catch (err) {
            console.error("Error updating profile:", err);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                    style={styles.retryButton}
                    onPress={() => setIsLoading(true)} // Retry fetch
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeadersComponent
                pageTitle="Update Profile"
                goToPrevious={() => navigation.goBack()}
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <View style={styles.formField}>
                        <Text style={styles.label}>First Name:</Text>
                        <TextInput
                            value={form.firstName}
                            onChangeText={(text) => handleInputChange("firstName", text)}
                            style={styles.input}
                            placeholder="Enter first name"
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Last Name:</Text>
                        <TextInput
                            value={form.lastName}
                            onChangeText={(text) => handleInputChange("lastName", text)}
                            style={styles.input}
                            placeholder="Enter last name"
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            value={form.email}
                            onChangeText={(text) => handleInputChange("email", text)}
                            style={styles.input}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.label}>Mobile Number:</Text>
                        <TextInput
                            value={form.mobileNo}
                            onChangeText={(text) => handleInputChange("mobileNo", text)}
                            style={styles.input}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <Pressable
                        style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.saveButtonText}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 24 : 0,
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        marginHorizontal: 15,
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 15,
    },
    formField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#333",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    saveButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: "#999",
        elevation: 0,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FF0000",
        marginBottom: 10,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UpdateProfileScreen;