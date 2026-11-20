import React, { useState, useEffect, useRef } from "react";
import { getTestResult, deleteTestResult } from "../../services/testResultService";
import { getTestModuleAppointments } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { hasPermission } from "../permissionUtil";

const TestResult = () => {
  const pdfRef = useRef();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.roles?.some((r) => r.name === "Admin");
  const allOrganizations = currentUser?.allOrganizations === true;

  useEffect(() => {
    loadAppointments();
  }, [currentPage, entries, search]);

  const loadAppointments = async () => {
    try {
      const res = await getTestModuleAppointments(
        currentPage - 1,
        entries,
        search
      );
      setAppointments(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }
    setSortColumn(column);
    setSortDirection(direction);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const handleView = async (appointmentId) => {
    if (!hasPermission("Test Result", "VIEW")) {
      alert("Access Denied ❌");
      return;
    }

    try {
      const res = await getTestResult(appointmentId);
      setSelectedResult(res.data.data);
      setShowModal(true);
    } catch (err) {
      alert("No test result found");
    }
  };

  const handleExportPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const fileName = `${selectedResult.patientName}_TestResult_${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;
    pdf.save(fileName);
  };

  const handleDelete = async (appointmentId) => {
    if (!hasPermission("Test Result", "EDIT")) {
      alert("Access Denied ❌");
      return;
    }

    if (!window.confirm("Are you sure to delete this test result?")) return;

    try {
      await deleteTestResult(appointmentId);
      alert("Deleted successfully ✅");
      loadAppointments();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  const closeResultModal = () => {
    setShowModal(false);
    setSelectedResult(null);
  };

  return (
    <div className="container-fluid test-result-page mt-3">
      <style>{`
        .test-result-page {
          font-family: "Inter", sans-serif;
          color: #18243a;
          padding-bottom: 24px;
        }
        .test-result-page .result-card {
          overflow: hidden;
          border: 1px solid #e6ebf1;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(18,39,63,.06);
        }
        .test-result-page .result-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fff;
          background: linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%);
        }
        .test-result-page .result-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255,255,255,.13);
        }
        .test-result-page .result-header-icon svg { width: 21px; height: 21px; }
        .test-result-page .result-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 700;
          letter-spacing: -.2px;
        }
        .test-result-page .result-subtitle {
          margin: 4px 0 0;
          color: #c7d8e8;
          font-size: 12px;
        }
        .test-result-page .result-body { padding: 22px 24px 20px; }
        .test-result-page .result-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 17px;
        }
        .test-result-page .result-entries,
        .test-result-page .result-search {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #637187;
          font-size: 12px;
          font-weight: 600;
        }
        .test-result-page .result-select,
        .test-result-page .result-search-input {
          height: 40px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background: #fff;
          color: #18243a;
          font-size: 13px;
          outline: none;
          transition: border-color .2s,box-shadow .2s;
        }
        .test-result-page .result-select { padding: 0 30px 0 11px; }
        .test-result-page .result-search-wrap { position: relative; }
        .test-result-page .result-search-input { width: 240px; padding: 0 12px 0 35px; }
        .test-result-page .result-search-icon {
          position: absolute;
          left: 12px;
          top: 13px;
          color: #8795a8;
        }
        .test-result-page .result-select:focus,
        .test-result-page .result-search-input:focus {
          border-color: #3b719b;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .test-result-page .result-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #e5ebf1;
          border-radius: 10px;
        }
        .test-result-page .result-table {
          width: 100%;
          min-width: 1160px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
        }
        .test-result-page .result-table thead th {
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
        .test-result-page .result-table thead th.sortable { cursor: pointer; }
        .test-result-page .result-table thead th.sortable:hover { color: #0e3d66; }
        .test-result-page .result-table tbody td {
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #35445a;
          vertical-align: middle;
          font-size: 12.5px;
          white-space: nowrap;
        }
        .test-result-page .result-table tbody tr:last-child td { border-bottom: 0; }
        .test-result-page .result-table tbody tr:hover { background: #f8fafc; }
        .test-result-page .result-action-btn {
          padding: 7px 12px;
          border: 1px solid #d8e2ec;
          border-radius: 7px;
          background: #fff;
          color: #0e3d66;
          font-size: 11.5px;
          font-weight: 700;
        }
        .test-result-page .result-action-btn:hover {
          border-color: #0e3d66;
          background: #f1f6fa;
        }
        .test-result-page .dropdown-menu {
          min-width: 190px;
          padding: 6px;
          border: 1px solid #e3e9f0;
          border-radius: 9px;
          box-shadow: 0 8px 24px rgba(16,35,56,.13);
        }
        .test-result-page .dropdown-item { padding: 9px 10px; border-radius: 6px; font-size: 12px; }
        .test-result-page .dropdown-item:hover { background: #f1f5f9; }
        .test-result-page .result-view-link {
          padding: 0;
          border: 0;
          background: transparent;
          color: #0e5b91;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
        }
        .test-result-page .result-view-link:hover { color: #082f50; text-decoration: underline; }
        .test-result-page .result-empty {
          padding: 36px 16px !important;
          color: #8190a3 !important;
          text-align: center;
          font-size: 13px !important;
        }
        .test-result-page .result-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 18px;
        }
        .test-result-page .result-page-info { color: #77869a; font-size: 12px; }
        .test-result-page .pagination { gap: 4px; }
        .test-result-page .page-link {
          min-width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          padding: 0 9px;
          border: 1px solid #e0e7ef;
          border-radius: 7px !important;
          background: #fff;
          color: #42536a;
          font-size: 12px;
          box-shadow: none;
        }
        .test-result-page .page-item.active .page-link {
          border-color: #0e3d66;
          background: #0e3d66;
          color: #fff;
        }
        .test-result-page .page-item.disabled .page-link {
          background: #f8fafc;
          color: #b5bfcb;
        }
        .test-result-page .result-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          padding: 32px 16px;
          background: rgba(8,24,40,.58);
        }
        .test-result-page .result-modal {
          width: 100%;
          max-width: 1050px;
          margin: auto;
          overflow: hidden;
          border: 0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 18px 55px rgba(0,0,0,.22);
        }
        .test-result-page .result-modal-header {
          min-height: 66px;
          padding: 15px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #fff;
          background: linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%);
        }
        .test-result-page .result-modal-title { margin: 0; font-size: 16px; font-weight: 700; }
        .test-result-page .result-modal-header .btn-close { filter: brightness(0) invert(1); opacity: .85; }
        .test-result-page .result-modal-body { padding: 20px; }
        .test-result-page .result-detail-table {
          width: 100%;
          min-width: 650px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
        }
        .test-result-page .result-detail-table th {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #58677c;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
        }
        .test-result-page .result-detail-table td {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #35445a;
          font-size: 12.5px;
        }
        .test-result-page .result-detail-wrap { overflow-x: auto; border: 1px solid #e5ebf1; border-radius: 9px; }
        .test-result-page .result-modal-footer {
          padding: 14px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          border-top: 1px solid #edf1f5;
        }
        .test-result-page .result-export-btn,
        .test-result-page .result-close-btn {
          min-height: 36px;
          padding: 7px 14px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
        }
        .test-result-page .result-export-btn { border: 1px solid #0e3d66; background: #0e3d66; color: #fff; }
        .test-result-page .result-export-btn:hover { background: #0a2d4a; }
        .test-result-page .result-close-btn { border: 1px solid #d7e0e9; background: #f5f7fa; color: #4e5e72; }
        .test-result-page .result-close-btn:hover { background: #e9eef4; }
        @media (max-width:767px) {
          .test-result-page { padding-left: 8px; padding-right: 8px; }
          .test-result-page .result-header { padding: 15px 16px; }
          .test-result-page .result-body { padding: 16px 12px; }
          .test-result-page .result-search-input { width: min(220px,58vw); }
          .test-result-page .result-toolbar,.test-result-page .result-footer { align-items: flex-start; }
          .test-result-page .result-modal-backdrop { padding: 16px 9px; }
          .test-result-page .result-modal-body { padding: 14px; }
        }
      `}</style>

      <div className="result-card">
        <div className="result-header">
          <div className="result-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
          </div>
          <div>
            <h5 className="result-title">Test Result</h5>
            <p className="result-subtitle">View patient test result records and manage reports</p>
          </div>
        </div>

        <div className="result-body">
          <div className="result-toolbar">
            <div className="result-entries">
              <span>Show</span>
              <select
                className="result-select"
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

            <label className="result-search">
              <span>Search</span>
              <span className="result-search-wrap">
                <svg className="result-search-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 5 5" />
                </svg>
                <input
                  type="text"
                  className="result-search-input"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search test results..."
                  aria-label="Search test results"
                />
              </span>
            </label>
          </div>

          <div className="result-table-wrap">
            <table className="table result-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>S.No. {getArrow("lm")}</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>LM No. {getArrow("lm")}</th>
                  <th className="sortable" onClick={() => handleSort("name")}>Patient Name {getArrow("name")}</th>
                  <th className="sortable" onClick={() => handleSort("mobile")}>Mobile {getArrow("mobile")}</th>
                  <th className="sortable" onClick={() => handleSort("age")}>Age / Gender {getArrow("age")}</th>
                  <th className="sortable" onClick={() => handleSort("organization")}>Organization Name {getArrow("organization")}</th>
                  <th className="sortable" onClick={() => handleSort("dc")}>Diagnostic Center {getArrow("dc")}</th>
                  <th className="sortable" onClick={() => handleSort("insurance")}>Insurance Company {getArrow("insurance")}</th>
                  <th className="sortable" onClick={() => handleSort("registered")}>Registered On {getArrow("registered")}</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="result-empty">No test result appointments found</td>
                  </tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        {(isAdmin || !allOrganizations) ? (
                          <div className="dropdown">
                            <button
                              type="button"
                              className="result-action-btn dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Action
                            </button>
                            <ul className="dropdown-menu">
                              {hasPermission("Test Result", "ADD") && !allOrganizations && (
                                <li>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => navigate(`/add-test-result/${a.appointmentId}`)}
                                  >
                                    Add / Edit Test Result
                                  </button>
                                </li>
                              )}
                              {isAdmin && (
                                <li>
                                  <button
                                    type="button"
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDelete(a.appointmentId)}
                                  >
                                    Delete Test Result
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{(currentPage - 1) * entries + index + 1}</td>
                      <td>{a.lmNo || "-"}</td>
                      <td>{a.patientName || "-"}</td>
                      <td>{a.mobile || "-"}</td>
                      <td>{a.ageGender || "-"}</td>
                      <td>{a.organizationName || "-"}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>{a.insuranceName || "-"}</td>
                      <td>{a.visitDate || "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="result-view-link"
                          onClick={() => handleView(a.appointmentId)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="result-footer">
            <div className="result-page-info">Showing page {currentPage} of {totalPages}</div>
            <nav aria-label="Test result pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>
                {pageNumbers.map((num) => (
                  <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                    <button type="button" className="page-link" onClick={() => setCurrentPage(num)}>
                      {num}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    disabled={currentPage === totalPages || totalPages === 0}
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

      {showModal && selectedResult && (
        <div className="result-modal-backdrop" role="presentation">
          <div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-modal-title">
            <div className="result-modal-header">
              <h5 className="result-modal-title" id="result-modal-title">
                Test Result - {selectedResult.patientName}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeResultModal}
              />
            </div>

            <div className="result-modal-body" ref={pdfRef}>
              <div className="result-detail-wrap">
                <table className="table result-detail-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Result</th>
                      <th>Unit</th>
                      <th>Range</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedResult.results || []).map((r, i) => (
                      <tr key={i}>
                        <td>{r.testName}</td>
                        <td>{r.resultValue}</td>
                        <td>{r.unit}</td>
                        <td>{r.referenceRange}</td>
                        <td>{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="result-modal-footer">
              <button type="button" className="btn result-export-btn" onClick={handleExportPDF}>
                Export as PDF
              </button>
              <button type="button" className="btn result-close-btn" onClick={closeResultModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResult;

// import React, { useState ,useEffect} from "react";
// import "../../styles/allPatients.css";
// import { getAppointments } from "../../services/appointmentService";
// import { getTestResult } from "../../services/testResultService";
// import { deleteTestResult } from "../../services/testResultService";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useRef } from "react";
// import { hasPermission } from "../permissionUtil";
// import {
//     getTestModuleAppointments
// } from "../../services/appointmentService";


// const TestResult = () => {
//   //   const testResults = [];
//   const pdfRef = useRef();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [appointments, setAppointments] = useState([]);
// const [totalPages, setTotalPages] = useState(0);
// const [selectedResult, setSelectedResult] = useState(null);
// const [showModal, setShowModal] = useState(false);
// const navigate = useNavigate();

// const currentUser = JSON.parse(localStorage.getItem("user"));

// const isAdmin =
//   currentUser?.roles?.some((r) => r.name === "Admin");

// const allOrganizations =
//   currentUser?.allOrganizations === true;

// useEffect(() => {
//   loadAppointments();
// }, [currentPage, entries, search]);

// // const loadAppointments = async () => {
// //   const res = await getAppointments(currentPage - 1, entries, search);

// //   setAppointments(res.data.content);
// //   setTotalPages(res.data.totalPages);
// // };
// const loadAppointments = async () => {
//   try {
//     const res = await getTestModuleAppointments(
//       currentPage - 1,
//       entries,
//       search
//     );

//     setAppointments(res.data.data.content);
//     setTotalPages(res.data.data.totalPages);

//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };

//   const handleSort = (column) => {
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
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

// //   const handleView = async (appointmentId) => {
// //   try {
// //     const res = await getTestResult(appointmentId);
// //     setSelectedResult(res.data.data);
// //     setShowModal(true); // 🔥 open modal
// //   } catch (err) {
// //     console.error(err);
// //     alert("No test result found for this appointment");
// //   }
// // };
// const handleView = async (appointmentId) => {

//   if (!hasPermission("Test Result", "VIEW")) {
//     alert("Access Denied ❌");
//     return;
//   }

//   try {
//     const res = await getTestResult(appointmentId);
//     setSelectedResult(res.data.data);
//     setShowModal(true);
//   } catch (err) {
//     alert("No test result found");
//   }
// };

// const handleExportPDF = async () => {
//   const input = pdfRef.current;

//   const canvas = await html2canvas(input);
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");

//   const imgWidth = 210;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  
//   const fileName = `${selectedResult.patientName}_TestResult_${new Date().
//     toISOString().split("T")[0]}.pdf`;

//   pdf.save(fileName);
// };

// const handleDelete = async (appointmentId) => {

//   if (!hasPermission("Test Result", "EDIT")) {
//     alert("Access Denied ❌");
//     return;
//   }

//   if (!window.confirm("Are you sure to delete this test result?")) return;

//   try {
//     await deleteTestResult(appointmentId);
//     alert("Deleted successfully ✅");

//     loadAppointments(); // refresh
//   } catch (err) {
//     alert("Delete failed ❌");
//   }
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Test Result</h5>
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

//           {/* Table */}

//           <div
//             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th>Actions</th>
//                    <th
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
//                     MOBILE {getArrow("mobile")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("age")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     AGE / GENDER {getArrow("age")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     ORGANIZATION NAME {getArrow("organization")}
//                   </th>

//                   <th
//   onClick={() => handleSort("dc")}
//   style={{ cursor: "pointer" }}
// >
//   Diagnostic Center {getArrow("dc")}
// </th>

//                   <th
//                     onClick={() => handleSort("insurance")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     INSURANCE COMPANY {getArrow("insurance")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("registered")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     REGISTERED ON {getArrow("registered")}
//                   </th>

//                   <th>VIEW DETAILS</th>
//                 </tr>
//               </thead>

//               <tbody>
//   {appointments.length === 0 ? (
//     <tr>
//       <td colSpan="10" className="text-center">
//         No data found for the appoitnments
//       </td>
//     </tr>
//   ) : (
//     appointments.map((a, index) => (
//       <tr key={a.appointmentId}>

//         {/* ACTION */}
//         <td>
//           {(isAdmin || !allOrganizations) ? (
//           <div className="dropdown">
//             <button className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown">
//               Action
//             </button>

//             <ul className="dropdown-menu">

//               {/* 🔥 ADD TEST RESULT */}
//               <li>
//                 {/* <button
//                   className="dropdown-item"
//                   onClick={() =>
//                     navigate(`/add-test-result/${a.appointmentId}`)
//                   }
//                 >
//                   Add Test Result
//                 </button> */}
//                 {hasPermission("Test Result", "ADD") &&
//  !allOrganizations && (
//   <button
//     className="dropdown-item"
//     onClick={() =>
//       navigate(`/add-test-result/${a.appointmentId}`)
//     }
//   >
//     Add / Edit Test Result
//   </button>
// )}
//               </li>
//                {isAdmin && (
//     <li>
//       <button
//         className="dropdown-item text-danger"
//         onClick={() => handleDelete(a.appointmentId)}
//       >
//         Delete Test Result
//       </button>
//     </li>
//   )}

//             </ul>
//           </div>
//           ) : (
//     "-"
//   )}
//         </td>

//         <td>{(currentPage - 1) * entries + index + 1}</td>
//          {/* <td>{a.patientId}</td> */}
//          <td>{a.lmNo || "-"}</td>
//         <td>{a.patientName}</td>
//         <td>{a.mobile}</td>
//         <td>{a.ageGender}</td>
//         <td>{a.organizationName}</td>
//         <td>{a.diagnosticCenterName || "-"}</td>
//         <td>{a.insuranceName}</td>
//         <td>{a.visitDate}</td>

//         {/* 🔥 VIEW DETAILS */}
//         <td
//           className="text-primary"
//           style={{ cursor: "pointer" }}
//           onClick={() => handleView(a.appointmentId)}
//         >
//           View
//         </td>

//       </tr>
//     ))
//   )}
// </tbody>
//             </table>
//             {showModal && selectedResult && (
//   <div
//     className="modal fade show"
//     style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//   >
//     <div className="modal-dialog modal-lg">
//       <div className="modal-content">

//         {/* HEADER */}
//         <div className="modal-header">
//           <h5 className="modal-title">
//             Test Result - {selectedResult.patientName}
//           </h5>
//           <button
//             className="btn-close"
//             onClick={() => setShowModal(false)}
//           ></button>
//         </div>

//         {/* BODY */}
//         <div className="modal-body" ref={pdfRef}>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Test</th>
//                 <th>Result</th>
//                 <th>Unit</th>
//                 <th>Range</th>
//                 <th>Remarks</th>
//               </tr>
//             </thead>

//             <tbody>
//               {selectedResult.results.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.testName}</td>
//                   <td>{r.resultValue}</td>
//                   <td>{r.unit}</td>
//                   <td>{r.referenceRange}</td>
//                   <td>{r.remarks}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* FOOTER */}
//         <div className="modal-footer">

//   {/* 🔥 EXPORT BUTTON */}
//   <button
//     className="btn btn-success"
//     onClick={handleExportPDF}
//   >
//     Export as PDF
//   </button>

//   <button
//     className="btn btn-secondary"
//     onClick={() => setShowModal(false)}
//   >
//     Close
//   </button>

// </div>

//       </div>
//     </div>
//   </div>
// )}
//           {/* {selectedResult && (
//   <div className="card mt-3">
//     <div className="card-header bg-primary text-white">
//       Test Result - {selectedResult.patientName}
//     </div>

//     <div className="card-body">
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>Test</th>
//             <th>Result</th>
//             <th>Unit</th>
//             <th>Range</th>
//             <th>Remarks</th>
//           </tr>
//         </thead>

//         <tbody>
//           {selectedResult.results.map((r, i) => (
//             <tr key={i}>
//               <td>{r.testName}</td>
//               <td>{r.resultValue}</td>
//               <td>{r.unit}</td>
//               <td>{r.referenceRange}</td>
//               <td>{r.remarks}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}   */}
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

// export default TestResult;
