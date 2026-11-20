import React, { useState, useEffect } from "react";
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
      // type NULL bhej rahe hain
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
      "Are you sure you want to delete this appointment?"
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
      "Are you sure this appointment was successfully completed?"
    );

    if (!confirmDone) return;

    try {
      await markAppointmentDone(appointmentId);
      alert("Appointment marked as successfully done.");
      loadAppointments();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to mark appointment as done."
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

  return (
    <div className="container-fluid all-appointment-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .all-appointment-page {
          width: 100%;
          max-width: none;
          padding: 18px 20px 28px;
          color: #18243a;
          font-family: 'Inter', sans-serif;
        }

        .all-appointment-page * {
          font-family: 'Inter', sans-serif;
        }

        .all-appointment-card {
          width: 100%;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(22, 42, 68, 0.07);
          overflow: visible;
        }

        .all-appointment-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fff;
          border-radius: 13px 13px 0 0;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }

        .all-appointment-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.13);
        }

        .all-appointment-header-icon svg {
          width: 22px;
          height: 22px;
          stroke: #fff;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .all-appointment-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.25px;
          line-height: 1.35;
        }

        .all-appointment-subtitle {
          margin: 3px 0 0;
          color: #c3d5e5;
          font-size: 12px;
          font-weight: 400;
        }

        .all-appointment-body {
          padding: 22px 24px 20px;
        }

        .all-appointment-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 17px;
        }

        .all-appointment-entries,
        .all-appointment-search {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #536278;
          font-size: 12px;
          font-weight: 600;
        }

        .all-appointment-entries select,
        .all-appointment-search input {
          height: 39px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background: #fff;
          color: #18243a;
          font-size: 13px;
          outline: none;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .all-appointment-entries select {
          min-width: 70px;
          padding: 0 27px 0 10px;
        }

        .all-appointment-search input {
          width: 235px;
          padding: 0 12px;
          font-weight: 400;
        }

        .all-appointment-entries select:focus,
        .all-appointment-search input:focus {
          border-color: #2b6f9f;
          box-shadow: 0 0 0 3px rgba(43, 111, 159, .11);
        }

        .all-appointment-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #e5ebf2;
          border-radius: 10px;
        }

        .all-appointment-table {
          width: 100%;
          min-width: 1250px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
          color: #26364d;
          vertical-align: middle;
        }

        .all-appointment-table thead th {
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

        .all-appointment-table tbody td {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #34445a;
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
        }

        .all-appointment-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .all-appointment-table tbody tr:hover td {
          background: #f8fbfe;
        }

        .all-appointment-empty {
          padding: 34px 12px !important;
          color: #8290a2 !important;
          text-align: center;
          font-size: 13px !important;
        }

        .all-appointment-action-btn {
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

        .all-appointment-action-btn:hover,
        .all-appointment-action-btn:focus {
          border-color: #b8cfe1;
          background: #e1edf7;
          color: #0e3d66;
        }

        .all-appointment-dropdown {
          min-width: 205px;
          padding: 6px;
          border: 1px solid #e4eaf1;
          border-radius: 9px;
          box-shadow: 0 8px 24px rgba(20, 42, 66, .14);
        }

        .all-appointment-dropdown .dropdown-item {
          padding: 9px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .all-appointment-dropdown .dropdown-item:hover {
          background: #f1f6fa;
        }

        .all-appointment-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 76px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .all-appointment-status.done {
          background: #e5f6ed;
          color: #18794e;
        }

        .all-appointment-status.not-done {
          background: #fff3d9;
          color: #946200;
        }

        .all-appointment-status.pending {
          background: #edf1f5;
          color: #637184;
        }

        .all-appointment-visit {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .all-appointment-visit.home {
          background: #e5f5fa;
          color: #17657c;
        }

        .all-appointment-visit.center {
          background: #e9efff;
          color: #3455a3;
        }

        .all-appointment-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 18px;
        }

        .all-appointment-page-info {
          color: #718096;
          font-size: 12px;
          font-weight: 500;
        }

        .all-appointment-pagination .pagination {
          gap: 4px;
        }

        .all-appointment-pagination .page-link {
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

        .all-appointment-pagination .page-link:hover {
          border-color: #9bb8d0;
          background: #f1f6fa;
          color: #0e3d66;
        }

        .all-appointment-pagination .page-item.active .page-link {
          border-color: #0e3d66;
          background: #0e3d66;
          color: #fff;
        }

        .all-appointment-pagination .page-item.disabled .page-link {
          background: #f7f9fb;
          color: #aab4c0;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .all-appointment-page {
            padding: 12px 10px 22px;
          }

          .all-appointment-header {
            min-height: 70px;
            padding: 14px 16px;
          }

          .all-appointment-title {
            font-size: 17px;
          }

          .all-appointment-body {
            padding: 16px 12px;
          }

          .all-appointment-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .all-appointment-search {
            justify-content: space-between;
          }

          .all-appointment-search input {
            width: min(100%, 235px);
          }

          .all-appointment-pagination {
            align-items: flex-start;
            flex-direction: column;
          }

          .all-appointment-pagination nav {
            width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="all-appointment-card">
        <div className="all-appointment-header">
          <div className="all-appointment-header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16.5h3M14 13h2.5" />
            </svg>
          </div>
          <div>
            <h5 className="all-appointment-title">All Appointments</h5>
            <p className="all-appointment-subtitle">
              View and manage patient appointments
            </p>
          </div>
        </div>

        <div className="all-appointment-body">
          <div className="all-appointment-toolbar">
            <div className="all-appointment-entries">
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

            <label className="all-appointment-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                placeholder="Search appointments..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="all-appointment-table-wrap">
            <table className="table all-appointment-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>S.No.</th>
                  <th>LM No.</th>
                  <th>Patient Name</th>
                  <th>Mobile No.</th>
                  <th>Organization Name</th>
                  <th>Diagnostic Center</th>
                  <th>Visit Type</th>
                  <th>Insurance Company</th>
                  <th>Visit Date</th>
                  <th>Appointment Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="all-appointment-empty">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle all-appointment-action-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>

                          <ul className="dropdown-menu all-appointment-dropdown">
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
                                    Appointment Done
                                  </button>
                                </li>
                              )}

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
                      <td>{a.lmNo}</td>
                      <td>{a.patientName}</td>
                      <td>{a.mobile}</td>
                      <td>{a.organizationName}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>
                        {a.visitType === "HOME_VISIT" ? (
                          <span className="all-appointment-visit home">
                            Home Visit
                          </span>
                        ) : a.visitType === "CENTER_VISIT" ? (
                          <span className="all-appointment-visit center">
                            Centre Visit
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{a.insuranceName}</td>
                      <td>{a.visitDate}</td>
                      <td>
                        {a.appointmentOutcome === "DONE" ? (
                          <span className="all-appointment-status done">
                            Done
                          </span>
                        ) : a.appointmentOutcome === "NOT_DONE" ? (
                          <span className="all-appointment-status not-done">
                            Not Done
                          </span>
                        ) : (
                          <span className="all-appointment-status pending">
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

          <div className="all-appointment-pagination">
            <div className="all-appointment-page-info">
              Showing page {currentPage} of {totalPages}
            </div>

            <nav aria-label="Appointment pagination">
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

                {getPageNumbers().map((num) => (
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

export default AllAppointment;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";

// import {
//   getAppointments,
//   deleteAppointment,
//   markAppointmentDone,
//   markAppointmentNotDone,
//   rescheduleAppointment,
// } from "../../services/appointmentService";
// import { useNavigate } from "react-router-dom";
// import { hasPermission } from "../permissionUtil";

// const AllAppointment = () => {
//   const navigate = useNavigate();

//   const [appointments, setAppointments] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Pagination - show maximum 5 pages at a time
// const getPageNumbers = () => {
//   const pages = [];

//   const startPage = Math.max(1, currentPage - 2);
//   const endPage = Math.min(totalPages, currentPage + 2);

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return pages;
// };

//   const loadAppointments = async () => {
//     try {
//       // 🔥 type NULL bhej rahe hain
//       const res = await getAppointments(currentPage - 1, entries, search, null);

//       setAppointments(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };

//   const handleDelete = async (appointmentId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this appointment?",
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteAppointment(appointmentId);

//       alert("Appointment deleted successfully.");

//       loadAppointments();
//     } catch (err) {
//       alert(err.response?.data?.message || "Unable to delete appointment.");
//     }
//   };

//   const handleAppointmentDone = async (appointmentId) => {
//     const confirmDone = window.confirm(
//       "Are you sure this appointment was successfully completed?",
//     );

//     if (!confirmDone) return;

//     try {
//       await markAppointmentDone(appointmentId);

//       alert("Appointment marked as successfully done.");

//       loadAppointments();
//     } catch (err) {
//       alert(
//         err.response?.data?.message || "Unable to mark appointment as done.",
//       );
//     }
//   };

//   const handleAppointmentNotDone = async (appointmentId) => {
//     const confirmNotDone = window.confirm(
//       "Are you sure the patient did not attend this appointment?",
//     );

//     if (!confirmNotDone) return;

//     try {
//       await markAppointmentNotDone(appointmentId);

//       alert("Appointment marked as not done.");

//       loadAppointments();
//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//           "Unable to mark appointment as not done.",
//       );
//     }
//   };

//   const handleReschedule = async (appointmentId) => {
//     const visitDate = window.prompt("Enter new appointment date (YYYY-MM-DD):");

//     if (!visitDate) return;

//     const visitTime = window.prompt("Enter new appointment time (HH:mm):");

//     if (!visitTime) return;

//     try {
//       await rescheduleAppointment(appointmentId, visitDate, visitTime);

//       alert("Appointment rescheduled successfully.");

//       loadAppointments();
//     } catch (err) {
//       alert(err.response?.data?.message || "Unable to reschedule appointment.");
//     }
//   };

//   useEffect(() => {
//     loadAppointments();
//   }, [currentPage, entries, search]);

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
//           <h5>All Appointments</h5>
//         </div>

//         <div className="card-body">
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
//                   <th>S.NO.</th>
//                   <th>LM NO.</th>
//                   <th>PATIENT NAME</th>
//                   <th>MOBILE NO.</th>
//                   <th>ORGANIZATION NAME</th>
//                   <th>DIAGNOSTIC CENTER</th>
//                   <th>VISIT TYPE</th>
//                   <th>INSURANCE COMPANY</th>
//                   <th>VISIT DATE</th>
//                   <th>APPOINTMENT STATUS</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments.length === 0 ? (
//                   <tr>
//                     <td colSpan="11" className="text-center">
//   No appointments found
// </td>
//                   </tr>
//                 ) : (
//                   appointments.map((a, index) => (
//                     <tr key={a.appointmentId}>
//                       <td>
//                         <div className="dropdown">
//                           <button
//                             className="btn btn-info dropdown-toggle"
//                             data-bs-toggle="dropdown"
//                           >
//                             Action
//                           </button>

//                           {/* <ul className="dropdown-menu">
//                             <li>
//                               {hasPermission("Appointment", "EDIT") && (
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
//                             <li>
//                               {hasPermission("Appointment", "EDIT") && (
//                                 <button
//                                   className="dropdown-item text-danger"
//                                   onClick={() => handleDelete(a.appointmentId)}
//                                 >
//                                   Delete Appointment
//                                 </button>
//                               )}
//                             </li>
//                           </ul> */}

//                           <ul className="dropdown-menu">
//                             {/* EDIT */}
//                             {hasPermission("Appointment", "EDIT") && (
//                               <li>
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
//                               </li>
//                             )}

//                             {/* APPOINTMENT DONE */}
//                             {hasPermission("Appointment", "EDIT") &&
//                               a.appointmentOutcome !== "DONE" && (
//                                 <li>
//                                   <button
//                                     className="dropdown-item text-success"
//                                     onClick={() =>
//                                       handleAppointmentDone(a.appointmentId)
//                                     }
//                                   >
//                                     Appointment Done
//                                   </button>
//                                 </li>
//                               )}

//                             {/* APPOINTMENT NOT DONE */}
//                             {hasPermission("Appointment", "EDIT") &&
//                               a.appointmentOutcome !== "NOT_DONE" && (
//                                 <li>
//                                   <button
//                                     className="dropdown-item text-warning"
//                                     onClick={() =>
//                                       handleAppointmentNotDone(a.appointmentId)
//                                     }
//                                   >
//                                     Appointment Not Done
//                                   </button>
//                                 </li>
//                               )}

//                             {/* RESCHEDULE */}
//                             {hasPermission("Appointment", "EDIT") &&
//                               a.appointmentOutcome === "NOT_DONE" && (
//                                 <li>
//                                   <button
//                                     className="dropdown-item text-primary"
//                                     onClick={() =>
//                                       handleReschedule(a.appointmentId)
//                                     }
//                                   >
//                                     Reschedule Appointment
//                                   </button>
//                                 </li>
//                               )}

//                             {/* DELETE */}
//                             {hasPermission("Appointment", "EDIT") && (
//                               <li>
//                                 <button
//                                   className="dropdown-item text-danger"
//                                   onClick={() => handleDelete(a.appointmentId)}
//                                 >
//                                   Delete Appointment
//                                 </button>
//                               </li>
//                             )}
//                           </ul>
//                         </div>
//                       </td>

//                       <td>{(currentPage - 1) * entries + index + 1}</td>

//                       {/* <td>{a.patientId}</td> */}
//                       <td>{a.lmNo}</td>
//                       <td>{a.patientName}</td>
//                       <td>{a.mobile}</td>
//                       <td>{a.organizationName}</td>
//                       <td>{a.diagnosticCenterName || "-"}</td>
//                       <td>
//   {a.visitType === "HOME_VISIT" ? (
//     <span className="badge bg-info text-dark">Home Visit</span>
//   ) : a.visitType === "CENTER_VISIT" ? (
//     <span className="badge bg-primary">Centre Visit</span>
//   ) : (
//     "-"
//   )}
// </td>
//                       <td>{a.insuranceName}</td>
//                       <td>{a.visitDate}</td>
//                       <td>
//                         {a.appointmentOutcome === "DONE" ? (
//                           <span className="badge bg-success">Done</span>
//                         ) : a.appointmentOutcome === "NOT_DONE" ? (
//                           <span className="badge bg-warning text-dark">
//                             Not Done
//                           </span>
//                         ) : (
//                           <span className="badge bg-secondary">Pending</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

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

//                 {getPageNumbers().map((num) => (
//   <li
//     key={num}
//     className={`page-item ${currentPage === num ? "active" : ""}`}
//   >
//     <button
//       className="page-link"
//       onClick={() => setCurrentPage(num)}
//     >
//       {num}
//     </button>
//   </li>
// ))}

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

// export default AllAppointment;


// // import React, { useState, useEffect } from "react";
// // import "../../styles/allPatients.css";

// // import {
// //   getAppointments,
// //   deleteAppointment,
// //   markAppointmentDone,
// //   markAppointmentNotDone,
// //   rescheduleAppointment,
// // } from "../../services/appointmentService";
// // import { useNavigate } from "react-router-dom";
// // import { hasPermission } from "../permissionUtil";

// // const AllAppointment = () => {
// //   const navigate = useNavigate();

// //   const [appointments, setAppointments] = useState([]);
// //   const [totalPages, setTotalPages] = useState(0);

// //   const [search, setSearch] = useState("");
// //   const [entries, setEntries] = useState(10);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   // Pagination - show maximum 5 pages at a time
// // const getPageNumbers = () => {
// //   const pages = [];

// //   const startPage = Math.max(1, currentPage - 2);
// //   const endPage = Math.min(totalPages, currentPage + 2);

// //   for (let i = startPage; i <= endPage; i++) {
// //     pages.push(i);
// //   }

// //   return pages;
// // };

// //   const loadAppointments = async () => {
// //     try {
// //       // 🔥 type NULL bhej rahe hain
// //       const res = await getAppointments(currentPage - 1, entries, search, null);

// //       setAppointments(res.data.content);
// //       setTotalPages(res.data.totalPages);
// //     } catch (err) {
// //       if (err.response?.status === 403) {
// //         alert("Access Denied ❌");
// //       }
// //     }
// //   };

// //   const handleDelete = async (appointmentId) => {
// //     const confirmDelete = window.confirm(
// //       "Are you sure you want to delete this appointment?",
// //     );

// //     if (!confirmDelete) return;

// //     try {
// //       await deleteAppointment(appointmentId);

// //       alert("Appointment deleted successfully.");

// //       loadAppointments();
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Unable to delete appointment.");
// //     }
// //   };

// //   const handleAppointmentDone = async (appointmentId) => {
// //     const confirmDone = window.confirm(
// //       "Are you sure this appointment was successfully completed?",
// //     );

// //     if (!confirmDone) return;

// //     try {
// //       await markAppointmentDone(appointmentId);

// //       alert("Appointment marked as successfully done.");

// //       loadAppointments();
// //     } catch (err) {
// //       alert(
// //         err.response?.data?.message || "Unable to mark appointment as done.",
// //       );
// //     }
// //   };

// //   const handleAppointmentNotDone = async (appointmentId) => {
// //     const confirmNotDone = window.confirm(
// //       "Are you sure the patient did not attend this appointment?",
// //     );

// //     if (!confirmNotDone) return;

// //     try {
// //       await markAppointmentNotDone(appointmentId);

// //       alert("Appointment marked as not done.");

// //       loadAppointments();
// //     } catch (err) {
// //       alert(
// //         err.response?.data?.message ||
// //           "Unable to mark appointment as not done.",
// //       );
// //     }
// //   };

// //   const handleReschedule = async (appointmentId) => {
// //     const visitDate = window.prompt("Enter new appointment date (YYYY-MM-DD):");

// //     if (!visitDate) return;

// //     const visitTime = window.prompt("Enter new appointment time (HH:mm):");

// //     if (!visitTime) return;

// //     try {
// //       await rescheduleAppointment(appointmentId, visitDate, visitTime);

// //       alert("Appointment rescheduled successfully.");

// //       loadAppointments();
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Unable to reschedule appointment.");
// //     }
// //   };

// //   useEffect(() => {
// //     loadAppointments();
// //   }, [currentPage, entries, search]);

// //   const pageNumbers = [];

// //   for (let i = 1; i <= totalPages; i++) {
// //     pageNumbers.push(i);
// //   }

// //   return (
// //     <div className="container-fluid mt-3">
// //       <div className="card">
// //         <div
// //           className="card-header"
// //           style={{ background: "#3fb4b6", color: "white" }}
// //         >
// //           <h5>All Appointments</h5>
// //         </div>

// //         <div className="card-body">
// //           <div className="d-flex justify-content-between mb-3">
// //             <div>
// //               Show
// //               <select
// //                 className="mx-2 entries-select"
// //                 value={entries}
// //                 onChange={(e) => {
// //                   setEntries(Number(e.target.value));
// //                   setCurrentPage(1);
// //                 }}
// //               >
// //                 <option value={5}>5</option>
// //                 <option value={10}>10</option>
// //                 <option value={25}>25</option>
// //               </select>
// //               entries
// //             </div>

// //             <div>
// //               Search :
// //               <input
// //                 type="text"
// //                 className="ms-2 search-box"
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //             </div>
// //           </div>

// //           <div
// //             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
// //             className="table-scroll"
// //           >
// //             <table className="table table-bordered all-table">
// //               <thead>
// //                 <tr>
// //                   <th>Action</th>
// //                   <th>S.NO.</th>
// //                   <th>LM NO.</th>
// //                   <th>PATIENT NAME</th>
// //                   <th>MOBILE NO.</th>
// //                   <th>ORGANIZATION NAME</th>
// //                   <th>DIAGNOSTIC CENTER</th>
// //                   <th>VISIT TYPE</th>
// //                   <th>INSURANCE COMPANY</th>
// //                   <th>VISIT DATE</th>
// //                   <th>APPOINTMENT STATUS</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {appointments.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="11" className="text-center">
// //   No appointments found
// // </td>
// //                   </tr>
// //                 ) : (
// //                   appointments.map((a, index) => (
// //                     <tr key={a.appointmentId}>
// //                       <td>
// //                         <div className="dropdown">
// //                           <button
// //                             className="btn btn-info dropdown-toggle"
// //                             data-bs-toggle="dropdown"
// //                           >
// //                             Action
// //                           </button>

// //                           {/* <ul className="dropdown-menu">
// //                             <li>
// //                               {hasPermission("Appointment", "EDIT") && (
// //                                 <button
// //                                   className="dropdown-item"
// //                                   onClick={() =>
// //                                     navigate(
// //                                       `/edit-appointment/${a.appointmentId}`,
// //                                     )
// //                                   }
// //                                 >
// //                                   Edit Appointment
// //                                 </button>
// //                               )}
// //                             </li>
// //                             <li>
// //                               {hasPermission("Appointment", "EDIT") && (
// //                                 <button
// //                                   className="dropdown-item text-danger"
// //                                   onClick={() => handleDelete(a.appointmentId)}
// //                                 >
// //                                   Delete Appointment
// //                                 </button>
// //                               )}
// //                             </li>
// //                           </ul> */}

// //                           <ul className="dropdown-menu">
// //                             {/* EDIT */}
// //                             {hasPermission("Appointment", "EDIT") && (
// //                               <li>
// //                                 <button
// //                                   className="dropdown-item"
// //                                   onClick={() =>
// //                                     navigate(
// //                                       `/edit-appointment/${a.appointmentId}`,
// //                                     )
// //                                   }
// //                                 >
// //                                   Edit Appointment
// //                                 </button>
// //                               </li>
// //                             )}

// //                             {/* APPOINTMENT DONE */}
// //                             {hasPermission("Appointment", "EDIT") &&
// //                               a.appointmentOutcome !== "DONE" && (
// //                                 <li>
// //                                   <button
// //                                     className="dropdown-item text-success"
// //                                     onClick={() =>
// //                                       handleAppointmentDone(a.appointmentId)
// //                                     }
// //                                   >
// //                                     Appointment Done
// //                                   </button>
// //                                 </li>
// //                               )}

// //                             {/* APPOINTMENT NOT DONE */}
// //                             {hasPermission("Appointment", "EDIT") &&
// //                               a.appointmentOutcome !== "NOT_DONE" && (
// //                                 <li>
// //                                   <button
// //                                     className="dropdown-item text-warning"
// //                                     onClick={() =>
// //                                       handleAppointmentNotDone(a.appointmentId)
// //                                     }
// //                                   >
// //                                     Appointment Not Done
// //                                   </button>
// //                                 </li>
// //                               )}

// //                             {/* RESCHEDULE */}
// //                             {hasPermission("Appointment", "EDIT") &&
// //                               a.appointmentOutcome === "NOT_DONE" && (
// //                                 <li>
// //                                   <button
// //                                     className="dropdown-item text-primary"
// //                                     onClick={() =>
// //                                       handleReschedule(a.appointmentId)
// //                                     }
// //                                   >
// //                                     Reschedule Appointment
// //                                   </button>
// //                                 </li>
// //                               )}

// //                             {/* DELETE */}
// //                             {hasPermission("Appointment", "EDIT") && (
// //                               <li>
// //                                 <button
// //                                   className="dropdown-item text-danger"
// //                                   onClick={() => handleDelete(a.appointmentId)}
// //                                 >
// //                                   Delete Appointment
// //                                 </button>
// //                               </li>
// //                             )}
// //                           </ul>
// //                         </div>
// //                       </td>

// //                       <td>{(currentPage - 1) * entries + index + 1}</td>

// //                       {/* <td>{a.patientId}</td> */}
// //                       <td>{a.lmNo}</td>
// //                       <td>{a.patientName}</td>
// //                       <td>{a.mobile}</td>
// //                       <td>{a.organizationName}</td>
// //                       <td>{a.diagnosticCenterName || "-"}</td>
// //                       <td>
// //   {a.visitType === "HOME_VISIT" ? (
// //     <span className="badge bg-info text-dark">Home Visit</span>
// //   ) : a.visitType === "CENTER_VISIT" ? (
// //     <span className="badge bg-primary">Centre Visit</span>
// //   ) : (
// //     "-"
// //   )}
// // </td>
// //                       <td>{a.insuranceName}</td>
// //                       <td>{a.visitDate}</td>
// //                       <td>
// //                         {a.appointmentOutcome === "DONE" ? (
// //                           <span className="badge bg-success">Done</span>
// //                         ) : a.appointmentOutcome === "NOT_DONE" ? (
// //                           <span className="badge bg-warning text-dark">
// //                             Not Done
// //                           </span>
// //                         ) : (
// //                           <span className="badge bg-secondary">Pending</span>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="d-flex justify-content-between align-items-center mt-3">
// //             <div>
// //               Showing page {currentPage} of {totalPages}
// //             </div>

// //             <nav>
// //               <ul className="pagination mb-0">
// //                 <li
// //                   className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
// //                 >
// //                   <button
// //                     className="page-link"
// //                     onClick={() => setCurrentPage(currentPage - 1)}
// //                   >
// //                     Prev
// //                   </button>
// //                 </li>

// //                 {getPageNumbers().map((num) => (
// //   <li
// //     key={num}
// //     className={`page-item ${currentPage === num ? "active" : ""}`}
// //   >
// //     <button
// //       className="page-link"
// //       onClick={() => setCurrentPage(num)}
// //     >
// //       {num}
// //     </button>
// //   </li>
// // ))}

// //                 <li
// //                   className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
// //                 >
// //                   <button
// //                     className="page-link"
// //                     onClick={() => setCurrentPage(currentPage + 1)}
// //                   >
// //                     Next
// //                   </button>
// //                 </li>
// //               </ul>
// //             </nav>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllAppointment;
