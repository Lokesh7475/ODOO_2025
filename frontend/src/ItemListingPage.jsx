import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../services/listingService";

const categories = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Accessories",
  "Shoes",
  "Other",
];

export default function ItemListingPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAvailable, setShowAvailable] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: "",
    listingType: "",
  });

  // Fetch listings from backend
  const fetchListings = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      }
      setError("");

      const params = {
        page: filters.page,
        limit: filters.limit,
      };

      // Add category filter if not "All"
      if (filters.category && filters.category !== "All") {
        params.category = filters.category;
      }

      // Add listing type filter for available items
      if (showAvailable) {
        params.listingType = "for_swap";
      }

      const response = await getListings(params);
      const newListings = response.data.listings || [];

      if (isLoadMore) {
        setListings((prev) => [...prev, ...newListings]);
      } else {
        setListings(newListings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings on component mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [filters, showAvailable]);

  // Update filters when category changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: selectedCategory === "All" ? "" : selectedCategory,
    }));
  }, [selectedCategory]);

  // Filter items based on search
  const filteredItems = listings.filter((listing) => {
    const item = listing.itemId;
    if (!item) return false;

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  // Generate tags for each item
  const generateTags = (item, listing) => {
    const tags = [];

    if (item.size) {
      tags.push(`Size ${item.size}`);
    }

    if (item.type) {
      tags.push(item.type);
    }

    if (item.condition) {
      tags.push(item.condition);
    }

    if (item.price) {
      tags.push(`$${item.price}`);
    }

    if (listing.listingType === "for_swap" || listing.listingType === "both") {
      tags.push("Available for Swap");
    }

    return tags;
  };

  // Get status color
  const getStatusColor = (listing) => {
    if (listing.listingType === "for_swap" || listing.listingType === "both") {
      return "bg-green-100 text-green-600";
    }
    return "bg-blue-100 text-blue-600";
  };

  // Get status text
  const getStatusText = (listing) => {
    if (listing.listingType === "for_swap") return "For Swap";
    if (listing.listingType === "for_sale") return "For Sale";
    if (listing.listingType === "both") return "For Sale & Swap";
    return "Available";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <nav
          className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <img src="/logo192.png" alt="Swapify Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-indigo-700 tracking-tight">
              Swapify
            </span>
          </div>
          <ul className="hidden md:flex gap-8 text-slate-700 font-medium">
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                Browse
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                Login
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:bg-indigo-600 hover:text-white border border-indigo-600 rounded px-4 py-1 transition"
              >
                Sign Up
              </a>
            </li>
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

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <form className="flex flex-col md:flex-row md:items-center gap-4 bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-slate-700 bg-slate-50"
            aria-label="Search items"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-slate-700 bg-slate-50"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAvailable}
              onChange={(e) => setShowAvailable(e.target.checked)}
              className="accent-indigo-600"
            />
            <span className="text-slate-700">Show only available for swap</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setFilters((prev) => ({ ...prev, page: 1 }));
              fetchListings();
            }}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </form>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Item Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <section
            aria-label="Item grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-12">
                {search || selectedCategory !== "All" || showAvailable
                  ? "No items found matching your criteria."
                  : "No items available at the moment."}
              </div>
            ) : (
              filteredItems.map((listing) => {
                const item = listing.itemId;
                if (!item) return null;

                return (
                  <article
                    key={listing._id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                  >
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : "https://source.unsplash.com/random/300x400?clothing"
                      }
                      alt={item.title}
                      className="w-full h-56 object-cover rounded mb-4"
                      onError={(e) => {
                        e.target.src =
                          "https://source.unsplash.com/random/300x400?clothing";
                      }}
                    />
                    <h3 className="font-semibold text-lg text-slate-800 mb-2">
                      {item.title}
                    </h3>

                    {/* Owner info */}
                    {item.ownerId && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                        <img
                          src={
                            item.ownerId.avatar ||
                            "https://source.unsplash.com/random/32x32?avatar"
                          }
                          alt={item.ownerId.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{item.ownerId.fullName}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {generateTags(item, listing).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          listing
                        )}`}
                      >
                        {getStatusText(listing)}
                      </span>
                    </div>

                    <Link
                      to={`/items/${listing._id}`}
                      className="mt-auto inline-block text-center bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium"
                    >
                      View Details
                    </Link>
                  </article>
                );
              })
            )}
          </section>
        )}

        {/* Load More button */}
        {!loading && listings.length >= filters.limit && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
                fetchListings(true);
              }}
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded hover:bg-slate-300 transition font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
