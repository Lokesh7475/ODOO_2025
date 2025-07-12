import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaGoogle,
  FaFacebookF,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { registerUser } from "../services/userService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    // Reset the file input
    const fileInput = document.getElementById("avatar-input");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!avatar) {
      setError("Please upload a profile picture");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        avatar: avatar,
      };

      const response = await registerUser(userData);

      setSuccess("Registration successful! Redirecting to login...");

      // Store tokens if provided
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        {/* Profile Photo Upload */}
        <div className="relative mb-4">
          {avatarPreview ? (
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
              />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <FaUserCircle className="text-indigo-300 text-6xl" />
              <label
                htmlFor="avatar-input"
                className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              >
                <FaUpload className="text-indigo-600 text-2xl" />
              </label>
            </div>
          )}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Register</h2>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {success}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="name"
            disabled={isSubmitting}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="email"
            disabled={isSubmitting}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="username"
            disabled={isSubmitting}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="flex items-center my-6 w-full">
          <div className="flex-grow h-px bg-slate-200" />
          <span className="mx-3 text-slate-400 text-sm">or</span>
          <div className="flex-grow h-px bg-slate-200" />
        </div>

        <div className="flex gap-4 w-full">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded shadow hover:bg-red-600 transition font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            <FaGoogle /> Google
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 transition font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            <FaFacebookF /> Facebook
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
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
