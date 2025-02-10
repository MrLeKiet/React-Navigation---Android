import React, { useState } from "react";
import { View, ViewToken } from "react-native";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import OnboardingItems from "../Componenets/OnboardingComponents/OnboardingItems";
import OnboardingPagination from "../Componenets/OnboardingComponents/OnboardingPagination";
import { OnboardingData } from "../Data/EncommerceAppData";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { OnboardingPrograms } from "../TypesCheck/OnboardingTypesCheck";
import OnboardingButton from "../Componenets/OnboardingComponents/OnboardingButton";

type Props = {};
const OnboardingScreen = ({ navigation, route }: RootStackScreenProps<"OnboardingScreen">) => {
    const [onboardingItems, setOnboardingItems] = useState<OnboardingPrograms[]>(OnboardingData);
    const flatListRef = useAnimatedRef<FlatList<OnboardingPrograms>>();
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0)
    const onScollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x
        }
    })

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: ViewToken[];
    }) => {
        if (viewableItems[0].index !== null) {
            flatListIndex.value = viewableItems[0].index;
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={onScollHandler}
                data={onboardingItems}
                renderItem={({ item, index }) => (
                    <OnboardingItems item={item} index={index} x={x} />
                )}
                keyExtractor={(item) => item._id}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    viewAreaCoveragePercentThreshold: 10,
                }}
            />
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginHorizontal: 30,
                    paddingVertical: 30,
                }}
            >
                <OnboardingPagination item={onboardingItems} x={x} />

                <OnboardingButton
                    x={x}
                    itemLength={onboardingItems.length}
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                />
            </View>

        </View>

    );
};

export default OnboardingScreen;
