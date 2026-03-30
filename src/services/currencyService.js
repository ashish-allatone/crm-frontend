import api from "./api";

// PAGINATION
export const getCurrencies = (page, size, search) =>
  api.get("/currencies", {
    params: { page, size, search },
  });

// ALL
export const getAllCurrencies = () =>
  api.get("/currencies/all");

// GET BY ID
export const getCurrencyById = (id) =>
  api.get(`/currencies/${id}`);

// CREATE
export const createCurrency = (data) =>
  api.post("/currencies", data);

// UPDATE
export const updateCurrency = (id, data) =>
  api.put(`/currencies/${id}`, data);

// DELETE
export const deleteCurrency = (id) =>
  api.delete(`/currencies/${id}`);