import api from "./api";

// PAGINATION
export const getPatients = (page, size, search) =>
  api.get("/patients", {
    params: { page, size, search },
  });

// ALL
export const getAllPatients = () =>
  api.get("/patients/all");

// GET BY ID
export const getPatientById = (id) =>
  api.get(`/patients/${id}`);

// CREATE
export const createPatient = (data) =>
  api.post("/patients", data);

// UPDATE
export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data);

// DELETE
export const deletePatient = (id) => {
  return api.delete(`/patients/${id}`);
};