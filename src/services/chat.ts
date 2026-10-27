/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import api from "./axios";

export const getAllChats = async () => {
  try {
    const response = await api.get("/api/v1/chat/get-all-chat");

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};

export const startChat = async (members: string[]) => {
  try {
    const response = await api.post("/api/v1/chat/create-new-chat", {
      members: members,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};

export const clearUnreadMsgCount = async (chatId: string) => {
  try {
    const response = await api.post("/api/v1/chat/clear-unread-message", {
      chatId: chatId,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};
