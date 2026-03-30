import api from "./api";

// PAGINATION
export const getServiceProviders = (page, size, search) =>
  api.get("/service-providers", {
    params: { page, size, search },
  });

// ALL
export const getAllServiceProviders = () =>
  api.get("/service-providers/all");

// GET BY ID
export const getServiceProviderById = (id) =>
  api.get(`/service-providers/${id}`);

// CREATE
export const createServiceProvider = (data) =>
  api.post("/service-providers", data);

// UPDATE
export const updateServiceProvider = (id, data) =>
  api.put(`/service-providers/${id}`, data);

// DELETE
export const deleteServiceProvider = (id) =>
  api.delete(`/service-providers/${id}`);