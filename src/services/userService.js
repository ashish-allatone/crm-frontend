import api from "./api";

// GET users
export const getUsers = (page, size, search) =>
  api.get(`/users`, {
    params: { page, size, search },
  });

// GET roles
export const getRoles = () =>
  api.get(`/users/roles`);

export const createRole = (data) =>
  api.post("/users/roles", data);

export const updateRole = (id, data) =>
  api.put(`/users/roles/${id}`, data)

// CREATE user
export const createUser = (data) =>
  api.post(`/users`, data);

// UPDATE user
export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

// CHANGE PASSWORD
export const changePassword = (id, data) =>
  api.put(`/users/${id}/change-password`, data);

// TOGGLE STATUS
export const toggleStatus = (id) =>
  api.put(`/users/${id}/status`);

export const getCurrentUser = () =>
  api.get("/users/me");