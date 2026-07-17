import { createSlice } from "@reduxjs/toolkit";

interface ShowUserState {
  showUser: boolean;
}

const initialState: ShowUserState = {
  showUser: false,
};

const showUserSlice = createSlice({
  name: "showUsers",
  initialState,
  reducers: {
    showUsers: (state: ShowUserState) => {
      state.showUser = true;
    },
    hideUsers: (state: ShowUserState) => {
      state.showUser = false;
    },
  },
});

export const { showUsers, hideUsers } = showUserSlice.actions;

export default showUserSlice.reducer;
