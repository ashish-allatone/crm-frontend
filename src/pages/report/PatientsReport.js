import React, { useState, useEffect } from "react";
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
      const res = await getPatientReport(
        currentPage - 1,
        entries,
        search,
        appliedStatus === "ALL" ? "ALL" : appliedStatus,
        appliedFromDate || null,
        appliedToDate || null,
        appliedOrganizationId === "ALL" ? null : appliedOrganizationId,
      );


      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
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

  const [organizations, setOrganizations] = useState([]);

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

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const convertDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");

    return new Date(`${year}-${month}-${day}`);
  };

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  //   const exportToExcel = () => {
  //     const exportData = patients.map((p) => ({

  //     "Registration Date": p.registrationDate,

  //     "Patient Id": p.patientId,

  //     "Proposal Id": p.proposalId,

  //     "Patient Name": p.patientName,

  //     Gender: p.gender,

  //     Age: p.age,

  //     DOB: p.dob,

  //     Mobile: p.mobile,

  //     Address: p.address,

  //     City: p.city,

  //     State: p.state,

  //     Country: p.country,

  //     Email: p.email,

  //     Organization: p.organizationName,

  //     Insurance: p.insuranceName,

  //     DiagnosticCenter: p.diagnosticCenterName,

  //     QCStatus: p.qcStatus,

  //     WorkflowStatus: p.currentStatus,

  //     RegistrationStatus: p.patientStatus,

  //     CancellationReason: p.cancellationReason,

  //     TAT: p.tat

  // }));

  //     const worksheet = XLSX.utils.json_to_sheet(exportData);

  //     const workbook = XLSX.utils.book_new();

  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Report");

  //     XLSX.writeFile(workbook, "Patients_MIS_Report.xlsx");
  //   };

  const exportToExcel = () => {
    const exportData = patients.map((p) => ({
      "Registration Date": p.registrationDate,

      "LM No": p.lmNo,

      "Patient Id": p.patientId,

      "Proposal ID": p.proposalId,

      "Patient Name": p.patientName,

      Gender: p.gender,

      Age: p.age,

      DOB: p.dob,

      "Mobile No": p.mobile,

      Address: p.address,

      City: p.city,

      State: p.state,

      Country: p.country,

      Email: p.email,

      Organization: p.organizationName,

      "Insurance Company": p.insuranceName,

      "Diagnostic Center": p.diagnosticCenterName,

      "Appointment Date": p.appointmentDate,

      "QC Status": p.qcStatus,

      "QC Approved Date": p.qcApprovedDate,

      "Workflow Status": p.currentStatus,

      "Registration Status": p.patientStatus,

      "Cancellation Reason": p.cancellationReason || "-",

      TAT: p.tat,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients Report");

    XLSX.writeFile(workbook, "Patients_MIS_Report.xlsx");
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Patients MIS Report</h5>
        </div>

        <div className="card-body">
          {/* Filters */}

          <div className="row mb-3">
            <div className="col-md-3">
              <label>Workflow Status</label>

              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ALL">All</option>

                <option value="PATIENT_REGISTERED">Patient Registered</option>

                <option value="APPOINTMENT_SCHEDULED">
                  Appointment Scheduled
                </option>

                <option value="APPOINTMENT_COMPLETED">
                  Appointment Completed
                </option>

                <option value="MEDICAL_COMPLETED">Medical Completed</option>

                <option value="REPORT_UPLOADED">Report Uploaded</option>

                <option value="QC_PENDING">QC Pending</option>

                <option value="QC_APPROVED">QC Approved</option>

                <option value="QC_REJECTED">QC Rejected</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Organization</label>

              <select
                className="form-control"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              >
                <option value="ALL">All Organizations</option>

                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.organizationName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>From Date</label>

              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label>To Date</label>

              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Show / Reset */}
<div className="row mt-2 mb-3">
  <div className="col-12 filter-buttons">

    <button
      type="button"
      className="btn btn-primary filter-btn"
      onClick={() => {
        setAppliedStatus(status);
        setAppliedFromDate(fromDate);
        setAppliedToDate(toDate);
        setAppliedOrganizationId(organizationId);
        setCurrentPage(1);
      }}
    >
      Show
    </button>

    <button
      type="button"
      className="btn btn-danger filter-btn"
      onClick={() => {
        setStatus("ALL");
        setFromDate("");
        setToDate("");
        setOrganizationId("ALL");

        setAppliedStatus("ALL");
        setAppliedFromDate("");
        setAppliedToDate("");
        setAppliedOrganizationId("ALL");

        setCurrentPage(1);
      }}
    >
      Reset
    </button>

  </div>
</div>

          {/* Search + Entries */}

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
                <option value={50}>50</option>
                <option value={100}>100</option>
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
              <button className="btn btn-success ms-3" onClick={exportToExcel}>
                Export Excel
              </button>
            </div>
          </div>

          <div
            style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
            className="table-scroll"
          >
            <table className="table table-bordered all-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("registered")}>
                    Registration D/T {getArrow("registered")}
                  </th>

                  <th onClick={() => handleSort("lm")}>
                    LM No {getArrow("lm")}
                  </th>

                  <th onClick={() => handleSort("proposalId")}>
                    Proposal ID {getArrow("proposalId")}
                  </th>

                  <th onClick={() => handleSort("name")}>
                    Patient Name {getArrow("name")}
                  </th>

                  <th onClick={() => handleSort("gender")}>
                    Gender {getArrow("gender")}
                  </th>

                  <th onClick={() => handleSort("age")}>
                    Age {getArrow("age")}
                  </th>

                  <th onClick={() => handleSort("dob")}>
                    DOB {getArrow("dob")}
                  </th>

                  <th onClick={() => handleSort("mobile")}>
                    Mobile No {getArrow("mobile")}
                  </th>

                  <th onClick={() => handleSort("address")}>
                    Address {getArrow("address")}
                  </th>

                  <th onClick={() => handleSort("city")}>
                    City {getArrow("city")}
                  </th>

                  <th onClick={() => handleSort("state")}>
                    State {getArrow("state")}
                  </th>

                  <th onClick={() => handleSort("country")}>
                    Country {getArrow("country")}
                  </th>

                  <th onClick={() => handleSort("email")}>
                    Email {getArrow("email")}
                  </th>

                  <th onClick={() => handleSort("organization")}>
                    Organization Name {getArrow("organization")}
                  </th>

                  <th onClick={() => handleSort("appointmentDate")}>
                    Appointment Date {getArrow("appointmentDate")}
                  </th>

                  <th onClick={() => handleSort("qcApproveDate")}>
                    QC Approved Date {getArrow("qcApproveDate")}
                  </th>

                  <th onClick={() => handleSort("provider")}>
                    Diagnostic Center {getArrow("provider")}
                  </th>

                  <th onClick={() => handleSort("insurance")}>
                    Insurance Company {getArrow("insurance")}
                  </th>

                  <th onClick={() => handleSort("nationalId")}>
                    National ID No {getArrow("nationalId")}
                  </th>

                  <th onClick={() => handleSort("passport")}>
                    Passport No {getArrow("passport")}
                  </th>

                  <th onClick={() => handleSort("status")}>
                    Workflow Status {getArrow("status")}
                  </th>
                  <th>Registration Status</th>

                  <th>Cancellation Reason</th>
                </tr>
              </thead>

              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="20" className="text-center">
                      !!No Record Found!!
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.patientId}>
                      <td>
                        {p.registrationDate
                          ? new Date(p.registrationDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{p.lmNo}</td>
                      <td>{p.proposalId}</td>
                      <td>
                        {p.title} {p.patientName}
                      </td>
                      <td>{p.gender}</td>
                      <td>{p.age}</td>
                      <td>{p.dob}</td>
                      <td>{p.mobile}</td>
                      <td>{p.address}</td>
                      <td>{p.city}</td>
                      <td>{p.state}</td>
                      <td>{p.country}</td>
                      <td>{p.email}</td>
                      <td>{p.organizationName}</td>
                      <td>
                        {p.appointmentDate
                          ? new Date(p.appointmentDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </td>
                      <td>
                        {p.qcApprovedDate
                          ? new Date(p.qcApprovedDate).toLocaleString("en-GB")
                          : "-"}
                      </td>
                      <td>{p.diagnosticCenterName}</td>
                      <td>{p.insuranceName}</td>
                      <td>{p.nationalIdNumber}</td>
                      <td>{p.passportNumber}</td>
                      <td>{p.currentStatus}</td>
                      <td>
                        {p.patientStatus === "ACTIVE" ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">
                            Registration Cancelled
                          </span>
                        )}
                      </td>

                      <td>{p.cancellationReason || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          {/* Pagination */}

<div className="d-flex justify-content-between align-items-center mt-3">

  {/* Page Information */}
  <div>
    Showing page {currentPage} of {totalPages}
  </div>

  {/* Pagination */}
  <nav>
    <ul className="pagination mb-0">

      {/* Previous */}
      <li
        className={`page-item ${
          currentPage === 1 ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>

      {/* Page Numbers */}
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

      {/* Next */}
      <li
        className={`page-item ${
          currentPage === totalPages ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
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

export default PatientsReport;
