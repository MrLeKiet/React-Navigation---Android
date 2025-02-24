import { View, Text, Pressable, ImageBackground, Image, TouchableOpacity, StyleSheet, ImageBackgroundComponent } from 'react-native'
import React from 'react'
import { IProductProps } from '../../TypesCheck/ProductTypes';

export const ProductCard = ({ item, productProps, pStyleProps }: IProductProps) => {
    return (
        <View
            style={sty(pStyleProps?.width, pStyleProps?.marginHorizontal, pStyleProps?.marginBottom).pCardContainer}
        >
            <ImageBackground
                source={{ uri: productProps?.imageBg }}
                style={styl(pStyleProps?.height).imageBg} imageStyle={{ borderRadius: 6 }}
            >
                <Pressable key={item._id} onPress={productProps?.onPress} style={{ alignItems: "center" }}>
                    <Image
                        source={{ uri: item?.images[0] }}
                        style={{
                            resizeMode: pStyleProps?.resizeMode,
                            height: "100%",
                            width: 70,
                        }}
                    />
                </Pressable>
            </ImageBackground>

            <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "500", marginBottom: 5 }}>{item?.name}</Text>
            {productProps?.percentageWidth !== undefined &&
                <>
                    <View style={{ marginTop: 12 }}>
                        <Text style={{ fontSize: 12 }}>{item?.quantity} items left</Text>
                    </View>
                    <View style={sty().progressBarContainer}>
                        <View style={sst(productProps?.percentageWidth ? 0 : 1).progressBar} />
                    </View>
                </>
            }
        </View>
    )
}

const sty = (width?: number, marginHorizontal?: number, marginBottom?: number) => ({
    pCardContainer: {
        width,
        marginHorizontal,
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 10,
        marginBottom,
        backgroundColor: "white",
    },
    progressBarContainer: {
        width: 100,
        height: 6,
        backgroundColor: "silver",
        borderRadius: 99,
        marginTop: 7,
    },
})

const styl = (height?: number) => ({
    imageBg: {
        height,
        borderRadius: 10,
    },
})

const sst = (percentageWidth?: number) => ({
    progressBar: {
        width: percentageWidth,
        backgroundColor: "purple",
        borderRadius: 99,
        height: 6,
    },
})
