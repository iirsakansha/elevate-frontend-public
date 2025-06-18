// In src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signInAction } from "./authAction";

const initialState = {
  isSigninLoading: false,
  isSigninError: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutAction: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      Helpers.deleteAllCookies();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.isSigninLoading = true;
        state.isSigninError = null;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.isSigninLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.isSigninLoading = false;
        state.isSigninError = action.payload;
      });
  },
});

export const { signOutAction } = authSlice.actions;
export default authSlice.reducer;