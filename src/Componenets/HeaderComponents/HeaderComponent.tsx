import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, Image, ActivityIndicator, ScrollView } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { GoBack } from "./GoBackButton";
import { searchProductsByName } from "../../MiddeleWares/HomeMiddeleWare";
import { ProductListParams } from "../../TypesCheck/HomeProps";
import { CartState } from "../../TypesCheck/productCartTypes";

const { width, height } = Dimensions.get('window');

interface IHeaderParams {
    pageTitle?: string;
    goToPrevious?: () => void;
    search?: (searchQuery: string) => void;
    gotoCartScreen?: () => void;
    navigateToProductDetail?: (product: ProductListParams) => void;
}

export const HeadersComponent = ({ goToPrevious, search, gotoCartScreen, navigateToProductDetail }: IHeaderParams) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<ProductListParams[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const cart = useSelector((state: CartState) => state.cart.cart);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        if (searchInput) {
            setIsLoading(true);
            searchProductsByName({ searchQuery: searchInput, setSearchResults })
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        } else {
            setSearchResults([]);
        }
    }, [searchInput]);

    // Calculate maximum height for 3 products
    const itemHeight = 80; // Height per item (including padding and borders, adjust as needed)
    const maxVisibleItems = 3; // Maximum number of items to show before scrolling
    const maxHeight = maxVisibleItems * itemHeight + 20; // Add padding

    return (
        <View style={styles.headerContainer}>
            <GoBack onPress={goToPrevious} />

            <View style={styles.searchContainer}>
                <Pressable style={styles.searchIcon} onPress={() => searchProductsByName({ searchQuery: searchInput, setSearchResults })}>
                    <AntDesign name="search1" size={22} color={"#007AFF"} />
                </Pressable>
                <TextInput
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#666"
                    style={styles.searchInput}
                    // Removed onFocus={() => setSearchResults([])} to prevent clearing results when re-focusing
                />
            </View>

            <Pressable onPress={gotoCartScreen}>
                <View style={styles.cartNum}>
                    <Text style={styles.cartNumText}>
                        {totalQuantity || 0}
                    </Text>
                </View>
                <MaterialIcons name="shopping-cart" size={26} color={"white"} style={styles.cartIcon} />
            </Pressable>

            {searchInput.length > 0 && (
                <View style={[styles.searchResultsContainer, { height: maxHeight }]}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#007AFF" />
                        </View>
                    ) : searchResults.length > 0 ? (
                        <ScrollView>
                            {searchResults.map((item) => (
                                <TouchableOpacity
                                    key={item._id}
                                    onPress={() => navigateToProductDetail && navigateToProductDetail(item)}
                                    style={styles.searchResultItem}
                                >
                                    <Image
                                        source={{ uri: item.images[0] }}
                                        style={styles.productImage}
                                        onError={(e) => console.log("Image load error:", e)}
                                    />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noResultsText}>No results found</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#1A1A1A", // Darker background for contrast
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        backgroundColor: "#FFF",
        borderRadius: 12,
        height: 42,
        flex: 1,
        elevation: 2, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    cartNum: {
        position: "absolute",
        top: -5,
        right: -8,
        height: 22,
        width: 22,
        backgroundColor: "#FF2D55",
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#1A1A1A",
    },
    cartNumText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    cartIcon: {
        padding: 8,
    },
    searchResultsContainer: {
        zIndex: 9999,
        backgroundColor: "#1A1A1A",
        position: "absolute",
        top: 60,
        left: 10,
        right: 10,
        borderRadius: 12,
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    searchResultItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
    productPrice: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },
    loadingContainer: {
        paddingVertical: 10,
        alignItems: "center",
    },
    noResultsText: {
        color: "#FFF",
        fontSize: 14,
        textAlign: "center",
        paddingVertical: 10,
    },
});