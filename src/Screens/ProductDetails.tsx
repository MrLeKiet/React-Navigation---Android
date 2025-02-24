import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    Pressable,
    Alert,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../Navigation/RootNavigator';

const { width } = Dimensions.get('window');

const ProductDetails = ({ navigation, route }: RootStackScreenProps<'productDetails'>) => {
    const { _id, images, name, price, oldPrice, inStock, color, size, description, quantity } = route.params;

    const gotoCartScreen = () => {
        navigation.navigate('Cart');
    };

    const goToPreviousScreen = () => {
        if (navigation.canGoBack()) {
            console.log('Chuyển về trang trước.');
            navigation.goBack();
        } else {
            console.log('Không thể quay lại, chuyển về trang Onboarding.');
            navigation.navigate('OnboardingScreen');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeadersComponent gotoCartScreen={gotoCartScreen} goToPrevious={goToPreviousScreen} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Phần hình ảnh */}
                <View style={styles.imageContainer}>
                    <Image style={styles.productImage} source={{ uri: images[0] }} />
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
                        <View style={styles.iconButton}>
                            <AntDesign name="heart" size={25} color="grey" />
                        </View>
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
                    <Text style={[styles.stockStatus, { color: quantity > 0 ? 'green' : 'red' }]}>
                        {quantity > 0 ? `Còn hàng - Số lượng: ${quantity}` : 'Hết hàng'}
                    </Text>
                    <Text style={styles.productAttribute}>Màu: {color}</Text>
                    <Text style={styles.productAttribute}>Kích thước: {size}</Text>
                </View>

                {/* Phần giao hàng */}
                <View style={styles.deliveryContainer}>
                    <Text style={styles.deliveryTitle}>Giao hàng</Text>
                    <Text style={styles.deliveryText}>Giao hàng có sẵn</Text>
                    <View style={styles.deliveryLocation}>
                        <Ionicons name="location-sharp" size={25} color="green" />
                        <Text style={styles.deliveryAddress}>
                            Giao đến: CAMPUS THANH THAI 7/1 Thanh Thai, Phường 14, Quận 10, TP. Hồ Chí Minh
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Nút Thêm vào giỏ hàng */}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.addToCartButton}
                    onPress={() => Alert.alert('Add to Cart', 'Product added to cart successfully.')}
                >
                    <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    scrollContent: {
        paddingBottom: 80, // Đệm dưới để nút không bị che
    },
    imageContainer: {
        position: 'relative',
        marginTop: 10,
    },
    productImage: {
        width: width,
        height: width * 0.9, // Tỷ lệ 9:10 để hình ảnh vuông hơn
        resizeMode: 'contain',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    discountBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#C60C30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountText: {
        color: 'yellow',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIconContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    detailContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    oldPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    oldPriceLabel: {
        fontSize: 16,
        color: '#999',
    },
    oldPriceValue: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    stockStatus: {
        fontSize: 16,
        marginVertical: 5,
    },
    productAttribute: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    deliveryContainer: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    deliveryText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
    },
    deliveryLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    deliveryAddress: {
        fontSize: 14,
        color: '#333',
        marginLeft: 5,
        flexShrink: 1,
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: 'white',
    },
    addToCartButton: {
        backgroundColor: '#28A745',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    addToCartText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ProductDetails;