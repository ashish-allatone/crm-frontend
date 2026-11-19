import React, { useState, useEffect } from "react";
import "../../styles/allPatients.css";

import {
  getAppointments,
  deleteAppointment,
  markAppointmentDone,
  markAppointmentNotDone,
  rescheduleAppointment,
} from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../permissionUtil";

const AllAppointment = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination - show maximum 5 pages at a time
const getPageNumbers = () => {
  const pages = [];

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};

  const loadAppointments = async () => {
    try {
      // 🔥 type NULL bhej rahe hain
      const res = await getAppointments(currentPage - 1, entries, search, null);

      setAppointments(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  const handleDelete = async (appointmentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAppointment(appointmentId);

      alert("Appointment deleted successfully.");

      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete appointment.");
    }
  };

  const handleAppointmentDone = async (appointmentId) => {
    const confirmDone = window.confirm(
      "Are you sure this appointment was successfully completed?",
    );

    if (!confirmDone) return;

    try {
      await markAppointmentDone(appointmentId);

      alert("Appointment marked as successfully done.");

      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to mark appointment as done.",
      );
    }
  };

  const handleAppointmentNotDone = async (appointmentId) => {
    const confirmNotDone = window.confirm(
      "Are you sure the patient did not attend this appointment?",
    );

    if (!confirmNotDone) return;

    try {
      await markAppointmentNotDone(appointmentId);

      alert("Appointment marked as not done.");

      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to mark appointment as not done.",
      );
    }
  };

  const handleReschedule = async (appointmentId) => {
    const visitDate = window.prompt("Enter new appointment date (YYYY-MM-DD):");

    if (!visitDate) return;

    const visitTime = window.prompt("Enter new appointment time (HH:mm):");

    if (!visitTime) return;

    try {
      await rescheduleAppointment(appointmentId, visitDate, visitTime);

      alert("Appointment rescheduled successfully.");

      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to reschedule appointment.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [currentPage, entries, search]);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>All Appointments</h5>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <div>
              Show
              <select
                className="mx-2 entries-select"
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              entries
            </div>

            <div>
              Search :
              <input
                type="text"
                className="ms-2 search-box"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
            className="table-scroll"
          >
            <table className="table table-bordered all-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>S.NO.</th>
                  <th>LM NO.</th>
                  <th>PATIENT NAME</th>
                  <th>MOBILE NO.</th>
                  <th>ORGANIZATION NAME</th>
                  <th>DIAGNOSTIC CENTER</th>
                  <th>VISIT TYPE</th>
                  <th>INSURANCE COMPANY</th>
                  <th>VISIT DATE</th>
                  <th>APPOINTMENT STATUS</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center">
  No appointments found
</td>
                  </tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-info dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            Action
                          </button>

                          {/* <ul className="dropdown-menu">
                            <li>
                              {hasPermission("Appointment", "EDIT") && (
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    navigate(
                                      `/edit-appointment/${a.appointmentId}`,
                                    )
                                  }
                                >
                                  Edit Appointment
                                </button>
                              )}
                            </li>
                            <li>
                              {hasPermission("Appointment", "EDIT") && (
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(a.appointmentId)}
                                >
                                  Delete Appointment
                                </button>
                              )}
                            </li>
                          </ul> */}

                          <ul className="dropdown-menu">
                            {/* EDIT */}
                            {hasPermission("Appointment", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    navigate(
                                      `/edit-appointment/${a.appointmentId}`,
                                    )
                                  }
                                >
                                  Edit Appointment
                                </button>
                              </li>
                            )}

                            {/* APPOINTMENT DONE */}
                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome !== "DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() =>
                                      handleAppointmentDone(a.appointmentId)
                                    }
                                  >
                                    Appointment Done
                                  </button>
                                </li>
                              )}

                            {/* APPOINTMENT NOT DONE */}
                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome !== "NOT_DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-warning"
                                    onClick={() =>
                                      handleAppointmentNotDone(a.appointmentId)
                                    }
                                  >
                                    Appointment Not Done
                                  </button>
                                </li>
                              )}

                            {/* RESCHEDULE */}
                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome === "NOT_DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-primary"
                                    onClick={() =>
                                      handleReschedule(a.appointmentId)
                                    }
                                  >
                                    Reschedule Appointment
                                  </button>
                                </li>
                              )}

                            {/* DELETE */}
                            {hasPermission("Appointment", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(a.appointmentId)}
                                >
                                  Delete Appointment
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>

                      <td>{(currentPage - 1) * entries + index + 1}</td>

                      {/* <td>{a.patientId}</td> */}
                      <td>{a.lmNo}</td>
                      <td>{a.patientName}</td>
                      <td>{a.mobile}</td>
                      <td>{a.organizationName}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>
  {a.visitType === "HOME_VISIT" ? (
    <span className="badge bg-info text-dark">Home Visit</span>
  ) : a.visitType === "CENTER_VISIT" ? (
    <span className="badge bg-primary">Centre Visit</span>
  ) : (
    "-"
  )}
</td>
                      <td>{a.insuranceName}</td>
                      <td>{a.visitDate}</td>
                      <td>
                        {a.appointmentOutcome === "DONE" ? (
                          <span className="badge bg-success">Done</span>
                        ) : a.appointmentOutcome === "NOT_DONE" ? (
                          <span className="badge bg-warning text-dark">
                            Not Done
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing page {currentPage} of {totalPages}
            </div>

            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>

                {getPageNumbers().map((num) => (
  <li
    key={num}
    className={`page-item ${currentPage === num ? "active" : ""}`}
  >
    <button
      className="page-link"
      onClick={() => setCurrentPage(num)}
    >
      {num}
    </button>
  </li>
))}

                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppointment;
