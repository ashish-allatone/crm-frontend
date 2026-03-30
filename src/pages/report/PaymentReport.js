import React, { useState } from "react";
import "../../styles/allPatients.css";
import * as XLSX from "xlsx";
import { invoices } from "../../data/invoices";

const PaymentReport = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [organization, setOrganization] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedOrganization, setAppliedOrganization] = useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const organizations = [
    "All",
    ...new Set(invoices.map((i) => i.organization)),
  ];

  const convertDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const filteredData = invoices.filter((i) => {
    const matchesSearch = Object.values(i)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesOrg =
      appliedOrganization === "All" || i.organization === appliedOrganization;

    let matchesDate = true;

    if (appliedFromDate || appliedToDate) {
      const invoiceDate = convertDate(i.invoiceDate);

      if (appliedFromDate) {
        matchesDate = invoiceDate >= new Date(appliedFromDate);
      }

      if (appliedToDate) {
        matchesDate = invoiceDate <= new Date(appliedToDate) && matchesDate;
      }
    }

    return matchesSearch && matchesOrg && matchesDate;
  });

  const sortedData=[...filteredData].sort((a,b)=>{

if(!sortColumn) return 0;

let valA = a[sortColumn];
let valB = b[sortColumn];

if(sortColumn === "dueAmount"){
valA = a.totalAmount - a.paidAmount;
valB = b.totalAmount - b.paidAmount;
}

if(valA < valB) return sortDirection==="asc"?-1:1;
if(valA > valB) return sortDirection==="asc"?1:-1;

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

const exportData = filteredData.map((i, index) => ({

"S.No": index + 1,
"Invoice No": i.invoiceNo,
"Invoice Date": i.invoiceDate,
"Invoice Due Date": i.dueDate,
"Organization": i.organization,
"Total Amount": i.totalAmount,
"Paid Amount": i.paidAmount,
"Due Amount": i.totalAmount - i.paidAmount,
"Payment Mode": i.paymentMode,
"Transaction ID": i.transactionId,
"Remark": i.remark,
"Status": i.status,
"Payment Date": i.paymentDate,
"Created By": i.createdBy,
"Created At": i.createdAt

}));

const worksheet = XLSX.utils.json_to_sheet(exportData);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Report");

XLSX.writeFile(workbook, "Payment_Report.xlsx");

};

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Payment Report</h5>
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
                  <option key={index}>{org}</option>
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

            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary me-2"
                onClick={() => {
                  setAppliedOrganization(organization);
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
                  setOrganization("All");
                  setFromDate("");
                  setToDate("");

                  setAppliedOrganization("All");
                  setAppliedFromDate("");
                  setAppliedToDate("");
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
                  <th>S.No</th>

                  <th onClick={() => handleSort("invoiceNo")}>
                    Invoice No {getArrow("invoiceNo")}
                  </th>

                  <th onClick={() => handleSort("invoiceDate")}>
                    Invoice Date {getArrow("invoiceDate")}
                  </th>

                  <th onClick={() => handleSort("dueDate")}>
                    Invoice Due Date {getArrow("dueDate")}
                  </th>

                  <th onClick={() => handleSort("organization")}>
                    Organization {getArrow("organization")}
                  </th>

                  <th onClick={() => handleSort("totalAmount")}>
                    Total Amount {getArrow("totalAmount")}
                  </th>

                  <th onClick={() => handleSort("paidAmount")}>
                    Paid Amount {getArrow("paidAmount")}
                  </th>

                  <th onClick={() => handleSort("dueAmount")}>
                    Due Amount {getArrow("dueAmount")}
                  </th>

                  <th>Payment Mode</th>

                  <th>Transaction ID</th>

                  <th>Remark</th>

                  <th>Status</th>

                  <th onClick={() => handleSort("paymentDate")}>
                    Payment Date {getArrow("paymentDate")}
                  </th>

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
                  currentData.map((i, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{i.invoiceNo}</td>
                      <td>{i.invoiceDate}</td>
                      <td>{i.dueDate}</td>
                      <td>{i.organization}</td>
                      <td>{i.totalAmount}</td>
                      <td>{i.paidAmount}</td>
                      <td>{i.totalAmount - i.paidAmount}</td>
                      <td>{i.paymentMode}</td>
                      <td>{i.transactionId}</td>
                      <td>{i.remark}</td>
                      <td>{i.status}</td>
                      <td>{i.paymentDate}</td>
                      <td>{i.createdBy}</td>
                      <td>{i.createdAt}</td>
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

export default PaymentReport;
