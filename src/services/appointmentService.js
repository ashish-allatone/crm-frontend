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

export const deleteAppointment = (id) => {
  return api.delete(`/appointments/${id}`);
};

// MARK APPOINTMENT DONE
export const markAppointmentDone = (appointmentId) =>
  api.put(`/appointments/${appointmentId}/done`);

// MARK APPOINTMENT NOT DONE
export const markAppointmentNotDone = (appointmentId) =>
  api.put(`/appointments/${appointmentId}/not-done`);

// RESCHEDULE APPOINTMENT
export const rescheduleAppointment = (
  appointmentId,
  visitDate,
  visitTime
) =>
  api.put(`/appointments/${appointmentId}/reschedule`, null, {
    params: {
      visitDate,
      visitTime,
    },
  });