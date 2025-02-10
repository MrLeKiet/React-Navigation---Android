import { View, Text } from "react-native";
import React from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";

type Props = {};

const ProfileScreen = ({ navigation, route }: TabsStackScreenProps<"Profile">) => {
  return (
    <View style={{ marginTop: 50 }}>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;
