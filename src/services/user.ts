/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "./axios";
import axios from "axios";

export const getLoggedInUser = async () => {
  try {
    const response = await api.get("/api/v1/user/user-details");

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
      console.error("Status:", error.response?.data);
    }

    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/v1/user/all-users");

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};

export const updateUserProfile = async (payload: any) => {
  try {
    const response = await api.patch(
      "/api/v1/user/update-user-details",
      payload,
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};

export const updatePassword = async (payload: any) => {
  try {
    const response = await api.patch(
      "/api/v1/user/update-user-password",
      payload,
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};

export const uploadProfilePic = async (payload: any) => {
  try {
    const response = await api.patch(
      "/api/v1/user/upload-profile-picture",
      payload,
    );

    return response.data;
  } catch (error: any) {
    if (error.message.includes("413")) {
      toast.error("Image size is too large. Please select another image!");
    }
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message);
      console.error("Status:", error.response?.data);
    }
    throw error;
  }
};
