import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductListParams } from "../TypesCheck/HomeProps";

interface FavoritesState {
    favorites: ProductListParams[];
}

const initialState: FavoritesState = {
    favorites: [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<ProductListParams>) => {
            state.favorites.push(action.payload);
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter(
                (item) => item._id !== action.payload
            );
        },
    },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;