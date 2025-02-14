import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

export interface IGoBack {
    onPress?: () => void;
}

export const GoBack = ({ onPress }: IGoBack) => {
    return (
        <Pressable onPress={onPress}>
            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
        </Pressable>
    );
};
