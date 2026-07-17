import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("./Pages/Home/Home"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Signup = lazy(() => import("./Pages/Signup/Signup"));
const Welcome = lazy(() => import("./Pages/Welcome/Welcome"));
const ProtectedRoutes = lazy(() => import("./Routes/ProtectedRoutes"));
const Loader = lazy(() => import("./Components/Loader"));
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import NotFound from "./Pages/NotFound/NotFound";
const Profile = lazy(() => import("./Pages/Profile/Profile"));

function App() {
  const loader = useSelector((state: RootState) => state.loaderReducer.loader);

  return (
    <>
      {loader && <Loader />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
