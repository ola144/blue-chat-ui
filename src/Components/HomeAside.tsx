/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Users from "./Users";
import Search from "./Search";
import type { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { updateUnreadMessage, setSelectedChat } from "../redux/userSlice";
import moment from "moment";
import { socket } from "../services/socket";
import { showUsers } from "../redux/showUserSlice";

// const contacts = [
//   {
//     name: "Ava",
//     status: "Online",
//     message: "Let's review the new design",
//     accent: "bg-blue-500",
//   },
//   {
//     name: "Noah",
//     status: "Away",
//     message: "I sent the files over",
//     accent: "bg-sky-400",
//   },
//   {
//     name: "Mia",
//     status: "Online",
//     message: "Can we sync at 3 PM?",
//     accent: "bg-indigo-500",
//   },
//   {
//     name: "Leo",
//     status: "Busy",
//     message: "Working on the update",
//     accent: "bg-cyan-500",
//   },
//   {
//     name: "Ava",
//     status: "Online",
//     message: "Let's review the new design",
//     accent: "bg-blue-500",
//   },
//   {
//     name: "Noah",
//     status: "Away",
//     message: "I sent the files over",
//     accent: "bg-sky-400",
//   },
//   {
//     name: "Mia",
//     status: "Online",
//     message: "Can we sync at 3 PM?",
//     accent: "bg-indigo-500",
//   },
//   {
//     name: "Leo",
//     status: "Busy",
//     message: "Working on the update",
//     accent: "bg-cyan-500",
//   },
// ];

const HomeAside = () => {
  const { userData: currentUser } = useSelector(
    (state: RootState) => state.userReducer,
  );
  const selectedChat = useSelector(
    (state: RootState) => state.userReducer.selectedChat,
  );
  const allChats = useSelector(
    (state: RootState) => state.userReducer.allChats,
  );
  const allUsers = useSelector(
    (state: RootState) => state.userReducer.allUsers,
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.userReducer.onlineUsers,
  );
  const showUser = useSelector(
    (state: RootState) => state.showUsersReducer.showUser,
  );

  const dispatch = useDispatch();

  const openChat = (selectedUserId: string) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((member) => member.id).includes(currentUser.id) &&
        chat.members.map((member) => member.id).includes(selectedUserId),
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const isSelectedChat = (userId: string) => {
    if (selectedChat) {
      return selectedChat.members.map((m) => m.id).includes(userId);
    }
    return false;
  };

  const [searchKey, setSearchKey] = useState<string>("");

  const getLastMessage = (userId: string) => {
    const chat: any = allChats.find((chat) =>
      chat.members.map((m) => m.id).includes(userId),
    );

    if (!chat || !chat?.lastMessage) {
      return " ";
    } else {
      const lastMessage = chat.lastMessage.text || chat.lastMessage.image;

      const msgPrefix =
        chat?.lastMessage?.sender === currentUser.id ? "You: " : " ";

      if (lastMessage.includes("data:image/")) {
        return `${msgPrefix} Sent photo 📸`;
      }

      return `${msgPrefix} ${chat?.lastMessage?.text?.substring(0, 25)}`;
    }
  };

  const getLastMessageTimeStamp = (userId: string) => {
    const chat: any = allChats.find((chat) =>
      chat.members.map((m) => m.id).includes(userId),
    );

    if (!chat || !chat?.lastMessage) {
      return "";
    } else {
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
    }
  };

  const getUnreadMessageCount = (userId: string) => {
    const chat: any = allChats.find((chat) =>
      chat.members.some((m) => m.id.includes(userId)),
    );

    if (
      chat &&
      chat?.unreadMessageCount &&
      chat?.lastMessage?.sender !== currentUser.id
    ) {
      return chat?.unreadMessageCount;
    } else {
      return " ";
    }
  };

  const filterChat = useMemo(() => {
    if (searchKey === "") {
      return allChats;
    } else {
      return allUsers.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchKey.toLowerCase()),
      );
    }
  }, [allChats, allUsers, searchKey]);

  useEffect(() => {
    const handleReceiveMsg = (message: any) => {
      if (message?.chatId !== selectedChat?.id) {
        dispatch(
          updateUnreadMessage({ message, selectedChatId: selectedChat.id }),
        );
      }
    };

    socket.on("receive-message", handleReceiveMsg);

    return () => {
      socket.off("receive-message", handleReceiveMsg);
    };
  }, []);

  return (
    <>
      <aside className="border-b border-blue-100 bg-slate-50/80 sm:p-4 px-1 py-1 md:w-80 sm:w-72 w-52 md:border-b-0 md:border-r overflow-y-hidden mt-2 flex flex-col gap-3 relative">
        <div className="flex items-center justify-between mt-2">
          <h2 className="sm:text-xl text-sm font-bold text-slate-900">
            Messages
          </h2>
          {!showUser && (
            <button
              className="rounded-sm bg-blue-600 sm:px-2 py-1 p-1 text-sm font-semibold text-white transition hover:bg-blue-700"
              title="New Chat"
              onClick={() => dispatch(showUsers())}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M216,72H130.67L102.93,51.2a16.12,16.12,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V200a16,16,0,0,0,16,16H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72Zm0,128H40V64H93.33L123.2,86.4A8,8,0,0,0,128,88h88Zm-56-56a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,144Z"></path>
              </svg>
            </button>
          )}
        </div>

        <Search searchKey={searchKey} setSearchKey={setSearchKey} />

        <div className="overflow-y-auto h-105 p-2">
          <div className="space-y-2">
            {filterChat.length === 0 ? (
              <div className="flex items-center flex-col gap-1 justify-center text-blue-500 h-fit overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="52"
                  height="52"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="hidden sm:block"
                >
                  <path d="M152,144a16,16,0,1,1-16-16A16,16,0,0,1,152,144Zm32-16a16,16,0,1,0,16,16A16,16,0,0,0,184,128Zm59.18,82.35a20,20,0,0,1-24.83,24.83l-23.26-6.84A84,84,0,0,1,83.72,187.11a83.2,83.2,0,0,1-22.82-6.77l-23.25,6.84A20.24,20.24,0,0,1,32,188a20,20,0,0,1-19.19-25.64l6.84-23.26A84,84,0,0,1,172.33,68.91a84,84,0,0,1,64,118.18ZM76.46,160.75A83.94,83.94,0,0,1,145,69.37,60,60,0,0,0,43.08,132.3a12,12,0,0,1,.93,9.06l-6.09,20.72L58.64,156a12,12,0,0,1,9.06.93A60.08,60.08,0,0,0,76.46,160.75ZM220,152a60,60,0,1,0-31.7,52.92,12,12,0,0,1,9.06-.93l20.72,6.09L212,189.36a12,12,0,0,1,.93-9.06A60.09,60.09,0,0,0,220,152Z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="sm:hidden block"
                >
                  <path d="M152,144a16,16,0,1,1-16-16A16,16,0,0,1,152,144Zm32-16a16,16,0,1,0,16,16A16,16,0,0,0,184,128Zm59.18,82.35a20,20,0,0,1-24.83,24.83l-23.26-6.84A84,84,0,0,1,83.72,187.11a83.2,83.2,0,0,1-22.82-6.77l-23.25,6.84A20.24,20.24,0,0,1,32,188a20,20,0,0,1-19.19-25.64l6.84-23.26A84,84,0,0,1,172.33,68.91a84,84,0,0,1,64,118.18ZM76.46,160.75A83.94,83.94,0,0,1,145,69.37,60,60,0,0,0,43.08,132.3a12,12,0,0,1,.93,9.06l-6.09,20.72L58.64,156a12,12,0,0,1,9.06.93A60.08,60.08,0,0,0,76.46,160.75ZM220,152a60,60,0,1,0-31.7,52.92,12,12,0,0,1,9.06-.93l20.72,6.09L212,189.36a12,12,0,0,1,.93-9.06A60.09,60.09,0,0,0,220,152Z"></path>
                </svg>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <p className="sm:text-lg text-xs text-center">
                    No chat found!
                  </p>
                  <button
                    className="bg-blue-500 text-white sm:py-2 sm:px-3 py-1 px-2 rounded-lg w-fit hover:bg-blue-400 sm:text-sm text-xs transition-all duration-300"
                    onClick={() => dispatch(showUsers())}
                  >
                    Create New Chat
                  </button>
                </div>
              </div>
            ) : (
              filterChat.map((obj: any, index) => {
                let contact = obj;
                if (obj.members) {
                  contact = obj.members.find(
                    (mem: any) => mem.id !== currentUser.id,
                  );
                }
                const chats = allChats.some((chat) =>
                  chat.members.map((member) => member.id).includes(contact.id),
                );

                const unreadCount = getUnreadMessageCount(contact.id);

                if (!chats) return null;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`flex w-full items-center sm:gap-3 gap-1 rounded-lg border border-transparent sm:p-2 p-1 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md ${isSelectedChat(contact.id) ? "bg-sky-400 text-white" : "bg-white text-slate-900"}`}
                    onClick={() => openChat(contact.id)}
                  >
                    {contact.profilePic ? (
                      <div className="relative">
                        <img
                          src={contact.profilePic}
                          alt={contact.firstName + " " + contact.lastName}
                          className="sm:h-8 sm:w-8 h-4 w-4 rounded-full"
                        />
                        {onlineUsers.some(
                          (user: any) =>
                            String(user.userId) === String(contact.id),
                        ) && (
                          <span className="size-2 rounded-full bg-blue-600 sm:flex items-center justify-center absolute hidden right-0 bottom-0"></span>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className={`flex sm:h-8 sm:w-8 h-4 w-4 items-center justify-center rounded-full uppercase ${isSelectedChat(contact.id) ? "bg-white text-sky-400" : "bg-sky-400 text-white"}  sm:text-sm text-[10px] font-bold `}
                        >
                          {contact.firstName[0] + contact.lastName[0]}
                        </div>
                        {onlineUsers.some(
                          (user: any) =>
                            String(user.userId) === String(contact.id),
                        ) && (
                          <span className="size-2 rounded-full bg-blue-600 sm:flex hidden items-center justify-center absolute right-0 bottom-0"></span>
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col sm:gap-1">
                      <div className="flex items-center justify-between sm:gap-2">
                        <p className="truncate sm:text-sm text-[10px] font-semibold capitalize">
                          {contact.firstName + " " + contact.lastName}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <p
                          className={`truncate sm:text-xs text-[10px]  ${isSelectedChat(contact.id) ? "text-white" : "text-slate-600"}`}
                        >
                          {getLastMessage(contact.id) || " "}
                        </p>
                        {unreadCount > 0 && (
                          <p
                            className={`sm:flex h-4 w-4 items-center justify-center rounded-full truncate text-sm text-white hidden bg-blue-600`}
                          >
                            {unreadCount}
                          </p>
                        )}
                      </div>

                      <p
                        className={`truncate sm:text-[10px] text-[8px] flex justify-end  ${isSelectedChat(contact.id) ? "text-white" : "text-slate-600"}`}
                      >
                        {getLastMessageTimeStamp(contact.id)}
                      </p>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        <Users />
      </aside>
    </>
  );
};

export default HomeAside;
