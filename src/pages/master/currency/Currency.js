import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../../../services/currencyService";

// import { currencies } from "../../../data/currencies";

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
    const res = await getCurrencies(currentPage - 1, entries, search);

    setCurrencies(res.data.content);
    setTotalPages(res.data.totalPages);
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
  if (!form.currencyCode || !form.currencyName) {
    alert("Currency Code and Name are required");
    return;
  }

  const payload = {
    currencyCode: form.currencyCode.toUpperCase(), // 🔥 best practice
    currencyName: form.currencyName,
    rateToInr: Number(form.rateToInr),
    isActive: form.isActive,
  };

  if (editData) {
    await updateCurrency(editData.id, payload);
  } else {
    await createCurrency(payload);
  }

  setShowModal(false);
  loadCurrencies();
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
          <h5>Currency Master</h5>

          <button
            className="btn btn-light"
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
          >
            + Add New Currency
          </button>
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
                  <th>ACTIONS</th>

                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    STATUS {getArrow("status")}
                  </th>

                  <th
                    onClick={() => handleSort("currency")}
                    style={{ cursor: "pointer" }}
                  >
                    CURRENCY {getArrow("currency")}
                  </th>

                  <th
                    onClick={() => handleSort("inr")}
                    style={{ cursor: "pointer" }}
                  >
                    INR {getArrow("inr")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currencies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          setEditData(c);
                          setForm({
                            currencyCode: c.currencyCode,
                            currencyName: c.currencyName,
                            rateToInr: c.rateToInr,
                            isActive: c.isActive,
                          });
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>

                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={c.isActive}
                          readOnly
                        />
                      </div>
                    </td>

                    <td>
                      {c.currencyCode} - {c.currencyName}
                    </td>
                    <td>{c.rateToInr}</td>
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
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">
                  {editData ? "Edit Currency" : "New Currency"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
  <label className="form-label">Currency Code</label>

  <input
    className="form-control"
    name="currencyCode"
    value={form.currencyCode}
    onChange={handleChange}
    placeholder="e.g. INR, USD"
  />
</div>
                <div className="mb-3">
                  <label className="form-label">Currency Name</label>

                  <input
                    className="form-control"
                    name="currencyName"
                    value={form.currencyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">INR</label>

                  <input
                    className="form-control"
                    name="rateToInr"
                    value={form.rateToInr}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn submit-btn" onClick={handleSubmit}>
                  {editData ? "Update" : "Submit"}
                </button>

                <button
                  className="btn btn-primary btn-danger"
                  onClick={() => {
                    setShowModal(false);
                    setEditData(null);
                    setForm({
                      currencyCode: "",
                      currencyName: "",
                      rateToInr: "",
                      isActive: true,
                    });
                  }}
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

{
  /* <button
  className="btn btn-danger btn-sm ms-2"
  onClick={async () => {
    await deleteCurrency(c.id);
    loadCurrencies();
  }}
>
  Delete
</button> */
}

export default Currency;
