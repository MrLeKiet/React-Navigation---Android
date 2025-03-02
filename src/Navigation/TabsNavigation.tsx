import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import CartScreen from "../Screens/CartScreen";
import HomeScreen from "../Screens/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import { RootStackScreenProps } from "./RootNavigator";
import ProductScreen from "../Screens/ProductScreen";

export type TabsStackParams = {
    Home: undefined;
    Cart?: {
        _id: string;
        images: [string];
        name: string;
        price: number;
        color?: string;
        size?: string;
        quantity: number;
        shouldShowOrder?: boolean;
        returnToCart?: boolean;
    };
    UserLogin: {
        email?: string;
        password?: string;
        confirmPassword?: string;
        firstName?: string;
        lastName?: string;
        mobileNo?: string;
        screenTitle?: string;
    };
    
    Payment: undefined;
    Profile: undefined;
    Order: undefined; // Add Order screen here
    CreateProduct: undefined;
    Product: undefined;
};

const TabsStack = createBottomTabNavigator<TabsStackParams>();

export type TabsStackScreenProps<T extends keyof TabsStackParams> =
    CompositeScreenProps<
        BottomTabScreenProps<TabsStackParams, T>,
        RootStackScreenProps<"TabsStack">
    >;

const TabsNavigator = () => {
    return (
        <TabsStack.Navigator screenOptions={{ tabBarShowLabel: false }}>
            <TabsStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Entypo name="home" size={24} color="#00970a" />
                        ) : (
                            <AntDesign name="home" size={24} color="#000" />
                        ),
                }}
            />
            <TabsStack.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="shoppingcart" size={24} color="#00970a" />
                        ) : (
                            <AntDesign name="shoppingcart" size={24} color="#000" />
                        ),
                }}
            />
            <TabsStack.Screen
                name="Product"
                component={ProductScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="copy" size={24} color="#00970a" />
                        ) : (
                            <Ionicons name="copy-outline" size={24} color="#000" />
                        ),
                }}
            />
            <TabsStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="person" size={24} color="#00970a" />
                        ) : (
                            <Ionicons name="person-outline" size={24} color="#000" />
                        ),
                }}
            />
        </TabsStack.Navigator>
    );
};

export default TabsNavigator;