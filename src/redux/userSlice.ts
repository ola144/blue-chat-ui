/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { IMessage } from "../services/messages";

interface IUser {
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  phoneNumber: string;
  updatedAt: string;
  profilePic: string;
}

export interface IChat {
  id: string;
  createdAt: string;
  updatedAt: string;
  unreadMessageCount: number;
  lastMessage: IMessage;
  members: Array<IUser>;
}

export interface ILastMsg {
  time: string;
  msg: string;
}

interface UserState {
  userData: IUser;
  allUsers: Array<IUser>;
  allChats: Array<IChat>;
  allMessages: Array<any>;
  selectedChat: IChat;
  lastMessage: ILastMsg;
  onlineUsers: string[];
}

const initialState: UserState = {
  userData: {
    createdAt: "",
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    phoneNumber: "",
    updatedAt: "",
    profilePic: "",
  },
  allUsers: [],
  allChats: [],
  allMessages: [],
  selectedChat: {
    id: "",
    createdAt: "",
    updatedAt: "",
    unreadMessageCount: 0,
    lastMessage: {
      chatId: "",
      sender: "",
      text: "",
      createdAt: "",
      read: false,
      id: "",
    },
    members: [],
  },
  lastMessage: {
    time: "",
    msg: "",
  },
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    setAllChat: (state, action) => {
      state.allChats = action.payload;
    },
    setAllMessage: (state, action) => {
      state.allMessages = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addMessage(state, action) {
      state.allMessages = [...state.allMessages, action.payload];
    },
    markAllMessagesRead(state) {
      state.allMessages = state.allMessages.map((msg) => ({
        ...msg,
        read: true,
      }));
    },
    updateUnreadMessage(state, action) {
      const { message, selectedChatId } = action.payload;

      const chat = state.allChats.find((chat) => chat.id === message.chatId);

      if (!chat) return;

      chat.lastMessage = message;
      chat.updatedAt = message.createdAt;

      state.allChats.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      if (message.chatId !== selectedChatId) {
        chat.unreadMessageCount = (chat.unreadMessageCount || 0) + 1;
      }
    },
    clearUnreadCount(state, action) {
      const chat = state.allChats.find((chat) => chat.id === action.payload);

      if (chat) {
        chat.unreadMessageCount = 0;
      }
    },
  },
});

export const {
  setUser,
  setAllUser,
  setAllChat,
  setAllMessage,
  addMessage,
  markAllMessagesRead,
  updateUnreadMessage,
  clearUnreadCount,
  setSelectedChat,
  setOnlineUsers,
} = userSlice.actions;
export default userSlice.reducer;
