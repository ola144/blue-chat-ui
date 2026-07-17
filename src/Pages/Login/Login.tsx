/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof FormData;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field])
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is a required field!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email!";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is a required field!";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    dispatch(showLoader());
    setLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    await login(payload)
      .then((res: any) => {
        if (res) {
          navigate("/chat");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    const message = sessionStorage.getItem("sessionExpired");

    if (message) {
      toast.error(message);

      sessionStorage.clear();
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8"
      style={{ overflow: "auto" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-4xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-500/10 backdrop-blur xl:p-10"
        >
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 sm:text-sm text-xs font-medium text-blue-700">
            <span
              className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500 
            "
            />
            Welcome back
          </div>

          <h1 className="mt-6 font-black leading-tight text-slate-900 sm:text-5xl text-3xl">
            Sign in to <span className="text-blue-600">BlueChat</span>
          </h1>

          <p className="mt-4 sm:text-lg text-sm sm:leading-8 leading-6 text-slate-600">
            Continue your conversations with a fast, beautiful, and secure
            messaging experience.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Stay connected in real time",
              "Access your chats instantly",
              "Enjoy a smooth modern interface",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm font-medium text-slate-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  ✓
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-4xl border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-500/10 sm:p-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Log in</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your details to continue.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                onChange={handleChange}
                value={formData.email}
                name="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input"
                  onChange={(e) => handleChange(e)}
                  value={formData.password}
                  name="password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.password}
                  </p>
                )}
                <button
                  type="button"
                  className="absolute top-4 right-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#4a5565"
                      viewBox="0 0 256 256"
                    >
                      <path d="M96.68,57.87a4,4,0,0,1,2.08-6.6A130.13,130.13,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41a8,8,0,0,1,0,6.5c-.35.79-8.82,19.57-27.65,38.4q-4.28,4.26-8.79,8.07a4,4,0,0,1-5.55-.36ZM213.92,210.62a8,8,0,1,1-11.84,10.76L180,197.13A127.21,127.21,0,0,1,128,208c-34.88,0-66.57-13.26-91.66-38.34C17.51,150.83,9,132.05,8.69,131.26a8,8,0,0,1,0-6.5C9,124,17.51,105.18,36.34,86.35a135,135,0,0,1,25-19.78L42.08,45.38A8,8,0,1,1,53.92,34.62Zm-65.49-48.25-52.69-58a40,40,0,0,0,52.69,58Z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#4a5565"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              {/* <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </a> */}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="authBtn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
