import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const formData = new FormData();
  formData.append("fullName", userData.fullName);
  formData.append("email", userData.email);
  formData.append("username", userData.username);
  formData.append("password", userData.password);
  formData.append("location", userData.location);
  if (userData.avatar) {
    formData.append("avatar", userData.avatar);
  }

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.post("/users/current-user");
  return response.data;
};

// Get user profile
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/c/${username}`);
  return response.data;
};

// Update account details
export const updateAccountDetails = async (details) => {
  const response = await api.patch("/users/update-account", details);
  return response.data;
};

// Update user avatar
export const updateUserAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const response = await api.patch("/users/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Change password
export const changePassword = async (passwords) => {
  const response = await api.post("/users/changePassword", passwords);
  return response.data;
};

// Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await api.post("/users/refreshToken", { refreshToken });
  return response.data;
}; 