import { View, Text } from "react-native";
import React from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";

type Props = {};

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
    return (
        <View style={{ marginTop: 50 }}>
            <Text>HomeScreen</Text>
        </View>
    );
};

export default HomeScreen;
