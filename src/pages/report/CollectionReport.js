import React, { useState } from "react";
import "../../styles/allPatients.css";
import * as XLSX from "xlsx";
import { patients } from "../../data/patients";

// const collectionData = [];

const CollectionReport = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [organization, setOrganization] = useState("All");
  const [provider, setProvider] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedOrganization, setAppliedOrganization] = useState("All");
  const [appliedProvider, setAppliedProvider] = useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const organizations = [
    "All",
    ...new Set(patients.map((p) => p.organization)),
  ];

  const providers = ["All", ...new Set(patients.map((p) => p.provider))];

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

  const filteredData = patients.filter((p) => {
    const matchesSearch = Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesOrg =
      appliedOrganization === "All" || p.organization === appliedOrganization;

    const matchesProvider =
      appliedProvider === "All" || p.provider === appliedProvider;

    const matchesDate =
      (!appliedFromDate ||
        convertDate(p.appointment) >= new Date(appliedFromDate)) &&
      (!appliedToDate || convertDate(p.appointment) <= new Date(appliedToDate));

    return matchesSearch && matchesOrg && matchesProvider && matchesDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;

    return 0;
  });

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentData = sortedData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedData.length / entries);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startEntry = sortedData.length === 0 ? 0 : indexOfFirst + 1;
  const endEntry = Math.min(indexOfLast, sortedData.length);

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Collection Report");

    XLSX.writeFile(workbook, "Collection_Report.xlsx");
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Collection Report</h5>
        </div>

        <div className="card-body">
          {/* Filters */}

          <div className="row mb-3">
            <div className="col-md-3">
              <label>Organization</label>

              <select
                className="form-control"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              >
                {organizations.map((org, index) => (
                  <option key={index} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>Service Provider</label>

              <select
                className="form-control"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                {providers.map((p, index) => (
                  <option key={index} value={p}>
                    {p}
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

            <div className="col-md-12 mt-2">
              <button
                className="btn btn-primary me-2"
                onClick={() => {
                  setAppliedOrganization(organization);
                  setAppliedProvider(provider);
                  setAppliedFromDate(fromDate);
                  setAppliedToDate(toDate);
                  setCurrentPage(1);
                }}
              >
                Show
              </button>
              <button
                className="btn btn-danger me-2"
                onClick={() => {
                  setOrganization("All");
                  setProvider("All");
                  setFromDate("");
                  setToDate("");

                  setAppliedOrganization("All");
                  setAppliedProvider("All");
                  setAppliedFromDate("");
                  setAppliedToDate("");
                }}
              >
                Reset
              </button>
              {/* <button className="btn btn-success" onClick={exportToExcel}>
                Export to Excel
              </button> */}
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
                  <th>S.No</th>

                  <th onClick={() => handleSort("uhid")}>
                    UHID {getArrow("uhid")}
                  </th>

                  <th onClick={() => handleSort("name")}>
                    Patient Name {getArrow("name")}
                  </th>

                  <th onClick={() => handleSort("country")}>
                    Location (Country) {getArrow("country")}
                  </th>

                  <th onClick={() => handleSort("appointmentDate")}>
                    Appointment Date {getArrow("appointmentDate")}
                  </th>

                  <th onClick={() => handleSort("proposalId")}>
                    Proposal ID {getArrow("proposalId")}
                  </th>

                  <th>Package Details</th>

                  <th onClick={() => handleSort("packageAmount")}>
                    Package Amount {getArrow("packageAmount")}
                  </th>

                  <th>Currency</th>

                  <th onClick={() => handleSort("amountINR")}>
                    Amount (INR) {getArrow("amountINR")}
                  </th>

                  <th onClick={() => handleSort("organization")}>
                    Organization {getArrow("organization")}
                  </th>

                  <th onClick={() => handleSort("provider")}>
                    Services Provider {getArrow("provider")}
                  </th>

                  <th>Insurance Company</th>

                  <th>Created By</th>

                  <th onClick={() => handleSort("createdAt")}>
                    Created At {getArrow("createdAt")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="text-center">
                      !!No Record Found!!
                    </td>
                  </tr>
                ) : (
                  currentData.map((p, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>{p.lm}</td>
                      <td>{p.name}</td>
                      <td>{p.country}</td>
                      <td>{p.appointment}</td>
                      <td>{p.proposalId}</td>
                      <td>{p.package}</td>
                      <td>{p.packageAmount}</td>
                      <td>{p.currency}</td>
                      <td>{p.amountINR}</td>
                      <td>{p.organization}</td>
                      <td>{p.provider}</td>
                      <td>{p.insurance}</td>
                      <td>{p.createdBy}</td>
                      <td>{p.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {startEntry} to {endEntry} of {sortedData.length} entries
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

export default CollectionReport;
