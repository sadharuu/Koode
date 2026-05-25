import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import logo from "../images/koode_logo.png";

const Signup = () => {
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profilePic, setProfilePic] = useState(null);

  const [preview, setPreview] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // HANDLE IMAGE
  // ==============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePic(file);

      setPreview(URL.createObjectURL(file));
    }
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Password validation
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");

      return;
    }

    setLoading(true);

    try {
      // FormData for multer
      const data = new FormData();

      data.append(
        "username",
        formData.username
      );

      data.append("email", formData.email);

      data.append(
        "password",
        formData.password
      );

      if (profilePic) {
        data.append(
          "profilePic",
          profilePic
        );
      }

      // API
      await axios.post(
        "https://koode-23xz.onrender.com/user/createuser",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // Redirect
      navigate("/");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.msg ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-6 transition-colors duration-300">

      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 transition-colors duration-300">

        {/* LOGO */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Koode Logo"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />

          <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400">
            Koode
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Create your account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">

              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 dark:border-slate-700 shadow-md">

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
                    👤
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Upload Profile Picture
            </p>
          </div>

          {/* USERNAME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-slate-700 transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-slate-700 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-4 py-3 pr-12 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-slate-700 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-4 py-3 pr-12 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-slate-700 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-3 font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="mt-6 text-center text-gray-500 dark:text-slate-400">
          Already have an account?{" "}

          <Link
            to="/"
            className="font-semibold text-purple-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;