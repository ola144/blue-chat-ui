/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { toast } from "react-toastify";
import {
  createNewMessage,
  getAllMessages,
  type IMessage,
  type MessageObj,
} from "../services/messages";
import { useEffect, useState } from "react";
import {
  addMessage,
  clearUnreadCount,
  markAllMessagesRead,
  setAllMessage,
  updateUnreadMessage,
} from "../redux/userSlice";
import moment from "moment";
import { clearUnreadMsgCount } from "../services/chat";
import { socket } from "../services/socket";
import EmojiPicker from "emoji-picker-react";
import ImageView from "./ImageView";
import Logo from "../assets/logo/blue-chat.png";
import { hideLoader, showLoader } from "../redux/loaderSlice";

const HomeMain = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isEmojiPicker, setIsEmojiPicker] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>("");
  const [data, setData] = useState<any>(null);

  const { userData: currentUser, allMessages } = useSelector(
    (state: RootState) => state.userReducer,
  );

  const selectedChat = useSelector(
    (state: RootState) => state.userReducer.selectedChat,
  );
  const allChats = useSelector(
    (state: RootState) => state.userReducer.allChats,
  );
  const selectedUser = selectedChat?.members.find(
    (member) => member.id !== currentUser.id,
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.userReducer.onlineUsers,
  );

  const dispatch = useDispatch();

  const sendMessage = async (image?: string) => {
    try {
      const payload: MessageObj = {
        chatId: selectedChat.id,
        sender: currentUser.id,
        text: message,
        image: image,
      };

      // Send message event
      socket.emit("send-message", {
        ...payload,
        members: selectedChat.members.map((m) => m.id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      const response = await createNewMessage(payload);

      if (response.status === "success") {
        dispatch(
          updateUnreadMessage({
            message: response.data,
            selectedChatId: selectedChat.id,
          }),
        );
        dispatch(addMessage(response.data));
        setMessage("");
        setIsEmojiPicker(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const sendImage = async (e: any) => {
    const file = e.target.files[0];
    const reader: any = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      sendMessage(reader.result);
    };
  };

  const getMessages = async () => {
    dispatch(showLoader());
    try {
      const response = await getAllMessages(selectedChat.id);

      if (response.status === "success") {
        dispatch(setAllMessage(response.data));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const clearUreadMessages = async () => {
    try {
      socket.emit("clear-unread-message", {
        chatId: selectedChat.id,
        members: selectedChat.members.map((m) => m.id),
      });

      const response = await clearUnreadMsgCount(selectedChat.id);

      if (response.status === "success") {
        allChats.map((chat) => {
          if (chat.id === selectedChat.id) {
            return response.data;
          }
          return chat;
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const isCurrentUserSender = (senderId: string) => {
    if (senderId) {
      return senderId === currentUser.id;
    }

    return false;
  };

  const formatTime = (timestamp: string) => {
    const now = moment();

    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return `${moment(timestamp).format("MMM D, hh:mm A")}`;
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken && selectedChat) {
      getMessages();
      if (selectedChat.lastMessage) {
        if (selectedChat.lastMessage.sender !== currentUser.id) {
          clearUreadMessages();
        }
      }

      const handleReceiveMesssage = (message: any) => {
        if (message.chatId === selectedChat.id) {
          dispatch(addMessage(message));
        }

        if (
          selectedChat.id === message.chatId &&
          message.sender !== currentUser.id
        ) {
          clearUreadMessages();
        }
      };

      const handleClearUnreadCount = (data: any) => {
        if (data.chatId === selectedChat.id) {
          // UPDATING UNREAD MESSAGE COUNT
          dispatch(clearUnreadCount(data.chatId));

          // UPDATING READ PROPERTY IN MESSAGE OBJECT
          dispatch(markAllMessagesRead());
        }
      };

      socket.on("receive-message", handleReceiveMesssage);
      socket.on("message-count-cleared", handleClearUnreadCount);
      socket.on("started-typing", (data: any) => {
        setData(data);
        if (data.chatId === selectedChat.id && data.sender !== currentUser.id) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      });

      return () => {
        socket.off("receive-message", handleReceiveMesssage);
        socket.off("message-count-cleared", handleClearUnreadCount);
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    const messageContainer = document.getElementById("messageContainer");

    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [allMessages, isTyping]);

  return (
    <main
      className="bg-linear-to-br from-white to-blue-50/60 p-2 sm:p-6 overflow-y-hidden  flex flex-col gap-4 h-screen w-full"
      style={{ overflow: "hidden" }}
    >
      {selectedChat.id.length ? (
        <>
          {/* Chat Info */}
          <div
            className="flex items-center justify-between border-b border-blue-100 sm:pb-4 pb-1
           h-fit"
          >
            <div className="flex items-center sm:gap-3 gap-1">
              {selectedUser?.profilePic ? (
                <img
                  src={selectedUser?.profilePic}
                  alt={selectedUser?.firstName + " " + selectedUser?.lastName}
                  className="sm:h-12 sm:w-12 w-6 h-6 rounded-full"
                />
              ) : (
                <div className="flex sm:h-12 sm:w-12 w-6 h-6 items-center justify-center rounded-full bg-blue-600 sm:text-lg text-sm font-bold text-white">
                  {selectedUser?.firstName[0]}
                  {selectedUser?.lastName[0]}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900 sm:text-sm text-xs">
                  {selectedUser?.firstName + " " + selectedUser?.lastName}
                </h3>
                {onlineUsers.some(
                  (user: any) =>
                    String(user.userId) === String(selectedUser?.id),
                ) ? (
                  <p className="sm:text-sm text-xs text-green-500">Online</p>
                ) : (
                  <p className="sm:text-sm text-xs text-red-500">Offline</p>
                )}
              </div>
            </div>
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm sm:block hidden font-semibold text-blue-700">
              Active chat
            </div>
          </div>

          {!allMessages.length ? (
            <div className="flex items-center flex-col  justify-center flex-1 overflow-y-auto max-h-[60vh] sm:p-4 p-2 sm:max-h-[70vh] text-blue-500  w-full ">
              <img
                src={Logo}
                alt="Blue Chat"
                className="sm:w-40 w-20 mx-auto"
              />
              <div className="flex flex-col gap-1 text-center">
                <p className="md:text-lg sm:text-sm text-xs text-blue-500 md:w-1/2 mx-auto">
                  Start your conversations with a fast, beautiful, and secure
                  messaging experience.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 overflow-y-auto max-h-[60vh] sm:p-4 p-2 sm:max-h-[70vh]"
              id="messageContainer"
            >
              {allMessages.map((msg: IMessage, index) => (
                <motion.div
                  key={`${msg.text}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mt-1 ${isCurrentUserSender(msg.sender) ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-sm sm:px-2 sm:py-2 p-1 text-sm shadow-sm whitespace-break-spaces flex flex-col gap-1 ${
                      isCurrentUserSender(msg.sender)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 border border-blue-100"
                    }`}
                  >
                    <div className="">
                      <p className="sm:text-sm text-xs">{msg.text}</p>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="image"
                          className="sm:h-30 sm:w-30 w-30 h-24 cursor-pointer transition-all duration-300 hover:scale-z-150"
                          onClick={() => setSelectedImage(msg.image)}
                        />
                      )}
                    </div>

                    <span className="flex justify-end sm:text-xs text-[10px] gap-1">
                      {formatTime(msg.createdAt)}

                      {isCurrentUserSender(msg.sender) && msg.read && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M146.8,82.85l-89.6,88a4,4,0,0,1-5.6,0L13.2,133.14a4,4,0,0,1,5.6-5.71l35.6,35,86.8-85.24a4,4,0,0,1,5.6,5.7Zm96-5.65a4,4,0,0,0-5.65,0l-86.8,85.24-21.63-21.24a4,4,0,1,0-5.61,5.7l24.44,24a4,4,0,0,0,5.6,0l89.6-88A4,4,0,0,0,242.85,77.2Z"></path>
                        </svg>
                      )}
                      {/* {moment(msg.createdAt).format("hh:mm A")} */}
                      {/* {new Date(msg.createdAt).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} */}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping &&
                selectedChat?.members
                  .map((m) => m.id)
                  .includes(data?.sender) && (
                  <div className="text-blue-500 italic text-xs ">typing...</div>
                )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {isEmojiPicker && (
              <motion.div
                initial={{ display: "hidden" }}
                animate={
                  isEmojiPicker ? { display: "block" } : { display: "hidden" }
                }
                transition={{ delay: 1.5 }}
                className="fixed -translate-y-full right-5 z-300"
              >
                {/* Emoji Picker */}
                <EmojiPicker
                  width={230}
                  height={400}
                  className="w-20"
                  onEmojiClick={(e) => setMessage(message + e.emoji)}
                ></EmojiPicker>
              </motion.div>
            )}

            {/* Textarea Field & Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-blue-100 bg-white p-2 shadow-sm mb-15 relative"
            >
              <div className="flex sm:items-center sm:gap-3 gap-1 sm:flex-row flex-col ">
                <textarea
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-blue-400 focus:bg-white w-full resize-none"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    socket.emit("user-typing", {
                      chatId: selectedChat.id,
                      members: selectedChat.members.map((m) => m.id),
                      sender: currentUser.id,
                    });
                  }}
                  rows={1}
                />
                <div className="flex gap-1 items-center justify-end">
                  <label
                    className="rounded-sm bg-blue-600 py-1 px-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-200 disabled:hover:bg-blue-200 cursor-pointer"
                    htmlFor="image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 256 256"
                      className="w-5 h-5 "
                    >
                      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM80,96a16,16,0,1,1,16,16A16,16,0,0,1,80,96Z"></path>
                    </svg>
                    <input
                      type="file"
                      id="image"
                      className="hidden"
                      accept="image/jpg,image/png,image/jpeg,image/gif"
                      onChange={sendImage}
                    />
                  </label>
                  <button
                    className="rrounded-sm bg-blue-600  py-1 px-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-200 disabled:hover:bg-blue-200"
                    onClick={() => setIsEmojiPicker(!isEmojiPicker)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 "
                      fill="#ffffff"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM92,96a12,12,0,1,1-12,12A12,12,0,0,1,92,96Zm82.92,60c-10.29,17.79-27.39,28-46.92,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.08-20a8,8,0,1,1,13.84,8ZM164,120a12,12,0,1,1,12-12A12,12,0,0,1,164,120Z"></path>
                    </svg>
                  </button>
                  <button
                    className="rounded-sm bg-blue-600 py-1 px-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-200 disabled:hover:bg-blue-200"
                    disabled={!message.trim()}
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 "
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div className="flex items-center flex-col justify-center text-blue-500 h-screen overflow-hidden">
          <img src={Logo} alt="Blue Chat" className="w-40 mx-auto" />
          <div className="flex flex-col gap-1 text-center">
            <p className="text-lg text-blue-500">
              Fresh conversations, beautifully connected!
            </p>
          </div>
        </div>
      )}

      {selectedImage && (
        <ImageView
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </main>
  );
};

export default HomeMain;
