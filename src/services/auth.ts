/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "./axios";

interface SignData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (payload: SignData) => {
  try {
    const response = await api.post(`${baseURL}/api/v1/auth/signup`, payload);

    toast.success(response.data.message);

    return response;
  } catch (error: any) {
    toast.error(
      error.response.data.message || "Something went wrong. Please try again",
    );
  }
};

export const login = async (payload: LoginData) => {
  try {
    const response = await api.post(`${baseURL}/api/v1/auth/login`, payload);

    toast.success(response.data.message);

    const result = response.data;
    localStorage.setItem("authToken", result.data.token);
    localStorage.setItem("userId", result.data.user.id);

    return response;
  } catch (error: any) {
    toast.error(
      error.response.data.message || "Something went wrong. Please try again",
    );
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");

  window.location.href = "/login";
};
