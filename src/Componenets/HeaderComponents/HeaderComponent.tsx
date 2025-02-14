import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { GoBack } from "./GoBackButton";

interface IHeaderParams {
    goToPrevious?: () => void;
    search?: () => void;
    cartLength?: number;
    gotoCartScreen?: () => void;
}

export const HeadersComponent = ({ goToPrevious, search, cartLength, gotoCartScreen }: IHeaderParams) => {
    const [searchInput, setSearchInput] = useState("");

    return (
        <View style={{ backgroundColor: "#000", padding: 10, flexDirection: "row", alignItems: "center" }}>
            <GoBack onPress={goToPrevious} />

            <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, gap: 10, backgroundColor: "white", borderRadius: 10, height: 38, flex: 1 }}>
                <Pressable style={{ padding: 10 }} onPress={search}>
                    <AntDesign name="search1" size={20} color={"blue"} />
                </Pressable>
                <TextInput value={searchInput} onChangeText={setSearchInput} placeholder="search Items ..." />
            </Pressable>

            <Pressable onPress={gotoCartScreen}>
                <View style={styles.cartNum}>
                    <Text style={{ color: "pink" }}>
                        {cartLength}
                    </Text>
                </View>
                <MaterialIcons name="shopping-cart" size={24} color={"white"} style={{ padding: 5, marginTop: 3 }} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cartNum: {
        position: "absolute",
        top: -5,
        right: -10,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    }
});
