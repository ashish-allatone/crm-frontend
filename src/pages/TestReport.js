import React, { useState } from "react";
import "../styles/allPatients.css";
import { patients } from "../data/patients";
import { useNavigate} from "react-router-dom";

const TestReport = () => {

//   const reports = [];

  const navigate=useNavigate();

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

  // search

  const filteredData = patients.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // sorting

  const sortedData = [...filteredData].sort((a, b) => {

    if (!sortColumn) return 0;

    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;

    return 0;
  });

  // pagination

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
          <h5>Test Report</h5>
        </div>

        <div className="card-body">

          {/* Entries + Search */}

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

          {/* Table */}

          <div
            style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
            className="table-scroll"
          >

            <table className="table table-bordered all-table">

              <thead>

                <tr>

                  <th>Actions</th>

                  <th
                    onClick={() => handleSort("lm")}
                    style={{ cursor: "pointer" }}
                  >
                    LM NO. {getArrow("lm")}
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    PATIENT NAME {getArrow("name")}
                  </th>

                  <th
                    onClick={() => handleSort("mobile")}
                    style={{ cursor: "pointer" }}
                  >
                    MOBILE {getArrow("mobile")}
                  </th>

                  <th
                    onClick={() => handleSort("age")}
                    style={{ cursor: "pointer" }}
                  >
                    AGE / GENDER {getArrow("age")}
                  </th>

                  <th
                    onClick={() => handleSort("organization")}
                    style={{ cursor: "pointer" }}
                  >
                    ORGANIZATION NAME {getArrow("organization")}
                  </th>

                  <th
                    onClick={() => handleSort("provider")}
                    style={{ cursor: "pointer" }}
                  >
                    SERVICES PROVIDER {getArrow("provider")}
                  </th>

                  <th
                    onClick={() => handleSort("insurance")}
                    style={{ cursor: "pointer" }}
                  >
                    INSURANCE COMPANY {getArrow("insurance")}
                  </th>

                  <th
                    onClick={() => handleSort("registered")}
                    style={{ cursor: "pointer" }}
                  >
                    REGISTERED ON {getArrow("registered")}
                  </th>

                  <th
                    onClick={() => handleSort("details")}
                    style={{ cursor: "pointer" }}
                  >
                    VIEW DETAILS {getArrow("details")}
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentData.length === 0 ? (

                  <tr>
                    <td colSpan="10" className="text-center">
                      No matching records found
                    </td>
                  </tr>

                ) : (

                  currentData.map((p, index) => (

                    <tr key={index}>

                      <td>
                        <button
className="btn btn-info btn-sm"
onClick={()=>navigate(`/test-report-upload/${p.id}`)}
>
View Test Report
</button>
                      </td>

                      <td>{p.lm}</td>
                      <td className="text-primary">{p.name}</td>
                      <td>{p.mobile}</td>
                      <td>{p.age}</td>
                      <td>{p.organization}</td>
                      <td>{p.provider}</td>
                      <td>{p.insurance}</td>
                      <td>{p.registered}</td>
                      <td>{p.status}</td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* Footer */}

          <div className="d-flex justify-content-between align-items-center mt-3">

            <div>
              Showing {startEntry} to {endEntry} of {sortedData.length} entries
            </div>

            <nav>

              <ul className="pagination mb-0">

                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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

export default TestReport;