import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper"; // Ensure this library is correctly installed
import { useSelector, useDispatch } from "react-redux";
import { HeadersComponent } from "../Componenets/HeaderComponents/HeaderComponent";
import { CategoryCard } from "../Componenets/HomeScreenComponents/CategoryCard";
import DisplayMessage from "../Componenets/ProductDetails/DisplayMessage";
import {
    fetchCategories,
    fetchProductByFeature,
    fetchProductsByCatID,
} from "../MiddeleWares/HomeMiddeleWare";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { CartState } from "../TypesCheck/productCartTypes";
import { removeFavorite } from "../redux/HeartReducer"; // Import removeFavorite action

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    const cart = useSelector((state: CartState) => state.cart.cart);
    const favorites = useSelector((state: any) => state.favorites.favorites); // Get favorites from Redux
    const dispatch = useDispatch();
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

    const [getCategory, setGetCategory] = useState<ProductListParams[]>([]);
    const [activeCat, setActiveCat] = useState<string>("");
    const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
    const [getProductsByFeature, setGetProductsByFeature] = useState<ProductListParams[]>([]);
    const [isViewVisible, setIsViewVisible] = useState<boolean>(true);
    const [message, setMessage] = React.useState("");
    const [displayMessage, setDisplayMessage] = React.useState<boolean>(false);

    useEffect(() => {
        fetchCategories({ setGetCategory });
        fetchProductByFeature({ setGetProductsByFeature });
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCategories({ setGetCategory });
            fetchProductByFeature({ setGetProductsByFeature });
            console.log("Focused - Featured products:", getProductsByFeature); // Debug data
        }, [])
    );

    useEffect(() => {
        if (activeCat) {
            fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
        }
    }, [activeCat]);

    useFocusEffect(
        useCallback(() => {
            fetchCategories({ setGetCategory });
            if (activeCat) {
                fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
            }
        }, [activeCat])
    );

    const handleOutsideClick = () => {
        // Do nothing, keep isViewVisible unchanged to not close the list when tapping outside
    };

    const handleCategoryClick = (catID: string) => {
        if (activeCat === catID) {
            // If clicking the active category again, reset to close the list
            setActiveCat("");
            setIsViewVisible(false);
        } else {
            setActiveCat(catID);
            setIsViewVisible(true);
        }
    };

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

    // Add a ref to the Swiper for debugging or controlling it manually if needed
    const swiperRef = useRef<any>(null);

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <SafeAreaView style={styles.safeArea}>
                {displayMessage && (
                    <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />
                )}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <HeadersComponent
                        gotoCartScreen={gotoCartScreen}
                        navigateToProductDetail={handleProductPress}
                    />

                    {/* Slider hình ảnh với điều hướng */}
                    <View style={styles.sliderContainer}>
                        <Swiper
                            ref={swiperRef}
                            style={styles.slider}
                            showsButtons={false}
                            autoplay={true}
                            autoplayTimeout={3} // Change slide every 3 seconds
                            dotColor="grey"
                            activeDotColor="black"
                            loop={true}
                            paginationStyle={{ bottom: 10 }} // Position pagination dots
                            onIndexChanged={(index) => console.log("Current slide index:", index)} // Debug current slide
                            onMomentumScrollEnd={(e, state, context) => console.log("Scroll ended at index:", state.index)}
                            scrollEnabled={true} // Ensure scrolling is enabled
                            // Force update if needed
                            key={getProductsByFeature.length} // Force re-render if data changes
                        >
                            {getProductsByFeature.length > 0 ? (
                                getProductsByFeature.map((product, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleProductPress(product)}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            style={styles.slideImage}
                                            source={{ uri: product.images[0] }}
                                            onError={(e) => console.log("Image load error for product:", product.name, e)}
                                            onLoad={() => console.log("Image loaded for product:", product.name)}
                                        />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.noImageText}>Không có sản phẩm nổi bật</Text>
                            )}
                        </Swiper>
                    </View>

                    {/* Danh mục sản phẩm */}
                    <View style={styles.categoryContainer}>
                    <Text style={styles.sectionTitle}>    Category:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryContent}
                        >
                            {getCategory.map((item, index) => (
                                <CategoryCard
                                    key={index}
                                    item={{ name: item.name, images: item.images, _id: item._id }}
                                    catStyleProps={{
                                        height: 50,
                                        width: 55,
                                        radius: 20,
                                        resizeMode: "contain",
                                    }}
                                    catProps={{
                                        activeCat: activeCat,
                                        onPress: () => handleCategoryClick(item._id),
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Danh sách sản phẩm theo danh mục */}
                    {isViewVisible && activeCat && (
                        <View style={styles.productSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Products from Selected Category</Text>
                                <Pressable>
                                    <Text style={styles.seeAll}>See ALL</Text>
                                </Pressable>
                            </View>
                            <View style={styles.productListContainer}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.productListContent}
                                >
                                    {getProductsByCatID?.length > 0 ? (
                                        getProductsByCatID.map((item, index) => (
                                            <CategoryCard
                                                key={index}
                                                item={{ name: item.name, images: item.images, _id: item._id }}
                                                catStyleProps={{
                                                    height: 100,
                                                    width: 100,
                                                    radius: 10,
                                                    resizeMode: "contain",
                                                }}
                                                catProps={{
                                                    onPress: () => navigation.navigate("productDetails", item),
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Text style={styles.noProductText}>Không có sản phẩm nào</Text>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    )}

                    {/* Danh sách sản phẩm yêu thích (Favorited Products) */}
                    {favorites.length > 0 && (
                        <View style={styles.productSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Favorite Products</Text>
                                <Pressable onPress={() => navigation.navigate("FavoriteProduct")}>
                                    <Text style={styles.seeAll}>See ALL</Text>
                                </Pressable>
                            </View>
                            <View style={styles.productListContainer}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.productListContent}
                                >
                                    {favorites.map((item: ProductListParams, index: number) => (
                                        <CategoryCard
                                            key={index}
                                            item={{ name: item.name, images: item.images, _id: item._id }}
                                            catStyleProps={{
                                                height: 100,
                                                width: 100,
                                                radius: 10,
                                                resizeMode: "contain",
                                            }}
                                            catProps={{
                                                onPress: () => navigation.navigate("productDetails", item),
                                            }}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F5F5", // Light gray background
        paddingTop: Platform.OS === "android" ? 0 : 0,
    },
    scrollContent: {
        paddingBottom: 20, // Bottom padding to avoid being obscured
    },
    sliderContainer: {
        marginVertical: 10,
    },
    slider: {
        height: 200,
    },
    slideImage: {
        width: "100%",
        height: "100%", // Ensure the image fills the slider height
        resizeMode: "cover",
    },
    noImageText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        padding: 20,
    },
    categoryContainer: {
        marginVertical: 10,
        backgroundColor: "#F5F5F5", // Light gray background
    },
    categoryContent: {
        paddingHorizontal: 15,
    },
    productSection: {
        marginVertical: 10,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    seeAll: {
        fontSize: 14,
        color: "#28A745", // Green color for "See ALL" button
        fontWeight: "bold",
    },
    productListContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        paddingVertical: 10,
    },
    productListContent: {
        paddingHorizontal: 15,
    },
    noProductText: {
        fontSize: 14,
        color: "#666",
        padding: 20,
    },
});

export default HomeScreen;