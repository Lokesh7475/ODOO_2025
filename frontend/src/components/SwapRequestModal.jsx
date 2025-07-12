import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaExchangeAlt,
  FaCheck,
  FaTimes as FaX,
} from "react-icons/fa";
import { createSwapRequest } from "../services/swapService";
import { getUserListings } from "../services/dashboardService";

export default function SwapRequestModal({
  isOpen,
  onClose,
  requestedItem,
  onSuccess,
}) {
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUserItems();
    }
  }, [isOpen]);

  const fetchUserItems = async () => {
    try {
      const response = await getUserListings();
      const items = response.data.listings || [];
      // Filter out items that are not available for swap
      const availableItems = items.filter(
        (listing) =>
          listing.isLive && listing.itemId && listing.itemId.availableForSwap
      );
      setUserItems(availableItems);
    } catch (error) {
      console.error("Error fetching user items:", error);
      setError("Failed to load your items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) {
      setError("Please select an item to swap");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const swapData = {
        requestedItemId: requestedItem._id,
        requesterItemId: selectedItem,
        message: message.trim(),
      };

      await createSwapRequest(swapData);
      setSuccess("Swap request sent successfully!");

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send swap request";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaExchangeAlt className="text-indigo-600" />
            Request Swap
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          {/* Requested Item Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Item You Want to Swap For:
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-4">
                {requestedItem.images && requestedItem.images.length > 0 ? (
                  <img
                    src={requestedItem.images[0]}
                    alt={requestedItem.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center">
                    <FaX className="text-slate-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-800">
                    {requestedItem.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {requestedItem.description}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {requestedItem.category && (
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                        {requestedItem.category}
                      </span>
                    )}
                    {requestedItem.condition && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        {requestedItem.condition}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Select Your Item */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Your Item to Swap: *
              </label>
              {userItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-2">
                    You don't have any items available for swap.
                  </p>
                  <p className="text-sm">Add items to your listings first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {userItems.map((listing) => {
                    const item = listing.itemId;
                    if (!item) return null;

                    return (
                      <div
                        key={listing._id}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                          selectedItem === listing._id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => setSelectedItem(listing._id)}
                      >
                        <div className="flex items-center gap-3">
                          {selectedItem === listing._id && (
                            <FaCheck className="text-indigo-600 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">
                              {item.title}
                            </h4>
                            <p className="text-sm text-slate-600 truncate">
                              {item.description}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {item.category && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                                  {item.category}
                                </span>
                              )}
                              {item.condition && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                                  {item.condition}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message (Optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to your swap request..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 bg-slate-50 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || !selectedItem || userItems.length === 0}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaExchangeAlt />
                    Send Swap Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
