import api from "./api";

export const saveTestResult = (data) =>
  api.post("/test-results", data);

export const getTestResult = (appointmentId) =>
  api.get(`/test-results/${appointmentId}`);

export const deleteTestResult = (appointmentId) =>
  api.delete(`/test-results/${appointmentId}`);

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
};