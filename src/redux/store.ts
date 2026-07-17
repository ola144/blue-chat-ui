import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./loaderSlice";
import userSlice from "./userSlice";
import showUserSlice from "./showUserSlice";

export const store = configureStore({
  reducer: {
    loaderReducer: loaderSlice,
    userReducer: userSlice,
    showUsersReducer: showUserSlice,
  },
});

// Infer the RootState type
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
