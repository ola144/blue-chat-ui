/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/auth";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof FormData;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^0[789][01]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // if (!formData.agreeToTerms) {
    //   newErrors.agreeToTerms = "You must agree to the terms";
    // }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
    // return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const palyload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    signup(palyload)
      .then((res: any) => {
        console.log(res);
        if (res) {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-4xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-500/10 backdrop-blur xl:p-10"
        >
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 sm:text-sm text-xs font-medium text-blue-700">
            <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
            Start your journey
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Create your <span className="text-blue-600">BlueChat</span> account
          </h1>

          <p className="mt-4 sm:text-lg text-sm leading-6 sm:leading-8 text-slate-600">
            Join thousands of people connecting in real time with a secure,
            modern chat experience.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Fast account setup",
              "Private and secure messages",
              "Beautiful chat experience",
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
            <h2 className="text-2xl font-bold text-slate-900">Sign up</h2>
            <p className="mt-2 text-sm text-slate-600">
              It only takes a minute to get started.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  name="firstName"
                  className="input"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input"
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="08111223344"
                  className="input"
                  value={formData.phoneNumber}
                  name="phoneNumber"
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="input"
                onChange={handleChange}
                value={formData.password}
                name="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="Repeat your password"
                className="input"
                onChange={handleChange}
                value={formData.confirmPassword}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="authBtn"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create account"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
