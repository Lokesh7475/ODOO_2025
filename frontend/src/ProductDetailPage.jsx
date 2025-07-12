import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaUserCircle, FaArrowLeft, FaImage } from "react-icons/fa";
import { getListing } from "../services/listingService";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getListing(id);
        setListing(response.data);
        // Set the first image as main image
        if (
          response.data.itemId.images &&
          response.data.itemId.images.length > 0
        ) {
          setMainImg(response.data.itemId.images[0]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleRequestSwap = () => {
    // TODO: Implement swap request functionality
    alert("Swap request functionality coming soon!");
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    alert("Wishlist functionality coming soon!");
  };

  const getStatusBadge = (listingType) => {
    if (listingType === "for_swap") return "For Swap";
    if (listingType === "for_sale") return "For Sale";
    if (listingType === "both") return "For Sale & Swap";
    return "Available";
  };

  const getStatusColor = (listingType) => {
    if (listingType === "for_swap") return "bg-green-100 text-green-700";
    if (listingType === "for_sale") return "bg-blue-100 text-blue-700";
    if (listingType === "both") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const item = listing.itemId;
  const owner = item.ownerId;

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
              <Link to="/" className="hover:text-indigo-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/browse" className="hover:text-indigo-600 transition">
                Browse
              </Link>
            </li>
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

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/browse")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
          >
            <FaArrowLeft />
            Back to Browse
          </button>
        </div>

        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Left: Images */}
          <div className="md:w-1/2 flex flex-col items-center">
            {item.images && item.images.length > 0 ? (
              <>
                <img
                  src={mainImg}
                  alt={item.title}
                  className="w-full max-w-xs h-96 object-cover rounded-xl shadow mb-4"
                />
                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImg(img)}
                      className={`border-2 rounded-lg p-1 transition ${
                        mainImg === img
                          ? "border-indigo-500"
                          : "border-transparent"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full max-w-xs h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <FaImage className="text-6xl text-gray-400" />
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {item.title}
            </h1>
            <p className="text-slate-600 mb-2">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {item.size && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600">
                  Size {item.size}
                </span>
              )}
              {item.condition && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                  {item.condition}
                </span>
              )}
              {item.category && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-600">
                  {item.category}
                </span>
              )}
              {item.type && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-pink-100 text-pink-600">
                  {item.type}
                </span>
              )}
              {item.tags &&
                item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Price */}
            {item.price && (
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                ${item.price}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                  listing.listingType
                )}`}
              >
                {getStatusBadge(listing.listingType)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition text-center"
                onClick={handleRequestSwap}
                disabled={!listing.isLive}
              >
                {listing.listingType === "for_sale"
                  ? "Buy Now"
                  : "Request Swap"}
              </button>
              <button
                className="flex-1 bg-white border border-indigo-600 text-indigo-600 font-semibold py-3 rounded shadow hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                onClick={handleAddToWishlist}
              >
                <FaHeart /> Add to Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="mt-10 bg-indigo-50 rounded-2xl p-6 md:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Item Details
          </h2>
          <p className="text-slate-700 mb-6">{item.description}</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Owner */}
            <div className="flex items-center gap-3">
              {owner.avatar ? (
                <img
                  src={owner.avatar}
                  alt={owner.fullName || owner.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-4xl text-indigo-300" />
              )}
              <div>
                <div className="font-semibold text-slate-800">
                  {owner.fullName || owner.username}
                </div>
                <div className="text-xs text-slate-500">Owner</div>
              </div>
            </div>
            {/* Date listed */}
            <div className="text-slate-500 text-sm">
              Listed on {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
