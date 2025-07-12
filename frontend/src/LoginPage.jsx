import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "./services/userService";
import { useAuth } from "./context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.emailOrUsername.trim()) {
      setError("Email or username is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Determine if input is email or username
      const isEmail = formData.emailOrUsername.includes("@");
      const credentials = {
        password: formData.password,
      };

      if (isEmail) {
        credentials.email = formData.emailOrUsername;
      } else {
        credentials.username = formData.emailOrUsername;
      }

      const response = await loginUser(credentials);

      // Use auth context to login
      if (response.data?.user && response.data?.accessToken) {
        login(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <FaUserCircle className="text-indigo-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            value={formData.emailOrUsername}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="username"
            disabled={isSubmitting}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50 pr-12"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              disabled={isSubmitting}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register
          </Link>
        </div>

        <div className="mt-2 text-sm text-slate-600">
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
