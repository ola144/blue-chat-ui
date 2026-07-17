/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Search from "./Search";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { hideUsers } from "../redux/showUserSlice";
import { startChat } from "../services/chat";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChat, setSelectedChat } from "../redux/userSlice";

const Users = () => {
  const [searchKey, setSearchKey] = useState("");

  const showUser = useSelector(
    (state: RootState) => state.showUsersReducer.showUser,
  );
  const {
    allUsers,
    allChats,
    userData: currentUser,
  } = useSelector((state: RootState) => state.userReducer);

  const filterUsers = useMemo(() => {
    return allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchKey.toLowerCase()),
    );
  }, [allUsers, searchKey]);

  const dispatch = useDispatch();

  const createNewChat = async (userId: string) => {
    const existingChat = allChats.find((chat) => {
      const memberIds = chat.members.map((m) => String(m.id));

      return (
        memberIds.includes(String(currentUser.id)) &&
        memberIds.includes(String(userId))
      );
    });

    if (existingChat) {
      dispatch(setSelectedChat(existingChat));
      dispatch(hideUsers());
      return;
    }

    try {
      dispatch(showLoader());
      const response = await startChat([`${currentUser.id}`, `${userId}`]);
      if (response.status === "success") {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [...allChats, newChat];
        dispatch(setAllChat(updatedChat));
        dispatch(hideUsers());
        dispatch(setSelectedChat(newChat));
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <motion.div
        className="absolute left-0 top-0 h-full sm:w-fit w-full z-3000 bg-[radial-gradient(rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] sm:p-2 p-1 flex flex-col gap-3 overflow-y-hidden"
        initial={{ left: -800 }}
        animate={showUser ? { left: 0 } : { left: -800 }}
      >
        <div className="flex items-center justify-between">
          <button
            className="text-blue-500"
            onClick={() => dispatch(hideUsers())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M220,128a4,4,0,0,1-4,4H49.66l65.17,65.17a4,4,0,0,1-5.66,5.66l-72-72a4,4,0,0,1,0-5.66l72-72a4,4,0,0,1,5.66,5.66L49.66,124H216A4,4,0,0,1,220,128Z"></path>
            </svg>
          </button>
          <h2 className="text-blue-500 font-bold sm:text-lg text-xs">
            New Chat
          </h2>
        </div>
        <Search searchKey={searchKey} setSearchKey={setSearchKey} />

        <div className="flex flex-col gap-2">
          <h2 className="text-blue-500 font-bold sm:text-sm text-xs">
            All Users
          </h2>

          {filterUsers.length === 0 ? (
            <div className="flex items-center flex-col gap-1 justify-center text-blue-500 h-125">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="sm:block hidden"
              >
                <path d="M164,56a12,12,0,0,1,12-12h48a12,12,0,0,1,0,24H176A12,12,0,0,1,164,56Zm65.85,36A108,108,0,1,1,128,20a109.19,109.19,0,0,1,18,1.49,12,12,0,0,1-4,23.67A85,85,0,0,0,128,44,83.94,83.94,0,0,0,62.05,179.94a83.48,83.48,0,0,1,29-23.42,52,52,0,1,1,74,0,83.36,83.36,0,0,1,29,23.42A83.94,83.94,0,0,0,207.22,100a12,12,0,0,1,22.63-8ZM128,148a28,28,0,1,0-28-28A28,28,0,0,0,128,148Zm0,64a83.53,83.53,0,0,0,48.43-15.43,60,60,0,0,0-96.86,0A83.53,83.53,0,0,0,128,212Z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="sm:hidden block"
              >
                <path d="M164,56a12,12,0,0,1,12-12h48a12,12,0,0,1,0,24H176A12,12,0,0,1,164,56Zm65.85,36A108,108,0,1,1,128,20a109.19,109.19,0,0,1,18,1.49,12,12,0,0,1-4,23.67A85,85,0,0,0,128,44,83.94,83.94,0,0,0,62.05,179.94a83.48,83.48,0,0,1,29-23.42,52,52,0,1,1,74,0,83.36,83.36,0,0,1,29,23.42A83.94,83.94,0,0,0,207.22,100a12,12,0,0,1,22.63-8ZM128,148a28,28,0,1,0-28-28A28,28,0,0,0,128,148Zm0,64a83.53,83.53,0,0,0,48.43-15.43,60,60,0,0,0-96.86,0A83.53,83.53,0,0,0,128,212Z"></path>
              </svg>
              <p className="sm:text-sm text-xs text-center">
                No User Is Available!
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto h-105 p-2">
              <div className="space-y-1">
                {filterUsers.map((user, index) => (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="flex w-full items-center sm:gap-3 gap-1 rounded-2xl border border-transparent bg-white p-2 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    onClick={() => createNewChat(user.id)}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.firstName + " " + user.lastName}
                        className="sm:h-8 sm:w-8 w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div
                        className={`flex sm:h-8 sm:w-8 w-5 h-5 items-center justify-center rounded-full bg-sky-400 text-[10px] sm:text-sm font-bold text-white`}
                      >
                        {user.firstName[0] + user.lastName[0]}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">
                          {user.firstName + " " + user.lastName}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      {showUser && (
        <div
          className="bg-black/0 fixed inset-0 h-full w-full z-2000"
          onClick={() => dispatch(hideUsers())}
        ></div>
      )}
    </>
  );
};

export default Users;
