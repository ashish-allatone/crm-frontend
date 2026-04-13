import React, { useState, useEffect} from "react";
import "../../../styles/allPatients.css";
import { useNavigate } from "react-router-dom";
// import { tests } from "../../../data/tests";
import { getTests, deleteTest } from "../../../services/testService";
import { hasPermission } from "../../permissionUtil";

const TestMaster = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [tests, setTests] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

//   const loadTests = async () => {
//   const res = await getTests(currentPage - 1, entries, search);

//   setTests(res.data.content);
//   setTotalPages(res.data.totalPages);
// };
const loadTests = async () => {
  try {
    const res = await getTests(currentPage - 1, entries, search);
    setTests(res.data.content);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    if (err.response?.status === 403) {
      alert("Access Denied ❌");
    }
  }
};

useEffect(() => {
  loadTests();
}, [currentPage, entries, search]);

  const navigate = useNavigate();

  /* Sorting */

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  /* Search */

  // const filteredTests = tests.filter((t) =>
  //   Object.values(t).join(" ").toLowerCase().includes(search.toLowerCase()),
  // );

  /* Sorted Data */

  // const sortedTests = [...filteredTests].sort((a, b) => {
  //   if (!sortColumn) return 0;

  //   let valA = a[sortColumn];
  //   let valB = b[sortColumn];

  //   if (valA < valB) return sortDirection === "asc" ? -1 : 1;
  //   if (valA > valB) return sortDirection === "asc" ? 1 : -1;

  //   return 0;
  // });

  /* Pagination */

  // const indexOfLast = currentPage * entries;
  // const indexOfFirst = indexOfLast - entries;

  // const currentTests = sortedTests.slice(indexOfFirst, indexOfLast);

  // const totalPages = Math.ceil(sortedTests.length / entries);

  // const pageNumbers = [];

  // for (let i = 1; i <= totalPages; i++) {
  //   pageNumbers.push(i);
  // }

  // const startEntry = sortedTests.length === 0 ? 0 : indexOfFirst + 1;
  // const endEntry = Math.min(indexOfLast, sortedTests.length);

  /* Arrow */

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Test Master</h5>

          {/* <button
            className="btn btn-light"
            onClick={() => navigate("/add-test")}
          >
            + Add New Test
          </button> */}
          {hasPermission("Test Master", "ADD") && (
  <button
    className="btn btn-light"
    onClick={() => navigate("/add-test")}
  >
    + Add New Test
  </button>
)}
        </div>

        <div className="card-body">
          {/* Search + Entries */}

          <div className="d-flex justify-content-between mb-3">
            <div>
              Show
              <select
                className="mx-2 entries-select"
                value={entries}
                onChange={(e) => {
  setEntries(e.target.value);
  setCurrentPage(1);
}}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
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
                  <th>Action</th>

                  {/* <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th> */}

                  <th
                    onClick={() => handleSort("organization")}
                    style={{ cursor: "pointer" }}
                  >
                    Organization {getArrow("organization")}
                  </th>

                  <th
                    onClick={() => handleSort("testName")}
                    style={{ cursor: "pointer" }}
                  >
                    Test Name {getArrow("testName")}
                  </th>

                  <th
                    onClick={() => handleSort("testType")}
                    style={{ cursor: "pointer" }}
                  >
                    Test Type {getArrow("testType")}
                  </th>

                  <th
                    onClick={() => handleSort("sampleType")}
                    style={{ cursor: "pointer" }}
                  >
                    Sample Type {getArrow("sampleType")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {tests.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {/* <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/edit-test/${t.id}`)}
                      >
                        Edit
                      </button> */}
                      {hasPermission("Test Master", "EDIT") && (
  <button
    className="btn btn-info btn-sm"
    onClick={() => navigate(`/edit-test/${t.id}`)}
  >
    Edit
  </button>
)}
                    </td>

                    {/* <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={t.status}
                          readOnly
                        />
                      </div>
                    </td> */}

                    <td>{t.organizationName}</td>

                    <td>{t.testName}</td>

                    <td>{t.testType}</td>

                    <td>{t.sampleType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
               Showing page {currentPage} of {totalPages}
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
                    Prev
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

export default TestMaster;
