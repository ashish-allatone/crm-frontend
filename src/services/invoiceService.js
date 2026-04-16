import api from "./api";

// 🔥 GET ALL INVOICES
export const getInvoices = () =>
  api.get("/invoices");

// 🔥 CREATE INVOICE
export const createInvoice = (data) =>
  api.post("/invoices", data);

export const updateInvoice = (id, data) =>
  api.put(`/invoices/${id}`, data);

export const deleteInvoice = (id) =>
  api.delete(`/invoices/${id}`);