import React, { useEffect, useState, useContext, useRef } from "react";
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
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { CartState, ProductListParams } from "../TypesCheck/productCartTypes";
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { UserType } from "../Componenets/LoginRegisterComponents/UserContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps"; // Removed PROVIDER_GOOGLE for free OSM
import * as Location from "expo-location"; // For geolocation

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CartScreen = ({ navigation, route }: TabsStackScreenProps<"Cart">) => {
  const { getUserId, setGetUserId } = useContext(UserType);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false); // Track if showing order form
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [lastLocationFetch, setLastLocationFetch] = useState<number>(0); // Track last location fetch timestamp
  const mapRef = useRef<MapView>(null);

  // Check login status using AsyncStorage and refresh on focus
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Checking login status in CartScreen, token:", token);
      setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
      if (token) {
        setGetUserId(token); // Sync getUserId with token if it exists
      } else {
        setGetUserId(""); // Clear getUserId if no token
      }

      // Check if we need to show the order form after returning from login
      const shouldShowOrder = route.params?.shouldShowOrder;
      if (shouldShowOrder && token) {
        setShowOrderForm(true);
      }
    };
    checkLoginStatus();

    // Add a focus listener to refresh login status when the screen is focused
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("CartScreen focused, refreshing login status...");
      checkLoginStatus();
    });

    return () => {
      unsubscribeFocus(); // Cleanup focus listener
    };
  }, [navigation, route.params, setGetUserId]);

  const proceed = () => {
    if (cart.length === 0) {
      // If cart is empty, navigate to Home in TabsStack (for both logged-in and logged-out users)
      navigation.navigate("Home");
    } else if (!isLoggedIn) {
      // If user is not logged in, navigate to Profile in TabsStack with intent to return to order
      navigation.navigate("Profile");
    } else {
      // If user is logged in and cart is not empty, show the order form
      setShowOrderForm(true);
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
    dispatch(increaseQuantity(item)); // Call action to increase quantity
    setMessage("Product Quantity Updated Successfully");
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
  };

  useEffect(() => {
    if (cart.length === 0) {
      setMessage("Your cart is Empty, Please Add products to continue!");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
        navigation.navigate("Home");
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
      navigation.navigate("Cart");
    }
  };

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  const handleProductPress = (product: ProductListParams) => {
    navigation.navigate("productDetails", product);
  };

  // Get user's current location with rate limiting
  const getLocation = async () => {
    const now = Date.now();
    const MIN_TIME_BETWEEN_REQUESTS = 10000; // 10 seconds between requests

    if (now - lastLocationFetch < MIN_TIME_BETWEEN_REQUESTS) {
      Alert.alert("Rate Limit", "Please wait 10 seconds before requesting location again.");
      return;
    }

    setIsLoadingLocation(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need location permission to provide accurate shipping addresses. Would you like to open settings?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
              style: "default",
            },
          ]
        );
        setIsLoadingLocation(false);
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Fetch reverse geocoding from OpenStreetMap Nominatim with User-Agent
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0 (your-email@example.com)", // Replace with your contact email
          },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.address) {
        const addressData = data.address;
        setAddress(`${addressData.road || ""}, ${addressData.city || ""}`);
        setCity(addressData.city || "");
        setState(addressData.state || "");
        setZipCode(addressData.postcode || "");
      } else {
        Alert.alert("Location Error", "Could not retrieve address. Please enter manually.");
      }
    } catch (err) {
      console.error("Error getting location:", err);
    } finally {
      setIsLoadingLocation(false);
      setLastLocationFetch(Date.now()); // Update last fetch timestamp
    }
  };

  // Handle order submission
  const handleOrder = () => {
    if (!address.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      Alert.alert("Missing Information", "Please fill in all address fields or use 'Get Your Location'.");
      return;
    }

    console.log("Order submitted with address:", { address, city, state, zipCode });
    Alert.alert("Order Successful", "Your order has been placed!");
    dispatch({ type: "RESET_CART" }); // Assuming you have a RESET_CART action in CartReducer
    navigation.navigate("Home"); // Navigate back to Home after order

    // Clear all order form inputs and location state
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setPhoneNumber("");
    setLocation(null);
    setShowOrderForm(false); // Hide the order form after clearing
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {displayMessage && <DisplayMessage message={message} />}

      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        goToPrevious={gotoPreviousScreen}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!showOrderForm ? (
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
        ) : (
          <View style={styles.orderContainer}>
            <Text style={styles.title}>Place Your Order</Text>
            <Pressable
              style={styles.locationButton}
              onPress={getLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.locationButtonText}>Get Your Location</Text>
              )}
            </Pressable>
            {location && (
              <MapView
                ref={mapRef}
                style={styles.map}
                region={location}
                onRegionChangeComplete={(region) =>
                  setLocation({
                    ...region,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  })
                }
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                <Marker coordinate={location} title="Your Location" />
              </MapView>
            )}
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
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="numeric"
            />
            <Pressable style={styles.button} onPress={handleOrder}>
              <Text style={styles.buttonText}>Submit Order</Text>
            </Pressable>
            <Pressable
              style={styles.backButton}
              onPress={() => setShowOrderForm(false)}
            >
              <Text style={styles.backButtonText}>Back to Cart</Text>
            </Pressable>
          </View>
        )}

        {!showOrderForm && (
          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                {total.toLocaleString("vi-VN")}$
              </Text>
            </View>
            <Pressable onPress={proceed} style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>
                Click to buy
              </Text>
            </Pressable>
          </View>
        )}
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
  cartContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  cartItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    padding: 15,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  productImage: {
    width: 120,
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
    gap: 10,
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
    backgroundColor: "#FF4444",
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
    color: "#28A745",
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
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28A745",
  },
  checkoutButton: {
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
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#800080",
  },
  orderContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  locationButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  map: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
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
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    backgroundColor: "#D8D8D8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CartScreen;