import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Platform,
    Pressable,
    Image,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import * as ImagePicker from "expo-image-picker";
import { createCategory, fetchCategories } from "../MiddeleWares/HomeMiddeleWare"; // Update middleware for category creation
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { ICatProps } from "../TypesCheck/CategoryTypes"; // Use ICatProps for categories
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage"; // Adjust path if needed

const CreateCategoryScreen = ({ navigation }: RootStackScreenProps<"CreateCategory">) => {
    const [form, setForm] = useState<Omit<ICatProps["item"], "images" | "_id"> & { images: [string] }>({
        name: "",
        images: [""], // Store single image URI as an array with one element
    });
    const [displayMessage, setDisplayMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showCategories, setShowCategories] = useState(false); // Removed categories state since it’s not needed for creation

    // No need to fetch categories for creation, but keep requestMediaPermissions for image picking
    useEffect(() => {
        requestMediaPermissions();
    }, []);

    const requestMediaPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                console.log("Photo library permission denied");
                Alert.alert("Permission Denied", "We need photo library access to pick images.");
            } else {
                console.log("Photo library permission granted");
            }
        }
    };

    const handleInputChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const pickImage = () => {
        console.log("Pick Image button pressed");
        if (Platform.OS !== "web") {
            launchImagePicker();
        } else {
            console.log("Image picking not supported on web");
            setMessage("Image picking is not supported on web");
            setDisplayMessage(true);
            setTimeout(() => setDisplayMessage(false), 3000);
            Alert.alert("Error", "Image picking is not supported on web.");
        }
    };

    const launchImagePicker = async () => {
        console.log("Launching image picker...");
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            console.log("Image picker result:", JSON.stringify(result, null, 2));
            if (result.canceled) {
                console.log("User cancelled image picker");
                setMessage("Image selection cancelled");
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
            } else if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                console.log("Selected image URI:", asset.uri);
                setForm({ ...form, images: [asset.uri] }); // Update images as an array with one element
                setMessage("Image selected successfully");
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
            } else {
                console.log("Unexpected result format:", result);
                setMessage("Unexpected error selecting image");
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
                Alert.alert("Error", "Unexpected error selecting image. Please try again.");
            }
        } catch (err) {
            console.log("Error launching image picker:", err);
        }
    };

    const submitCategory = () => {
        if (!form.name || !form.images[0]) {
            setMessage("Please enter a category name and select an image");
            setDisplayMessage(true);
            setTimeout(() => setDisplayMessage(false), 3000);
            return;
        }

        const categoryData: Omit<ICatProps["item"], "_id"> = {
            name: form.name,
            images: form.images, // Send images as an array with one element [string]
        };

        console.log("Submitting category data with image:", categoryData); // Debug log

        createCategory({
            categoryData,
            onSuccess: (successMessage) => {
                setMessage(successMessage);
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                    navigation.navigate("TabsStack", { screen: "Profile" }); // Navigate back to Profile or another screen
                }, 3000);
                setForm({
                    name: "",
                    images: [""], // Reset images array with empty string
                });
            },
            onError: (errorMessage) => {
                setMessage(errorMessage);
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
            },
        });
    };

    const gotoPreviousScreen = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {displayMessage && <DisplayMessage message={message} />}

            <HeadersComponent
                gotoCartScreen={() => {}} // No cart screen for categories, you can remove or adjust
                goToPrevious={gotoPreviousScreen}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create New Category</Text>

                    {/* Category Name: Input box */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Category Name:</Text>
                        <TextInput
                            placeholder="Enter category name"
                            value={form.name}
                            onChangeText={(text) => handleInputChange("name", text)}
                            style={styles.input}
                        />
                    </View>

                    {/* Category Image */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Category Image:</Text>
                        <Pressable onPress={pickImage} style={styles.imageButton}>
                            <Text style={styles.imageButtonText}>
                                {form.images[0] ? "Change Image" : "Pick Image"}
                            </Text>
                        </Pressable>
                    </View>
                    {form.images[0] && (
                        <Image
                            source={{ uri: form.images[0] }}
                            style={styles.productImage}
                            onError={(e) => console.log("Image load error:", e)}
                        />
                    )}

                    <Pressable onPress={submitCategory} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Create Category</Text>
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
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
        marginBottom: 15,
    },
    formField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
        fontWeight: "500",
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
    imageButton: {
        backgroundColor: "#D8D8D8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    imageButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    productImage: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 15,
        alignSelf: "center",
    },
    submitButton: {
        backgroundColor: "#FFC72C",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: "center",
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#800080",
    },
});

export default CreateCategoryScreen;