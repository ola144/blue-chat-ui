/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import {
  updatePassword,
  updateUserProfile,
  uploadProfilePic,
} from "../../services/user";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.userReducer);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    password: "",
    currentPassword: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    currentPassword: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");

  const displayFirstName = formData.firstName || userData.firstName || "";
  const displayLastName = formData.lastName || userData.lastName || "";
  const displayEmail = formData.email || userData.email || "";
  const displayPhone = formData.phoneNumber || userData.phoneNumber || "";
  const profilePicture = imagePreview || userData.profilePic || "";

  const avatarLabel = useMemo(() => {
    const first = displayFirstName.trim().charAt(0)?.toUpperCase() || "U";
    const last = displayLastName.trim().charAt(0)?.toUpperCase() || "";

    return `${first}${last}`;
  }, [displayFirstName, displayLastName]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
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

    // if (!formData.agreeToTerms) {
    //   newErrors.agreeToTerms = "You must agree to the terms";
    // }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
    // return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {
      password: "",
      currentPassword: "",
    };

    if (!passwordData.password) {
      newErrors.password = "Password is required";
    } else if (passwordData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwordData.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[0-9]/.test(passwordData.password)) {
      newErrors.password = "Password must contain a number";
    }

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Please provide your current password";
    }

    setPasswordErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader: any = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      setImagePreview(reader.result);
    };

    setSelectedFile(file);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!validateProfile()) return;
    dispatch(showLoader());

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    try {
      const response = await updateUserProfile(payload);

      if (response.status === "success") {
        dispatch(setUser(response.data));
        toast.success(response.message);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleUpdatePassword = async (event: Event) => {
    event.preventDefault();
    if (!validatePassword()) return;
    dispatch(showLoader());

    const payload = {
      password: passwordData.password,
      currentPassword: passwordData.currentPassword,
    };

    try {
      const response = await updatePassword(payload);

      if (response.status === "success") {
        toast.success(response.message);
        setPasswordData({
          password: "",
          currentPassword: "",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error) {
        toast.error(error.message);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleUploadProfilePic = async () => {
    dispatch(showLoader());

    const payload = {
      profilePic: imagePreview,
    };

    try {
      const response = await uploadProfilePic(payload);
      console.log(response);

      if (response.status === "success") {
        dispatch(setUser(response.data));
        toast.success(response.message);
        setSelectedFile("");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    setFormData({
      email: userData.email || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phoneNumber: userData.phoneNumber || "",
    });

    setImagePreview(userData.profilePic || "");
  }, [
    userData.email,
    userData.firstName,
    userData.lastName,
    userData.phoneNumber,
    userData.profilePic,
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_36%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] px-4 py-8 text-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Your profile
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Update your account details
            </h1>
          </div>
          <Link
            to="/chat"
            className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:border-blue-400 hover:text-blue-700"
          >
            Back to chat
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-end gap-1">
                <label className="group flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-blue-200 bg-blue-50 shadow-inner transition hover:border-blue-400">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-700">
                      {avatarLabel}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {selectedFile && (
                  <button
                    className="w-fit bg-blue-500 text-white transition-all duration-300 hover:bg-blue-400 rounded-lg py-2 px-3"
                    onClick={handleUploadProfilePic}
                  >
                    Upload
                  </button>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Profile picture
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {displayFirstName || "Your"} {displayLastName || "Name"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choose a new photo to personalize your BlueChat profile.
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  First name
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm font-normal">
                      {errors.firstName}
                    </p>
                  )}
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm font-normal">
                      {errors.lastName}
                    </p>
                  )}
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white disabled:cursor-no-drop disabled:bg-gray-300"
                  disabled
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.email}
                  </p>
                )}
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Phone number
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.phoneNumber}
                  </p>
                )}
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 w-fit"
                  onClick={(e: any) => handleSubmit(e)}
                >
                  Save Profile
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-700 text-lg">
                Change Password
              </h4>
              <label className="block text-sm font-semibold text-slate-700">
                Current password
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Current Password"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm font-normal">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                New password
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="New Password"
                />
                {passwordErrors.password && (
                  <p className="text-red-500 text-sm font-normal">
                    {passwordErrors.password}
                  </p>
                )}
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 w-fit"
                  onClick={(e: any) => handleUpdatePassword(e)}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-slate-900 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
              Quick preview
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-blue-400 bg-blue-500/20 text-xl font-bold text-blue-100">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarLabel
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {displayFirstName || "Your"} {displayLastName || "Name"}
                </h3>
                <p className="text-sm text-slate-300">
                  {displayEmail || "your@email.com"}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Display name</span>
                <span className="font-semibold text-white">
                  {displayFirstName || "Your"} {displayLastName || "Name"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <span className="font-semibold text-white">
                  {displayPhone || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
