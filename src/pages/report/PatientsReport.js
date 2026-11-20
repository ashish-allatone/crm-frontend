import React, { useEffect, useMemo, useState } from "react";
import "../../styles/allPatients.css";
import { getPatientReport } from "../../services/patientService";
import { getOrganizationsAll } from "../../services/organizationService";
import * as XLSX from "xlsx";

const PatientsReport = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [organizationId, setOrganizationId] = useState("ALL");

  const [appliedOrganizationId, setAppliedOrganizationId] = useState("ALL");
  const [appliedStatus, setAppliedStatus] = useState("ALL");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let page = startPage; page <= endPage; page += 1) pages.push(page);
    return pages;
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatientReport(
        currentPage - 1,
        entries,
        search,
        appliedStatus === "ALL" ? "ALL" : appliedStatus,
        appliedFromDate || null,
        appliedToDate || null,
        appliedOrganizationId === "ALL" ? null : appliedOrganizationId
      );
      setPatients(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load patients report:", err);
      setPatients([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients();
    }, 400);
    return () => clearTimeout(timer);
  }, [
    currentPage,
    entries,
    search,
    appliedStatus,
    appliedFromDate,
    appliedToDate,
    appliedOrganizationId,
  ]);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const res = await getOrganizationsAll();
      setOrganizations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to load organizations", err);
    }
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") direction = "desc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const sortFieldMap = {
    registered: "registrationDate",
    lm: "lmNo",
    proposalId: "proposalId",
    name: "patientName",
    gender: "gender",
    age: "age",
    dob: "dob",
    mobile: "mobile",
    address: "address",
    city: "city",
    state: "state",
    country: "country",
    email: "email",
    organization: "organizationName",
    appointmentDate: "appointmentDate",
    qcApproveDate: "qcApprovedDate",
    provider: "diagnosticCenterName",
    insurance: "insuranceName",
    nationalId: "nationalIdNumber",
    passport: "passportNumber",
    status: "currentStatus",
  };

  const displayedPatients = useMemo(() => {
    if (!sortColumn) return patients;
    const field = sortFieldMap[sortColumn];
    if (!field) return patients;
    return [...patients].sort((a, b) => {
      const first = a[field] ?? "";
      const second = b[field] ?? "";
      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [patients, sortColumn, sortDirection]);

  const getArrow = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const exportToExcel = () => {
    const exportData = displayedPatients.map((patient) => ({
      "Registration Date": patient.registrationDate,
      "LM No": patient.lmNo,
      "Patient Id": patient.patientId,
      "Proposal ID": patient.proposalId,
      "Patient Name": patient.patientName,
      Gender: patient.gender,
      Age: patient.age,
      DOB: patient.dob,
      "Mobile No": patient.mobile,
      Address: patient.address,
      City: patient.city,
      State: patient.state,
      Country: patient.country,
      Email: patient.email,
      Organization: patient.organizationName,
      "Insurance Company": patient.insuranceName,
      "Diagnostic Center": patient.diagnosticCenterName,
      "Appointment Date": patient.appointmentDate,
      "QC Status": patient.qcStatus,
      "QC Approved Date": patient.qcApprovedDate,
      "Workflow Status": patient.currentStatus,
      "Registration Status": patient.patientStatus,
      "Cancellation Reason": patient.cancellationReason || "-",
      TAT: patient.tat,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Report");
    XLSX.writeFile(workbook, "Patients_MIS_Report.xlsx");
  };

  const applyFilters = () => {
    setAppliedStatus(status);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedOrganizationId(organizationId);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setStatus("ALL");
    setFromDate("");
    setToDate("");
    setOrganizationId("ALL");
    setAppliedStatus("ALL");
    setAppliedFromDate("");
    setAppliedToDate("");
    setAppliedOrganizationId("ALL");
    setCurrentPage(1);
  };

  const columns = [
    ["registered", "Registration D/T"],
    ["lm", "LM No"],
    ["proposalId", "Proposal ID"],
    ["name", "Patient Name"],
    ["gender", "Gender"],
    ["age", "Age"],
    ["dob", "DOB"],
    ["mobile", "Mobile No"],
    ["address", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["country", "Country"],
    ["email", "Email"],
    ["organization", "Organization Name"],
    ["appointmentDate", "Appointment Date"],
    ["qcApproveDate", "QC Approved Date"],
    ["provider", "Diagnostic Center"],
    ["insurance", "Insurance Company"],
    ["nationalId", "National ID No"],
    ["passport", "Passport No"],
    ["status", "Workflow Status"],
  ];

  if (loading && patients.length === 0) {
    // The page shell remains visible while the first report request is loading.
  }

  return (
    <div className="container-fluid patients-report-page">
      <style>{`
        .patients-report-page {
          --pr-navy: #0e3d66;
          --pr-text: #18243a;
          --pr-muted: #718096;
          --pr-border: #e4eaf1;
          padding: 18px 18px 28px;
          color: var(--pr-text);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .patients-report-page .pr-card {
          overflow: hidden;
          border: 1px solid var(--pr-border);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(20,43,70,.06);
        }
        .patients-report-page .pr-header {
          display: flex;
          align-items: center;
          gap: 13px;
          min-height: 76px;
          padding: 16px 24px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .patients-report-page .pr-header-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          border-radius: 11px;
          background: rgba(255,255,255,.13);
        }
        .patients-report-page .pr-header-icon svg { width: 22px; height: 22px; }
        .patients-report-page .pr-title { margin: 0; font-size: 19px; font-weight: 700; line-height: 1.3; }
        .patients-report-page .pr-subtitle { margin: 3px 0 0; color: #c7d8e8; font-size: 12px; }
        .patients-report-page .pr-body { padding: 21px 23px; }
        .patients-report-page .pr-filter-panel {
          margin-bottom: 19px;
          padding: 17px;
          border: 1px solid #e7edf3;
          border-radius: 11px;
          background: #fbfcfe;
        }
        .patients-report-page .pr-section-title {
          margin: 0 0 14px;
          color: #293c52;
          font-size: 13px;
          font-weight: 750;
        }
        .patients-report-page .pr-field { margin-bottom: 12px; }
        .patients-report-page .pr-field label {
          display: block;
          margin-bottom: 6px;
          color: #4b5b70;
          font-size: 12px;
          font-weight: 650;
        }
        .patients-report-page .pr-control {
          width: 100%;
          min-height: 40px;
          padding: 8px 10px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          outline: none;
          background: #fff;
          color: #26374b;
          font-size: 12.5px;
          box-shadow: none;
        }
        .patients-report-page .pr-control:focus,
        .patients-report-page .pr-search:focus {
          border-color: #6b9abd;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .patients-report-page .pr-filter-actions { display: flex; gap: 8px; align-items: flex-end; }
        .patients-report-page .pr-btn {
          min-height: 38px;
          padding: 8px 14px;
          border: 0;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          transition: .18s ease;
          white-space: nowrap;
        }
        .patients-report-page .pr-btn:disabled { opacity: .55; cursor: not-allowed; }
        .patients-report-page .pr-btn-primary { color: #fff; background: #0e3d66; }
        .patients-report-page .pr-btn-primary:hover { background: #092d4b; }
        .patients-report-page .pr-btn-reset { color: #fff; background: #a94450; }
        .patients-report-page .pr-btn-reset:hover { background: #8d3440; }
        .patients-report-page .pr-btn-excel { color: #fff; background: #247a58; }
        .patients-report-page .pr-btn-excel:hover { background: #1c6347; }
        .patients-report-page .pr-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 13px;
          margin-bottom: 14px;
        }
        .patients-report-page .pr-entries,
        .patients-report-page .pr-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #526176;
          font-size: 12px;
          font-weight: 550;
        }
        .patients-report-page .pr-entries select,
        .patients-report-page .pr-search {
          min-height: 38px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          outline: none;
          background: #fff;
          color: #26374b;
          font-size: 12.5px;
          box-shadow: none;
        }
        .patients-report-page .pr-entries select { min-width: 70px; padding: 6px 24px 6px 9px; }
        .patients-report-page .pr-search { width: 220px; padding: 8px 10px; }
        .patients-report-page .pr-toolbar-actions { display: flex; align-items: center; gap: 10px; }
        .patients-report-page .pr-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid var(--pr-border);
          border-radius: 10px;
        }
        .patients-report-page .pr-table {
          width: 100%;
          min-width: 2200px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 12px;
        }
        .patients-report-page .pr-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          padding: 12px 11px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #526176;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .4px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .patients-report-page .pr-table thead th.sortable { cursor: pointer; user-select: none; }
        .patients-report-page .pr-table thead th.sortable:hover { color: var(--pr-navy); }
        .patients-report-page .pr-table tbody td {
          padding: 11px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #344256;
          vertical-align: middle;
          white-space: nowrap;
        }
        .patients-report-page .pr-table tbody tr:last-child td { border-bottom: 0; }
        .patients-report-page .pr-table tbody tr:hover { background: #f9fbfd; }
        .patients-report-page .pr-patient-name { color: #263a50; font-weight: 650; }
        .patients-report-page .pr-status {
          display: inline-flex;
          align-items: center;
          max-width: 190px;
          padding: 5px 8px;
          border-radius: 20px;
          background: #edf3f8;
          color: #35536d;
          font-size: 10.5px;
          font-weight: 700;
          white-space: normal;
        }
        .patients-report-page .pr-status-active { background: #e8f5ee; color: #24734d; }
        .patients-report-page .pr-status-cancelled { background: #fff0f0; color: #ad3945; }
        .patients-report-page .pr-empty { padding: 35px 12px !important; color: #8995a4 !important; text-align: center; }
        .patients-report-page .pr-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
          color: #718096;
          font-size: 12px;
        }
        .patients-report-page .pr-pagination .pagination { gap: 4px; }
        .patients-report-page .pr-pagination .page-link {
          min-width: 32px;
          border: 1px solid #e0e7ef;
          border-radius: 7px !important;
          color: #36516a;
          background: #fff;
          font-size: 12px;
          text-align: center;
          box-shadow: none;
        }
        .patients-report-page .pr-pagination .page-item.active .page-link {
          border-color: var(--pr-navy);
          color: #fff;
          background: var(--pr-navy);
        }
        .patients-report-page .pr-pagination .page-item.disabled .page-link { color: #aab4c0; }
        .patients-report-page .pr-loading {
          padding: 28px;
          color: #718096;
          text-align: center;
          font-size: 12px;
        }
        @media (max-width: 767px) {
          .patients-report-page { padding: 12px 8px 22px; }
          .patients-report-page .pr-body { padding: 14px 12px; }
          .patients-report-page .pr-header { padding: 15px; }
          .patients-report-page .pr-toolbar { align-items: flex-start; flex-direction: column; }
          .patients-report-page .pr-toolbar-actions,
          .patients-report-page .pr-search-wrap { width: 100%; }
          .patients-report-page .pr-search { flex: 1; width: 100%; }
          .patients-report-page .pr-filter-actions { padding-top: 3px; }
          .patients-report-page .pr-pagination { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <div className="pr-card">
        <div className="pr-header">
          <div className="pr-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5V4.8A1.8 1.8 0 0 1 5.8 3h12.4A1.8 1.8 0 0 1 20 4.8v14.7" />
              <path d="M8 8h8M8 12h8M8 16h4M3 20.5h18" />
            </svg>
          </div>
          <div>
            <h1 className="pr-title">Patients MIS Report</h1>
            <p className="pr-subtitle">Monitor patient registrations, appointments and workflow progress</p>
          </div>
        </div>

        <div className="pr-body">
          <section className="pr-filter-panel">
            <h2 className="pr-section-title">Report Filters</h2>
            <div className="row">
              <div className="col-md-3 pr-field">
                <label htmlFor="pr-status">Workflow Status</label>
                <select id="pr-status" className="pr-control" value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="ALL">All</option>
                  <option value="PATIENT_REGISTERED">Patient Registered</option>
                  <option value="APPOINTMENT_SCHEDULED">Appointment Scheduled</option>
                  <option value="APPOINTMENT_COMPLETED">Appointment Completed</option>
                  <option value="MEDICAL_COMPLETED">Medical Completed</option>
                  <option value="REPORT_UPLOADED">Report Uploaded</option>
                  <option value="QC_PENDING">QC Pending</option>
                  <option value="QC_APPROVED">QC Approved</option>
                  <option value="QC_REJECTED">QC Rejected</option>
                </select>
              </div>
              <div className="col-md-3 pr-field">
                <label htmlFor="pr-organization">Organization</label>
                <select id="pr-organization" className="pr-control" value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}>
                  <option value="ALL">All Organizations</option>
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.organizationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 pr-field">
                <label htmlFor="pr-from-date">From Date</label>
                <input id="pr-from-date" type="date" className="pr-control" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
              </div>
              <div className="col-md-3 pr-field">
                <label htmlFor="pr-to-date">To Date</label>
                <input id="pr-to-date" type="date" className="pr-control" value={toDate} onChange={(event) => setToDate(event.target.value)} />
              </div>
            </div>
            <div className="pr-filter-actions">
              <button type="button" className="pr-btn pr-btn-primary" onClick={applyFilters}>Show</button>
              <button type="button" className="pr-btn pr-btn-reset" onClick={resetFilters}>Reset</button>
            </div>
          </section>

          <div className="pr-toolbar">
            <label className="pr-entries">
              Show
              <select value={entries} onChange={(event) => { setEntries(Number(event.target.value)); setCurrentPage(1); }} aria-label="Entries per page">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </label>
            <div className="pr-toolbar-actions">
              <label className="pr-search-wrap">
                Search
                <input
                  type="search"
                  className="pr-search"
                  placeholder="Search patient records..."
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
                />
              </label>
              <button className="pr-btn pr-btn-excel" onClick={exportToExcel} disabled={displayedPatients.length === 0}>
                Export Excel
              </button>
            </div>
          </div>

          <div className="pr-table-wrap">
            <table className="table pr-table">
              <thead>
                <tr>
                  {columns.map(([key, label]) => (
                    <th key={key} className="sortable" onClick={() => handleSort(key)}>
                      {label} <span aria-hidden="true">{getArrow(key)}</span>
                    </th>
                  ))}
                  <th>Registration Status</th>
                  <th>Cancellation Reason</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={23} className="pr-empty">Loading patient report...</td></tr>
                ) : displayedPatients.length === 0 ? (
                  <tr><td colSpan={23} className="pr-empty">No Record Found</td></tr>
                ) : (
                  displayedPatients.map((patient) => (
                    <tr key={patient.patientId}>
                      <td>{patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : "-"}</td>
                      <td>{patient.lmNo || "-"}</td>
                      <td>{patient.proposalId || "-"}</td>
                      <td className="pr-patient-name">{[patient.title, patient.patientName].filter(Boolean).join(" ") || "-"}</td>
                      <td>{patient.gender || "-"}</td>
                      <td>{patient.age ?? "-"}</td>
                      <td>{patient.dob || "-"}</td>
                      <td>{patient.mobile || "-"}</td>
                      <td>{patient.address || "-"}</td>
                      <td>{patient.city || "-"}</td>
                      <td>{patient.state || "-"}</td>
                      <td>{patient.country || "-"}</td>
                      <td>{patient.email || "-"}</td>
                      <td>{patient.organizationName || "-"}</td>
                      <td>{patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString("en-GB") : "-"}</td>
                      <td>{patient.qcApprovedDate ? new Date(patient.qcApprovedDate).toLocaleString("en-GB") : "-"}</td>
                      <td>{patient.diagnosticCenterName || "-"}</td>
                      <td>{patient.insuranceName || "-"}</td>
                      <td>{patient.nationalIdNumber || "-"}</td>
                      <td>{patient.passportNumber || "-"}</td>
                      <td><span className="pr-status">{patient.currentStatus || "-"}</span></td>
                      <td>
                        <span className={`pr-status ${patient.patientStatus === "ACTIVE" ? "pr-status-active" : "pr-status-cancelled"}`}>
                          {patient.patientStatus === "ACTIVE" ? "Active" : "Registration Cancelled"}
                        </span>
                      </td>
                      <td>{patient.cancellationReason || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pr-pagination">
            <div>Showing page {totalPages === 0 ? 0 : currentPage} of {totalPages}</div>
            <nav aria-label="Patients report pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>Previous</button>
                </li>
                {getPageNumbers().map((number) => (
                  <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                  <button className="page-link" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((page) => page + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsReport;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";
// import { getPatientReport } from "../../services/patientService";
// import { getOrganizationsAll } from "../../services/organizationService";
// import * as XLSX from "xlsx";

// const PatientsReport = () => {
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [status, setStatus] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [organizationId, setOrganizationId] = useState("ALL");
//   const [appliedOrganizationId, setAppliedOrganizationId] = useState("ALL");

//   const [appliedStatus, setAppliedStatus] = useState("ALL");
//   const [appliedFromDate, setAppliedFromDate] = useState("");
//   const [appliedToDate, setAppliedToDate] = useState("");

//   const [patients, setPatients] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   const getPageNumbers = () => {
//   const pages = [];

//   const startPage = Math.max(1, currentPage - 2);
//   const endPage = Math.min(totalPages, currentPage + 2);

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   return pages;
// };

//   const loadPatients = async () => {
//     try {
//       const res = await getPatientReport(
//         currentPage - 1,
//         entries,
//         search,
//         appliedStatus === "ALL" ? "ALL" : appliedStatus,
//         appliedFromDate || null,
//         appliedToDate || null,
//         appliedOrganizationId === "ALL" ? null : appliedOrganizationId,
//       );


//       setPatients(res.data.content);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//   const timer = setTimeout(() => {
//     loadPatients();
//   }, 400);

//   return () => clearTimeout(timer);
// }, [
//   currentPage,
//   entries,
//   search,
//   appliedStatus,
//   appliedFromDate,
//   appliedToDate,
//   appliedOrganizationId,
// ]);

//   const [organizations, setOrganizations] = useState([]);

//   useEffect(() => {
//     loadOrganizations();
//   }, []);

//   const loadOrganizations = async () => {
//     try {
//       const res = await getOrganizationsAll();

//       setOrganizations(res.data.data || res.data || []);
//     } catch (err) {
//       console.error("Failed to load organizations", err);
//     }
//   };

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const convertDate = (dateStr) => {
//     const [day, month, year] = dateStr.split("-");

//     return new Date(`${year}-${month}-${day}`);
//   };

//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   //   const exportToExcel = () => {
//   //     const exportData = patients.map((p) => ({

//   //     "Registration Date": p.registrationDate,

//   //     "Patient Id": p.patientId,

//   //     "Proposal Id": p.proposalId,

//   //     "Patient Name": p.patientName,

//   //     Gender: p.gender,

//   //     Age: p.age,

//   //     DOB: p.dob,

//   //     Mobile: p.mobile,

//   //     Address: p.address,

//   //     City: p.city,

//   //     State: p.state,

//   //     Country: p.country,

//   //     Email: p.email,

//   //     Organization: p.organizationName,

//   //     Insurance: p.insuranceName,

//   //     DiagnosticCenter: p.diagnosticCenterName,

//   //     QCStatus: p.qcStatus,

//   //     WorkflowStatus: p.currentStatus,

//   //     RegistrationStatus: p.patientStatus,

//   //     CancellationReason: p.cancellationReason,

//   //     TAT: p.tat

//   // }));

//   //     const worksheet = XLSX.utils.json_to_sheet(exportData);

//   //     const workbook = XLSX.utils.book_new();

//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Report");

//   //     XLSX.writeFile(workbook, "Patients_MIS_Report.xlsx");
//   //   };

//   const exportToExcel = () => {
//     const exportData = patients.map((p) => ({
//       "Registration Date": p.registrationDate,

//       "LM No": p.lmNo,

//       "Patient Id": p.patientId,

//       "Proposal ID": p.proposalId,

//       "Patient Name": p.patientName,

//       Gender: p.gender,

//       Age: p.age,

//       DOB: p.dob,

//       "Mobile No": p.mobile,

//       Address: p.address,

//       City: p.city,

//       State: p.state,

//       Country: p.country,

//       Email: p.email,

//       Organization: p.organizationName,

//       "Insurance Company": p.insuranceName,

//       "Diagnostic Center": p.diagnosticCenterName,

//       "Appointment Date": p.appointmentDate,

//       "QC Status": p.qcStatus,

//       "QC Approved Date": p.qcApprovedDate,

//       "Workflow Status": p.currentStatus,

//       "Registration Status": p.patientStatus,

//       "Cancellation Reason": p.cancellationReason || "-",

//       TAT: p.tat,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);

//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Report");

//     XLSX.writeFile(workbook, "Patients_MIS_Report.xlsx");
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Patients MIS Report</h5>
//         </div>

//         <div className="card-body">
//           {/* Filters */}

//           <div className="row mb-3">
//             <div className="col-md-3">
//               <label>Workflow Status</label>

//               <select
//                 className="form-control"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="ALL">All</option>

//                 <option value="PATIENT_REGISTERED">Patient Registered</option>

//                 <option value="APPOINTMENT_SCHEDULED">
//                   Appointment Scheduled
//                 </option>

//                 <option value="APPOINTMENT_COMPLETED">
//                   Appointment Completed
//                 </option>

//                 <option value="MEDICAL_COMPLETED">Medical Completed</option>

//                 <option value="REPORT_UPLOADED">Report Uploaded</option>

//                 <option value="QC_PENDING">QC Pending</option>

//                 <option value="QC_APPROVED">QC Approved</option>

//                 <option value="QC_REJECTED">QC Rejected</option>
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>Organization</label>

//               <select
//                 className="form-control"
//                 value={organizationId}
//                 onChange={(e) => setOrganizationId(e.target.value)}
//               >
//                 <option value="ALL">All Organizations</option>

//                 {organizations.map((org) => (
//                   <option key={org.id} value={org.id}>
//                     {org.organizationName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>From Date</label>

//               <input
//                 type="date"
//                 className="form-control"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>

//             <div className="col-md-3">
//               <label>To Date</label>

//               <input
//                 type="date"
//                 className="form-control"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Show / Reset */}
// <div className="row mt-2 mb-3">
//   <div className="col-12 filter-buttons">

//     <button
//       type="button"
//       className="btn btn-primary filter-btn"
//       onClick={() => {
//         setAppliedStatus(status);
//         setAppliedFromDate(fromDate);
//         setAppliedToDate(toDate);
//         setAppliedOrganizationId(organizationId);
//         setCurrentPage(1);
//       }}
//     >
//       Show
//     </button>

//     <button
//       type="button"
//       className="btn btn-danger filter-btn"
//       onClick={() => {
//         setStatus("ALL");
//         setFromDate("");
//         setToDate("");
//         setOrganizationId("ALL");

//         setAppliedStatus("ALL");
//         setAppliedFromDate("");
//         setAppliedToDate("");
//         setAppliedOrganizationId("ALL");

//         setCurrentPage(1);
//       }}
//     >
//       Reset
//     </button>

//   </div>
// </div>

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
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
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
//               <button className="btn btn-success ms-3" onClick={exportToExcel}>
//                 Export Excel
//               </button>
//             </div>
//           </div>

//           <div
//             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort("registered")}>
//                     Registration D/T {getArrow("registered")}
//                   </th>

//                   <th onClick={() => handleSort("lm")}>
//                     LM No {getArrow("lm")}
//                   </th>

//                   <th onClick={() => handleSort("proposalId")}>
//                     Proposal ID {getArrow("proposalId")}
//                   </th>

//                   <th onClick={() => handleSort("name")}>
//                     Patient Name {getArrow("name")}
//                   </th>

//                   <th onClick={() => handleSort("gender")}>
//                     Gender {getArrow("gender")}
//                   </th>

//                   <th onClick={() => handleSort("age")}>
//                     Age {getArrow("age")}
//                   </th>

//                   <th onClick={() => handleSort("dob")}>
//                     DOB {getArrow("dob")}
//                   </th>

//                   <th onClick={() => handleSort("mobile")}>
//                     Mobile No {getArrow("mobile")}
//                   </th>

//                   <th onClick={() => handleSort("address")}>
//                     Address {getArrow("address")}
//                   </th>

//                   <th onClick={() => handleSort("city")}>
//                     City {getArrow("city")}
//                   </th>

//                   <th onClick={() => handleSort("state")}>
//                     State {getArrow("state")}
//                   </th>

//                   <th onClick={() => handleSort("country")}>
//                     Country {getArrow("country")}
//                   </th>

//                   <th onClick={() => handleSort("email")}>
//                     Email {getArrow("email")}
//                   </th>

//                   <th onClick={() => handleSort("organization")}>
//                     Organization Name {getArrow("organization")}
//                   </th>

//                   <th onClick={() => handleSort("appointmentDate")}>
//                     Appointment Date {getArrow("appointmentDate")}
//                   </th>

//                   <th onClick={() => handleSort("qcApproveDate")}>
//                     QC Approved Date {getArrow("qcApproveDate")}
//                   </th>

//                   <th onClick={() => handleSort("provider")}>
//                     Diagnostic Center {getArrow("provider")}
//                   </th>

//                   <th onClick={() => handleSort("insurance")}>
//                     Insurance Company {getArrow("insurance")}
//                   </th>

//                   <th onClick={() => handleSort("nationalId")}>
//                     National ID No {getArrow("nationalId")}
//                   </th>

//                   <th onClick={() => handleSort("passport")}>
//                     Passport No {getArrow("passport")}
//                   </th>

//                   <th onClick={() => handleSort("status")}>
//                     Workflow Status {getArrow("status")}
//                   </th>
//                   <th>Registration Status</th>

//                   <th>Cancellation Reason</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {patients.length === 0 ? (
//                   <tr>
//                     <td colSpan="20" className="text-center">
//                       !!No Record Found!!
//                     </td>
//                   </tr>
//                 ) : (
//                   patients.map((p) => (
//                     <tr key={p.patientId}>
//                       <td>
//                         {p.registrationDate
//                           ? new Date(p.registrationDate).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td>{p.lmNo}</td>
//                       <td>{p.proposalId}</td>
//                       <td>
//                         {p.title} {p.patientName}
//                       </td>
//                       <td>{p.gender}</td>
//                       <td>{p.age}</td>
//                       <td>{p.dob}</td>
//                       <td>{p.mobile}</td>
//                       <td>{p.address}</td>
//                       <td>{p.city}</td>
//                       <td>{p.state}</td>
//                       <td>{p.country}</td>
//                       <td>{p.email}</td>
//                       <td>{p.organizationName}</td>
//                       <td>
//                         {p.appointmentDate
//                           ? new Date(p.appointmentDate).toLocaleDateString(
//                               "en-GB",
//                             )
//                           : "-"}
//                       </td>
//                       <td>
//                         {p.qcApprovedDate
//                           ? new Date(p.qcApprovedDate).toLocaleString("en-GB")
//                           : "-"}
//                       </td>
//                       <td>{p.diagnosticCenterName}</td>
//                       <td>{p.insuranceName}</td>
//                       <td>{p.nationalIdNumber}</td>
//                       <td>{p.passportNumber}</td>
//                       <td>{p.currentStatus}</td>
//                       <td>
//                         {p.patientStatus === "ACTIVE" ? (
//                           <span className="badge bg-success">Active</span>
//                         ) : (
//                           <span className="badge bg-danger">
//                             Registration Cancelled
//                           </span>
//                         )}
//                       </td>

//                       <td>{p.cancellationReason || "-"}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}

//           {/* Pagination */}

// <div className="d-flex justify-content-between align-items-center mt-3">

//   {/* Page Information */}
//   <div>
//     Showing page {currentPage} of {totalPages}
//   </div>

//   {/* Pagination */}
//   <nav>
//     <ul className="pagination mb-0">

//       {/* Previous */}
//       <li
//         className={`page-item ${
//           currentPage === 1 ? "disabled" : ""
//         }`}
//       >
//         <button
//           className="page-link"
//           onClick={() => setCurrentPage(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//       </li>

//       {/* Page Numbers */}
//       {getPageNumbers().map((num) => (
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

//       {/* Next */}
//       <li
//         className={`page-item ${
//           currentPage === totalPages ? "disabled" : ""
//         }`}
//       >
//         <button
//           className="page-link"
//           onClick={() => setCurrentPage(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </li>

//     </ul>
//   </nav>

// </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientsReport;
