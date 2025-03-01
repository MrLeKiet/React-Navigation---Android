import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    ProductListParams,
    CartItem,
    CartState,
} from "../TypesCheck/productCartTypes";

export const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
    },
    reducers: {
        addToCart: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const itemPresent = state.cart.find(
                (item) => item._id === action.payload._id
            );
            if (!itemPresent) {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state: CartItem, action: PayloadAction<string>) => {
            state.cart = state.cart.filter((item) => item._id !== action.payload);
        },
        increaseQuantity: (
            state: CartItem,
            action: PayloadAction<ProductListParams>
        ) => {
            state.cart = state.cart.map((item) =>
                item._id === action.payload._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        },
        decreaseQuantity: (
            state: CartItem,
            action: PayloadAction<ProductListParams>
        ) => {
            state.cart = state.cart
                .map((item) =>
                    item._id === action.payload._id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0); // Xóa sản phẩm nếu quantity = 0
        },
        emptyCart: (state) => {
            state.cart = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    emptyCart,
} = CartSlice.actions;

export default CartSlice.reducer;
