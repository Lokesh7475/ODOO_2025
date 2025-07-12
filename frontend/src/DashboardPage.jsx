import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  getDashboardData,
  getUserListings,
  deleteListing,
  toggleListingStatus,
} from "./services/dashboardService";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dashboard data
  const [userInfo, setUserInfo] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [userHistory, setUserHistory] = useState([]);

  // User listings
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardData();
      const { userInfo, statistics, history } = response.data;

      setUserInfo(userInfo);
      setStatistics(statistics);
      setUserHistory(history);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      // Use actual user data from auth context if API fails
      if (user) {
        setUserInfo({
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          location: user.location || "Not specified",
          role: user.role || "User",
        });
      }
      setStatistics({
        totalTransactions: 0,
        boughtCount: 0,
        soldCount: 0,
        swappedCount: 0,
      });
      setUserHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user listings
  const fetchUserListings = async () => {
    try {
      setListingsLoading(true);
      const response = await getUserListings();
      setUserListings(response.data.listings || []);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setError("Failed to load your listings.");
    } finally {
      setListingsLoading(false);
    }
  };

  // Handle listing deletion
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await deleteListing(listingId);
      // Refresh listings
      fetchUserListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError("Failed to delete listing.");
    }
  };

  // Handle listing status toggle
  const handleToggleStatus = async (listingId) => {
    try {
      await toggleListingStatus(listingId);
      // Refresh listings
      fetchUserListings();
    } catch (error) {
      console.error("Error toggling listing status:", error);
      setError("Failed to update listing status.");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Load listings when tab is active
  useEffect(() => {
    if (activeTab === "listings") {
      fetchUserListings();
    }
  }, [activeTab]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
      case "For Swap":
      case "For Sale":
        return "bg-green-100 text-green-700";
      case "Swapped":
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get listing status text
  const getListingStatus = (listing) => {
    if (!listing.isLive) return "Inactive";
    if (listing.listingType === "for_swap") return "For Swap";
    if (listing.listingType === "for_sale") return "For Sale";
    if (listing.listingType === "both") return "For Sale & Swap";
    return "Available";
  };

  // Get history status text
  const getHistoryStatus = (history) => {
    if (history.action === "swapped") {
      return history.swapRequestAccepted ? "Completed" : "Pending";
    }
    return history.action === "bought" ? "Bought" : "Sold";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Profile Section */}
        {(userInfo || user) && (
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {userInfo?.avatar || user?.avatar ? (
                <img
                  src={userInfo?.avatar || user?.avatar}
                  alt={userInfo?.fullName || user?.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-6xl text-indigo-300" />
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">
                  {userInfo?.fullName || user?.fullName || "User"}
                </h1>
                <p className="text-slate-600 mb-2">
                  {userInfo?.email || user?.email}
                </p>
                {(userInfo?.location || user?.location) && (
                  <p className="text-slate-500 mb-4">
                    📍 {userInfo?.location || user?.location}
                  </p>
                )}
                <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Total Transactions
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {statistics.totalTransactions || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Items Bought
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {statistics.boughtCount || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Items Sold
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.soldCount || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Items Swapped
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.swappedCount || 0}
              </p>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <nav
              className="flex flex-col sm:flex-row"
              aria-label="Dashboard tabs"
            >
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 px-6 py-4 text-left font-medium transition ${
                  activeTab === "listings"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>My Listings</span>
                  <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                    {userListings.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-6 py-4 text-left font-medium transition ${
                  activeTab === "history"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Transaction History</span>
                  <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                    {userHistory.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "listings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    My Listings
                  </h2>
                  <Link
                    to="/add-product"
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium flex items-center gap-2"
                  >
                    <FaPlus /> Add New Item
                  </Link>
                </div>

                {listingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : userListings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">You haven't listed any items yet.</p>
                    <Link
                      to="/add-product"
                      className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition font-medium"
                    >
                      Add Your First Item
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => {
                      const item = listing.itemId;
                      if (!item) return null;

                      return (
                        <article
                          key={listing._id}
                          className="bg-white border border-slate-200 rounded-xl shadow hover:shadow-lg transition p-4"
                        >
                          <img
                            src={
                              item.images && item.images.length > 0
                                ? item.images[0]
                                : "https://source.unsplash.com/random/300x400?clothing"
                            }
                            alt={item.title}
                            className="w-full h-48 object-cover rounded mb-4"
                            onError={(e) => {
                              e.target.src =
                                "https://source.unsplash.com/random/300x400?clothing";
                            }}
                          />
                          <h3 className="font-semibold text-slate-800 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                                getListingStatus(listing)
                              )}`}
                            >
                              {getListingStatus(listing)}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(listing._id)}
                              className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm hover:bg-slate-200 transition flex items-center justify-center gap-1"
                            >
                              {listing.isLive ? <FaEyeSlash /> : <FaEye />}
                              {listing.isLive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing._id)}
                              className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition flex items-center justify-center gap-1"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">
                  Transaction History
                </h2>
                {userHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No transaction history yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userHistory.map((history) => (
                      <article
                        key={history.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">
                              {history.description}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {history.date} at {history.time}
                            </p>
                            {history.otherUser && (
                              <p className="text-sm text-slate-600">
                                with {history.otherUser.fullName}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                              getHistoryStatus(history)
                            )}`}
                          >
                            {getHistoryStatus(history)}
                          </span>
                        </div>

                        {/* Item details */}
                        {history.item && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {history.item.images &&
                                history.item.images.length > 0 && (
                                  <img
                                    src={history.item.images[0]}
                                    alt={history.item.title}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                              <div>
                                <p className="font-medium text-slate-800">
                                  {history.item.title}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {history.item.category} • {history.item.size}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Swap details */}
                        {history.action === "swapped" &&
                          history.itemGiven &&
                          history.itemReceived && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm font-medium text-red-800 mb-1">
                                  You gave:
                                </p>
                                <p className="text-sm text-red-700">
                                  {history.itemGiven.title}
                                </p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-800 mb-1">
                                  You received:
                                </p>
                                <p className="text-sm text-green-700">
                                  {history.itemReceived.title}
                                </p>
                              </div>
                            </div>
                          )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
