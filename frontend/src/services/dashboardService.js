import api from "./api";

// Get dashboard data (user info, statistics, history)
export const getDashboardData = async () => {
  const response = await api.get("/users/dashboard");
  return response.data;
};

// Get user's listings
export const getUserListings = async (params = {}) => {
  const response = await api.get("/listings/user", { params });
  return response.data;
};

// Delete a listing
export const deleteListing = async (listingId) => {
  const response = await api.delete(`/listings/${listingId}`);
  return response.data;
};

// Toggle listing status (activate/deactivate)
export const toggleListingStatus = async (listingId) => {
  const response = await api.patch(`/listings/${listingId}/toggle`);
  return response.data;
}; 