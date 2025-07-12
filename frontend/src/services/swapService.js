import api from "./api";

// Create a new swap request
export const createSwapRequest = async (swapData) => {
  const response = await api.post("/swaps/create", swapData);
  return response.data;
};

// Get user's swap requests (sent by user)
export const getMySwapRequests = async (params = {}) => {
  const response = await api.get("/swaps/my-requests", { params });
  return response.data;
};

// Get swap requests for user's items (received by user)
export const getReceivedSwapRequests = async (params = {}) => {
  const response = await api.get("/swaps/received", { params });
  return response.data;
};

// Respond to a swap request (accept/reject)
export const respondToSwapRequest = async (requestId, action, message = "") => {
  const response = await api.patch(`/swaps/${requestId}/respond`, {
    action,
    message
  });
  return response.data;
};

// Mark swap request as read
export const markSwapRequestAsRead = async (requestId) => {
  const response = await api.patch(`/swaps/${requestId}/read`);
  return response.data;
}; 