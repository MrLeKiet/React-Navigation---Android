export interface ICatProps {
    item: {
        _id: string;
        name: string;
        images: [string];
    };
    catProps: {
        imageBg?: string;
        activeCat?: string;
        onPress?: () => void;
    };
    catStyleProps: {
        imageBgHt?: number;
        width?: number;
        height?: number;
        radius?: number;
        resizeMode?: "contain" | "cover" | "stretch";
    };
}
