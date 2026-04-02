import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.cart.find(
        (i) =>
          item.id === i.id && i.size === item.size && i.color === item.color,
      );

      if (exist) {
        exist.quantity += item.quantity;
      } else {
        state.cart.push({ ...item });
      }

      state.total = Number(
        state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      ).toFixed(2);
    },
    removeCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          ),
      );

      state.total = state.cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    },
    updateCartItem: (state, action) => {
      const { id, oldSize, oldColor, newSize, newColor } = action.payload;

      const currentItem = state.cart.find(
        (i) => i.id === id && i.size === oldSize && i.color === oldColor,
      );

      if (!currentItem) return;

      const existingItem = state.cart.find(
        (i) =>
          i.id === id &&
          i.size === newSize &&
          i.color === newColor &&
          !(i.size === oldSize && i.color === oldColor),
      );

      const index = state.cart.findIndex(
        (i) => i.id === id && i.size === oldSize && i.color === oldColor,
      );

      if (existingItem) {
        existingItem.quantity += currentItem.quantity;
        state.cart.splice(index, 1); // remove old safely
      } else {
        currentItem.size = newSize;
        currentItem.color = newColor;
      }

      state.total = state.cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    },
    updateQty: (state, action) => {
      const { id, size, color, type } = action.payload;

      const item = state.cart.find(
        (i) => i.id === id && i.size === size && i.color === color,
      );

      if (item) {
        if (type === "increase") {
          item.quantity += 1;
        } else if (type === "decrease" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }

      // Recalculate total
      state.total = state.cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeCart, updateCartItem, updateQty } =
  cartSlice.actions;

export default cartSlice.reducer;
