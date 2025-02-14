import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Componenets/HeaderComponents/HeaderComponent';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';

type Props = {};

const CartScreen = ({ navigation, route }: TabsStackScreenProps<"Cart">) => {
  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "black" }}>
      <HeadersComponent />
    </SafeAreaView>
  );
}

export default CartScreen;
