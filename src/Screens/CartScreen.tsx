import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../redux/CartReducer"; // Adjusted for correct spelling
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { CartState, ProductListParams } from "../TypesCheck/productCartTypes";
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { UserType } from "../Componenets/LoginRegisterComponents/UserContent";

const screenWidth = Dimensions.get("window").width;

const CartScreen = ({ navigation, route }: TabsStackScreenProps<"Cart">) => {
  const { getUserId, setGetUserId } = useContext(UserType);
  const proceed = () => {
    if (getUserId === "") {
      navigation.navigate("UserLogin", { screenTitle: "User Authentication" });
    } else {
      if (cart.length === 0) {
        navigation.navigate("TabsStack", { screen: "Home" });
      }
    }
  };

  const cart = useSelector((state: CartState) => state.cart.cart);
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);
  const gotoPreviousScreen = () => {
    navigation.goBack();
  };

  const decreaseItem = (item: ProductListParams) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
      setMessage("Product Quantity Updated Successfully");
      setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
    } else {
      
    }
  };

  const deleteItem = (item: ProductListParams) => {
    dispatch(removeFromCart(item._id)); // Only pass the product ID
    setMessage("Product Removed Successfully");
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
  };

  const addItem = (item: ProductListParams) => {
    dispatch(increaseQuantity(item)); // Gọi action để tăng số lượng
    setMessage("Product Quantity Updated Successfully");
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
  }

  useEffect(() => {
    if (cart.length === 0) {
      setMessage("Your cart is Empty, Please Add products to continue!");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
        navigation.navigate("TabsStack", { screen: "Home" });
      }, 3000);
    }
  }, [cart.length]);

  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      navigation.navigate("TabsStack", { screen: "Cart" });
    }
  };

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  const handleProductPress = (product: ProductListParams) => {
    navigation.navigate("productDetails", product);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {displayMessage && <DisplayMessage message={message} />}

      <HeadersComponent gotoCartScreen={gotoCartScreen} goToPrevious={gotoPreviousScreen} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cartContainer}>
          {cart?.map((item, index) => (
            <View style={styles.cartItem} key={index}>
              <View style={styles.itemHeader}>
                <Pressable onPress={() => handleProductPress(item)}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: item?.images[0] }}
                    onError={(e) => console.log("Image load error:", e)}
                  />
                </Pressable>
                <View style={styles.itemDetails}>
                  <Pressable onPress={() => handleProductPress(item)}>
                    <Text numberOfLines={2} style={styles.productName}>
                      {item.name}
                    </Text>
                  </Pressable>
                  <Text style={styles.productPrice}>
                    Price: {item.price.toLocaleString("vi-VN")}$
                  </Text>
                </View>
              </View>

              <View style={styles.quantityControls}>
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={() => decreaseItem(item)}
                    style={styles.quantityButton}
                  >
                    <AntDesign name="minus" size={20} color="black" />
                  </Pressable>

                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => addItem(item)}
                    style={styles.quantityButton}
                  >
                    <Feather name="plus" size={20} color="black" />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => deleteItem(item)}
                  style={styles.deleteButton}
                >
                  <View style={styles.deleteButtonContent}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                    <AntDesign name="delete" size={20} color="white" />
                  </View>
                </Pressable>
                <Text style={styles.itemTotal}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}$
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
              {total.toLocaleString("vi-VN")}$
            </Text>
          </View>
          <Pressable onPress={proceed} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>
              Click to buy ({cart.length})
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
    backgroundColor: "#F5F5F5", // Light gray background for a clean look
    paddingTop: Platform.OS === "android" ? 24 : 0, // Adjusted padding for Android
  },
  scrollView: {
    flex: 1,
  },
  cartContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  cartItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    padding: 15, // Increased padding for better spacing
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  productImage: {
    width: 120, // Slightly smaller to fit better with text
    height: 120,
    resizeMode: "contain",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10, // Added gap for better spacing
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 5,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "#D8D8D8",
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: "#FF4444", // Red for delete button, matching your screenshot
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745", // Green for totals, matching your screenshot
    marginLeft: 10,
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light border for separation
    paddingBottom: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000", // Black for better contrast, instead of blue
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28A745", // Green for totals, matching your screenshot
  },
  checkoutButton: {
    backgroundColor: "#FFC72C", // Yellow for the checkout button, matching your screenshot
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
  checkoutButtonText: {
    fontSize: 16, // Reduced for better proportionality, matching your screenshot
    fontWeight: "bold",
    color: "#800080", // Purple for contrast, matching your screenshot
  },
});

export default CartScreen;