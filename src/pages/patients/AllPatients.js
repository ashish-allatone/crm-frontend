import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPatients,
  cancelPatientRegistration,
} from "../../services/patientService";
import { hasPermission } from "../permissionUtil";

const AllPatients = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination - show only 5 pages at a time
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const loadPatients = async () => {
    try {
      const res = await getPatients(currentPage - 1, entries, search);
      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this patient's registration?"
    );

    if (!confirmDelete) return;

    const reason = window.prompt("Please enter the reason for cancellation:");

    if (reason === null) {
      return;
    }

    if (reason.trim() === "") {
      alert("Cancellation reason is required.");
      return;
    }

    try {
      await cancelPatientRegistration(patientId, reason);
      alert("Patient cancelled successfully.");
      loadPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel registration.");
    }
  };

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, entries, search]);

  const handleSort = (column) => {
    if (column === "insurance" || column === "approval") return;

    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const getArrow = (column) => {
    if (column === "insurance" || column === "approval") return "";
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .ap-page {
      width: 100%;
      padding: 22px 20px;
      color: #18243a;
      font-family: 'Inter', sans-serif;
    }
    .ap-card {
      width: 100%;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, .06);
    }
    .ap-header {
      min-height: 76px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .ap-heading-wrap { display: flex; align-items: center; gap: 13px; min-width: 0; }
    .ap-heading-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .ap-heading-icon svg { width: 22px; height: 22px; }
    .ap-title { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: .1px; }
    .ap-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .ap-add-btn {
      min-height: 39px;
      padding: 8px 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 0;
      border-radius: 8px;
      background: #fff;
      color: #183554;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: .2s ease;
    }
    .ap-add-btn:hover { background: #eaf1f8; transform: translateY(-1px); }
    .ap-add-btn svg { width: 16px; height: 16px; }
    .ap-body { padding: 22px 24px 18px; }
    .ap-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 17px;
      flex-wrap: wrap;
    }
    .ap-entries, .ap-search-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #66758a;
      font-size: 13px;
    }
    .ap-select {
      min-width: 72px;
      height: 37px;
      padding: 0 28px 0 11px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      background-color: #fff;
      color: #26374d;
      font: inherit;
      outline: none;
    }
    .ap-select:focus, .ap-search-input:focus {
      border-color: #52769d;
      box-shadow: 0 0 0 3px rgba(58, 94, 132, .11);
    }
    .ap-search-box { position: relative; }
    .ap-search-box svg {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: #8795a8;
      pointer-events: none;
    }
    .ap-search-input {
      width: 245px;
      height: 37px;
      padding: 0 12px 0 35px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      color: #26374d;
      font: inherit;
      font-size: 13px;
      outline: none;
      transition: .2s ease;
    }
    .ap-table-wrap {
      width: 100%;
      overflow: auto;
      max-height: 700px;
      border: 1px solid #e7ebf1;
      border-radius: 10px;
    }
    .ap-table {
      width: 100%;
      min-width: 1450px;
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
    }
    .ap-table thead th {
      position: sticky;
      top: 0;
      z-index: 2;
      padding: 14px 13px;
      background: #f4f7fb;
      color: #53647a;
      border-bottom: 1px solid #e4eaf1;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .45px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .ap-table thead th.ap-sortable { cursor: pointer; user-select: none; }
    .ap-table thead th.ap-sortable:hover { color: #193b60; }
    .ap-sort-arrow { margin-left: 5px; color: #8b9aae; font-size: 13px; }
    .ap-table tbody td {
      padding: 13px;
      border-bottom: 1px solid #edf0f4;
      color: #35445a;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }
    .ap-table tbody tr:last-child td { border-bottom: 0; }
    .ap-table tbody tr:hover { background: #f8fafd; }
    .ap-patient-name { color: #203b5d !important; font-weight: 600; }
    .ap-status {
      display: inline-flex;
      align-items: center;
      min-height: 25px;
      padding: 4px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .ap-status-active { background: #e8f5ee; color: #24734b; }
    .ap-status-cancelled { background: #fceced; color: #b33c46; }
    .ap-action-wrap { position: relative; }
    .ap-action-btn {
      min-height: 31px;
      padding: 5px 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border: 1px solid #d7e2ee;
      border-radius: 7px;
      background: #f5f8fc;
      color: #294e74;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: .2s ease;
    }
    .ap-action-btn:hover, .ap-action-btn[aria-expanded="true"] {
      background: #e8f0f8;
      border-color: #b9cadd;
    }
    .ap-action-btn svg { width: 13px; height: 13px; }
    .ap-dropdown {
      min-width: 190px;
      padding: 6px;
      border: 1px solid #e1e7ef;
      border-radius: 9px;
      box-shadow: 0 10px 28px rgba(20, 38, 60, .14);
    }
    .ap-dropdown .dropdown-item {
      padding: 8px 10px;
      border-radius: 6px;
      color: #40536c;
      font-family: inherit;
      font-size: 12px;
      transition: .15s ease;
    }
    .ap-dropdown .dropdown-item:hover { background: #f0f4f9; color: #193b60; }
    .ap-dropdown .dropdown-item.text-danger:hover { background: #fff0f0; color: #b4232d !important; }
    .ap-empty { padding: 42px 16px !important; text-align: center; color: #8a97a8 !important; }
    .ap-empty-icon {
      width: 42px;
      height: 42px;
      margin: 0 auto 10px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: #f1f5f9;
      color: #8292a6;
    }
    .ap-empty-icon svg { width: 21px; height: 21px; }
    .ap-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding-top: 18px;
      flex-wrap: wrap;
    }
    .ap-showing { color: #78869a; font-size: 12px; }
    .ap-pagination { display: flex; align-items: center; gap: 5px; margin: 0; padding: 0; list-style: none; }
    .ap-page-btn {
      min-width: 33px;
      height: 33px;
      padding: 0 9px;
      border: 1px solid #e0e6ee;
      border-radius: 7px;
      background: #fff;
      color: #53647a;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: .2s ease;
    }
    .ap-page-btn:hover:not(:disabled) { background: #f0f4f9; border-color: #cbd7e5; }
    .ap-page-btn.ap-active { background: #1c3a5d; border-color: #1c3a5d; color: #fff; }
    .ap-page-btn:disabled { opacity: .42; cursor: not-allowed; }

    @media (max-width: 640px) {
      .ap-page { padding: 12px 8px; }
      .ap-header { padding: 15px; align-items: flex-start; }
      .ap-title { font-size: 17px; }
      .ap-body { padding: 16px 12px; }
      .ap-toolbar { align-items: flex-start; flex-direction: column; }
      .ap-search-wrap { width: 100%; justify-content: space-between; }
      .ap-search-box, .ap-search-input { width: 100%; }
      .ap-search-box { flex: 1; }
      .ap-footer { align-items: flex-start; flex-direction: column; }
    }
  `;

  return (
    <div className="ap-page container-fluid">
      <style>{styles}</style>

      <div className="ap-card">
        <div className="ap-header">
          <div className="ap-heading-wrap">
            <div className="ap-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
                <circle cx="10" cy="7" r="3.5" />
                <path d="M17 11a3.5 3.5 0 0 0 0-7M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" />
              </svg>
            </div>
            <div>
              <h5 className="ap-title">All Patient List</h5>
              <p className="ap-subtitle">View and manage patient registrations</p>
            </div>
          </div>

          {hasPermission("Patients", "ADD") && (
            <button
              className="ap-add-btn"
              onClick={() => navigate("/add-patient")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Patient Registration
            </button>
          )}
        </div>

        <div className="ap-body">
          <div className="ap-toolbar">
            <div className="ap-entries">
              <span>Show</span>
              <select
                className="ap-select"
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Number of entries to display"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>

            <div className="ap-search-wrap">
              <label htmlFor="ap-patient-search">Search</label>
              <div className="ap-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  id="ap-patient-search"
                  type="text"
                  className="ap-search-input"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th className="ap-sortable" onClick={() => handleSort("status")}>
                    Status <span className="ap-sort-arrow">{getArrow("status")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("lm")}>
                    LM No. <span className="ap-sort-arrow">{getArrow("lm")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("name")}>
                    Patient Name <span className="ap-sort-arrow">{getArrow("name")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("mobile")}>
                    Mobile <span className="ap-sort-arrow">{getArrow("mobile")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("age")}>
                    Age / Gender <span className="ap-sort-arrow">{getArrow("age")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("org")}>
                    Organization Name <span className="ap-sort-arrow">{getArrow("org")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("dc")}>
                    Diagnostic Center <span className="ap-sort-arrow">{getArrow("dc")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("proposal")}>
                    Proposal No. <span className="ap-sort-arrow">{getArrow("proposal")}</span>
                  </th>
                  <th>Insurance</th>
                  <th className="ap-sortable" onClick={() => handleSort("appointment")}>
                    Appointment Date <span className="ap-sort-arrow">{getArrow("appointment")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("registered")}>
                    Registered On <span className="ap-sort-arrow">{getArrow("registered")}</span>
                  </th>
                  <th className="ap-sortable" onClick={() => handleSort("tat")}>
                    TAT <span className="ap-sort-arrow">{getArrow("tat")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="dropdown ap-action-wrap">
                          <button
                            className="ap-action-btn dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Action
                          </button>

                          <ul className="dropdown-menu ap-dropdown">
                            {hasPermission("Patients", "VIEW") && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/patient-details/${p.id}`)}
                                >
                                  View Details
                                </button>
                              </li>
                            )}

                            {hasPermission("Patients", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/edit-patient/${p.id}`)}
                                >
                                  Edit
                                </button>
                              </li>
                            )}

                            {hasPermission("Appointment", "ADD") && !p.hasAppointment && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/create-appointment/${p.id}`)}
                                >
                                  Create Appointment
                                </button>
                              </li>
                            )}

                            {hasPermission("Patients", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/add-package-price/${p.id}`)}
                                >
                                  Add Package Price
                                </button>
                              </li>
                            )}

                            {hasPermission("Patients", "EDIT") && (
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(p.id)}
                                >
                                  Cancel Registration
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>

                      <td>
                        {p.status === "ACTIVE" ? (
                          <span className="ap-status ap-status-active">Active</span>
                        ) : (
                          <span className="ap-status ap-status-cancelled">
                            Registration Cancelled
                          </span>
                        )}
                      </td>
                      <td>{p.lmNo}</td>
                      <td className="ap-patient-name">{p.patientName}</td>
                      <td>{p.mobileNumber}</td>
                      <td>{p.age} / {p.gender}</td>
                      <td>{p.organizationName}</td>
                      <td>{p.diagnosticCenterName || "-"}</td>
                      <td>{p.proposalId || "-"}</td>
                      <td>{p.insuranceName}</td>
                      <td>{p.appointmentDate}</td>
                      <td>
                        {p.registered
                          ? (() => {
                              const date = new Date(p.registered);

                              if (Number.isNaN(date.getTime())) return "-";

                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, "0");
                              const day = String(date.getDate()).padStart(2, "0");
                              const hours = String(date.getHours()).padStart(2, "0");
                              const minutes = String(date.getMinutes()).padStart(2, "0");
                              const seconds = String(date.getSeconds()).padStart(2, "0");

                              return `${year}.${month}.${day}, ${hours}:${minutes}:${seconds}`;
                            })()
                          : "-"}
                      </td>
                      <td>{p.tat || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="ap-empty" colSpan="13">
                      <div className="ap-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <circle cx="10.5" cy="10.5" r="6.5" />
                          <path d="m16 16 4 4M8 10.5h5" />
                        </svg>
                      </div>
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ap-footer">
            <div className="ap-showing">
              Showing page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </div>

            <nav aria-label="Patient list pagination">
              <ul className="ap-pagination">
                <li>
                  <button
                    className="ap-page-btn"
                    disabled={currentPage === 1 || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Prev
                  </button>
                </li>

                {getPageNumbers().map((num) => (
                  <li key={num}>
                    <button
                      className={`ap-page-btn ${currentPage === num ? "ap-active" : ""}`}
                      aria-current={currentPage === num ? "page" : undefined}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="ap-page-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

export default AllPatients;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";
// import { useNavigate } from "react-router-dom";
// // import { useParams } from "react-router-dom";
// import {
//   getPatients,
//   cancelPatientRegistration,
// } from "../../services/patientService";
// import { hasPermission } from "../permissionUtil";

// const AllPatients = () => {
//   const navigate = useNavigate();
//   // const { id } = useParams();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [patients, setPatients] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   // Pagination - show only 5 pages at a time
// const getPageNumbers = () => {
//   const pages = [];

//   const startPage = Math.max(1, currentPage - 2);
//   const endPage = Math.min(totalPages, currentPage + 2);

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return pages;
// };

//   // const loadPatients = async () => {
//   //   const res = await getPatients(currentPage - 1, entries, search);

//   //   setPatients(res.data.content);
//   //   setTotalPages(res.data.totalPages);
//   // };
//   const loadPatients = async () => {
//     try {
//       const res = await getPatients(currentPage - 1, entries, search);
//       setPatients(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };

//   // const handleDelete = async (patientId) => {
//   //   // const confirmDelete = window.confirm(
//   //   //   "Are you sure you want to delete this patient?",
//   //   // );
//   //   const confirmDelete = window.confirm(
//   //     "Are you sure you want to cancel this patient's registration?",
//   //   );

//   //   if (!confirmDelete) return;

//   //   try {
//   //     await deletePatient(patientId);

//   //     // alert("Patient deleted successfully.");
//   //     alert("Patient registration cancelled successfully.");

//   //     loadPatients();
//   //   } catch (err) {
//   //     alert(err.response?.data?.message || "Unable to delete patient.");
//   //   }
//   // };

//   const handleDelete = async (patientId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to cancel this patient's registration?",
//     );

//     if (!confirmDelete) return;

//     const reason = window.prompt("Please enter the reason for cancellation:");

//     if (reason === null) {
//       return;
//     }

//     if (reason.trim() === "") {
//       alert("Cancellation reason is required.");

//       return;
//     }

//     try {
//       await cancelPatientRegistration(patientId, reason);

//       alert("Patient cancelled successfully.");

//       loadPatients();
//     } catch (err) {
//       alert(err.response?.data?.message || "Unable to cancel registration.");
//     }
//   };

//   useEffect(() => {
//     loadPatients();
//   }, [currentPage, entries, search]);

//   const handleSort = (column) => {
//     if (column === "insurance" || column === "approval") return;

//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const getArrow = (column) => {
//     if (column === "insurance" || column === "approval") return "";

//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>All Patient List</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => navigate("/add-patient")}
//           >
//             👤 New Patient Registration
//           </button> */}
//           {hasPermission("Patients", "ADD") && (
//             <button
//               className="btn btn-light"
//               onClick={() => navigate("/add-patient")}
//             >
//               👤 New Patient Registration
//             </button>
//           )}
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
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
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
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("lm")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     LM No. {getArrow("lm")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("name")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Patient Name {getArrow("name")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("mobile")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Mobile {getArrow("mobile")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("age")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Age / Gender {getArrow("age")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("org")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Organization Name {getArrow("org")}
//                   </th>

//                   {/* <th
//                     onClick={() => handleSort("provider")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Services Provider {getArrow("provider")}
//                   </th> */}
//                   <th
//                     onClick={() => handleSort("dc")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Diagnostic Center {getArrow("dc")}
//                   </th>
//                   <th
//                     onClick={() => handleSort("proposal")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Proposal No. {getArrow("proposal")}
//                   </th>

//                   <th>Insurance</th>

//                   {/* <th>Approval</th> */}

//                   <th
//                     onClick={() => handleSort("appointment")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Appointment Date {getArrow("appointment")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("registered")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Registered On {getArrow("registered")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("tat")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     TAT {getArrow("tat")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {patients.map((p) => (
//                   <tr key={p.id}>
//                     <td>
//                       <div className="dropdown">
//                         <button
//                           className="btn btn-info dropdown-toggle"
//                           data-bs-toggle="dropdown"
//                         >
//                           Action
//                         </button>

//                         <ul className="dropdown-menu">
//                           {/* <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 navigate(`/patient-details/${p.id}`)
//                               }
//                             >
//                               View Details
//                             </button>
//                           </li> */}
//                           {hasPermission("Patients", "VIEW") && (
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() =>
//                                   navigate(`/patient-details/${p.id}`)
//                                 }
//                               >
//                                 View Details
//                               </button>
//                             </li>
//                           )}

//                           {/* <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() => navigate(`/edit-patient/${p.id}`)}
//                             >
//                               Edit
//                             </button>
//                           </li> */}
//                           {hasPermission("Patients", "EDIT") && (
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() =>
//                                   navigate(`/edit-patient/${p.id}`)
//                                 }
//                               >
//                                 Edit
//                               </button>
//                             </li>
//                           )}

//                           {/* <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 navigate(`/create-appointment/${p.id}`)
//                               }
//                             >
//                               Create Appointment
//                             </button>
//                           </li> */}
//                           {/* {hasPermission("Patients", "ADD") && ( */}
//                           {hasPermission("Appointment", "ADD") &&
//                             !p.hasAppointment && (
//                               <li>
//                                 <button
//                                   className="dropdown-item"
//                                   onClick={() =>
//                                     navigate(`/create-appointment/${p.id}`)
//                                   }
//                                 >
//                                   Create Appointment
//                                 </button>
//                               </li>
//                             )}

//                           {/* For showing proper alert on click create appointment */}
//                           {/* {hasPermission("Appointment", "ADD") && (
//   <li>
//     <button
//       className="dropdown-item"
//       onClick={() => {
//         if (p.hasAppointment) {
//           alert("Patient appointment already done earlier.");
//           return;
//         }

//         navigate(`/create-appointment/${p.id}`);
//       }}
//     >
//       Create Appointment
//     </button>
//   </li>
// )} */}

//                           {/* <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() =>
//                                 navigate(`/add-package-price/${p.id}`)
//                               }
//                             >
//                               Add Package Price
//                             </button>
//                           </li> */}
//                           {hasPermission("Patients", "EDIT") && (
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() =>
//                                   navigate(`/add-package-price/${p.id}`)
//                                 }
//                               >
//                                 Add Package Price
//                               </button>
//                             </li>
//                           )}
//                           <li>
//                             {hasPermission("Patients", "EDIT") && (
//                               <button
//                                 className="dropdown-item text-danger"
//                                 onClick={() => handleDelete(p.id)}
//                               >
//                                 Cancel Registration
//                               </button>
//                             )}
//                           </li>
//                         </ul>
//                       </div>
//                     </td>

//                     {/* <td>{p.status}</td> */}
//                     {/* <td>{p.id}</td> */}

//                     <td>
//                       {p.status === "ACTIVE" ? (
//                         <span className="badge bg-success">Active</span>
//                       ) : (
//                         <span className="badge bg-danger">
//                           Registration Cancelled
//                         </span>
//                       )}
//                     </td>
//                     <td>{p.lmNo}</td>
//                     <td className="text-primary">{p.patientName}</td>
//                     <td>{p.mobileNumber}</td>
//                     <td>
//                       {p.age} / {p.gender}
//                     </td>
//                     <td>{p.organizationName}</td>
//                     <td>{p.diagnosticCenterName || "-"}</td>
//                     <td>{p.proposalId || "-"}</td>
//                     <td>{p.insuranceName}</td>
//                     {/* <td>{p.approval}</td> */}
//                     <td>{p.appointmentDate}</td>
//                     {/* <td>
//                       {p.registered
//                         ? new Date(p.registered).toLocaleString()
//                         : "-"}
//                     </td> */}
//                     <td>
//                       {p.registered
//                         ? (() => {
//                             const date = new Date(p.registered);

//                             if (Number.isNaN(date.getTime())) return "-";

//                             const year = date.getFullYear();
//                             const month = String(date.getMonth() + 1).padStart(
//                               2,
//                               "0",
//                             );
//                             const day = String(date.getDate()).padStart(2, "0");

//                             const hours = String(date.getHours()).padStart(
//                               2,
//                               "0",
//                             );
//                             const minutes = String(date.getMinutes()).padStart(
//                               2,
//                               "0",
//                             );
//                             const seconds = String(date.getSeconds()).padStart(
//                               2,
//                               "0",
//                             );

//                             return `${year}.${month}.${day}, ${hours}:${minutes}:${seconds}`;
//                           })()
//                         : "-"}
//                     </td>
//                     <td>{p.tat || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}

//           {/* Table Footer */}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             {/* Showing Entries */}

//             <div>
//               Showing page {currentPage} of {totalPages}
//             </div>

//             {/* Pagination */}

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
//     className={`page-item ${
//       currentPage === num ? "active" : ""
//     }`}
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

// export default AllPatients;
