import { CartItem, Product, User } from "@/types/prismaTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  currency: string;
  user: Partial<User> | null;
  isSeller: boolean;
  showUserLogin: boolean;
  products: Product[];
  cartItems: {
    [productId: string]: number;
  };
  searchQuery: string;
  count: number;
}

export const initialState: GlobalState = {
  currency: process.env.NEXT_CURRENCY || "$",
  user: null,
  isSeller: false,
  showUserLogin: false,
  products: [],
  cartItems: {},
  searchQuery: "",
  count: 0,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = action.payload;
    },
    setIsSeller: (state, action: PayloadAction<boolean>) => {
      state.isSeller = action.payload;
    },
    toggleShowUserLogin: (state) => {
      state.showUserLogin = !state.showUserLogin;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCartItems: (state, action: PayloadAction<CartItem>) => {
      state.cartItems = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (!state.cartItems[productId]) {
        state.cartItems[productId] = 1;
      } else {
        state.cartItems[productId] += 1;
      }
      state.count += 1;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (state.cartItems[productId]) {
        if (state.cartItems[productId] > 1) {
          state.cartItems[productId] -= 1;
          state.count -= 1;
        } else {
          if (state.cartItems[productId] === 1) {
            state.count -= 1;
          }
          delete state.cartItems[productId];
        }
      }
    },
    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const prevQuantity = state.cartItems[id] || 0;

      if (quantity <= 0) {
        state.count -= prevQuantity;
        delete state.cartItems[id];
      } else {
        state.cartItems[id] = quantity;
        state.count += quantity - prevQuantity;
      }
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
  },
});

export const {
  setUser,
  setIsSeller,
  toggleShowUserLogin,
  setProducts,
  setCartItems,
  setSearchQuery,
  addToCart,
  removeFromCart,
  updateCartItem,
  setCount,
} = globalSlice.actions;

export default globalSlice.reducer;
