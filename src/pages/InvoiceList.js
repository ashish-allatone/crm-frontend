import React, { useState } from "react";
import "../../styles/allPatients.css";
import { invoices } from "../../data/invoices";

const InvoiceList = () => {
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

  const filteredData = invoices.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

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
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Invoice List</h5>

          <button className="btn btn-light">➕ Add New Invoice</button>
        </div>

        <div className="card-body">
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
                  <th>Actions</th>

                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th>

                  <th
                    onClick={() => handleSort("organization")}
                    style={{ cursor: "pointer" }}
                  >
                    Organization {getArrow("organization")}
                  </th>

                  <th
                    onClick={() => handleSort("invoiceDate")}
                    style={{ cursor: "pointer" }}
                  >
                    Invoice Date {getArrow("invoiceDate")}
                  </th>

                  <th
                    onClick={() => handleSort("invoiceNo")}
                    style={{ cursor: "pointer" }}
                  >
                    Invoice No {getArrow("invoiceNo")}
                  </th>

                  <th
                    onClick={() => handleSort("dueDate")}
                    style={{ cursor: "pointer" }}
                  >
                    Due Date {getArrow("dueDate")}
                  </th>

                  <th
                    onClick={() => handleSort("totalAmount")}
                    style={{ cursor: "pointer" }}
                  >
                    Total Amount {getArrow("totalAmount")}
                  </th>

                  <th
                    onClick={() => handleSort("paidAmount")}
                    style={{ cursor: "pointer" }}
                  >
                    Paid Amount {getArrow("paidAmount")}
                  </th>

                  <th
                    onClick={() => handleSort("dueAmount")}
                    style={{ cursor: "pointer" }}
                  >
                    Due Amount {getArrow("dueAmount")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  currentData.map((p) => {
                    const dueAmount = p.totalAmount - p.paidAmount;

                    return (
                      <tr key={p.id}>
                        <td>
                          <button className="btn btn-info btn-sm">View</button>
                        </td>

                        <td>{p.status}</td>

                        <td>{p.organization}</td>

                        <td>{p.invoiceDate}</td>

                        <td>{p.invoiceNo}</td>

                        <td>{p.dueDate}</td>

                        <td>₹ {p.totalAmount}</td>

                        <td>₹ {p.paidAmount}</td>

                        <td>₹ {dueAmount}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

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

export default InvoiceList;
