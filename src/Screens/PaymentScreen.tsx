import { View, Text } from "react-native";
import React from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";

type Props = {};

const PaymentScreen = ({ navigation, route }: TabsStackScreenProps<"Payment">) => {
  return (
    <View style={{ marginTop: 50 }}>
      <Text>PaymentScreen</Text>
    </View>
  );
};

export default PaymentScreen;
