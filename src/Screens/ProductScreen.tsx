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
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { fetchAllProducts } from "../MiddeleWares/HomeMiddeleWare";
import { ProductListParams } from "../TypesCheck/HomeProps"; // Adjust the import path based on your types file
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "../TypesCheck/productCartTypes";
type Props = {};

const ProductScreen = ({ navigation, route }: TabsStackScreenProps<"Product">) => {
  const [products, setProducts] = useState<ProductListParams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("priceLowToHigh"); // Default sorting: price low to high
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);
  const cart = useSelector((state: CartState) => state.cart.cart);
  const dispatch = useDispatch();
  const fetchProducts = useCallback(async () => {
    try {
      await fetchAllProducts({ setProducts }); // Use the new fetchAllProducts function
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        "Failed to load products. Please try again."
      );
      setIsLoading(false);
    }
  }, []); // No dependency on sortOption since sorting is handled locally

  const gotoPreviousScreen = () => {
    navigation.goBack();
  };

  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      navigation.navigate("Cart");
    }
  };

  useEffect(() => {
    fetchProducts();

    // Add a focus listener to refetch data when the screen is focused
    const unsubscribe = navigation.addListener("focus", fetchProducts);

    return unsubscribe; // Cleanup on unmount
  }, [fetchProducts, navigation]);

  const sortProducts = (products: ProductListParams[], option: string) => {
    const sorted = [...products];
    switch (option) {
      case "priceLowToHigh":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleProductPress = (product: ProductListParams) => {
    navigation.navigate("productDetails", product);
  };

  const renderProductItem = ({ item }: { item: ProductListParams }) => (
    <Pressable
      style={styles.productBox}
      onPress={() => handleProductPress(item)}
    >
      <Image
        style={styles.productImage}
        source={{ uri: item.images[0] || "https://via.placeholder.com/100" }} // Fallback placeholder image
        onError={(e) => {
          console.log("Image load error for product", item.name, ":", e);
        }}
      />
      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.productPrice}>
        ${item.price.toLocaleString("vi-VN")}
      </Text>
    </Pressable>
  );

  const sortedProducts = sortProducts(products, sortOption);

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
        <Pressable style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        goToPrevious={gotoPreviousScreen}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
        <View style={styles.sortContainer}>
          <Pressable
            style={styles.sortButton}
            onPress={() => handleSortChange("priceLowToHigh")}
          >
            <Text style={styles.sortButtonText}>
              Price: Low to High
            </Text>
          </Pressable>
          <Pressable
            style={styles.sortButton}
            onPress={() => handleSortChange("priceHighToLow")}
          >
            <Text style={styles.sortButtonText}>
              Price: High to Low
            </Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={sortedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        numColumns={2} // 2 columns per row for grid layout
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        ListFooterComponent={<View style={{ height: 20 }} />} // Optional: Add padding at the bottom
      />
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
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sortButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  productList: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 10,
  },
  productBox: {
    width: "48%", // Approximately half the screen width, accounting for margins
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
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
});

export default ProductScreen;