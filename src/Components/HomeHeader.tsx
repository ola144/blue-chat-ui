import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../redux/store";
import { socket } from "../services/socket";
import { logout } from "../services/auth";
import Logo from "../assets/logo/blue-chat.png";

const HomeHeader = () => {
  const { userData } = useSelector((state: RootState) => state.userReducer);

  const getFullName = () => {
    const fName = userData.firstName.toUpperCase();
    const lName = userData.lastName.toUpperCase();

    return fName + " " + lName;
  };

  const getInitials = () => {
    const f = userData.firstName.toUpperCase()[0];
    const l = userData.lastName.toUpperCase()[0];

    return f + l;
  };

  const handleLogout = () => {
    socket.disconnect();
    logout();
  };

  return (
    <div className="flex justify-between px-4 py-1  shadow-black w-full bg-blue-200">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 text-blue-600">
          <img src={Logo} alt="Blue Chat" className="sm:w-10 sm:h-10 w-8 h-8" />
          <h1 className="sm:text-lg sm:block hidden font-semibold ">
            BlueChat
          </h1>
        </div>
      </div>

      <div className="flex items-center sm:gap-4 gap-1">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-blue-50"
        >
          {userData.profilePic ? (
            <img
              src={userData.profilePic}
              alt={userData.firstName + " " + userData.lastName}
              className="sm:h-8 sm:w-8 w-6 h-6 rounded-full"
            />
          ) : (
            <span className="flex sm:h-8 sm:w-8 w-6 h-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {getInitials()}
            </span>
          )}
          <p className="text-slate-700 sm:text-sm text-xs font-bold">
            {getFullName()}
          </p>
        </Link>

        <button
          className="bg-red-500 text-white font-bold w-fit sm:py-2 sm:px-3 py-1 px-2 rounded-lg translate-all duration-300 hover:bg-red-400"
          title="Logout"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40A8,8,0,0,0,176,88v32H112a8,8,0,0,0,0,16h64v32a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,229.66,122.34Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
