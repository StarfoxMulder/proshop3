import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // If userInfo is in local storage, parse it back to JSON, if not set it to null
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    }
  }
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
