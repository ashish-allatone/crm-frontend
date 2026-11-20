import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/allPatients.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getInvoices, updateInvoice, deleteInvoice } from "../../services/invoiceService";
import { getOrganizationsAll } from "../../services/organizationService";
import { hasPermission } from "../permissionUtil";

const Invoice = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [invoiceList, setInvoiceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [editPaid, setEditPaid] = useState({});
  const [savingInvoice, setSavingInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pdfRef = useRef(null);
  const navigate = useNavigate();

  const canAdd = hasPermission("Invoice", "ADD");
  const canEdit = hasPermission("Invoice", "EDIT");

  useEffect(() => {
    loadInvoices();
    loadOrganizations();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoiceList(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      } else {
        console.error("Unable to load invoices:", err);
      }
    }
  };

  const loadOrganizations = async () => {
    try {
      const res = await getOrganizationsAll();
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error("Unable to load organizations:", err);
    }
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") direction = "desc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const sortedData = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = invoiceList.filter((invoice) =>
      Object.values(invoice).join(" ").toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
      if (!sortColumn) return 0;
      const valueA = a[sortColumn] ?? "";
      const valueB = b[sortColumn] ?? "";
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      const comparison = String(valueA).localeCompare(String(valueB), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [invoiceList, search, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / entries);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const indexOfLast = safePage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = sortedData.slice(indexOfFirst, indexOfLast);
  const startEntry = sortedData.length === 0 ? 0 : indexOfFirst + 1;
  const endEntry = Math.min(indexOfLast, sortedData.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const getArrow = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handlePaidChange = (invoiceId, value) => {
    setEditPaid((previous) => ({ ...previous, [invoiceId]: value }));
  };

  const handleUpdate = async (invoice) => {
    const paidAmount = editPaid[invoice.invoiceId] ?? invoice.paidAmount;
    if (paidAmount === "" || paidAmount === null || Number.isNaN(Number(paidAmount))) {
      alert("Please enter a valid paid amount");
      return;
    }

    try {
      setSavingInvoice(invoice.invoiceId);
      await updateInvoice(invoice.invoiceId, { paidAmount });
      alert("Updated successfully ✅");
      setEditPaid((previous) => {
        const next = { ...previous };
        delete next[invoice.invoiceId];
        return next;
      });
      await loadInvoices();
    } catch (err) {
      console.error("Invoice update failed:", err);
      alert("Update failed ❌");
    } finally {
      setSavingInvoice(null);
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
      await loadInvoices();
    } catch (err) {
      console.error("Invoice deletion failed:", err);
      alert("Delete failed ❌");
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current || !selectedInvoice) return;
    try {
      setExporting(true);
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      if (!canvas.width || !canvas.height) {
        throw new Error("Invoice preview could not be rendered");
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      let remainingHeight = imageHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imageHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - imageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imageHeight);
        remainingHeight -= pageHeight;
      }

      const organization = (selectedInvoice.organizationName || "Organization")
        .replace(/[\\/:*?"<>|]/g, "_");
      const invoiceNo = (selectedInvoice.invoiceNo || "Invoice")
        .replace(/[\\/:*?"<>|]/g, "_");
      pdf.save(`${organization}_Invoice_${invoiceNo}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Unable to export invoice PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const openInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const closeInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="container-fluid invoice-page">
      <style>{`
        .invoice-page {
          --invoice-navy: #0e3d66;
          --invoice-deep: #061d30;
          --invoice-text: #18243a;
          --invoice-muted: #718096;
          --invoice-border: #e4eaf1;
          color: var(--invoice-text);
          padding: 18px 18px 28px;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .invoice-page .invoice-card {
          border: 1px solid var(--invoice-border);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(20, 43, 70, .06);
          overflow: hidden;
        }
        .invoice-page .invoice-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .invoice-page .invoice-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }
        .invoice-page .invoice-heading-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255,255,255,.13);
        }
        .invoice-page .invoice-heading-icon svg { width: 22px; height: 22px; }
        .invoice-page .invoice-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 700;
          letter-spacing: .1px;
        }
        .invoice-page .invoice-subtitle {
          margin: 3px 0 0;
          color: #c7d8e8;
          font-size: 12px;
        }
        .invoice-page .invoice-add-btn,
        .invoice-page .invoice-action-btn {
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 650;
          transition: .18s ease;
          white-space: nowrap;
        }
        .invoice-page .invoice-add-btn {
          color: #123754;
          background: #fff;
        }
        .invoice-page .invoice-add-btn:hover { background: #eaf2f8; }
        .invoice-page .invoice-body { padding: 21px 23px 20px; }
        .invoice-page .invoice-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }
        .invoice-page .invoice-entries,
        .invoice-page .invoice-search {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #526176;
          font-size: 12px;
          font-weight: 550;
        }
        .invoice-page .invoice-page select,
        .invoice-page .invoice-search input,
        .invoice-page .paid-input {
          min-height: 38px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background: #fff;
          color: var(--invoice-text);
          font-size: 12.5px;
          outline: none;
          box-shadow: none;
        }
        .invoice-page .invoice-entries select {
          min-width: 68px;
          padding: 6px 25px 6px 10px;
        }
        .invoice-page .invoice-search input {
          width: 230px;
          padding: 8px 11px;
        }
        .invoice-page .invoice-page select:focus,
        .invoice-page .invoice-search input:focus,
        .invoice-page .paid-input:focus {
          border-color: #6b9abd;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .invoice-page .invoice-table-wrap {
          width: 100%;
          overflow: auto;
          max-height: 680px;
          border: 1px solid var(--invoice-border);
          border-radius: 10px;
        }
        .invoice-page .invoice-table {
          width: 100%;
          min-width: 1050px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 12.5px;
        }
        .invoice-page .invoice-table thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #526176;
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: .5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .invoice-page .invoice-table thead th.sortable { cursor: pointer; user-select: none; }
        .invoice-page .invoice-table thead th.sortable:hover { color: var(--invoice-navy); }
        .invoice-page .invoice-table tbody td {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #344256;
          vertical-align: middle;
          white-space: nowrap;
        }
        .invoice-page .invoice-table tbody tr:last-child td { border-bottom: 0; }
        .invoice-page .invoice-table tbody tr:hover { background: #f9fbfd; }
        .invoice-page .invoice-actions { display: flex; align-items: center; gap: 6px; }
        .invoice-page .btn-view {
          color: #fff;
          background: #1d638f;
        }
        .invoice-page .btn-delete {
          color: #fff;
          background: #b83e4b;
        }
        .invoice-page .btn-save {
          color: #fff;
          background: #247a58;
        }
        .invoice-page .invoice-action-btn:hover { filter: brightness(.93); }
        .invoice-page .invoice-action-btn:disabled { opacity: .55; cursor: not-allowed; }
        .invoice-page .paid-editor { display: flex; align-items: center; gap: 7px; min-width: 155px; }
        .invoice-page .paid-input { width: 95px; min-width: 0; padding: 6px 8px; }
        .invoice-page .invoice-status {
          display: inline-flex;
          align-items: center;
          border-radius: 20px;
          padding: 5px 9px;
          background: #edf3f8;
          color: #35536d;
          font-size: 11px;
          font-weight: 700;
        }
        .invoice-page .invoice-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 17px;
          color: #718096;
          font-size: 12px;
        }
        .invoice-page .invoice-pagination .pagination { gap: 4px; }
        .invoice-page .invoice-pagination .page-link {
          min-width: 32px;
          border: 1px solid #e0e7ef;
          border-radius: 7px !important;
          color: #36516a;
          background: #fff;
          font-size: 12px;
          text-align: center;
          box-shadow: none;
        }
        .invoice-page .invoice-pagination .page-item.active .page-link {
          border-color: var(--invoice-navy);
          color: #fff;
          background: var(--invoice-navy);
        }
        .invoice-page .invoice-pagination .page-item.disabled .page-link { color: #aab4c0; }
        .invoice-page .invoice-empty { padding: 34px 12px !important; color: #8a97a8 !important; text-align: center; }
        .invoice-page .invoice-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          background: rgba(8, 24, 40, .56);
        }
        .invoice-page .invoice-modal {
          width: min(760px, 100%);
          max-height: calc(100vh - 40px);
          overflow: auto;
          border: 0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 18px 55px rgba(0,0,0,.22);
        }
        .invoice-page .invoice-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px 21px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .invoice-page .invoice-modal-header h5 { margin: 0; font-size: 16px; font-weight: 700; }
        .invoice-page .invoice-modal-close {
          border: 0;
          color: #fff;
          background: transparent;
          font-size: 25px;
          line-height: 1;
          opacity: .9;
        }
        .invoice-page .invoice-modal-body { padding: 22px; }
        .invoice-page .invoice-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .invoice-page .invoice-info-item {
          padding: 12px 14px;
          border: 1px solid #e7edf3;
          border-radius: 9px;
          background: #f9fbfd;
        }
        .invoice-page .invoice-info-label {
          display: block;
          margin-bottom: 4px;
          color: #7b8999;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .45px;
          text-transform: uppercase;
        }
        .invoice-page .invoice-info-value { color: #25364b; font-size: 13px; font-weight: 650; }
        .invoice-page .invoice-section-title {
          margin: 0 0 11px;
          color: #24374d;
          font-size: 13px;
          font-weight: 750;
        }
        .invoice-page .invoice-detail-table {
          width: 100%;
          margin-bottom: 19px;
          border: 1px solid #e4eaf1;
          font-size: 12px;
        }
        .invoice-page .invoice-detail-table th {
          padding: 10px;
          background: #f3f6fa;
          color: #526176;
          font-size: 10px;
          letter-spacing: .35px;
          text-transform: uppercase;
        }
        .invoice-page .invoice-detail-table td { padding: 10px; color: #344256; }
        .invoice-page .invoice-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 14px 21px;
          border-top: 1px solid #e8edf2;
        }
        .invoice-page .invoice-org-list { display: grid; gap: 10px; }
        .invoice-page .invoice-org-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          border: 1px solid #e5ebf2;
          border-radius: 9px;
          background: #fff;
        }
        .invoice-page .invoice-org-name { color: #273a50; font-size: 13px; font-weight: 650; }
        .invoice-page .invoice-org-empty { padding: 28px 12px; color: #8290a0; text-align: center; font-size: 13px; }
        @media (max-width: 767px) {
          .invoice-page { padding: 12px 8px 22px; }
          .invoice-page .invoice-header { align-items: flex-start; padding: 15px; }
          .invoice-page .invoice-body { padding: 15px 12px; }
          .invoice-page .invoice-toolbar { align-items: flex-start; flex-direction: column; }
          .invoice-page .invoice-search { width: 100%; }
          .invoice-page .invoice-search input { flex: 1; width: 100%; }
          .invoice-page .invoice-pagination { align-items: flex-start; flex-direction: column; }
          .invoice-page .invoice-info-grid { grid-template-columns: 1fr; }
          .invoice-page .invoice-modal-backdrop { padding: 10px; }
          .invoice-page .invoice-modal-body { padding: 15px; }
        }
        @media print {
          .invoice-page .invoice-modal-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="invoice-card">
        <div className="invoice-header">
          <div className="invoice-heading">
            <div className="invoice-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
                <path d="M14 3.8V8h4M9 12h6M9 15.5h6M9 19h3" />
              </svg>
            </div>
            <div>
              <h1 className="invoice-title">Invoice List</h1>
              <p className="invoice-subtitle">Review invoices, payments and outstanding balances</p>
            </div>
          </div>
          {canAdd && (
            <button className="invoice-add-btn" onClick={() => setShowModal(true)}>
              <span aria-hidden="true">＋</span> Add New Invoice
            </button>
          )}
        </div>

        <div className="invoice-body">
          <div className="invoice-toolbar">
            <label className="invoice-entries">
              Show
              <select
                value={entries}
                onChange={(event) => {
                  setEntries(Number(event.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Entries per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              entries
            </label>
            <label className="invoice-search">
              Search
              <input
                type="search"
                placeholder="Search invoices..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
          </div>

          <div className="invoice-table-wrap">
            <table className="table invoice-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  {[
                    ["status", "Status"],
                    ["organization", "Organization"],
                    ["invoiceDate", "Invoice Date"],
                    ["invoiceNo", "Invoice No"],
                    ["dueDate", "Due Date"],
                    ["totalAmount", "Total Amount"],
                    ["paidAmount", "Paid Amount"],
                    ["dueAmount", "Due Amount"],
                  ].map(([key, label]) => (
                    <th key={key} className="sortable" onClick={() => handleSort(key)}>
                      {label} <span aria-hidden="true">{getArrow(key)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="invoice-empty">No data available in table</td>
                  </tr>
                ) : (
                  currentData.map((invoice) => (
                    <tr key={invoice.invoiceId}>
                      <td>
                        <div className="invoice-actions">
                          <button className="invoice-action-btn btn-view" onClick={() => openInvoice(invoice)}>
                            View
                          </button>
                          {canEdit && (
                            <button className="invoice-action-btn btn-delete" onClick={() => handleDelete(invoice.invoiceId)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                      <td><span className="invoice-status">{invoice.status || "-"}</span></td>
                      <td>{invoice.organizationName || "-"}</td>
                      <td>{invoice.invoiceDate || "-"}</td>
                      <td>{invoice.invoiceNo || "-"}</td>
                      <td>{invoice.dueDate || "-"}</td>
                      <td>₹ {invoice.totalAmount ?? 0}</td>
                      <td>
                        <div className="paid-editor">
                          <input
                            type="number"
                            min="0"
                            className="form-control paid-input"
                            disabled={!canEdit}
                            value={editPaid[invoice.invoiceId] ?? invoice.paidAmount ?? ""}
                            onChange={(event) => handlePaidChange(invoice.invoiceId, event.target.value)}
                            aria-label={`Paid amount for invoice ${invoice.invoiceNo || invoice.invoiceId}`}
                          />
                          {canEdit && (
                            <button
                              className="invoice-action-btn btn-save"
                              disabled={savingInvoice === invoice.invoiceId}
                              onClick={() => handleUpdate(invoice)}
                            >
                              {savingInvoice === invoice.invoiceId ? "Saving..." : "Save"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>₹ {invoice.dueAmount ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="invoice-pagination">
            <div>Showing {startEntry} to {endEntry} of {sortedData.length} entries</div>
            <nav aria-label="Invoice pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}>
                    Previous
                  </button>
                </li>
                {pageNumbers.map((number) => (
                  <li key={number} className={`page-item ${safePage === number ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                  </li>
                ))}
                <li className={`page-item ${safePage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    disabled={safePage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(safePage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {showInvoiceModal && selectedInvoice && (
        <div className="invoice-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeInvoice();
        }}>
          <section className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="invoice-preview-title">
            <div className="invoice-modal-header">
              <h5 id="invoice-preview-title">Invoice - {selectedInvoice.invoiceNo}</h5>
              <button className="invoice-modal-close" aria-label="Close invoice preview" onClick={closeInvoice}>×</button>
            </div>

            <div className="invoice-modal-body" ref={pdfRef}>
              <div className="invoice-info-grid">
                <div className="invoice-info-item">
                  <span className="invoice-info-label">Organization</span>
                  <span className="invoice-info-value">{selectedInvoice.organizationName || "-"}</span>
                </div>
                <div className="invoice-info-item">
                  <span className="invoice-info-label">Status</span>
                  <span className="invoice-info-value">{selectedInvoice.status || "-"}</span>
                </div>
                <div className="invoice-info-item">
                  <span className="invoice-info-label">Invoice Date</span>
                  <span className="invoice-info-value">{selectedInvoice.invoiceDate || "-"}</span>
                </div>
                <div className="invoice-info-item">
                  <span className="invoice-info-label">Due Date</span>
                  <span className="invoice-info-value">{selectedInvoice.dueDate || "-"}</span>
                </div>
              </div>

              <h6 className="invoice-section-title">Patient Invoice Details</h6>
              <div className="table-responsive">
                <table className="table table-bordered invoice-detail-table">
                  <thead>
                    <tr><th>Patient Name</th><th>Visit Date</th><th>Package Amount</th></tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.length > 0 ? (
                      selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.patientName || "-"}</td>
                          <td>{item.visitDate || "-"}</td>
                          <td>₹ {item.packageAmount ?? 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="text-center text-muted">No invoice items found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h6 className="invoice-section-title">Payment Summary</h6>
              <div className="table-responsive">
                <table className="table table-bordered invoice-detail-table mb-0">
                  <thead><tr><th>Total Amount</th><th>Paid Amount</th><th>Due Amount</th></tr></thead>
                  <tbody>
                    <tr>
                      <td>₹ {selectedInvoice.totalAmount ?? 0}</td>
                      <td>₹ {selectedInvoice.paidAmount ?? 0}</td>
                      <td>₹ {selectedInvoice.dueAmount ?? 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="invoice-modal-footer">
              <button className="invoice-action-btn btn-save" disabled={exporting} onClick={handleExportPDF}>
                {exporting ? "Exporting..." : "Export as PDF"}
              </button>
              <button className="invoice-action-btn btn-delete" onClick={closeInvoice}>Close</button>
            </div>
          </section>
        </div>
      )}

      {showModal && (
        <div className="invoice-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowModal(false);
        }}>
          <section className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="organization-modal-title" style={{ maxWidth: 520 }}>
            <div className="invoice-modal-header">
              <h5 id="organization-modal-title">Select Organization</h5>
              <button className="invoice-modal-close" aria-label="Close organization selection" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="invoice-modal-body">
              {organizations.length === 0 ? (
                <div className="invoice-org-empty">No organization found</div>
              ) : (
                <div className="invoice-org-list">
                  {organizations.map((org) => (
                    <div key={org.id} className="invoice-org-row">
                      <span className="invoice-org-name">{org.organizationName}</span>
                      {canAdd && (
                        <button
                          className="invoice-action-btn btn-view"
                          onClick={() => navigate(`/add-invoice/${org.id}`)}
                        >
                          + Add Invoice
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="invoice-modal-footer">
              <button className="invoice-action-btn btn-delete" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Invoice;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";
// import { getInvoices } from "../../services/invoiceService";
// import { useNavigate } from "react-router-dom";
// import { getOrganizationsAll } from "../../services/organizationService";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useRef } from "react";
// import { hasPermission } from "../permissionUtil";
// import { updateInvoice, deleteInvoice } from "../../services/invoiceService";

// const Invoice = () => {
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [invoiceList, setInvoiceList] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [organizations, setOrganizations] = useState([]);

//   const [editPaid, setEditPaid] = useState(null);

//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const pdfRef = useRef();
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadInvoices();
//     loadOrganizations();
//   }, []);

//   // const loadInvoices = async () => {
//   //   try {
//   //     const res = await getInvoices();

//   //     console.log("🔥 INVOICES:", res.data);

//   //     setInvoiceList(res.data.data || []);
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };
//   const loadInvoices = async () => {
//     try {
//       const res = await getInvoices();
//       setInvoiceList(res.data.data || []);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };
//   const loadOrganizations = async () => {
//     try {
//       const res = await getOrganizationsAll();
//       setOrganizations(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const filteredData = invoiceList.filter((p) =>
//     Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase()),
//   );

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortColumn) return 0;

//     let valA = a[sortColumn];
//     let valB = b[sortColumn];

//     if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//     if (valA > valB) return sortDirection === "asc" ? 1 : -1;

//     return 0;
//   });

//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;

//   const currentData = sortedData.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(sortedData.length / entries);

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const startEntry = sortedData.length === 0 ? 0 : indexOfFirst + 1;
//   const endEntry = Math.min(indexOfLast, sortedData.length);

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   const handleExportPDF = async () => {
//     const input = pdfRef.current;

//     const canvas = await html2canvas(input);
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgWidth = 210;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//     const fileName = `${selectedInvoice.organizationName}_Invoice_${selectedInvoice.invoiceNo}.pdf`;

//     pdf.save(fileName);
//   };

//   const handleUpdate = async (invoiceId) => {
//     try {
//       await updateInvoice(invoiceId, {
//         paidAmount: editPaid,
//       });

//       alert("Updated successfully ✅");
//       loadInvoices();
//       setEditPaid(null);
//     } catch (err) {
//       alert("Update failed ❌");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!hasPermission("Invoice", "EDIT")) {
//       alert("Access Denied ❌");
//       return;
//     }

//     if (!window.confirm("Delete this invoice?")) return;

//     try {
//       await deleteInvoice(id);
//       alert("Deleted successfully");
//       loadInvoices();
//     } catch (err) {
//       alert("Delete failed ❌");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Invoice List</h5>

//           {/* <button className="btn btn-light" onClick={() => setShowModal(true)}>
//             ➕ Add New Invoice
//           </button> */}
//           {hasPermission("Invoice", "ADD") && (
//             <button
//               className="btn btn-light"
//               onClick={() => setShowModal(true)}
//             >
//               ➕ Add New Invoice
//             </button>
//           )}
//         </div>

//         <div className="card-body">
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               Show
//               <select
//                 className="mx-2 entries-select"
//                 value={entries}
//                 onChange={(e) => {
//                   setEntries(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//               </select>
//               entries
//             </div>

//             <div>
//               Search :
//               <input
//                 type="text"
//                 className="ms-2 search-box"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <div
//             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th>Actions</th>

//                   <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Organization {getArrow("organization")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("invoiceDate")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Invoice Date {getArrow("invoiceDate")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("invoiceNo")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Invoice No {getArrow("invoiceNo")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("dueDate")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Due Date {getArrow("dueDate")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("totalAmount")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Total Amount {getArrow("totalAmount")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("paidAmount")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Paid Amount {getArrow("paidAmount")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("dueAmount")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Due Amount {getArrow("dueAmount")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No data available in table
//                     </td>
//                   </tr>
//                 ) : (
//                   currentData.map((p) => {
//                     const dueAmount = p.dueAmount;

//                     return (
//                       <tr key={p.invoiceId}>
//                         <td>
//                           <button
//                             className="btn btn-info btn-sm me-1"
//                             onClick={() => {
//                               setSelectedInvoice(p);
//                               setShowInvoiceModal(true);
//                             }}
//                           >
//                             View
//                           </button>

//                           {hasPermission("Invoice", "EDIT") && (
//                             <button
//                               className="btn btn-danger btn-sm"
//                               onClick={() => handleDelete(p.invoiceId)}
//                             >
//                               Delete
//                             </button>
//                           )}
//                         </td>

//                         <td>{p.status}</td>

//                         <td>{p.organizationName}</td>

//                         <td>{p.invoiceDate}</td>

//                         <td>{p.invoiceNo}</td>

//                         <td>{p.dueDate}</td>

//                         <td>₹ {p.totalAmount}</td>

//                         {/* <td>₹ {p.paidAmount}</td> */}
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             <input
//                               type="number"
//                               className="form-control form-control-sm paid-input"
//                               disabled={!hasPermission("Invoice", "EDIT")}
//                               defaultValue={p.paidAmount}
//                               onChange={(e) => setEditPaid(e.target.value)}
//                             />

//                             {hasPermission("Invoice", "EDIT") && (
//                               <button
//                                 className="btn btn-success btn-sm"
//                                 onClick={() => handleUpdate(p.invoiceId)}
//                               >
//                                 Save
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         <td>₹ {dueAmount}</td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {showInvoiceModal && selectedInvoice && (
//             <div className="modal fade show d-block">
//               <div className="modal-dialog modal-lg">
//                 <div className="modal-content">
//                   {/* HEADER */}
//                   <div
//                     className="modal-header"
//                     style={{ background: "#3fb4b6", color: "white" }}
//                   >
//                     <h5 className="modal-title">
//                       Invoice - {selectedInvoice.invoiceNo}
//                     </h5>

//                     <button
//                       className="btn-close"
//                       onClick={() => setShowInvoiceModal(false)}
//                     ></button>
//                   </div>

//                   {/* BODY */}
//                   <div className="modal-body" ref={pdfRef}>
//                     <div className="mb-3">
//                       <b>Organization:</b> {selectedInvoice.organizationName}
//                     </div>

//                     <div className="mb-3">
//                       <b>Status:</b> {selectedInvoice.status}
//                     </div>

//                     <div className="mb-3">
//                       <b>Invoice Date:</b> {selectedInvoice.invoiceDate}
//                     </div>

//                     <div className="mb-3">
//                       <b>Due Date:</b> {selectedInvoice.dueDate}
//                     </div>

//                     <hr />

//                     <h6 className="mb-3">Patient Invoice Details</h6>

//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th>Patient Name</th>
//                           <th>Visit Date</th>
//                           <th>Package Amount</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {selectedInvoice.items?.length > 0 ? (
//                           selectedInvoice.items.map((item, index) => (
//                             <tr key={index}>
//                               <td>{item.patientName}</td>

//                               <td>{item.visitDate}</td>

//                               <td>₹ {item.packageAmount}</td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="3" className="text-center">
//                               No invoice items found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>

//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th>Total Amount</th>
//                           <th>Paid Amount</th>
//                           <th>Due Amount</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         <tr>
//                           <td>₹ {selectedInvoice.totalAmount}</td>
//                           <td>₹ {selectedInvoice.paidAmount}</td>
//                           <td>₹ {selectedInvoice.dueAmount}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* FOOTER */}
//                   <div className="modal-footer">
//                     <button
//                       className="btn btn-success"
//                       onClick={handleExportPDF}
//                     >
//                       Export as PDF
//                     </button>

//                     <button
//                       className="btn btn-danger"
//                       onClick={() => setShowInvoiceModal(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing {startEntry} to {endEntry} of {sortedData.length} entries
//             </div>

//             <nav>
//               <ul className="pagination mb-0">
//                 <li
//                   className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage - 1)}
//                   >
//                     Previous
//                   </button>
//                 </li>

//                 {pageNumbers.map((num) => (
//                   <li
//                     key={num}
//                     className={`page-item ${currentPage === num ? "active" : ""}`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(num)}
//                     >
//                       {num}
//                     </button>
//                   </li>
//                 ))}

//                 <li
//                   className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//       {showModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               {/* ✅ HEADER SAME STYLE */}
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Select Organization</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               {/* ✅ BODY CLEAN UI */}
//               <div className="modal-body">
//                 {organizations.length === 0 ? (
//                   <div className="text-center text-muted">
//                     No organization found
//                   </div>
//                 ) : (
//                   organizations.map((org) => (
//                     <div
//                       key={org.id}
//                       className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
//                     >
//                       <div>
//                         <div>
//                           <b>{org.organizationName}</b>
//                         </div>
//                         {/* <small className="text-muted">
//                     Currency: {org.currencyCode}
//                   </small> */}
//                       </div>

//                       {/* <button
//                         className="btn btn-primary btn-sm"
//                         onClick={() => navigate(`/add-invoice/${org.id}`)}
//                       >
//                         + Add Invoice
//                       </button> */}
//                       {hasPermission("Invoice", "ADD") && (
//                         <button
//                           className="btn btn-primary btn-sm"
//                           onClick={() => navigate(`/add-invoice/${org.id}`)}
//                         >
//                           + Add Invoice
//                         </button>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* ✅ FOOTER ADD (like Insurance modal) */}
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Invoice;
