import React, { useState, useEffect } from "react";
import "../../styles/allPatients.css";
import { getPatientReport } from "../../services/patientService";
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

  const [appliedStatus, setAppliedStatus] = useState("ALL");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const loadPatients = async () => {
    try {
      const res = await getPatientReport(
        currentPage - 1,

        entries,

        search,

        appliedStatus === "ALL" ? "ALL" : appliedStatus,

        appliedFromDate || null,

        appliedToDate || null,
      );

      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [
    currentPage,

    entries,

    search,

    appliedStatus,

    appliedFromDate,

    appliedToDate,
  ]);

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

  const exportToExcel = () => {
    const exportData = patients.map((p) => ({

    "Registration Date": p.registrationDate,

    "Patient Id": p.patientId,

    "Proposal Id": p.proposalId,

    "Patient Name": p.patientName,

    Gender: p.gender,

    Age: p.age,

    DOB: p.dob,

    Mobile: p.mobile,

    Address: p.address,

    City: p.city,

    State: p.state,

    Country: p.country,

    Email: p.email,

    Organization: p.organizationName,

    Insurance: p.insuranceName,

    DiagnosticCenter: p.diagnosticCenterName,

    QCStatus: p.qcStatus,

    CurrentStatus: p.currentStatus,

    TAT: p.tat

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
              <label>Current Status</label>

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

            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary me-2"
                onClick={() => {
                  setAppliedStatus(status);
                  setAppliedFromDate(fromDate);
                  setAppliedToDate(toDate);
                  setCurrentPage(1);
                }}
              >
                Show
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setStatus("ALL");
                  setFromDate("");
                  setToDate("");

                  setAppliedStatus("ALL");
                  setAppliedFromDate("");
                  setAppliedToDate("");

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
                    Current Status {getArrow("status")}
                  </th>
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
                      <td>{p.patientId}</td>
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
                      <td>{p.diagnosticCenterName}</td>
                      <td>{p.insuranceName}</td>
                      <td>{p.nationalIdNumber}</td>
                      <td>{p.passportNumber}</td>
                      <td>{p.currentStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* <div>
              Showing {startEntry} to {endEntry} of {sortedData.length} entries
            </div> */}

            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {pageNumbers.map((num) => (
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

export default PatientsReport;
