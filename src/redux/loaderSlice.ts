/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  loader: boolean;
}

const initialState: LoaderState = {
  loader: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state: any) => {
      state.loader = true;
    },
    hideLoader: (state: any) => {
      state.loader = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
