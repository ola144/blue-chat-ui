import { useEffect } from "react";
import { getAllUsers, getLoggedInUser } from "../services/user";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChat, setAllUser, setUser } from "../redux/userSlice";
import { Navigate } from "react-router-dom";
import { getAllChats } from "../services/chat";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ProtectedRoutes = ({ children }: any) => {
  const authToken = localStorage.getItem("authToken");

  const dispatch = useDispatch();

  const getLoggedUser = async () => {
    dispatch(showLoader());
    try {
      const response = await getLoggedInUser();
      dispatch(setUser(response.data));
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getUsers = async () => {
    dispatch(showLoader());
    try {
      const response = await getAllUsers();
      dispatch(setAllUser(response.data));
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getChats = async () => {
    dispatch(showLoader());
    try {
      const response = await getAllChats();

      dispatch(setAllChat(response.data));
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (authToken) {
      getLoggedUser();
      getUsers();
      getChats();
    }
  }, []);

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;
