import React, { useState } from "react";
import { FaUpload, FaTrash, FaImage } from "react-icons/fa";

const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Accessories",
  "Shoes",
  "Other"
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const conditions = ["New", "Like New", "Good", "Fair", "Used"];

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    availableForSwap: true,
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Product added successfully!");
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        availableForSwap: true,
      });
      setImages([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-sans">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <section>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Product Images
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto text-3xl text-slate-400 mb-2" />
                  <p className="text-slate-600 mb-1">Click to upload images</p>
                  <p className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image) => (
                      <div key={image.id} className="relative flex-shrink-0">
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Blue Denim Jacket"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Describe your item..."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-slate-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-slate-700 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              {/* Available for Swap */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availableForSwap"
                  name="availableForSwap"
                  checked={formData.availableForSwap}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="availableForSwap" className="ml-2 block text-sm text-slate-700">
                  Available for Swap
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <FaImage />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 