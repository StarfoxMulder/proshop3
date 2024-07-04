import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id)
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item]
      }

      // Calculate items price -- accumulator + (price*qty), starting value
      state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0));
      // Calculate shipping price (if order total > $100 ? free : $10)
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
      // Calculate tax price (15%)
      state.taxPrice = addDecimals(Number((state.itemsPrice * 0.15).toFixed(2)));
      // Calculate total price
      state.totalPrice = (
        Number(state.itemsPrice) + 
        Number(state.taxPrice) + 
        Number(state.shippingPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    }
  }
});

// Any action defined here needs to be exported individually
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
