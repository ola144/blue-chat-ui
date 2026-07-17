import { useEffect } from "react";
import HomeAside from "../../Components/HomeAside";
import HomeHeader from "../../Components/HomeHeader";
import HomeMain from "../../Components/HomeMain";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { socket } from "../../services/socket";
import { setOnlineUsers } from "../../redux/userSlice";

const Home = () => {
  const { userData } = useSelector((state: RootState) => state.userReducer);
  const onlineUsers = useSelector(
    (state: RootState) => state.userReducer.onlineUsers,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Emit an event from client
    // socket.emit("send-message-all", { text: "Hi from John!" });
    // socket.on("send-message-by-server", (data) => {
    //   console.log(data);
    // });

    // SOCKET ROOM FOR SPECIFIC USER
    if (userData) {
      socket.emit("join-room", userData.id);
      socket.emit("user-login", userData.id);

      socket.on("online-users", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // socket.emit("send-message", {
      //   text: "Hi, Cole!",
      //   recipient: "6a4bcb8b2bea18e8703fb12e",
      // });
      // socket.on("receive-message", (data) => {
      //   console.log(data);
      // });
    }
  }, [userData, onlineUsers]);

  return (
    <div className="h-screen max-w-7xl text-slate-800 overflow-y-hidden mx-auto">
      <div className="sticky top-0 z-50">
        <HomeHeader />
      </div>

      <div className="flex overflow-y-hidden h-fit">
        <HomeAside />

        <HomeMain />
      </div>
    </div>
  );
};

export default Home;
