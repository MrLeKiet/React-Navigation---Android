import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import { CategoryCard } from '../Componenets/HomeScreenComponents/CategoryCard';
import ImageSlider from '../Componenets/HomeScreenComponents/ImageSlider';
import { fetchCategories, fetchProductsByCatID, fetchProductByFeature } from '../MiddeleWares/HomeMiddeleWare';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';
import { ProductListParams } from '../TypesCheck/HomeProps';

type Props = {};

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    const gotoCartScreen = () => {
        navigation.navigate("Cart");
    }

    const [getCategory, setGetCategory] = useState<ProductListParams[]>([]);
    const [activeCat, setActiveCat] = useState<string>("");
    const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
    const [getProductsByFeature, setGetProductsByFeature] = useState<ProductListParams[]>([]);
    const [isViewVisible, setIsViewVisible] = useState<boolean>(true);

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
        setIsViewVisible(false);
    };

    const handleCategoryClick = (catID: string) => {
        setActiveCat(catID);
        setIsViewVisible(true);
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 0 : 0, flex: 1, backgroundColor: "black" }}>
                <ScrollView>
                    <HeadersComponent gotoCartScreen={gotoCartScreen} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor: "#efg" }}>
                        <ImageSlider images={getProductsByFeature.map(product => product.images[0])} />
                    </ScrollView>
                    <View style={{ backgroundColor: "yellow", flex: 1 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            style={{ marginTop: 4 }}
                        >
                            {
                                getCategory.map((item, index) => (
                                    <CategoryCard
                                        key={index}
                                        item={{ "name": item.name, "images": item.images, _id: item._id }}
                                        catStyleProps={{
                                            "height": 50,
                                            "width": 55,
                                            "radius": 20,
                                            "resizeMode": "contain"
                                        }}
                                        catProps={{
                                            "activeCat": activeCat, "onPress": () => handleCategoryClick(item._id)
                                        }}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>
                    {isViewVisible && (
                        <>
                            <View style={{
                                backgroundColor: "pink", flexDirection: "row", justifyContent: "space-between",
                                marginTop: 10
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", padding: 10 }}>
                                    Products from Selected Category
                                </Text>
                                <Pressable>
                                    <Text style={{ fontSize: 11, fontWeight: "bold", padding: 10 }}>
                                        See ALL
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={{
                                backgroundColor: "#fff", borderWidth: 7, borderColor: "green", flexDirection: "row",
                                justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                            }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {
                                        getProductsByCatID?.length > 0 ? (
                                            getProductsByCatID.map((item, index) => (
                                                <CategoryCard
                                                    key={index}
                                                    item={{ "name": item.name, "images": item.images, "_id": item._id }}
                                                    catStyleProps={{
                                                        "height": 100,
                                                        "width": 100,
                                                        "radius": 10,
                                                        "resizeMode": "contain"
                                                    }}
                                                    catProps={{
                                                        "onPress": () => Alert.alert(item.name),
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Text>Không có sản phẩm nào</Text>
                                        )
                                    }
                                </ScrollView>
                            </View>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default HomeScreen;