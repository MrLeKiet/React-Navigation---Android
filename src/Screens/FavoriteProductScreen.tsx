import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Image,
} from "react-native";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { useSelector, useDispatch } from "react-redux";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { removeFavorite } from "../redux/HeartReducer"; // Import removeFavorite action
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
type Props = {};

const FavoriteProductScreen = ({ navigation }: RootStackScreenProps<"FavoriteProduct">) => {
    const favorites = useSelector((state: any) => state.favorites.favorites); // Get favorites from Redux
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleProductPress = (product: ProductListParams) => {
        navigation.navigate("productDetails", product);
    };

    const handleRemoveFavorite = (productId: string) => {
        dispatch(removeFavorite(productId));
        setMessage("Product removed from favorites.");
        setDisplayMessage(true);
        setTimeout(() => {
            setDisplayMessage(false);
        }, 3000);
    };

    const gotoPreviousScreen = () => {
        navigation.goBack();
    };


    const [message, setMessage] = useState("");
    const [displayMessage, setDisplayMessage] = useState<boolean>(false);

    const renderProductItem = ({ item }: { item: ProductListParams }) => (
        <View style={styles.productContainer}>
            <Pressable
                style={styles.productBox}
                onPress={() => handleProductPress(item)}
            >
                <Image
                    style={styles.productImage}
                    source={{ uri: item.images[0] || "https://via.placeholder.com/100" }} // Fallback placeholder image
                    onError={(e) => console.log("Image load error for product", item.name, ":", e)}
                />
                <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.productPrice}>
                    ${item.price.toLocaleString("vi-VN")}
                </Text>
            </Pressable>
            <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(item._id)}
            >
                <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeadersComponent
                gotoCartScreen={() => { }} // No cart screen for categories, you can remove or adjust
                goToPrevious={gotoPreviousScreen}
            />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorite Products</Text>
            </View>
            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No favorite products yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item._id}
                    numColumns={2} // 2 columns per row for grid layout
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.productList}
                    ListFooterComponent={<View style={{ height: 20 }} />} // Optional: Add padding at the bottom
                />
            )}
            {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 24 : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    errorText: {
        fontSize: 16,
        color: "#FF0000",
        marginBottom: 10,
        textAlign: "center",
    },
    header: {
        paddingVertical: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#041E42",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
    productList: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    row: {
        justifyContent: "space-around",
        marginBottom: 10,
    },
    productContainer: {
        width: "48%", // Approximately half the screen width, accounting for margins
        marginBottom: 10,
    },
    productBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 10,
        alignItems: "center",
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        borderRadius: 8,
        marginBottom: 5,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#28A745", // Green for price, matching ProductDetails
        textAlign: "center",
    },
    removeButton: {
        backgroundColor: "#FF4444",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 5,
        alignItems: "center",
    },
    removeButtonText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default FavoriteProductScreen;