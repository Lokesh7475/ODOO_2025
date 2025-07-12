import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";

// Mock product data
const product = {
  id: 1,
  title: "Red Floral Dress",
  description: "A beautiful red floral dress, perfect for summer outings. Light, breezy, and stylish.",
  fullDescription:
    "This red floral dress is made from 100% organic cotton. Worn only twice, it's in excellent condition. Size M, fits true to size. Category: Dresses. Condition: Like New.",
  images: [
    "https://source.unsplash.com/600x800/?dress,red,floral",
    "https://source.unsplash.com/100x100/?dress,red,floral,1",
    "https://source.unsplash.com/100x100/?dress,red,floral,2",
    "https://source.unsplash.com/100x100/?dress,red,floral,3",
  ],
  tags: [
    { label: "Size M", color: "bg-indigo-100 text-indigo-600" },
    { label: "Like New", color: "bg-green-100 text-green-700" },
    { label: "Dresses", color: "bg-purple-100 text-purple-600" },
  ],
  available: true,
  owner: {
    name: "Jane Doe",
    avatar: null,
  },
  dateListed: "2024-07-10",
};

export default function ProductDetailPage() {
  // const { id } = useParams(); // For real routing
  const [mainImg, setMainImg] = React.useState(product.images[0]);

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

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Left: Images */}
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={mainImg}
              alt={product.title}
              className="w-full max-w-xs h-96 object-cover rounded-xl shadow mb-4"
            />
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImg(img)}
                  className={`border-2 rounded-lg p-1 transition ${mainImg === img ? "border-indigo-500" : "border-transparent"}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.title}</h1>
            <p className="text-slate-600 mb-2">{product.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.tags.map((tag, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded-full font-medium ${tag.color}`}>{tag.label}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                {product.available ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded shadow hover:bg-indigo-700 transition text-center"
                disabled={!product.available}
              >
                Request Swap
              </button>
              <button className="flex-1 bg-white border border-indigo-600 text-indigo-600 font-semibold py-3 rounded shadow hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                <FaHeart /> Add to Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="mt-10 bg-indigo-50 rounded-2xl p-6 md:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Item Details</h2>
          <p className="text-slate-700 mb-6">{product.fullDescription}</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Owner */}
            <div className="flex items-center gap-3">
              {product.owner.avatar ? (
                <img src={product.owner.avatar} alt={product.owner.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <FaUserCircle className="text-4xl text-indigo-300" />
              )}
              <div>
                <div className="font-semibold text-slate-800">{product.owner.name}</div>
                <div className="text-xs text-slate-500">Owner</div>
              </div>
            </div>
            {/* Date listed */}
            <div className="text-slate-500 text-sm">Listed on {new Date(product.dateListed).toLocaleDateString()}</div>
          </div>
        </section>
      </main>
    </div>
  );
} 