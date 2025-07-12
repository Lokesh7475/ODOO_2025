import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <FaUserCircle className="text-indigo-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Login</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">Register</Link>
        </div>
        <div className="mt-2 text-sm text-slate-600">
          <Link to="/" className="text-indigo-600 hover:underline font-medium">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 