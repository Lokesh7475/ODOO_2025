import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FaLeaf, FaTshirt, FaStar } from "react-icons/fa";

const featuredItems = [
  {
    img: "https://source.unsplash.com/200x250/?clothes,shirt",
    name: "Floral Summer Dress",
    tag: "Available to Swap",
  },
  {
    img: "https://source.unsplash.com/200x250/?clothes,jacket",
    name: "Denim Jacket",
    tag: "Available to Swap",
  },
  {
    img: "https://source.unsplash.com/200x250/?clothes,hoodie",
    name: "Cozy Hoodie",
    tag: "Available to Swap",
  },
  {
    img: "https://source.unsplash.com/200x250/?clothes,skirt",
    name: "Pleated Skirt",
    tag: "Available to Swap",
  },
  {
    img: "https://source.unsplash.com/200x250/?clothes,jeans",
    name: "Classic Jeans",
    tag: "Available to Swap",
  },
];

const metrics = [
  {
    icon: <FaTshirt className="text-indigo-500 text-2xl" />,
    label: "5,000+ swaps completed",
  },
  {
    icon: <FaLeaf className="text-green-500 text-2xl" />,
    label: "10 tons of waste saved",
  },
  {
    icon: <FaStar className="text-yellow-400 text-2xl" />,
    label: "Rated 4.9 by our users",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-indigo-100 via-purple-100 to-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-16 md:py-24 gap-10">
        {/* Text */}
        <div className="flex-1 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Swap Your Style. <br className="hidden md:block" /> Save the Planet.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Join the sustainable fashion movement
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 transition font-semibold text-center"
            >
              Start Swapping
            </Link>
            <Link
              to="/browse"
              className="bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded shadow hover:bg-indigo-50 transition font-semibold text-center"
            >
              Browse Items
            </Link>
          </div>
        </div>
        {/* Background shape */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-gradient-to-br from-purple-200 via-indigo-100 to-white rounded-full blur-3xl opacity-60 pointer-events-none hidden md:block" />
        {/* Hero Image */}
        <div className="flex-1 flex justify-center z-10">
          <img
            src="https://source.unsplash.com/400x400/?clothes,fashion"
            alt="Hero"
            className="rounded-2xl shadow-lg w-72 h-72 object-cover"
          />
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Featured Items
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-200">
          {featuredItems.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[180px] bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-32 h-40 object-cover rounded mb-3"
              />
              <div className="font-semibold text-slate-700 mb-1">
                {item.name}
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center"
            >
              {m.icon}
              <div className="mt-2 font-semibold text-slate-700">{m.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
