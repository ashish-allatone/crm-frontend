import api from "./api";

// PAGINATION
export const getTests = (page, size, search) =>
  api.get("/tests", {
    params: { page, size, search },
  });

// ALL (dropdown)
export const getAllTests = () =>
  api.get("/tests/all");

// GET BY ID
export const getTestById = (id) =>
  api.get(`/tests/${id}`);

// CREATE
export const createTest = (data) =>
  api.post("/tests", data);

// UPDATE
export const updateTest = (id, data) =>
  api.put(`/tests/${id}`, data);

// DELETE
export const deleteTest = (id) =>
  api.delete(`/tests/${id}`);