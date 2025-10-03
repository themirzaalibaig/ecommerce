import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, Size } from '@/types/models';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: Size;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

// Helper function to check if two cart items are the same (including variants)
const isSameCartItem = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.product._id === item2.product._id &&
    item1.selectedSize === item2.selectedSize &&
    item1.selectedColor === item2.selectedColor
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>
    ) => {
      const { product, selectedSize, selectedColor, quantity = 1 } = action.payload;
      const newItem: CartItem = { product, selectedSize, selectedColor, quantity };

      // Check if item with same variant already exists
      const existingItemIndex = state.items.findIndex((item) => isSameCartItem(item, newItem));

      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist or has different variant
        state.items.push(newItem);
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; selectedSize?: Size; selectedColor?: string }>
    ) => {
      const { productId, selectedSize, selectedColor } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        selectedSize?: Size;
        selectedColor?: string;
      }>
    ) => {
      const { productId, quantity, selectedSize, selectedColor } = action.payload;
      const item = state.items.find(
        (item) =>
          item.product._id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter((i) => i !== item);
        } else {
          item.quantity = quantity;
        }
      }
    },

    incrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; selectedSize?: Size; selectedColor?: string }>
    ) => {
      const { productId, selectedSize, selectedColor } = action.payload;
      const item = state.items.find(
        (item) =>
          item.product._id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; selectedSize?: Size; selectedColor?: string }>
    ) => {
      const { productId, selectedSize, selectedColor } = action.payload;
      const item = state.items.find(
        (item) =>
          item.product._id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity would be 0
          state.items = state.items.filter((i) => i !== item);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    openCart: (state) => {
      state.isCartOpen = true;
    },

    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isCartOpen;
