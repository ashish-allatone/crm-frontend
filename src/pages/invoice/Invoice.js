import React, { useState, useEffect } from "react";
import "../../styles/allPatients.css";
import { getInvoices } from "../../services/invoiceService";
import { useNavigate } from "react-router-dom";
import { getOrganizationsAll } from "../../services/organizationService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { hasPermission } from "../permissionUtil";
import { updateInvoice, deleteInvoice } from "../../services/invoiceService";

const Invoice = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [invoiceList, setInvoiceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const [editPaid, setEditPaid] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const pdfRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
    loadOrganizations();
  }, []);

  // const loadInvoices = async () => {
  //   try {
  //     const res = await getInvoices();

  //     console.log("🔥 INVOICES:", res.data);

  //     setInvoiceList(res.data.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const loadInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoiceList(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };
  const loadOrganizations = async () => {
    try {
      const res = await getOrganizationsAll();
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error(err);
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

  const filteredData = invoiceList.filter((p) =>
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

  const handleExportPDF = async () => {
    const input = pdfRef.current;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const fileName = `${selectedInvoice.organizationName}_Invoice_${selectedInvoice.invoiceNo}.pdf`;

    pdf.save(fileName);
  };

  const handleUpdate = async (invoiceId) => {
    try {
      await updateInvoice(invoiceId, {
        paidAmount: editPaid,
      });

      alert("Updated successfully ✅");
      loadInvoices();
      setEditPaid(null);
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("Invoice", "EDIT")) {
      alert("Access Denied ❌");
      return;
    }

    if (!window.confirm("Delete this invoice?")) return;

    try {
      await deleteInvoice(id);
      alert("Deleted successfully");
      loadInvoices();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Invoice List</h5>

          {/* <button className="btn btn-light" onClick={() => setShowModal(true)}>
            ➕ Add New Invoice
          </button> */}
          {hasPermission("Invoice", "ADD") && (
            <button
              className="btn btn-light"
              onClick={() => setShowModal(true)}
            >
              ➕ Add New Invoice
            </button>
          )}
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
                    const dueAmount = p.dueAmount;

                    return (
                      <tr key={p.invoiceId}>
                        <td>
                          <button
                            className="btn btn-info btn-sm me-1"
                            onClick={() => {
                              setSelectedInvoice(p);
                              setShowInvoiceModal(true);
                            }}
                          >
                            View
                          </button>

                          {hasPermission("Invoice", "EDIT") && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(p.invoiceId)}
                            >
                              Delete
                            </button>
                          )}
                        </td>

                        <td>{p.status}</td>

                        <td>{p.organizationName}</td>

                        <td>{p.invoiceDate}</td>

                        <td>{p.invoiceNo}</td>

                        <td>{p.dueDate}</td>

                        <td>₹ {p.totalAmount}</td>

                        {/* <td>₹ {p.paidAmount}</td> */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="number"
                              className="form-control form-control-sm paid-input"
                              disabled={!hasPermission("Invoice", "EDIT")}
                              defaultValue={p.paidAmount}
                              onChange={(e) => setEditPaid(e.target.value)}
                            />

                            {hasPermission("Invoice", "EDIT") && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleUpdate(p.invoiceId)}
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </td>

                        <td>₹ {dueAmount}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {showInvoiceModal && selectedInvoice && (
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  {/* HEADER */}
                  <div
                    className="modal-header"
                    style={{ background: "#3fb4b6", color: "white" }}
                  >
                    <h5 className="modal-title">
                      Invoice - {selectedInvoice.invoiceNo}
                    </h5>

                    <button
                      className="btn-close"
                      onClick={() => setShowInvoiceModal(false)}
                    ></button>
                  </div>

                  {/* BODY */}
                  <div className="modal-body" ref={pdfRef}>
                    <div className="mb-3">
                      <b>Organization:</b> {selectedInvoice.organizationName}
                    </div>

                    <div className="mb-3">
                      <b>Status:</b> {selectedInvoice.status}
                    </div>

                    <div className="mb-3">
                      <b>Invoice Date:</b> {selectedInvoice.invoiceDate}
                    </div>

                    <div className="mb-3">
                      <b>Due Date:</b> {selectedInvoice.dueDate}
                    </div>

                    <hr />

                    <h6 className="mb-3">Patient Invoice Details</h6>

                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Patient Name</th>
                          <th>Visit Date</th>
                          <th>Package Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedInvoice.items?.length > 0 ? (
                          selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.patientName}</td>

                              <td>{item.visitDate}</td>

                              <td>₹ {item.packageAmount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">
                              No invoice items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Total Amount</th>
                          <th>Paid Amount</th>
                          <th>Due Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>₹ {selectedInvoice.totalAmount}</td>
                          <td>₹ {selectedInvoice.paidAmount}</td>
                          <td>₹ {selectedInvoice.dueAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER */}
                  <div className="modal-footer">
                    <button
                      className="btn btn-success"
                      onClick={handleExportPDF}
                    >
                      Export as PDF
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => setShowInvoiceModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* ✅ HEADER SAME STYLE */}
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">Select Organization</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* ✅ BODY CLEAN UI */}
              <div className="modal-body">
                {organizations.length === 0 ? (
                  <div className="text-center text-muted">
                    No organization found
                  </div>
                ) : (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
                    >
                      <div>
                        <div>
                          <b>{org.organizationName}</b>
                        </div>
                        {/* <small className="text-muted">
                    Currency: {org.currencyCode}
                  </small> */}
                      </div>

                      {/* <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/add-invoice/${org.id}`)}
                      >
                        + Add Invoice
                      </button> */}
                      {hasPermission("Invoice", "ADD") && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/add-invoice/${org.id}`)}
                        >
                          + Add Invoice
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ✅ FOOTER ADD (like Insurance modal) */}
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
