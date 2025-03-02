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
import { createProduct, fetchCategories } from "../MiddeleWares/HomeMiddeleWare";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { ProductListParams } from "../TypesCheck/HomeProps";
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";

const CreateProductScreen = ({ navigation }: RootStackScreenProps<"CreateProduct">) => {
    const [form, setForm] = useState<Omit<ProductListParams, "images" | "_id"> & { images: string[] }>({
        name: "",
        price: 0,
        oldPrice: 0,
        inStock: false,
        description: "",
        quantity: 0,
        category: "", // Store the category ID
        categoryName: "", // Store the category name for display
        images: [], // Array to store up to 3 image URIs
    });
    const [displayMessage, setDisplayMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState<ProductListParams[]>([]);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        // Fetch categories and request image permissions
        fetchCategories({ setGetCategory: setCategories });
        console.log("Fetched categories:", categories); // Debug log for categories
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
        if (field === "price" || field === "oldPrice" || field === "quantity") {
            const numericValue = parseFloat(value) || 0;
            setForm({ ...form, [field]: numericValue });
        } else {
            setForm({ ...form, [field]: value });
        }
    };

    const pickImage = () => {
        console.log("Pick Images button pressed");
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
                allowsMultipleSelection: true, // Enable multiple image selection
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
                // Limit to 3 images total (including existing ones)
                const newImages = result.assets.map(asset => asset.uri);
                const updatedImages = [...form.images, ...newImages].slice(0, 3); // Keep only up to 3 images
                console.log("Selected image URIs:", updatedImages);
                setForm({ ...form, images: updatedImages });
                setMessage("Images selected successfully");
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
            } else {
                console.log("Unexpected result format:", result);
                setMessage("Unexpected error selecting images");
                setDisplayMessage(true);
                setTimeout(() => setDisplayMessage(false), 3000);
                Alert.alert("Error", "Unexpected error selecting images. Please try again.");
            }
        } catch (err) {
            console.log("Error launching image picker:", err);
        }
    };

    const toggleInStock = () => {
        setForm({ ...form, inStock: !form.inStock });
    };

    const selectCategory = (categoryId: string, categoryName: string) => {
        setForm({ ...form, category: categoryId, categoryName }); // Store both ID and name
        setShowCategories(false);
        console.log("Selected category ID:", categoryId, "Name:", categoryName); // Debug log
    };

    const submitProduct = () => {
        if (form.images.length === 0) {
            setMessage("Please select at least one image");
            setDisplayMessage(true);
            setTimeout(() => setDisplayMessage(false), 3000);
            return;
        }

        const productData: Omit<ProductListParams, "images" | "_id"> & { images: string[] } = {
            name: form.name,
            price: form.price,
            oldPrice: form.oldPrice || undefined,
            inStock: form.inStock,
            description: form.description || undefined,
            quantity: form.quantity,
            images: form.images, // Send array of image URIs
            category: form.category || undefined, // Send the ID to the backend
        };

        console.log("Submitting product data with images and category ID:", productData); // Debug log

        createProduct({
            productData,
            onSuccess: (successMessage) => {
                setMessage(successMessage);
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                    navigation.navigate("TabsStack", { screen: "Home" });
                }, 3000);
                setForm({
                    name: "",
                    price: 0,
                    oldPrice: 0,
                    inStock: false,
                    description: "",
                    quantity: 0,
                    category: "",
                    categoryName: "",
                    images: [], // Reset images array
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

    const gotoCartScreen = () => {
        navigation.navigate("TabsStack", { screen: "Cart" });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {displayMessage && <DisplayMessage message={message} />}

            <HeadersComponent
                gotoCartScreen={gotoCartScreen}
                goToPrevious={gotoPreviousScreen}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create New Product</Text>

                    {/* Product Name: Input box */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Product Name:</Text>
                        <TextInput
                            placeholder="Enter product name"
                            value={form.name}
                            onChangeText={(text) => handleInputChange("name", text)}
                            style={styles.input}
                        />
                    </View>

                    {/* Select Category: Dropdown button */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Select Category:</Text>
                        <View style={styles.categoryContainer}>
                            <Pressable
                                onPress={() => {
                                    console.log("Toggling categories, current categoryName:", form.categoryName);
                                    setShowCategories(!showCategories);
                                }}
                                style={styles.categoryButton}
                            >
                                <View style={styles.categoryButtonContent}>
                                    {form.categoryName ? (
                                        <View style={styles.categoryButtonItem}>
                                            <Text style={styles.categoryButtonText}>
                                                {form.categoryName || "Select Category"}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.categoryButtonText}>Select Category</Text>
                                    )}
                                </View>
                            </Pressable>
                            {showCategories && (
                                <View style={styles.categoryDropdown}>
                                    <ScrollView style={styles.categoryScrollView}>
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <Pressable
                                                    key={cat._id}
                                                    onPress={() => selectCategory(cat._id, cat.name)} // Pass both ID and name
                                                    style={styles.categoryItem}
                                                >
                                                    <View style={styles.categoryItemContent}>
                                                        {cat.images && cat.images.length > 0 && (
                                                            <Image
                                                                source={{ uri: cat.images[0] }} // Use first image if available
                                                                style={styles.categoryImage}
                                                                onError={(e) => console.log("Category image load error:", e)}
                                                            />
                                                        )}
                                                        <View style={styles.categoryInfo}>
                                                            <Text style={styles.categoryText} numberOfLines={1}>
                                                                {cat.name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </Pressable>
                                            ))
                                        ) : (
                                            <Text style={styles.noCategoryText}>No categories available</Text>
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Price */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Price:</Text>
                        <TextInput
                            placeholder="Enter price"
                            value={String(form.price)}
                            onChangeText={(text) => handleInputChange("price", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    {/* Old Price */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Old Price:</Text>
                        <TextInput
                            placeholder="Enter old price"
                            value={String(form.oldPrice)}
                            onChangeText={(text) => handleInputChange("oldPrice", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    {/* In Stock */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>In Stock:</Text>
                        <View style={styles.toggleContainer}>
                            <Pressable
                                onPress={toggleInStock}
                                style={[styles.toggleButton, form.inStock && styles.toggleButtonActive]}
                            >
                                <Text style={styles.toggleButtonText}>
                                    {form.inStock ? "True" : "False"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Description:</Text>
                        <TextInput
                            placeholder="Enter description"
                            value={form.description}
                            onChangeText={(text) => handleInputChange("description", text)}
                            style={styles.input}
                            multiline
                        />
                    </View>

                    {/* Quantity */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Quantity:</Text>
                        <TextInput
                            placeholder="Enter quantity"
                            value={String(form.quantity)}
                            onChangeText={(text) => handleInputChange("quantity", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    {/* Pick Images */}
                    <View style={styles.formField}>
                        <Text style={styles.label}>Images:</Text>
                        <Pressable onPress={pickImage} style={styles.imageButton}>
                            <Text style={styles.imageButtonText}>Pick Images (Up to 3)</Text>
                        </Pressable>
                    </View>
                    {form.images.length > 0 && (
                        <View style={styles.imagePreviewContainer}>
                            {form.images.map((uri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={styles.productImage}
                                    onError={(e) => console.log("Image load error:", e)}
                                />
                            ))}
                        </View>
                    )}

                    <Pressable onPress={submitProduct} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Create Product</Text>
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
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#D8D8D8",
    },
    toggleButtonActive: {
        backgroundColor: "#4CAF50",
    },
    toggleButtonText: {
        color: "#000",
        fontWeight: "600",
    },
    categoryContainer: {
        marginBottom: 0, // No additional margin since it's in formField
    },
    categoryButton: {
        backgroundColor: "#F0F0F0",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    categoryButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    categoryButtonItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    categoryButtonText: {
        fontSize: 16,
        color: "#333",
    },
    categoryDropdown: {
        position: "absolute",
        top: 60, // Adjusted to match search bar positioning
        left: 10,
        right: 10,
        backgroundColor: "#1A1A1A", // Dark background like search bar
        borderRadius: 12,
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        zIndex: 1000,
    },
    categoryScrollView: {
        maxHeight: 240, // Adjusted to match search bar’s maxHeight (3 items * 80 + 20 padding)
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#333", // Match search bar border color
    },
    categoryItemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12, // Space between image and text, matching search bar
    },
    categoryImage: {
        width: 60, // Match search bar product image size
        height: 60, // Match search bar product image size
        borderRadius: 8,
        marginRight: 12,
    },
    categoryInfo: {
        flex: 1, // Ensure text takes remaining space
    },
    categoryText: {
        color: "#FFF", // White text like search bar
        fontSize: 16,
        fontWeight: "500", // Match search bar text weight
        flex: 1, // Allow text to wrap and take remaining space
    },
    noCategoryText: {
        color: "#FFF", // White text like search bar
        fontSize: 14,
        textAlign: "center",
        paddingVertical: 10,
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
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 15,
    },
    productImage: {
        width: 100, // Smaller images for preview
        height: 100,
        resizeMode: "contain",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        margin: 5,
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

export default CreateProductScreen;