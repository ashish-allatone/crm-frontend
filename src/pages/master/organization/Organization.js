import React, { useState, useEffect} from "react";
import "../../../styles/allPatients.css";
import { useNavigate } from "react-router-dom";
// import { organizations } from "../../../data/organizations";
import { getOrganizations, deleteOrganization } from "../../../services/organizationService";

const Organization = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [organizations, setOrganizations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  /* Sorting */
  const loadOrganizations = async () => {
  const res = await getOrganizations(currentPage - 1, entries, search);

  setOrganizations(res.data.content);
  setTotalPages(res.data.totalPages);
};

useEffect(() => {
  loadOrganizations();
}, [currentPage, entries, search]);

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  /* Search */

  // const filteredData = organizations.filter((o) =>
  //   Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase()),
  // );

  // /* Sorted */

  // const sortedData = [...filteredData].sort((a, b) => {
  //   if (!sortColumn) return 0;

  //   let valA = a[sortColumn];
  //   let valB = b[sortColumn];

  //   if (valA < valB) return sortDirection === "asc" ? -1 : 1;
  //   if (valA > valB) return sortDirection === "asc" ? 1 : -1;

  //   return 0;
  // });
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

const startEntry = organizations.length === 0 ? 0 : (currentPage - 1) * entries + 1;

const endEntry = Math.min(currentPage * entries, totalPages * entries);

  /* Pagination */

  // const indexOfLast = currentPage * entries;
  // const indexOfFirst = indexOfLast - entries;

  // const currentData = sortedData.slice(indexOfFirst, indexOfLast);

  // const totalPages = Math.ceil(sortedData.length / entries);

  // const pageNumbers = [];

  // for (let i = 1; i <= totalPages; i++) {
  //   pageNumbers.push(i);
  // }

  // const startEntry = sortedData.length === 0 ? 0 : indexOfFirst + 1;
  // const endEntry = Math.min(indexOfLast, sortedData.length);

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
          style={{
            background: "linear-gradient(90deg,#6a5acd,#7b68ee)",
            color: "white",
          }}
        >
          <h5>Organization Master</h5>

          <button
            className="btn btn-light"
            onClick={() => navigate("/add-organization")}
          >
            Add New Organization
          </button>
        </div>

        <div className="card-body">
          {/* Show entries + search */}

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
                onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
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
                  <th>Actions</th>

                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Name {getArrow("name")}
                  </th>

                  <th
                    onClick={() => handleSort("contact")}
                    style={{ cursor: "pointer" }}
                  >
                    Contact {getArrow("contact")}
                  </th>

                  <th
                    onClick={() => handleSort("creditLimit")}
                    style={{ cursor: "pointer" }}
                  >
                    Credit Limit {getArrow("creditLimit")}
                  </th>

                  <th
                    onClick={() => handleSort("code")}
                    style={{ cursor: "pointer" }}
                  >
                    Code {getArrow("code")}
                  </th>

                  <th
                    onClick={() => handleSort("email")}
                    style={{ cursor: "pointer" }}
                  >
                    Email {getArrow("email")}
                  </th>

                  <th
                    onClick={() => handleSort("address")}
                    style={{ cursor: "pointer" }}
                  >
                    Address {getArrow("address")}
                  </th>

                  <th
                    onClick={() => handleSort("city")}
                    style={{ cursor: "pointer" }}
                  >
                    City {getArrow("city")}
                  </th>

                  <th
                    onClick={() => handleSort("state")}
                    style={{ cursor: "pointer" }}
                  >
                    State {getArrow("state")}
                  </th>

                  <th
                    onClick={() => handleSort("country")}
                    style={{ cursor: "pointer" }}
                  >
                    Country {getArrow("country")}
                  </th>

                  <th
                    onClick={() => handleSort("currency")}
                    style={{ cursor: "pointer" }}
                  >
                    Currency {getArrow("currency")}
                  </th>

                  <th
                    onClick={() => handleSort("paymentMode")}
                    style={{ cursor: "pointer" }}
                  >
                    Payment Mode {getArrow("paymentMode")}
                  </th>

                  <th
                    onClick={() => handleSort("source")}
                    style={{ cursor: "pointer" }}
                  >
                    Source {getArrow("source")}
                  </th>

                  <th
                    onClick={() => handleSort("marketingPerson")}
                    style={{ cursor: "pointer" }}
                  >
                    Marketing Person {getArrow("marketingPerson")}
                  </th>

                  <th
                    onClick={() => handleSort("tat")}
                    style={{ cursor: "pointer" }}
                  >
                    Turn Around Time {getArrow("tat")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* {currentData.map((o) => ( */}
                {organizations.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/edit-organization/${o.id}`)}
                      >
                        Edit
                      </button>
                    </td>

                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={true}
                          readOnly
                        />
                      </div>
                    </td>

                    <td>{o.organizationName}</td>
                    <td>{o.contact}</td>
                    <td>{o.creditLimit}</td>
                    <td>{o.code}</td>
                    <td>{o.email}</td>
                    <td>{o.address}</td>
                    <td>{o.city}</td>
                    <td>{o.state}</td>
                    <td>{o.country}</td>
                    <td>{o.currency}</td>
                    <td>{o.paymentMode}</td>
                    <td>{o.source}</td>
                    <td>{o.marketingPerson}</td>
                    <td>{o.turnAroundTime}</td>
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

export default Organization;
