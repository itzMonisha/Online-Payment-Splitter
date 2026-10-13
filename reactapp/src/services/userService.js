import api from "./api";

// ===============================
// GET ALL USERS
// ===============================

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// ===============================
// GET USER BY ID
// ===============================

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ===============================
// GET USER BY EMAIL
// ===============================

export const getUserByEmail = async (email) => {
  const response = await api.get(
    `/users/email/${encodeURIComponent(email)}`
  );

  return response.data;
};

// ===============================
// SEARCH USERS
// ===============================

export const searchUsers = async (keyword) => {
  const response = await api.get(
    `/users/search?keyword=${encodeURIComponent(keyword)}`
  );

  return response.data;
};

// ===============================
// CURRENT USER
// ===============================

export const getCurrentUserDetails = async () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  const parsedUser = JSON.parse(user);

  if (parsedUser.id) {
    const response = await api.get(
      `/users/${parsedUser.id}`
    );

    return response.data;
  }

  return parsedUser;
};

// ===============================
// UPDATE USER
// ===============================

export const updateUser = async (id, user) => {
  const response = await api.put(
    `/users/${id}`,
    user
  );

  return response.data;
};

// ===============================
// PROFILE ALIASES
// ===============================

export const getProfile = async () => {
  return getCurrentUserDetails();
};

export const updateProfile = async (id, user) => {
  return updateUser(id, user);
};

// ===============================
// CHANGE PASSWORD
// ===============================

export const changePassword = async (
  id,
  passwordData
) => {
  const response = await api.put(
    `/users/${id}/password`,
    passwordData
  );

  return response.data;
};

// ===============================
// DELETE USER
// ===============================

export const deleteUser = async (id) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};

export default api;