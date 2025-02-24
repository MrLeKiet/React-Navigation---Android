import { View, Image, Text, Platform, ScrollView, SectionList, Dimensions, Pressable, Alert, SafeAreaView, ImageBackground } from 'react-native'
import React from 'react'
import { RootStackParams, RootStackScreenProps } from '../Navigation/RootNavigator'
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");

const ProductDetails = ({ navigation, route }: RootStackScreenProps<"productDetails">) => {
    const { _id, images, name, price, oldPrice, inStock, color, size, description, quantity } = route.params;

    const gotoCartScreen = () => {
        navigation.navigate("Cart")
    }

    const goToPreviousScreen = () => {
        if (navigation.canGoBack()) {
            console.log("Chuyển về trang trước.");
            navigation.goBack();
        } else {
            console.log("Không thể quay lại, chuyển về trang Onboarding.");
            navigation.navigate("OnboardingScreen"); // Điều hướng fallback nếu không quay lại được
        }
    };

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 20 : 0, flex: 1, backgroundColor: "white" }}>
            <HeadersComponent gotoCartScreen={gotoCartScreen} goToPrevious={goToPreviousScreen} />
            <ScrollView style={{ backgroundColor: "pink" }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ImageBackground style={{ width, height, marginTop: 25 }}>
                        <View style={{ padding: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{
                                width: 40, height: 40, borderRadius: 20, backgroundColor: "#C60C30",
                                flexDirection: "row", justifyContent: "center", alignItems: "center"
                            }}>
                                <Text style={{ color: "yellow", textAlign: "center", fontWeight: "600", fontSize: 12 }}>
                                    {oldPrice ? ((1 - price / oldPrice) * 100).toFixed(1) : 0}% off
                                </Text>
                            </View>
                            <View style={{
                                width: 40, height: 40, borderRadius: 20, backgroundColor: "#E0E0E0", flexDirection: "row",
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <MaterialCommunityIcons name='share-variant' size={25} color="green" />
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: 20 }}>
                            <Image style={{ width: 300, height: 300, resizeMode: "contain" }} source={{ uri: images[0] }} />
                        </View>
                        <View style={{
                            width: 40, height: 40, borderRadius: 20, backgroundColor: "#E0E0E0", flexDirection: "row",
                            justifyContent: "center", alignItems: "center", marginLeft: 20,
                        }}>
                            <AntDesign style={{ paddingLeft: 0, paddingTop: 2 }} name='heart' size={25} color="grey" />
                        </View>
                    </ImageBackground>
                </ScrollView>
                <View style={{
                    backgroundColor: "white", borderColor: "purple", borderWidth: 8, width,
                    position: "absolute", top: 420, padding: 10
                }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
                    <Text style={{ fontSize: 16, color: "green" }}>{description}</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Price: {price} $</Text>
                    <Text style={{ fontSize: 16, color: "grey" }}>Old Price: {oldPrice} $</Text>
                    <Text style={{ fontSize: 16, color: "blue" }}>
                        {quantity > 0 ? `In Stock - Quantity: ${quantity}` : "Out of Stock"}
                    </Text>
                    <Text style={{ fontSize: 16, color: "orange" }}>Color: {color}</Text>
                    <Text style={{ fontSize: 16, color: "red" }}>Size: {size}</Text>
                </View>
                <View style={{ marginTop: 220, marginHorizontal: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue" }}>Delivery</Text>
                </View>

                <View style={{ backgroundColor: "white", borderColor: "orange", borderWidth: 8, width, padding: 10 }}>
                    <Text style={{ fontSize: 14, color: "red" }}>Delivery is Available</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name='location-sharp' size={25} color="green" />
                        <Text style={{ fontSize: 14, color: "brown", marginLeft: 5 }}>
                            Delivery to: CAMPUS THANH THAI 7/1 Thanh Thai, Ward 14, District 10, Ho Chi Minh City
                        </Text>
                    </View>
                </View>

            </ScrollView>
            <View style={{ backgroundColor: "white", paddingBottom: 0 }}>
                <Pressable
                    style={{
                        backgroundColor: "green",
                        padding: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        margin: 10
                    }}
                    onPress={() =>
                        Alert.alert("Add to Cart", "Product added to cart successfully.")
                    }
                >
                    <Text style={{ color: "yellow", fontSize: 20, fontWeight: "bold" }}>
                        Add to Cart
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default ProductDetails;
