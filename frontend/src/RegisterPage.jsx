import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaGoogle, FaFacebookF } from "react-icons/fa";

export default function RegisterPage() {
  // Placeholder for navigation on register
  // const navigate = useNavigate();
  // const handleRegister = (e) => { e.preventDefault(); navigate('/dashboard'); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        {/* Profile Photo Upload Placeholder */}
        <div className="relative mb-4">
          <FaUserCircle className="text-indigo-300 text-6xl" />
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" disabled />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Register</h2>
        <form className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-3 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50"
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition"
            // onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <div className="flex items-center my-6 w-full">
          <div className="flex-grow h-px bg-slate-200" />
          <span className="mx-3 text-slate-400 text-sm">or</span>
          <div className="flex-grow h-px bg-slate-200" />
        </div>
        <div className="flex gap-4 w-full">
          <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded shadow hover:bg-red-600 transition font-medium">
            <FaGoogle /> Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 transition font-medium">
            <FaFacebookF /> Facebook
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">Login</Link>
        </div>
      </div>
    </div>
  );
} 