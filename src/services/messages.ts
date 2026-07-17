/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";
import { setAllMessage } from "../redux/userSlice";
import { toast } from "react-toastify";

export interface MessageObj {
  chatId: string;
  sender: string;
  text: string;
  image?: string;
}

export interface IMessage {
  chatId: string;
  sender: string;
  text: string;
  image?: string;
  createdAt: string;
  read: boolean;
  id: string;
}

export const getAllMessages = async (chatId: string) => {
  if (!chatId) return;

  try {
    const response = await api.get(`/api/v1/message/all-message/${chatId}`);

    setAllMessage(response.data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const createNewMessage = async (message: MessageObj) => {
  try {
    const response = await api.post("/api/v1/message/new-message", message);

    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const updateMesssage = async (
  message: MessageObj,
  messageId: string | undefined,
) => {
  try {
    const response = await api.post(
      `/api/v1/message//update-message/${messageId}`,
      message,
    );

    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};
