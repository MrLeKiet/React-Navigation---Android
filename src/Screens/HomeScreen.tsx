import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import ImageSlider from '../Componenets/HomeScreenComponents/ImageSlider';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';

type Props = {};

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    const gotoCartScreen = () => {
        navigation.navigate("Cart");
    }

    const sliderImages = [
        "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x4.jpg",
    ];

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "black" }}>
            <HeadersComponent gotoCartScreen={gotoCartScreen} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "#efg" }}>
                <ImageSlider images={sliderImages} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;
