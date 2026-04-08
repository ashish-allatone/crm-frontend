import api from "./api";

export const getPackagePrices = (patientId) =>
  api.get(`/package-prices/${patientId}`);

export const savePackagePrices = (data) =>
  api.post("/package-prices", data);