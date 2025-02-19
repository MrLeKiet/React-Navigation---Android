import React, { useCallback, useEffect } from 'react';
import { Platform, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import ImageSlider from '../Componenets/HomeScreenComponents/ImageSlider';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';
import { ProductListParams } from '../TypesCheck/HomeProps';
import { CategoryCard } from '../Componenets/HomeScreenComponents/CategoryCard';
import { fetchCategories } from '../MiddeleWares/HomeMiddeleWare';
import { useFocusEffect } from '@react-navigation/native';

type Props = {};

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    const gotoCartScreen = () => {
        navigation.navigate("Cart");
    }

    const sliderImages = [
        "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg",
    ];

    const [getCategory, setGetCategory] = React.useState<ProductListParams[]>([]);
    const [activeCat, setActiveCat] = React.useState<string>("");

    useEffect(() => {
        fetchCategories({ setGetCategory });
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCategories({ setGetCategory });
        }, [])
    );

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "black" }}>
            <HeadersComponent gotoCartScreen={gotoCartScreen} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "#efg" }}>
                <ImageSlider images={sliderImages} />
            </ScrollView>
            <View style={{ backgroundColor: "yellow", flex: 1 }}>
                <Text>
                    Hello
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    style={{ marginTop: 4 }}
                >
                    {
                        getCategory.map((item, index) => (
                            <CategoryCard
                                item={{ "name": item.name, "images": item.images, _id: item._id }}
                                catStyleProps={{
                                    "height": 50,
                                    "width": 55,
                                    "radius": 20,
                                    "resizeMode": "contain"
                                }}
                                catProps={{
                                    "activeCat": activeCat, "onPress": () => setActiveCat(item._id)
                                }}
                            />
                        ))
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;
