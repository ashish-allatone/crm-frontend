import api from "./api";

export const createAppointment = (data) =>
  api.post("/appointments", data);

export const getTodayAppointments = () =>
  api.get("/appointments/today");

export const getUpcomingAppointments = () =>
  api.get("/appointments/upcoming");

// export const getAppointments = (page, size, search, type) =>
//   api.get("/appointments", {
//     params: { page, size, search, type },
//   });
export const getAppointments = (page, size, search, type, organizationId) =>
  api.get("/appointments", {
    params: { page, size, search, type, organizationId },
  });

export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, data);  

export const getAppointmentById = (id) =>
  api.get(`/appointments/${id}`);