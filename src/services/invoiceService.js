import api from "./api";

// 🔥 GET ALL INVOICES
export const getInvoices = () =>
  api.get("/invoices");

// 🔥 CREATE INVOICE
export const createInvoice = (data) =>
  api.post("/invoices", data);