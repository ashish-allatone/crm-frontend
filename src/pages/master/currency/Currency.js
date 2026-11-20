import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
} from "../../../services/currencyService";
import { hasPermission } from "../../permissionUtil";

const Currency = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    currencyCode: "",
    currencyName: "",
    rateToInr: "",
    isActive: true,
  });

  const loadCurrencies = async () => {
    try {
      const res = await getCurrencies(currentPage - 1, entries, search);
      setCurrencies(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, [currentPage, entries, search]);

  /* Sorting */
  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  /* Arrow */
  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const handleSubmit = async () => {
    try {
      if (!form.currencyCode || !form.currencyName) {
        alert("Currency Code and Name are required");
        return;
      }

      const payload = {
        currencyCode: form.currencyCode.toUpperCase(),
        currencyName: form.currencyName,
        rateToInr: Number(form.rateToInr),
        isActive: form.isActive,
      };

      let res;

      if (editData) {
        res = await updateCurrency(editData.id, payload);
      } else {
        res = await createCurrency(payload);
      }

      if (res.data.success) {
        alert(res.data.message);
        setShowModal(false);
        loadCurrencies();
      } else {
        alert(res.data.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Operation failed ❌"
      );
    }
  };

  const openAddModal = () => {
    setEditData(null);
    setForm({
      currencyCode: "",
      currencyName: "",
      rateToInr: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (currency) => {
    setEditData(currency);
    setForm({
      currencyCode: currency.currencyCode,
      currencyName: currency.currencyName,
      rateToInr: currency.rateToInr,
      isActive: currency.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
    setForm({
      currencyCode: "",
      currencyName: "",
      rateToInr: "",
      isActive: true,
    });
  };

  return (
    <div className="container-fluid currency-page">
      <style>{`

       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .currency-page {
          --currency-navy: #142b55;
          --currency-blue: #244b87;
          --currency-light: #eef3fb;
          --currency-border: #dce5f1;
          --currency-text: #26364d;
          --currency-muted: #718096;
          width: 100%;
          padding: 24px;
          font-family: "Inter", sans-serif;
          color: var(--currency-text);
        }

        .currency-page .currency-card {
          width: 100%;
          border: 1px solid var(--currency-border);
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 5px 22px rgba(20, 43, 85, 0.07);
        }

        .currency-page .currency-header {
          min-height: 68px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }

        .currency-page .currency-heading {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .currency-page .currency-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.currency-page .currency-header-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 11px;
  background: rgba(255,255,255,.10);
  color: #fff;
}

.currency-page .currency-header-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

        .currency-page .currency-subtitle {
          margin: 4px 0 0;
          color: rgba(255,255,255,.78);
          font-size: 12px;
        }

        .currency-page .currency-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid rgba(255,255,255,.7);
          border-radius: 8px;
          padding: 9px 15px;
          background: #fff;
          color: var(--currency-navy);
          font-size: 13px;
          font-weight: 700;
          transition: .2s ease;
        }

        .currency-page .currency-add-btn:hover {
          background: #eaf1fb;
          transform: translateY(-1px);
        }

        .currency-page .currency-body {
          padding: 20px 22px 22px;
        }

        .currency-page .currency-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 17px;
        }

        .currency-page .currency-entries,
        .currency-page .currency-search {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #52647c;
          font-size: 13px;
          font-weight: 500;
        }

        .currency-page .currency-entries select,
        .currency-page .currency-search input {
          min-height: 37px;
          border: 1px solid #d5dfec;
          border-radius: 7px;
          outline: none;
          background: #fff;
          color: #26364d;
          font-size: 13px;
          transition: border-color .2s, box-shadow .2s;
        }

        .currency-page .currency-entries select {
          min-width: 75px;
          padding: 5px 27px 5px 10px;
        }

        .currency-page .currency-search input {
          width: 230px;
          padding: 7px 11px;
        }

        .currency-page .currency-entries select:focus,
        .currency-page .currency-search input:focus,
        .currency-page .currency-modal input:focus {
          border-color: #4778b8;
          box-shadow: 0 0 0 3px rgba(71,120,184,.13);
        }

        .currency-page .currency-table-wrap {
          width: 100%;
          max-height: 700px;
          overflow: auto;
          border: 1px solid var(--currency-border);
          border-radius: 9px;
        }

        .currency-page .currency-table {
          width: 100%;
          min-width: 560px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 13px;
        }

        .currency-page .currency-table thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          padding: 13px 15px;
          border: 0;
          border-bottom: 1px solid #d9e3f0;
          background: #edf2f9;
          color: #233e66;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .55px;
          white-space: nowrap;
        }

        .currency-page .currency-table tbody td {
          padding: 13px 15px;
          border: 0;
          border-bottom: 1px solid #edf1f6;
          color: #394b62;
          vertical-align: middle;
        }

        .currency-page .currency-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .currency-page .currency-table tbody tr:hover {
          background: #f7faff;
        }

        .currency-page .currency-code {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #263e63;
          font-weight: 650;
        }

        .currency-page .currency-code-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 35px;
          height: 25px;
          padding: 0 6px;
          border-radius: 5px;
          background: #e9f0fa;
          color: #244b87;
          font-size: 11px;
          font-weight: 800;
        }

        .currency-page .currency-rate {
          color: #263e63;
          font-weight: 650;
          font-variant-numeric: tabular-nums;
        }

        .currency-page .currency-edit-btn {
          min-width: 66px;
          border: 1px solid #c8d9ef;
          border-radius: 6px;
          padding: 6px 11px;
          background: #edf4fd;
          color: #24538e;
          font-size: 12px;
          font-weight: 700;
          transition: .2s ease;
        }

        .currency-page .currency-edit-btn:hover {
          border-color: #24538e;
          background: #24538e;
          color: #fff;
        }

        .currency-page .currency-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 17px;
        }

        .currency-page .currency-page-info {
          color: var(--currency-muted);
          font-size: 12px;
        }

        .currency-page .currency-pagination {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin: 0;
        }

        .currency-page .currency-pagination .page-link {
          min-width: 34px;
          min-height: 33px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d9e3f0;
          border-radius: 6px;
          padding: 5px 10px;
          background: #fff;
          color: #365477;
          font-size: 12px;
          box-shadow: none;
        }

        .currency-page .currency-pagination .page-item.active .page-link {
          border-color: var(--currency-navy);
          background: var(--currency-navy);
          color: #fff;
        }

        .currency-page .currency-pagination .page-item.disabled .page-link {
          background: #f5f7fa;
          color: #a2adbb;
          pointer-events: none;
        }

        .currency-page .currency-empty {
          padding: 30px 12px !important;
          color: #8290a2 !important;
          text-align: center;
        }

        .currency-page .currency-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1040;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
          background: rgba(12, 27, 49, .58);
          backdrop-filter: blur(3px);
        }

        .currency-page .currency-modal {
          width: 100%;
          max-width: 520px;
          border: 0;
          border-radius: 13px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 18px 55px rgba(0,0,0,.22);
        }

        .currency-page .currency-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px 21px;
          background: linear-gradient(110deg, #142b55, #2e5c98);
          color: #fff;
        }

        .currency-page .currency-modal-title {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
        }

        .currency-page .currency-modal-close {
          border: 0;
          padding: 2px 5px;
          background: transparent;
          color: #fff;
          font-size: 24px;
          line-height: 1;
          opacity: .9;
        }

        .currency-page .currency-modal-body {
          padding: 22px;
        }

        .currency-page .currency-field {
          margin-bottom: 17px;
        }

        .currency-page .currency-field:last-child {
          margin-bottom: 0;
        }

        .currency-page .currency-field label {
          display: block;
          margin-bottom: 7px;
          color: #344a67;
          font-size: 12px;
          font-weight: 700;
        }

        .currency-page .currency-modal input {
          width: 100%;
          min-height: 41px;
          border: 1px solid #d5dfec;
          border-radius: 7px;
          padding: 8px 11px;
          outline: none;
          color: #293c55;
          font-size: 13px;
        }

        .currency-page .currency-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          padding: 14px 21px;
          border-top: 1px solid #edf1f6;
          background: #fbfcfe;
        }

        .currency-page .currency-save-btn,
        .currency-page .currency-cancel-btn {
          min-width: 90px;
          border-radius: 7px;
          padding: 8px 15px;
          font-size: 12px;
          font-weight: 700;
        }

        .currency-page .currency-save-btn {
          border: 1px solid var(--currency-navy);
          background: var(--currency-navy);
          color: #fff;
        }

        .currency-page .currency-save-btn:hover {
          background: #244b87;
        }

        .currency-page .currency-cancel-btn {
          border: 1px solid #d5dfec;
          background: #fff;
          color: #52647c;
        }

        .currency-page .currency-cancel-btn:hover {
          background: #f0f3f8;
        }

        @media (max-width: 640px) {
          .currency-page .currency-body {
            padding: 15px 12px 17px;
          }

          .currency-page .currency-header {
            padding: 15px;
          }

          .currency-page .currency-toolbar {
            align-items: stretch;
          }

          .currency-page .currency-search {
            justify-content: space-between;
            width: 100%;
          }

          .currency-page .currency-search input {
            width: min(65%, 260px);
          }

          .currency-page .currency-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .currency-page .currency-pagination {
            max-width: 100%;
          }

          .currency-page .currency-modal-footer {
            padding: 12px 15px;
          }
        }
      `}</style>

      <div className="currency-card">
        <div className="currency-header">
          <div className="currency-header-left">
  <div className="currency-header-icon">
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5c-.7-.7-1.7-1-3-1-1.5 0-2.5.8-2.5 1.9 0 3 5 1.2 5 4.1 0 1.2-1.1 2-2.8 2-1.3 0-2.4-.4-3.2-1.2" />
      <path d="M12 5.5v13" />
    </svg>
  </div>

  <div>
    <h5 className="currency-heading">Currency Master</h5>
    <p className="currency-subtitle">
      Manage currency codes, names and INR conversion rates
    </p>
  </div>
</div>

          {hasPermission("Currency", "ADD") && (
            <button
              type="button"
              className="currency-add-btn"
              onClick={openAddModal}
            >
              <span aria-hidden="true">＋</span> Add New Currency
            </button>
          )}
        </div>

        <div className="currency-body">
          <div className="currency-toolbar">
            <div className="currency-entries">
              <span>Show</span>
              <select
                value={entries}
                aria-label="Number of entries"
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <label className="currency-search">
              <span>Search</span>
              <input
                type="text"
                value={search}
                placeholder="Search currencies..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>
          </div>

          <div className="currency-table-wrap">
            <table className="table currency-table">
              <thead>
                <tr>
                  <th scope="col">ACTIONS</th>
                  <th
                    scope="col"
                    onClick={() => handleSort("currency")}
                    style={{ cursor: "pointer" }}
                  >
                    CURRENCY <span>{getArrow("currency")}</span>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("inr")}
                    style={{ cursor: "pointer" }}
                  >
                    INR <span>{getArrow("inr")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {currencies.length > 0 ? (
                  currencies.map((c) => (
                    <tr key={c.id}>
                      <td>
                        {hasPermission("Currency", "EDIT") && (
                          <button
                            type="button"
                            className="currency-edit-btn"
                            onClick={() => openEditModal(c)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td>
                        <span className="currency-code">
                          <span className="currency-code-mark">
                            {c.currencyCode}
                          </span>
                          <span>{c.currencyName}</span>
                        </span>
                      </td>
                      <td>
                        <span className="currency-rate">{c.rateToInr}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="currency-empty">
                      No currencies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="currency-footer">
            <div className="currency-page-info">
              Showing page {currentPage} of {totalPages}
            </div>

            <nav aria-label="Currency table pagination">
              <ul className="pagination currency-pagination">
                <li
                  className={`page-item ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li
                    key={num}
                    className={`page-item ${
                      currentPage === num ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
        <div
          className="currency-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="currency-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-modal-title"
          >
            <div className="currency-modal-header">
              <h5 className="currency-modal-title" id="currency-modal-title">
                {editData ? "Edit Currency" : "New Currency"}
              </h5>
              <button
                type="button"
                className="currency-modal-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="currency-modal-body">
              <div className="currency-field">
                <label htmlFor="currencyCode">Currency Code</label>
                <input
                  id="currencyCode"
                  name="currencyCode"
                  value={form.currencyCode}
                  onChange={handleChange}
                  placeholder="e.g. INR, USD"
                />
              </div>

              <div className="currency-field">
                <label htmlFor="currencyName">Currency Name</label>
                <input
                  id="currencyName"
                  name="currencyName"
                  value={form.currencyName}
                  onChange={handleChange}
                  placeholder="Enter currency name"
                />
              </div>

              <div className="currency-field">
                <label htmlFor="rateToInr">INR Conversion Rate</label>
                <input
                  id="rateToInr"
                  name="rateToInr"
                  value={form.rateToInr}
                  onChange={handleChange}
                  placeholder="Enter rate to INR"
                />
              </div>
            </div>

            <div className="currency-modal-footer">
              <button
                type="button"
                className="currency-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="currency-save-btn"
                onClick={handleSubmit}
              >
                {editData ? "Update Currency" : "Save Currency"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currency;

// import React, { useState, useEffect } from "react";
// import "../../../styles/allPatients.css";
// import {
//   getCurrencies,
//   createCurrency,
//   updateCurrency,
//   deleteCurrency,
// } from "../../../services/currencyService";


// import { hasPermission } from "../../permissionUtil";

// const Currency = () => {
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [currencies, setCurrencies] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   const [form, setForm] = useState({
//     currencyCode: "",
//     currencyName: "",
//     rateToInr: "",
//     isActive: true,
//   });

//   // const loadCurrencies = async () => {
//   //   const res = await getCurrencies(currentPage - 1, entries, search);

//   //   setCurrencies(res.data.content);
//   //   setTotalPages(res.data.totalPages);
//   // };
//   const loadCurrencies = async () => {
//   try {
//     const res = await getCurrencies(currentPage - 1, entries, search);

//     setCurrencies(res.data.content);
//     setTotalPages(res.data.totalPages);
//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };

//   useEffect(() => {
//     loadCurrencies();
//   }, [currentPage, entries, search]);

//   /* Sorting */

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   /* Arrow */

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

// //  const handleSubmit = async () => {
// //   if (!form.currencyCode || !form.currencyName) {
// //     alert("Currency Code and Name are required");
// //     return;
// //   }

// //   const payload = {
// //     currencyCode: form.currencyCode.toUpperCase(), // 🔥 best practice
// //     currencyName: form.currencyName,
// //     rateToInr: Number(form.rateToInr),
// //     isActive: form.isActive,
// //   };

// //   if (editData) {
// //     await updateCurrency(editData.id, payload);
// //   } else {
// //     await createCurrency(payload);
// //   }

// //   setShowModal(false);
// //   loadCurrencies();
// // };
// const handleSubmit = async () => {
//   try {
//     if (!form.currencyCode || !form.currencyName) {
//       alert("Currency Code and Name are required");
//       return;
//     }

//     const payload = {
//       currencyCode: form.currencyCode.toUpperCase(),
//       currencyName: form.currencyName,
//       rateToInr: Number(form.rateToInr),
//       isActive: form.isActive,
//     };

//     let res;

//     if (editData) {
//       res = await updateCurrency(editData.id, payload);
//     } else {
//       res = await createCurrency(payload);
//     }

//     // ✅ Backend message show
//     if (res.data.success) {
//       alert(res.data.message); // "Currency created successfully" / "updated successfully"

//       setShowModal(false);
//       loadCurrencies();
//     } else {
//       alert(res.data.message || "Something went wrong ❌");
//     }

//   } catch (error) {
//     console.error(error);

//     // ❌ Backend error (important for duplicate case)
//     alert(
//       error.response?.data?.message ||
//       error.message ||
//       "Operation failed ❌"
//     );
//   }
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{
//             background: "linear-gradient(90deg,#6a5acd,#7b68ee)",
//             color: "white",
//           }}
//         >
//           <h5>Currency Master</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => {
//               setEditData(null);
//               setShowModal(true);
//             }}
//           >
//             + Add New Currency
//           </button> */}
//           {hasPermission("Currency", "ADD") && (
//   <button
//     className="btn btn-light"
//     onClick={() => {
//       setEditData(null);
//       setShowModal(true);
//     }}
//   >
//     ➕ Add New Currency
//   </button>
// )}
//         </div>

//         <div className="card-body">
//           {/* Search + Entries */}

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
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               entries
//             </div>

//             <div>
//               Search :
//               <input
//                 type="text"
//                 className="ms-2 search-box"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
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
//                   <th>ACTIONS</th>

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     STATUS {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("currency")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     CURRENCY {getArrow("currency")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("inr")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     INR {getArrow("inr")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currencies.map((c) => (
//                   <tr key={c.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => {
//                           setEditData(c);
//                           setForm({
//                             currencyCode: c.currencyCode,
//                             currencyName: c.currencyName,
//                             rateToInr: c.rateToInr,
//                             isActive: c.isActive,
//                           });
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Currency", "EDIT") && (
//   <button
//     className="btn btn-info btn-sm"
//     onClick={() => {
//       setEditData(c);
//       setForm({
//         currencyCode: c.currencyCode,
//         currencyName: c.currencyName,
//         rateToInr: c.rateToInr,
//         isActive: c.isActive,
//       });
//       setShowModal(true);
//     }}
//   >
//     Edit
//   </button>
// )}
//                     </td>

//                     {/* <td>
//                       <div className="form-check form-switch">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           checked={c.isActive}
//                           readOnly
//                         />
//                       </div>
//                     </td> */}

//                     <td>
//                       {c.currencyCode} - {c.currencyName}
//                     </td>
//                     <td>{c.rateToInr}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing page {currentPage} of {totalPages}
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
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">
//                   {editData ? "Edit Currency" : "New Currency"}
//                 </h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="mb-3">
//   <label className="form-label">Currency Code</label>

//   <input
//     className="form-control"
//     name="currencyCode"
//     value={form.currencyCode}
//     onChange={handleChange}
//     placeholder="e.g. INR, USD"
//   />
// </div>
//                 <div className="mb-3">
//                   <label className="form-label">Currency Name</label>

//                   <input
//                     className="form-control"
//                     name="currencyName"
//                     value={form.currencyName}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">INR</label>

//                   <input
//                     className="form-control"
//                     name="rateToInr"
//                     value={form.rateToInr}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button className="btn submit-btn" onClick={handleSubmit}>
//                   {editData ? "Update" : "Submit"}
//                 </button>

//                 <button
//                   className="btn btn-primary btn-danger"
//                   onClick={() => {
//                     setShowModal(false);
//                     setEditData(null);
//                     setForm({
//                       currencyCode: "",
//                       currencyName: "",
//                       rateToInr: "",
//                       isActive: true,
//                     });
//                   }}
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

// {
//   /* <button
//   className="btn btn-danger btn-sm ms-2"
//   onClick={async () => {
//     await deleteCurrency(c.id);
//     loadCurrencies();
//   }}
// >
//   Delete
// </button> */
// }

// export default Currency;
