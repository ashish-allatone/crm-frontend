import React, { useState, useEffect } from "react";
import { getAppointments, markAppointmentDone, markAppointmentNotDone, rescheduleAppointment } from "../../services/appointmentService";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../permissionUtil";

const TodayAppointment = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleAppointmentDone = async (appointmentId) => {
    const confirmDone = window.confirm(
      "Are you sure this appointment was successfully completed?"
    );

    if (!confirmDone) return;

    try {
      await markAppointmentDone(appointmentId);
      alert("Appointment marked as successfully done.");
      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to mark appointment as done."
      );
    }
  };

  const handleAppointmentNotDone = async (appointmentId) => {
    const confirmNotDone = window.confirm(
      "Are you sure the patient did not attend this appointment?"
    );

    if (!confirmNotDone) return;

    try {
      await markAppointmentNotDone(appointmentId);
      alert("Appointment marked as not done.");
      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to mark appointment as not done."
      );
    }
  };

  const handleReschedule = async (appointmentId) => {
    const visitDate = window.prompt(
      "Enter new appointment date (YYYY-MM-DD):"
    );

    if (!visitDate) return;

    const visitTime = window.prompt(
      "Enter new appointment time (HH:mm):"
    );

    if (!visitTime) return;

    try {
      await rescheduleAppointment(appointmentId, visitDate, visitTime);
      alert("Appointment rescheduled successfully.");
      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to reschedule appointment."
      );
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await getAppointments(
        currentPage - 1,
        entries,
        search,
        "TODAY"
      );

      setAppointments(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [currentPage, entries, search]);

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (!hasPermission("Appointment", "VIEW")) {
    return (
      <div className="today-appointment-access-denied">
        <style>{`
          .today-appointment-access-denied {
            margin: 28px 20px;
            padding: 22px;
            border: 1px solid #f0d6d6;
            border-radius: 12px;
            background: #fff8f8;
            color: #a83232;
            font-family: Inter, sans-serif;
            font-weight: 600;
          }
        `}</style>
        Access Denied ❌
      </div>
    );
  }

  return (
    <div className="container-fluid today-appointment-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .today-appointment-page {
          width: 100%;
          max-width: none;
          padding: 18px 20px 28px;
          color: #18243a;
          font-family: 'Inter', sans-serif;
        }

        .today-appointment-page * {
          font-family: 'Inter', sans-serif;
        }

        .today-appointment-card {
          width: 100%;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(22, 42, 68, .07);
          overflow: visible;
        }

        .today-appointment-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 13px 13px 0 0;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }

        .today-appointment-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, .13);
        }

        .today-appointment-header-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: #fff;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .today-appointment-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -.25px;
        }

        .today-appointment-subtitle {
          margin: 3px 0 0;
          color: #c3d5e5;
          font-size: 12px;
        }

        .today-appointment-body {
          padding: 22px 24px 20px;
        }

        .today-appointment-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 17px;
        }

        .today-appointment-entries,
        .today-appointment-search {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #536278;
          font-size: 12px;
          font-weight: 600;
        }

        .today-appointment-entries select,
        .today-appointment-search input {
          height: 39px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background: #fff;
          color: #18243a;
          font-size: 13px;
          outline: none;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .today-appointment-entries select {
          min-width: 70px;
          padding: 0 27px 0 10px;
        }

        .today-appointment-search input {
          width: 235px;
          padding: 0 12px;
          font-weight: 400;
        }

        .today-appointment-entries select:focus,
        .today-appointment-search input:focus {
          border-color: #2b6f9f;
          box-shadow: 0 0 0 3px rgba(43, 111, 159, .11);
        }

        .today-appointment-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #e5ebf2;
          border-radius: 10px;
        }

        .today-appointment-table {
          width: 100%;
          min-width: 1150px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
          color: #26364d;
          vertical-align: middle;
        }

        .today-appointment-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f2f6fa;
          color: #52647a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .5px;
          line-height: 1.4;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .today-appointment-table thead th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .today-appointment-table thead th.sortable:hover {
          color: #0e3d66;
          background: #eaf1f7;
        }

        .today-appointment-sort-arrow {
          display: inline-block;
          margin-left: 5px;
          color: #8a9aab;
          font-size: 10px;
        }

        .today-appointment-table tbody td {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #34445a;
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
        }

        .today-appointment-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .today-appointment-table tbody tr:hover td {
          background: #f8fbfe;
        }

        .today-appointment-empty {
          padding: 34px 12px !important;
          color: #8290a2 !important;
          text-align: center;
          font-size: 13px !important;
        }

        .today-appointment-action-btn {
          min-width: 92px;
          padding: 7px 11px;
          border: 1px solid #d8e4ef;
          border-radius: 7px;
          background: #edf4fa;
          color: #174b73;
          font-size: 12px;
          font-weight: 700;
          box-shadow: none;
        }

        .today-appointment-action-btn:hover,
        .today-appointment-action-btn:focus {
          border-color: #b8cfe1;
          background: #e1edf7;
          color: #0e3d66;
        }

        .today-appointment-dropdown {
          min-width: 220px;
          padding: 6px;
          border: 1px solid #e4eaf1;
          border-radius: 9px;
          box-shadow: 0 8px 24px rgba(20, 42, 66, .14);
        }

        .today-appointment-dropdown .dropdown-item {
          display: flex;
          align-items: center;
          padding: 9px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .today-appointment-dropdown .dropdown-item:hover {
          background: #f1f6fa;
        }

        .today-appointment-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 76px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .today-appointment-status.done {
          background: #e5f6ed;
          color: #18794e;
        }

        .today-appointment-status.not-done {
          background: #fff0ef;
          color: #b42318;
        }

        .today-appointment-status.pending {
          background: #edf1f5;
          color: #637184;
        }

        .today-appointment-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 18px;
        }

        .today-appointment-page-info {
          color: #718096;
          font-size: 12px;
          font-weight: 500;
        }

        .today-appointment-pagination .pagination {
          gap: 4px;
        }

        .today-appointment-pagination .page-link {
          min-width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          border: 1px solid #e0e7ef;
          border-radius: 7px !important;
          background: #fff;
          color: #42546b;
          font-size: 12px;
          font-weight: 600;
          box-shadow: none;
        }

        .today-appointment-pagination .page-link:hover {
          border-color: #9bb8d0;
          background: #f1f6fa;
          color: #0e3d66;
        }

        .today-appointment-pagination .page-item.active .page-link {
          border-color: #0e3d66;
          background: #0e3d66;
          color: #fff;
        }

        .today-appointment-pagination .page-item.disabled .page-link {
          background: #f7f9fb;
          color: #aab4c0;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .today-appointment-page {
            padding: 12px 10px 22px;
          }

          .today-appointment-header {
            min-height: 70px;
            padding: 14px 16px;
          }

          .today-appointment-title {
            font-size: 17px;
          }

          .today-appointment-body {
            padding: 16px 12px;
          }

          .today-appointment-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .today-appointment-search {
            justify-content: space-between;
          }

          .today-appointment-search input {
            width: min(100%, 235px);
          }

          .today-appointment-pagination {
            align-items: flex-start;
            flex-direction: column;
          }

          .today-appointment-pagination nav {
            width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="today-appointment-card">
        <div className="today-appointment-header">
          <div className="today-appointment-header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16.5h3M15 13h2" />
            </svg>
          </div>
          <div>
            <h5 className="today-appointment-title">Today's Appointments</h5>
            <p className="today-appointment-subtitle">
              View and manage appointments scheduled for today
            </p>
          </div>
        </div>

        <div className="today-appointment-body">
          <div className="today-appointment-toolbar">
            <div className="today-appointment-entries">
              <span>Show</span>
              <select
                value={entries}
                aria-label="Number of appointments per page"
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>

            <label className="today-appointment-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                placeholder="Search today's appointments..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="today-appointment-table-wrap">
            <table className="table today-appointment-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>
                    S.No.
                    <span className="today-appointment-sort-arrow">
                      {getArrow("lm")}
                    </span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("lm")}>
                    LM No.
                    <span className="today-appointment-sort-arrow">
                      {getArrow("lm")}
                    </span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Patient Name
                    <span className="today-appointment-sort-arrow">
                      {getArrow("name")}
                    </span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("mobile")}>
                    Mobile No.
                    <span className="today-appointment-sort-arrow">
                      {getArrow("mobile")}
                    </span>
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("organization")}
                  >
                    Organization Name
                    <span className="today-appointment-sort-arrow">
                      {getArrow("organization")}
                    </span>
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("provider")}
                  >
                    Diagnostic Center
                    <span className="today-appointment-sort-arrow">
                      {getArrow("provider")}
                    </span>
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("insurance")}
                  >
                    Insurance Company
                    <span className="today-appointment-sort-arrow">
                      {getArrow("insurance")}
                    </span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("visit")}>
                    Visit Date
                    <span className="today-appointment-sort-arrow">
                      {getArrow("visit")}
                    </span>
                  </th>
                  <th>Appointment Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="today-appointment-empty">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        <div className="dropdown">
                          <button
                            type="button"
                            className="btn dropdown-toggle today-appointment-action-btn"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>

                          <ul className="dropdown-menu today-appointment-dropdown">
                            {hasPermission("Appointment", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    navigate(
                                      `/edit-appointment/${a.appointmentId}`
                                    )
                                  }
                                >
                                  <FaEdit className="me-2" />
                                  Edit Appointment
                                </button>
                              </li>
                            )}

                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome !== "DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() =>
                                      handleAppointmentDone(a.appointmentId)
                                    }
                                  >
                                    <FaCheckCircle className="me-2" />
                                    Appointment Done
                                  </button>
                                </li>
                              )}

                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome !== "NOT_DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() =>
                                      handleAppointmentNotDone(a.appointmentId)
                                    }
                                  >
                                    <FaTimesCircle className="me-2" />
                                    Appointment Not Done
                                  </button>
                                </li>
                              )}

                            {hasPermission("Appointment", "EDIT") &&
                              a.appointmentOutcome === "NOT_DONE" && (
                                <li>
                                  <button
                                    className="dropdown-item text-primary"
                                    onClick={() =>
                                      handleReschedule(a.appointmentId)
                                    }
                                  >
                                    <FaCalendarAlt className="me-2" />
                                    Reschedule Appointment
                                  </button>
                                </li>
                              )}
                          </ul>
                        </div>
                      </td>

                      <td>{(currentPage - 1) * entries + index + 1}</td>
                      <td>{a.lmNo}</td>
                      <td>{a.patientName}</td>
                      <td>{a.mobile}</td>
                      <td>{a.organizationName}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>{a.insuranceName}</td>
                      <td>{a.visitDate}</td>
                      <td>
                        {a.appointmentOutcome === "DONE" ? (
                          <span className="today-appointment-status done">
                            Done
                          </span>
                        ) : a.appointmentOutcome === "NOT_DONE" ? (
                          <span className="today-appointment-status not-done">
                            Not Done
                          </span>
                        ) : (
                          <span className="today-appointment-status pending">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="today-appointment-pagination">
            <div className="today-appointment-page-info">
              Showing page {currentPage} of {totalPages}
            </div>

            <nav aria-label="Today's appointment pagination">
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li
                    key={num}
                    className={`page-item ${
                      currentPage === num ? "active" : ""
                    }`}
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
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    disabled={currentPage === totalPages}
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

export default TodayAppointment;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";

// import { getTodayAppointments } from "../../services/appointmentService";
// import {
//   getAppointments,
//   markAppointmentDone,
//   markAppointmentNotDone,
//   rescheduleAppointment,
// } from "../../services/appointmentService";

// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaCalendarAlt,
//   FaEdit,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { hasPermission } from "../permissionUtil";

// const TodayAppointment = () => {
//   // const appointments = [];

//   const navigate = useNavigate();

//   const [appointments, setAppointments] = useState([]);

//   const [totalPages, setTotalPages] = useState(0);

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };
   
//   const handleAppointmentDone = async (appointmentId) => {
//   const confirmDone = window.confirm(
//     "Are you sure this appointment was successfully completed?"
//   );

//   if (!confirmDone) return;

//   try {
//     await markAppointmentDone(appointmentId);

//     alert("Appointment marked as successfully done.");

//     loadAppointments();
//   } catch (err) {
//     alert(
//       err.response?.data?.message ||
//         "Unable to mark appointment as done."
//     );
//   }
// };

// const handleAppointmentNotDone = async (appointmentId) => {
//   const confirmNotDone = window.confirm(
//     "Are you sure the patient did not attend this appointment?"
//   );

//   if (!confirmNotDone) return;

//   try {
//     await markAppointmentNotDone(appointmentId);

//     alert("Appointment marked as not done.");

//     loadAppointments();
//   } catch (err) {
//     alert(
//       err.response?.data?.message ||
//         "Unable to mark appointment as not done."
//     );
//   }
// };

// const handleReschedule = async (appointmentId) => {
//   const visitDate = window.prompt(
//     "Enter new appointment date (YYYY-MM-DD):"
//   );

//   if (!visitDate) return;

//   const visitTime = window.prompt(
//     "Enter new appointment time (HH:mm):"
//   );

//   if (!visitTime) return;

//   try {
//     await rescheduleAppointment(
//       appointmentId,
//       visitDate,
//       visitTime
//     );

//     alert("Appointment rescheduled successfully.");

//     loadAppointments();
//   } catch (err) {
//     alert(
//       err.response?.data?.message ||
//         "Unable to reschedule appointment."
//     );
//   }
// };


//   // const loadAppointments = async () => {
//   //   const res = await getAppointments(
//   //     currentPage - 1,
//   //     entries,
//   //     search,
//   //     "TODAY"
//   //   );

//   //   setAppointments(res.data.content);
//   //   setTotalPages(res.data.totalPages);
//   // };
//   const loadAppointments = async () => {
//     try {
//       const res = await getAppointments(
//         currentPage - 1,
//         entries,
//         search,
//         "TODAY",
//       );

//       setAppointments(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };

//   // search filter
//   useEffect(() => {
//     loadAppointments();
//   }, [currentPage, entries, search]);

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Today's Appointment</h5>
//         </div>

//         <div className="card-body">
//           {/* Search + Entries */}

//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               Show
//               <select
//                 className="mx-2 entries-select"
//                 value={entries}
//                 onChange={(e) => {
//                   setEntries(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//               </select>
//               entries
//             </div>

//             <div>
//               Search :
//               <input
//                 type="text"
//                 className="ms-2 search-box"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <div
//             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th>Action</th>

//                   <th
//                     onClick={() => handleSort("lm")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     S.NO.{getArrow("lm")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("lm")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     LM NO. {getArrow("lm")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("name")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     PATIENT NAME {getArrow("name")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("mobile")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     MOBILE NO. {getArrow("mobile")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     ORGANIZATION NAME {getArrow("organization")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("provider")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     DIAGNOSTIC CENTER {getArrow("provider")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("insurance")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     INSURANCE COMPANY {getArrow("insurance")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("visit")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     VISIT DATE {getArrow("visit")}
//                   </th>

//                   <th>APPOINTMENT STATUS</th>

//                   {/* <th>
//                     VIEW DETAILS
//                   </th> */}
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No appointments found
//                     </td>
//                   </tr>
//                 ) : (
//                   appointments.map((a, index) => (
//                     <tr key={a.appointmentId}>
//                       {/* ✅ ACTION FIRST */}
//                       <td>
//                         <div className="dropdown">
//                           <button
//                             className="btn btn-info dropdown-toggle"
//                             data-bs-toggle="dropdown"
//                           >
//                             Action
//                           </button>

//                           {/* <ul className="dropdown-menu">
//                             <li> */}
//                               {/* <button
//                   className="dropdown-item"
//                   onClick={() =>
//                     navigate(`/edit-appointment/${a.appointmentId}`)
//                   }
//                 >
//                   Edit Appointment
//                 </button> */}
//                               {/* {hasPermission("Appointment", "EDIT") && (
//                                 <button
//                                   className="dropdown-item"
//                                   onClick={() =>
//                                     navigate(
//                                       `/edit-appointment/${a.appointmentId}`,
//                                     )
//                                   }
//                                 >
//                                   Edit Appointment
//                                 </button>
//                               )}
//                             </li>
//                           </ul> */}

//                           <ul className="dropdown-menu">

//   {/* EDIT APPOINTMENT */}
//   {hasPermission("Appointment", "EDIT") && (
//     <li>
//       <button
//         className="dropdown-item"
//         onClick={() =>
//           navigate(
//             `/edit-appointment/${a.appointmentId}`
//           )
//         }
//       >
//         <FaEdit className="me-2" />
//         Edit Appointment
//       </button>
//     </li>
//   )}

//   {/* APPOINTMENT DONE */}
//   {hasPermission("Appointment", "EDIT") &&
//     a.appointmentOutcome !== "DONE" && (
//       <li>
//         <button
//           className="dropdown-item text-success"
//           onClick={() =>
//             handleAppointmentDone(a.appointmentId)
//           }
//         >
//           <FaCheckCircle className="me-2" />
//           Appointment Done
//         </button>
//       </li>
//     )}

//   {/* APPOINTMENT NOT DONE */}
//   {hasPermission("Appointment", "EDIT") &&
//     a.appointmentOutcome !== "NOT_DONE" && (
//       <li>
//         <button
//           className="dropdown-item text-danger"
//           onClick={() =>
//             handleAppointmentNotDone(a.appointmentId)
//           }
//         >
//           <FaTimesCircle className="me-2" />
//           Appointment Not Done
//         </button>
//       </li>
//     )}

//   {/* RESCHEDULE */}
//   {hasPermission("Appointment", "EDIT") &&
//     a.appointmentOutcome === "NOT_DONE" && (
//       <li>
//         <button
//           className="dropdown-item text-primary"
//           onClick={() =>
//             handleReschedule(a.appointmentId)
//           }
//         >
//           <FaCalendarAlt className="me-2" />
//           Reschedule Appointment
//         </button>
//       </li>
//     )}

// </ul>
//                         </div>
//                       </td>

//                       {/* ✅ LM NO */}
//                       <td>{(currentPage - 1) * entries + index + 1}</td>
//                       <td>{a.lmNo}</td>

//                       {/* ✅ PATIENT NAME */}
//                       <td>{a.patientName}</td>

//                       {/* ✅ MOBILE */}
//                       <td>{a.mobile}</td>

//                       {/* ✅ ORGANIZATION */}
//                       <td>{a.organizationName}</td>

//                       {/* ✅ SERVICE PROVIDER */}
//                       <td>{a.diagnosticCenterName || "-"}</td>

//                       {/* ✅ INSURANCE */}
//                       <td>{a.insuranceName}</td>

//                       {/* ✅ VISIT DATE */}
//                       <td>{a.visitDate}</td>

//                       <td>
//   {a.appointmentOutcome === "DONE" ? (
//     <span className="badge bg-success">
//       Done
//     </span>
//   ) : a.appointmentOutcome === "NOT_DONE" ? (
//     <span className="badge bg-danger">
//       Not Done
//     </span>
//   ) : (
//     <span className="badge bg-secondary">
//       Pending
//     </span>
//   )}
// </td>

//                       {/* ✅ VIEW */}
//                       {/* <td className="text-primary" style={{ cursor: "pointer" }}>
//           View
//         </td> */}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing page {currentPage} of {totalPages}
//             </div>

//             <nav>
//               <ul className="pagination mb-0">
//                 <li
//                   className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage - 1)}
//                   >
//                     Prev
//                   </button>
//                 </li>

//                 {pageNumbers.map((num) => (
//                   <li
//                     key={num}
//                     className={`page-item ${currentPage === num ? "active" : ""}`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(num)}
//                     >
//                       {num}
//                     </button>
//                   </li>
//                 ))}

//                 <li
//                   className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodayAppointment;
