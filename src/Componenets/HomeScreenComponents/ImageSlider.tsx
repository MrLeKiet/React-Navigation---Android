import React, { useRef, useState, useEffect } from "react";
import { Animated, Dimensions, Image, StyleSheet, View, Easing } from "react-native";

const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current?.(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

interface ImageProps {
    images: string[];
}

const Max_Width = Dimensions.get("screen").width;
const ImageSlider = ({ images }: ImageProps) => {
    const animation = useRef(new Animated.Value(0)).current;
    const [currentImage, setCurrentImage] = useState(0);

    const handleAnimation = () => {
        const newCurrentImage = (currentImage + 1) % images.length;
        setCurrentImage(newCurrentImage);

        Animated.timing(animation, {
            toValue: -(Max_Width * newCurrentImage),
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => console.log("Animation completed for image:", newCurrentImage));
    };

    useEffect(() => {
        console.log("Slider images:", images);
        const interval = setInterval(() => {
            console.log("Interval triggered");
            handleAnimation();
        }, 2000);
        return () => clearInterval(interval);
    }, [handleAnimation, images]);

    useEffect(() => {
        animation.setValue(0);
        setCurrentImage(0);
    }, [images, animation]);

    console.log("Screen width:", Max_Width);

    return (
        <View>
            <Animated.View style={[styles.container, { transform: [{ translateX: animation }] }]}>
                {images.map((image, index) => (
                    <Image
                        key={image}
                        source={{ uri: image }}
                        style={styles.image}
                        onError={(e) => console.log("Image load error for URI:", image, e)}
                        onLoad={() => console.log("Image loaded for URI:", image)}
                    />
                ))}
            </Animated.View>
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            index === currentImage ? styles.activeIndicator : undefined,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default ImageSlider;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    image: {
        resizeMode: "contain",
        height: 220,
        width: Max_Width,
        borderWidth: 7,
        borderColor: "white",
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Max_Width,
        bottom: 0,
        zIndex: 2,
        paddingVertical: 10,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 7.5,
        borderColor: "silver",
        borderWidth: 1,
        marginHorizontal: 3,
        backgroundColor: "#eee",
    },
    activeIndicator: {
        backgroundColor: "green",
    },
});