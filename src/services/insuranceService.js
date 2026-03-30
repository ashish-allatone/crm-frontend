import api from "./api";

// PAGINATION
export const getInsurances = (page, size, search) =>
  api.get("/insurances", {
    params: { page, size, search },
  });

// ALL
export const getAllInsurances = () =>
  api.get("/insurances/all");

// GET BY ID
export const getInsuranceById = (id) =>
  api.get(`/insurances/${id}`);

// CREATE (MULTIPART)
export const createInsurance = (formData) =>
  api.post("/insurances", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// UPDATE (MULTIPART)
export const updateInsurance = (id, formData) =>
  api.put(`/insurances/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE
export const deleteInsurance = (id) =>
  api.delete(`/insurances/${id}`);