import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import { CategoryCard } from '../Componenets/HomeScreenComponents/CategoryCard';
import Swiper from 'react-native-swiper'; // Thư viện Swiper đã được cài đặt
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';
import { fetchCategories, fetchProductsByCatID, fetchProductByFeature } from '../MiddeleWares/HomeMiddeleWare';
import { ProductListParams } from '../TypesCheck/HomeProps';
import { useSelector } from 'react-redux';
import { CartState } from '../TypesCheck/productCartTypes';
import DisplayMessage from '../Componenets/ProductDetails/DisplayMessage';
const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    const cart = useSelector((state: CartState) => state.cart.cart);
    const gotoCartScreen = () => {
        if (cart.length == 0) {
            setMessage("Cart is empty. Please add products to cart.");
            setDisplayMessage(true);
            setTimeout(() => {
                setDisplayMessage(false);
            }, 3000);
        } else
            navigation.navigate("TabsStack", { screen: "Cart" });
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
        // Không làm gì cả, giữ nguyên isViewVisible để không đóng danh sách khi nhấn ngoài
    };

    const handleCategoryClick = (catID: string) => {
        if (activeCat === catID) {
            // Nếu nhấn lại vào category đang active, reset để đóng danh sách
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

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <SafeAreaView style={styles.safeArea}>
            {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <HeadersComponent gotoCartScreen={gotoCartScreen} />

                    {/* Slider hình ảnh với điều hướng */}
                    <View style={styles.sliderContainer}>
                        <Swiper
                            style={styles.slider}
                            showsButtons={false}
                            autoplay={true}
                            autoplayTimeout={3} // Thay đổi ảnh mỗi 3 giây
                            dotColor="grey"
                            activeDotColor="black"
                            loop={true}
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
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Nền xám nhạt
        paddingTop: Platform.OS === 'android' ? 0 : 0,
    },
    scrollContent: {
        paddingBottom: 20, // Đệm dưới để tránh bị che
    },
    sliderContainer: {
        marginVertical: 10,
    },
    slider: {
        height: 200,
    },
    slideImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    noImageText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        padding: 20,
    },
    categoryContainer: {
        marginVertical: 10,
        backgroundColor: '#F5F5F5', // Nền xám nhạt
    },
    categoryContent: {
        paddingHorizontal: 15,
    },
    productSection: {
        marginVertical: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAll: {
        fontSize: 14,
        color: '#28A745', // Màu xanh lá cho nút "See ALL"
        fontWeight: 'bold',
    },
    productListContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
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
        color: '#666',
        padding: 20,
    },
});

export default HomeScreen;