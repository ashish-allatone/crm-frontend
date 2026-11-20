import React, { useState, useEffect } from "react";
import {
  getAppointments,
  markAppointmentDone,
  markAppointmentNotDone,
  rescheduleAppointment,
} from "../../services/appointmentService";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaEdit,
  FaCalendarDay,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../permissionUtil";

const UpcommingAppointment = () => {
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
    if (sortColumn === column && sortDirection === "asc") direction = "desc";
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
      alert(err.response?.data?.message || "Unable to mark appointment as done.");
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
      alert(err.response?.data?.message || "Unable to mark appointment as not done.");
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

  const loadAppointments = async () => {
    try {
      const res = await getAppointments(
        currentPage - 1,
        entries,
        search,
        "UPCOMING"
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
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="container-fluid upcoming-page mt-3">
      <style>{`
        .upcoming-page {
          font-family: "Inter", sans-serif;
          color: #18243a;
          padding-bottom: 24px;
        }
        .upcoming-page .upcoming-card {
          border: 1px solid #e6ebf1;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(18, 39, 63, 0.06);
          overflow: hidden;
        }
        .upcoming-page .upcoming-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .upcoming-page .upcoming-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,.13);
          font-size: 18px;
        }
        .upcoming-page .upcoming-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 700;
          letter-spacing: -.2px;
        }
        .upcoming-page .upcoming-subtitle {
          margin: 4px 0 0;
          color: #c7d8e8;
          font-size: 12px;
        }
        .upcoming-page .upcoming-body { padding: 22px 24px 20px; }
        .upcoming-page .upcoming-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 17px;
        }
        .upcoming-page .upcoming-entries,
        .upcoming-page .upcoming-search {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #637187;
          font-size: 12px;
          font-weight: 600;
        }
        .upcoming-page .upcoming-page-select,
        .upcoming-page .upcoming-search-input {
          height: 40px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background: #fff;
          color: #18243a;
          font-size: 13px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .upcoming-page .upcoming-page-select { padding: 0 30px 0 11px; }
        .upcoming-page .upcoming-search-wrap { position: relative; }
        .upcoming-page .upcoming-search-input { width: 240px; padding: 0 12px 0 35px; }
        .upcoming-page .upcoming-search-wrap svg {
          position: absolute;
          left: 12px;
          top: 13px;
          color: #8795a8;
          font-size: 13px;
        }
        .upcoming-page .upcoming-page-select:focus,
        .upcoming-page .upcoming-search-input:focus {
          border-color: #3b719b;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .upcoming-page .upcoming-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #e5ebf1;
          border-radius: 10px;
        }
        .upcoming-page .upcoming-table {
          width: 100%;
          min-width: 1120px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
        }
        .upcoming-page .upcoming-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #58677c;
          white-space: nowrap;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .55px;
          text-transform: uppercase;
        }
        .upcoming-page .upcoming-table thead th.sortable { cursor: pointer; }
        .upcoming-page .upcoming-table thead th.sortable:hover { color: #0e3d66; }
        .upcoming-page .upcoming-table tbody td {
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #35445a;
          vertical-align: middle;
          font-size: 12.5px;
          white-space: nowrap;
        }
        .upcoming-page .upcoming-table tbody tr:last-child td { border-bottom: 0; }
        .upcoming-page .upcoming-table tbody tr:hover { background: #f8fafc; }
        .upcoming-page .upcoming-action-btn {
          padding: 7px 12px;
          border: 1px solid #d8e2ec;
          border-radius: 7px;
          background: #fff;
          color: #0e3d66;
          font-size: 11.5px;
          font-weight: 700;
        }
        .upcoming-page .upcoming-action-btn:hover {
          border-color: #0e3d66;
          background: #f1f6fa;
        }
        .upcoming-page .dropdown-menu {
          min-width: 205px;
          padding: 6px;
          border: 1px solid #e3e9f0;
          border-radius: 9px;
          box-shadow: 0 8px 24px rgba(16, 35, 56, .13);
        }
        .upcoming-page .dropdown-item {
          padding: 9px 10px;
          border-radius: 6px;
          font-size: 12px;
        }
        .upcoming-page .dropdown-item:hover { background: #f1f5f9; }
        .upcoming-page .upcoming-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .upcoming-page .status-done { background: #e8f6ee; color: #187344; }
        .upcoming-page .status-not-done { background: #fdecec; color: #b42332; }
        .upcoming-page .status-pending { background: #eef2f6; color: #657386; }
        .upcoming-page .upcoming-empty {
          padding: 34px 16px !important;
          color: #8190a3 !important;
          text-align: center;
          font-size: 13px !important;
        }
        .upcoming-page .upcoming-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .upcoming-page .upcoming-page-info { color: #77869a; font-size: 12px; }
        .upcoming-page .pagination { gap: 4px; }
        .upcoming-page .page-link {
          min-width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          padding: 0 9px;
          border: 1px solid #e0e7ef;
          border-radius: 7px !important;
          color: #42536a;
          background: #fff;
          font-size: 12px;
          box-shadow: none;
        }
        .upcoming-page .page-item.active .page-link {
          border-color: #0e3d66;
          background: #0e3d66;
          color: #fff;
        }
        .upcoming-page .page-item.disabled .page-link { color: #b5bfcb; background: #f8fafc; }
        @media (max-width: 767px) {
          .upcoming-page { padding-left: 8px; padding-right: 8px; }
          .upcoming-page .upcoming-header { padding: 15px 16px; }
          .upcoming-page .upcoming-body { padding: 16px 12px; }
          .upcoming-page .upcoming-search-input { width: min(220px, 58vw); }
          .upcoming-page .upcoming-toolbar { align-items: flex-start; }
          .upcoming-page .upcoming-footer { align-items: flex-start; }
        }
      `}</style>

      <div className="upcoming-card">
        <div className="upcoming-header">
          <div className="upcoming-header-icon">
            <FaCalendarDay />
          </div>
          <div>
            <h5 className="upcoming-title">Upcoming Appointments</h5>
            <p className="upcoming-subtitle">
              Review and manage scheduled patient appointments
            </p>
          </div>
        </div>

        <div className="upcoming-body">
          <div className="upcoming-toolbar">
            <div className="upcoming-entries">
              <span>Show</span>
              <select
                className="upcoming-page-select"
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Entries per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>

            <label className="upcoming-search">
              <span>Search</span>
              <span className="upcoming-search-wrap">
                <FaSearch />
                <input
                  type="text"
                  className="upcoming-search-input"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search appointments..."
                  aria-label="Search appointments"
                />
              </span>
            </label>
          </div>

          <div className="upcoming-table-wrap">
            <table className="table upcoming-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>
                    S.No. {getArrow("lm")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("lm")}>
                    LM No. {getArrow("lm")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Patient Name {getArrow("name")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("mobile")}>
                    Mobile No. {getArrow("mobile")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("organization")}>
                    Organization Name {getArrow("organization")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("provider")}>
                    Diagnostic Center {getArrow("provider")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("insurance")}>
                    Insurance Company {getArrow("insurance")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("visit")}>
                    Visit Date {getArrow("visit")}
                  </th>
                  <th>Appointment Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="upcoming-empty">
                      <FaCalendarAlt className="me-2" />
                      No upcoming appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        <div className="dropdown">
                          <button
                            type="button"
                            className="upcoming-action-btn dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>
                          <ul className="dropdown-menu">
                            {hasPermission("Appointment", "EDIT") && (
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() =>
                                    navigate(`/edit-appointment/${a.appointmentId}`)
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
                                    type="button"
                                    className="dropdown-item text-success"
                                    onClick={() => handleAppointmentDone(a.appointmentId)}
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
                                    type="button"
                                    className="dropdown-item text-danger"
                                    onClick={() => handleAppointmentNotDone(a.appointmentId)}
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
                                    type="button"
                                    className="dropdown-item text-primary"
                                    onClick={() => handleReschedule(a.appointmentId)}
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
                      <td>{a.lmNo || "-"}</td>
                      <td>{a.patientName || "-"}</td>
                      <td>{a.mobile || "-"}</td>
                      <td>{a.organizationName || "-"}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>{a.insuranceName || "-"}</td>
                      <td>
                        <span className="d-inline-flex align-items-center gap-2">
                          <FaClock className="text-secondary" />
                          {a.visitDate || "-"}
                        </span>
                      </td>
                      <td>
                        {a.appointmentOutcome === "DONE" ? (
                          <span className="upcoming-status status-done">
                            <FaCheckCircle /> Done
                          </span>
                        ) : a.appointmentOutcome === "NOT_DONE" ? (
                          <span className="upcoming-status status-not-done">
                            <FaTimesCircle /> Not Done
                          </span>
                        ) : (
                          <span className="upcoming-status status-pending">
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

          <div className="upcoming-footer">
            <div className="upcoming-page-info">
              Showing page {currentPage} of {totalPages}
            </div>
            <nav aria-label="Upcoming appointment pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li
                    key={num}
                    className={`page-item ${currentPage === num ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages || totalPages === 0 ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    aria-label="Next page"
                  >
                    <FaChevronRight />
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

export default UpcommingAppointment;

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
// const UpcommingAppointment = () => {
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
//   //     "UPCOMING"
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
//         "UPCOMING",
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
//           <h5>Upcomming Appointment</h5>
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
//                       VIEW DETAILS
//                     </th> */}
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
//                     className="dropdown-item"
//                     onClick={() =>
//                       navigate(`/edit-appointment/${a.appointmentId}`)
//                     }
//                   >
//                     Edit Appointment
//                   </button> */}
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
//             View
//           </td> */}
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

// export default UpcommingAppointment;
