import api from "./api";

// Create a new listing
export const createListing = async (formData) => {
  const response = await api.post("/listings/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get all listings
export const getListings = async (params = {}) => {
  const response = await api.get("/listings", { params });
  return response.data;
};

// Get single listing by ID
export const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

// Get user's listings
export const getUserListings = async (params = {}) => {
  const response = await api.get("/listings/user", { params });
  return response.data;
};

// Update listing
export const updateListing = async (id, formData) => {
  const response = await api.patch(`/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete listing
export const deleteListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

// Search listings
export const searchListings = async (params = {}) => {
  const response = await api.get("/listings/search", { params });
  return response.data;
};

// Toggle listing status
export const toggleListingStatus = async (id) => {
  const response = await api.patch(`/listings/${id}/status`);
  return response.data;
}; 