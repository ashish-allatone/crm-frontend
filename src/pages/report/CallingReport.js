import React, { useState } from "react";
import "../../styles/allPatients.css";

const callData = [];

const CallingReport = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const filteredData = callData.filter((p) => {
    const matchesSearch = Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchesDate = true;

    if (fromDate || toDate) {
      const callDate = new Date(p.callAt);

      if (fromDate) {
        matchesDate = callDate >= new Date(fromDate);
      }

      if (toDate) {
        matchesDate = callDate <= new Date(toDate) && matchesDate;
      }
    }

    return matchesSearch && matchesDate;
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

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Call Response</h5>
        </div>

        <div className="card-body">
          {/* Date Filters */}

          <div className="row mb-3">
            <div className="col-md-4">
              <label>From Date</label>

              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label>To Date</label>

              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary me-2">Show</button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
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
            </div>
          </div>

          <div
            style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
            className="table-scroll"
          >
            <table className="table table-bordered all-table">
              <thead>
                <tr>
                  <th>S No</th>

                  <th
                    onClick={() => handleSort("lm")}
                    style={{ cursor: "pointer" }}
                  >
                    LM No {getArrow("lm")}
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Patient Name {getArrow("name")}
                  </th>

                  <th
                    onClick={() => handleSort("mobile")}
                    style={{ cursor: "pointer" }}
                  >
                    Mobile No {getArrow("mobile")}
                  </th>

                  <th
                    onClick={() => handleSort("callAt")}
                    style={{ cursor: "pointer" }}
                  >
                    Call At {getArrow("callAt")}
                  </th>

                  <th
                    onClick={() => handleSort("callBy")}
                    style={{ cursor: "pointer" }}
                  >
                    Call By {getArrow("callBy")}
                  </th>

                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th>

                  <th
                    onClick={() => handleSort("response")}
                    style={{ cursor: "pointer" }}
                  >
                    Response {getArrow("response")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      !!No Record Found!!
                    </td>
                  </tr>
                ) : (
                  currentData.map((p, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>{p.lm}</td>

                      <td>{p.name}</td>

                      <td>{p.mobile}</td>

                      <td>{p.callAt}</td>

                      <td>{p.callBy}</td>

                      <td>{p.status}</td>

                      <td>{p.response}</td>
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

export default CallingReport;
