import api from "./api";

// GET ALL
export const getOrganizations = (page, size, search) =>
  api.get("/organizations", {
    params: { page, size, search },
  });

export const getOrganizationsAll = () =>
  api.get("/organizations/all");  

// GET BY ID
export const getOrganizationById = (id) =>
  api.get(`/organizations/${id}`);

// CREATE
export const createOrganization = (data) =>
  api.post("/organizations", data);

// UPDATE
export const updateOrganization = (id, data) =>
  api.put(`/organizations/${id}`, data);

// DELETE
export const deleteOrganization = (id) =>
  api.delete(`/organizations/${id}`);