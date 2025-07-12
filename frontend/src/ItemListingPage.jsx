import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Shirts", "Pants", "Accessories", "Jackets", "Shoes"];

const mockItems = [
  {
    id: 1,
    name: "Blue Denim Jacket",
    img: "https://source.unsplash.com/random/300x400?jacket,denim",
    tags: ["Available for Swap", "Size M"],
    category: "Jackets",
    available: true,
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    img: "https://source.unsplash.com/random/300x400?dress,floral",
    tags: ["Available for Swap", "Size S"],
    category: "Shirts",
    available: true,
  },
  {
    id: 3,
    name: "Classic Black Pants",
    img: "https://source.unsplash.com/random/300x400?pants,black",
    tags: ["Size L"],
    category: "Pants",
    available: false,
  },
  {
    id: 4,
    name: "Red Scarf",
    img: "https://source.unsplash.com/random/300x400?scarf,red",
    tags: ["Available for Swap"],
    category: "Accessories",
    available: true,
  },
  {
    id: 5,
    name: "White Sneakers",
    img: "https://source.unsplash.com/random/300x400?sneakers,white",
    tags: ["Size 9"],
    category: "Shoes",
    available: false,
  },
  {
    id: 6,
    name: "Green Hoodie",
    img: "https://source.unsplash.com/random/300x400?hoodie,green",
    tags: ["Available for Swap", "Size M"],
    category: "Shirts",
    available: true,
  },
];

export default function ItemListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAvailable, setShowAvailable] = useState(false);

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvailable = !showAvailable || item.available;
    return matchesSearch && matchesCategory && matchesAvailable;
  });

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

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <form className="flex flex-col md:flex-row md:items-center gap-4 bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search items"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-slate-700 bg-slate-50"
            aria-label="Search items"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-slate-700 bg-slate-50"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAvailable}
              onChange={e => setShowAvailable(e.target.checked)}
              className="accent-indigo-600"
            />
            <span className="text-slate-700">Show only available</span>
          </label>
        </form>
      </section>

      {/* Item Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <section aria-label="Item grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">No items found.</div>
          ) : (
            filteredItems.map(item => (
              <article key={item.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-56 object-cover rounded mb-4"
                />
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                  {item.available && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Available</span>
                  )}
                </div>
                <Link
                  to={`/items/${item.id}`}
                  className="mt-auto inline-block text-center bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium"
                >
                  View Details
                </Link>
              </article>
            ))
          )}
        </section>
        {/* Optional: Load More button */}
        {/* <div className="flex justify-center mt-8">
          <button className="bg-slate-200 text-slate-700 px-6 py-2 rounded hover:bg-slate-300 transition font-medium">Load More</button>
        </div> */}
      </main>
    </div>
  );
} 