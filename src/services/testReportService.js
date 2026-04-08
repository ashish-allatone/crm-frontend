import api from "./api";

// GET reports
export const getTestReports = (appointmentId) =>
  api.get(`/test-reports/${appointmentId}`);

// UPLOAD
export const uploadTestReport = (formData) =>
  api.post("/test-reports", formData);

// QC update
export const updateQc = (reportId, status) =>
  api.put(`/test-reports/qc/${reportId}?status=${status}`);
export const getTestReportFile = (id) =>
  api.get(`/test-reports/file/${id}`, {
    responseType: "blob",
  });