import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/koode_logo.png"; // Place your logo in src/assets/

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://koode-23xz.onrender.com/user/createuser", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to login page after successful signup
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-purple-200/50 p-8">
        {/* Branding */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Koode Logo"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-4xl font-bold text-purple-700">Koode</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 pr-12 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 pr-12 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "'Poppins', sans-serif",}}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-500">
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