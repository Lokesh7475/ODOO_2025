import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Mock user data
const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: null,
};

// Mock listings data
const myListings = [
  {
    id: 1,
    name: "Blue Denim Jacket",
    img: "https://source.unsplash.com/300x400?jacket,denim",
    status: "Available",
    date: "2024-07-10",
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    img: "https://source.unsplash.com/300x400?dress,floral",
    status: "Swapped",
    date: "2024-07-08",
  },
  {
    id: 3,
    name: "Red Scarf",
    img: "https://source.unsplash.com/300x400?scarf,red",
    status: "Available",
    date: "2024-07-05",
  },
];

// Mock swaps/requests data
const mySwaps = [
  {
    id: 1,
    name: "Classic Black Pants",
    date: "2024-07-12",
    status: "Pending",
  },
  {
    id: 2,
    name: "White Sneakers",
    date: "2024-07-10",
    status: "Accepted",
  },
  {
    id: 3,
    name: "Green Hoodie",
    date: "2024-07-08",
    status: "Rejected",
  },
];

const tabs = [
  { id: "listings", label: "My Listings", count: myListings.length },
  { id: "swaps", label: "My Swaps", count: mySwaps.length },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Swapped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <img src="/logo192.png" alt="Swapify Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-indigo-700 tracking-tight">Swapify</span>
          </div>
          <ul className="hidden md:flex gap-8 text-slate-700 font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition">Home</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Browse</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Login</a></li>
            <li>
              <a href="#" className="hover:bg-indigo-600 hover:text-white border border-indigo-600 rounded px-4 py-1 transition">
                Sign Up
              </a>
            </li>
          </ul>
          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button aria-label="Open menu" className="text-2xl text-indigo-700 focus:outline-none">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <FaUserCircle className="text-6xl text-indigo-300" />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h1>
              <p className="text-slate-600 mb-4">{user.email}</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex flex-col sm:flex-row" aria-label="Dashboard tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-left font-medium transition ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{tab.label}</span>
                    <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "listings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">My Listings</h2>
                  <Link
                    to="/add-product"
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium flex items-center gap-2"
                  >
                    <FaPlus /> Add New Item
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((item) => (
                    <article key={item.id} className="bg-white border border-slate-200 rounded-xl shadow hover:shadow-lg transition p-4">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                      <h3 className="font-semibold text-slate-800 mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm hover:bg-slate-200 transition flex items-center justify-center gap-1">
                          <FaEdit /> Edit
                        </button>
                        <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition flex items-center justify-center gap-1">
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "swaps" && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">My Swaps</h2>
                <div className="space-y-4">
                  {mySwaps.map((swap) => (
                    <article key={swap.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-1">{swap.name}</h3>
                          <p className="text-sm text-slate-500">Requested on {swap.date}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(swap.status)}`}>
                          {swap.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 