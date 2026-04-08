import api from "./api";

export const saveTestResult = (data) =>
  api.post("/test-results", data);

export const getTestResult = (appointmentId) =>
  api.get(`/test-results/${appointmentId}`);