import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2">
          <img src="/logo.avif" alt="Swapify Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-indigo-700 tracking-tight">
            Swapify
          </span>
        </div>

        <ul className="hidden md:flex gap-8 text-slate-700 font-medium items-center">
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/browse" className="hover:text-indigo-600 transition">
              Browse
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/add-product"
                  className="hover:text-indigo-600 transition"
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl text-indigo-300" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.fullName || user?.username}
                  </span>
                  {user?.location && (
                    <span className="text-xs text-slate-500">
                      📍 {user.location}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                  title="Logout"
                >
                  <FaSignOutAlt size={14} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:bg-indigo-600 hover:text-white border border-indigo-600 rounded px-4 py-1 transition"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            aria-label="Open menu"
            className="text-2xl text-indigo-700 focus:outline-none"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
