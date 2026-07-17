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

  export const getTestModuleAppointments = (
    page,
    size,
    search
) => {

    return api.get("/appointments/test-module", {

        params: {

            page,

            size,

            search
        }
    });

    
}

export const updateTestReport = (reportId, formData) => {
  return api.put(`/test-reports/${reportId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

;