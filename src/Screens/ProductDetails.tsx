import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-swiper";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { CartState } from "../TypesCheck/productCartTypes";
import { addToCart } from "../redux/CartReducer";
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";
import { addFavorite, removeFavorite } from "../redux/HeartReducer"; // Assume you’ll create/use this reducer
import AsyncStorage from "@react-native-async-storage/async-storage"; // To check login status

const { width } = Dimensions.get("window");

const ProductDetails = ({ navigation, route }: RootStackScreenProps<"productDetails">) => {
    const { _id, images, name, price, oldPrice, inStock, color, size, description, quantity } =
        route.params;

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

    const goToPreviousScreen = () => {
        if (navigation.canGoBack()) {
            console.log("Chuyển về trang trước.");
            navigation.goBack();
        } else {
            console.log("Không thể quay lại, chuyển về trang Onboarding.");
            navigation.navigate("OnboardingScreen");
        }
    };

    const productItemObj: ProductListParams = route.params as ProductListParams;
    const cart = useSelector((state: CartState) => state.cart.cart);
    const favorites = useSelector((state: any) => state.favorites.favorites); // Assume FavoritesReducer state
    const dispatch = useDispatch();
    const [addedToCart, setAddedToCart] = useState(false);
    const [isFavorited, setIsFavorited] = useState(
        favorites.some((item: ProductListParams) => item._id === _id)
    ); // Check if already favorited
    const [message, setMessage] = useState("");
    const [displayMessage, setDisplayMessage] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status

    // Check login status on mount and when needed
    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem("authToken");
            setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
        };
        checkLoginStatus();
    }, []);

    const addItemToCart = (productItemObj: ProductListParams) => {
        if (productItemObj.quantity <= 0) {
            setMessage("Product is out of stock.");
            setDisplayMessage(true);
            setTimeout(() => {
                setDisplayMessage(false);
            }, 3000);
        } else {
            const findItem = cart.find((product) => product._id === _id);
            if (findItem) {
                setMessage("Product is already in cart.");
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                }, 3000);
            } else {
                setAddedToCart(true);
                dispatch(addToCart(productItemObj));
                setMessage("Product added to cart successfully.");
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                }, 3000);
            }
        }
    };

    const toggleFavorite = async (productItemObj: ProductListParams) => {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            // If not logged in, navigate to Profile (login/register page)
            alert(
                "Login Required"
            );
            return;
        }

        const isCurrentlyFavorited = favorites.some((item: ProductListParams) => item._id === _id);
        if (isCurrentlyFavorited) {
            dispatch(removeFavorite(_id));
            setIsFavorited(false);
            setMessage("Product removed from favorites.");
        } else {
            dispatch(addFavorite(productItemObj));
            setIsFavorited(true);
            setMessage("Product added to favorites successfully.");
        }
        setDisplayMessage(true);
        setTimeout(() => {
            setDisplayMessage(false);
        }, 3000);
    };

    // Sync favorites state on mount and when favorites change
    useEffect(() => {
        setIsFavorited(favorites.some((item: ProductListParams) => item._id === _id));
    }, [favorites, _id]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeadersComponent gotoCartScreen={gotoCartScreen} goToPrevious={goToPreviousScreen} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Phần hình ảnh */}
                <View style={styles.imageContainer}>
                    <Swiper
                        style={styles.slider}
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={3} // Change slide every 3 seconds
                        dotColor="grey"
                        activeDotColor="black"
                        loop={true}
                        paginationStyle={{ bottom: 10 }} // Position pagination dots
                    >
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                style={styles.productImage}
                                source={{ uri: image }}
                                onError={(e) => console.log("Image load error:", e)}
                            />
                        ))}
                    </Swiper>
                    <View style={styles.imageOverlay}>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                {oldPrice ? ((1 - price / oldPrice) * 100).toFixed(1) : 0}% off
                            </Text>
                        </View>
                        <View style={styles.iconButton}>
                            <MaterialCommunityIcons name="share-variant" size={25} color="green" />
                        </View>
                    </View>
                    <View style={styles.heartIconContainer}>
                        <Pressable onPress={() => toggleFavorite(productItemObj)}>
                            <View style={styles.iconButton}>
                                <AntDesign
                                    name="heart"
                                    size={25}
                                    color={isFavorited ? "red" : "grey"} // Red when favorited, grey when not
                                />
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Phần chi tiết sản phẩm */}
                <View style={styles.detailContainer}>
                    <Text style={styles.productName}>{name}</Text>
                    <Text style={styles.productDescription}>{description}</Text>
                    <Text style={styles.productPrice}>Giá: {price} $</Text>
                    <View style={styles.oldPriceContainer}>
                        <Text style={styles.oldPriceLabel}>Giá cũ: </Text>
                        <Text style={styles.oldPriceValue}>{oldPrice} $</Text>
                    </View>
                    <Text style={[styles.stockStatus, { color: quantity > 0 ? "green" : "red" }]}>
                        {quantity > 0 ? `Còn hàng - Số lượng: ${quantity}` : "Hết hàng"}
                    </Text>
                </View>

                {/* Phần giao hàng (commented out as in your code) */}
                {/* <View style={styles.deliveryContainer}>
          <Text style={styles.deliveryTitle}>Giao hàng</Text>
          <Text style={styles.deliveryText}>Giao hàng có sẵn</Text>
          <View style={styles.deliveryLocation}>
            <Ionicons name="location-sharp" size={25} color="green" />
            <Text style={styles.deliveryAddress}>
              Giao đến: CAMPUS THANH THAI 7/1 Thanh Thai, Phường 14, Quận 10, TP. Hồ Chí Minh
            </Text>
          </View>
        </View> */}
            </ScrollView>

            {/* Nút Thêm vào giỏ hàng */}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.addToCartButton}
                    onPress={() => addItemToCart(productItemObj)}
                >
                    {addedToCart ? (
                        <Text style={{ color: "violet", fontSize: 20, fontWeight: "bold" }}>
                            Add to Cart
                        </Text>
                    ) : (
                        <Text style={{ color: "orange", fontSize: 20, fontWeight: "bold" }}>
                            Add to Cart
                        </Text>
                    )}
                </Pressable>
            </View>

            {/* Hiển thị thông báo */}
            {displayMessage && (
                <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? 20 : 0,
    },
    scrollContent: {
        paddingBottom: 80, // Padding at the bottom to prevent the button from being obscured
    },
    imageContainer: {
        position: "relative",
        marginTop: 10,
    },
    slider: {
        height: width * 0.9, // Adjust the height as needed
    },
    productImage: {
        width: width,
        height: width * 0.9, // Ratio 9:10 for a more square image
        resizeMode: "contain",
    },
    imageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    discountBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#C60C30",
        justifyContent: "center",
        alignItems: "center",
    },
    discountText: {
        color: "yellow",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    heartIconContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    detailContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "white",
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    productName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 5,
    },
    productDescription: {
        fontSize: 14,
        color: "#666",
        marginVertical: 5,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 5,
    },
    oldPriceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    oldPriceLabel: {
        fontSize: 16,
        color: "#999",
    },
    oldPriceValue: {
        fontSize: 16,
        color: "#999",
        textDecorationLine: "line-through",
    },
    stockStatus: {
        fontSize: 16,
        marginVertical: 5,
    },
    productAttribute: {
        fontSize: 16,
        color: "#333",
        marginVertical: 5,
    },
    deliveryContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "white",
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 5,
    },
    deliveryText: {
        fontSize: 14,
        color: "#333",
        marginVertical: 5,
    },
    deliveryLocation: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    deliveryAddress: {
        fontSize: 14,
        color: "#333",
        marginLeft: 5,
        flexShrink: 1,
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: "white",
    },
    addToCartButton: {
        backgroundColor: "#28A745",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
});

export default ProductDetails;