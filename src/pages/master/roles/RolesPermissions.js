import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const RolesPermissions = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRoles = async () => {
    try {
      const res = await api.get("/users/roles");
      setRoles(res.data.data || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      } else {
        alert("Failed to load roles");
      }
    }
  };

  /* Sorting */
  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  /* Search */
  const filteredRoles = roles.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* Sorted */
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (!sortColumn) return 0;

    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;

    return 0;
  });

  /* Pagination */
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentRoles = sortedRoles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedRoles.length / entries);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startEntry = sortedRoles.length === 0 ? 0 : indexOfFirst + 1;
  const endEntry = Math.min(indexOfLast, sortedRoles.length);

  const getArrow = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const hasPermission = (module, action) => {
    const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
    console.log("Perms is" + perms);

    const p = perms.find((x) => x.module === module);

    if (!p) return false;
    if (action === "VIEW") return p.canView;
    if (action === "ADD") return p.canAdd;
    if (action === "EDIT") return p.canEdit;

    return false;
  };

  const handleSaveRole = async () => {
    if (editData && !hasPermission("Roles", "EDIT")) {
      alert("Access Denied ❌");
      return;
    }

    if (!editData && !hasPermission("Roles", "ADD")) {
      alert("Access Denied ❌");
      return;
    }

    try {
      if (editData) {
        await api.put(`/users/roles/${editData.id}`, {
          name: roleName,
        });

        alert("Role updated successfully");
      } else {
        await api.post("/users/roles", {
          name: roleName,
        });

        alert("Role created successfully");
      }

      setShowModal(false);
      loadRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving role");
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .rp-page {
      width: 100%;
      padding: 22px 20px;
      color: #18243a;
      font-family: 'Inter', sans-serif;
    }
    .rp-card {
      width: 100%;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, .06);
    }
    .rp-header {
      min-height: 76px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .rp-heading-wrap { display: flex; align-items: center; gap: 13px; min-width: 0; }
    .rp-heading-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .rp-heading-icon svg { width: 22px; height: 22px; }
    .rp-title { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: .1px; }
    .rp-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .rp-add-btn {
      min-height: 39px;
      padding: 8px 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 0;
      border-radius: 8px;
      background: #fff;
      color: #183554;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: .2s ease;
    }
    .rp-add-btn:hover { background: #eaf1f8; transform: translateY(-1px); }
    .rp-add-btn svg { width: 16px; height: 16px; }
    .rp-body { padding: 22px 24px 18px; }
    .rp-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 17px;
      flex-wrap: wrap;
    }
    .rp-entries, .rp-search-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #66758a;
      font-size: 13px;
    }
    .rp-select {
      min-width: 72px;
      height: 37px;
      padding: 0 28px 0 11px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      background-color: #fff;
      color: #26374d;
      font: inherit;
      outline: none;
    }
    .rp-select:focus, .rp-search-input:focus, .rp-modal-input:focus {
      border-color: #52769d;
      box-shadow: 0 0 0 3px rgba(58, 94, 132, .11);
    }
    .rp-search-box { position: relative; }
    .rp-search-box svg {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: #8795a8;
      pointer-events: none;
    }
    .rp-search-input {
      width: 245px;
      height: 37px;
      padding: 0 12px 0 35px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      color: #26374d;
      font: inherit;
      font-size: 13px;
      outline: none;
      transition: .2s ease;
    }
    .rp-table-wrap {
      width: 100%;
      overflow: auto;
      max-height: 650px;
      border: 1px solid #e7ebf1;
      border-radius: 10px;
    }
    .rp-table {
      width: 100%;
      min-width: 650px;
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
    }
    .rp-table thead th {
      position: sticky;
      top: 0;
      z-index: 2;
      padding: 14px 15px;
      background: #f4f7fb;
      color: #53647a;
      border-bottom: 1px solid #e4eaf1;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .55px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .rp-table thead th.rp-sortable { cursor: pointer; user-select: none; }
    .rp-table thead th.rp-sortable:hover { color: #193b60; }
    .rp-sort-arrow { margin-left: 6px; color: #8b9aae; font-size: 13px; }
    .rp-table tbody td {
      padding: 14px 15px;
      border-bottom: 1px solid #edf0f4;
      color: #35445a;
      font-size: 13px;
      vertical-align: middle;
      white-space: nowrap;
    }
    .rp-table tbody tr:last-child td { border-bottom: 0; }
    .rp-table tbody tr:hover { background: #f8fafd; }
    .rp-role-name { color: #203b5d !important; font-weight: 600; }
    .rp-actions { display: flex; align-items: center; gap: 8px; }
    .rp-action-btn {
      min-height: 30px;
      padding: 5px 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: 1px solid #d7e2ee;
      border-radius: 7px;
      background: #f5f8fc;
      color: #294e74;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: .2s ease;
    }
    .rp-action-btn:hover { background: #e8f0f8; border-color: #b9cadd; }
    .rp-action-btn svg { width: 14px; height: 14px; }
    .rp-permission-btn { background: #1d3c60; color: #fff; border-color: #1d3c60; }
    .rp-permission-btn:hover { background: #142e4d; border-color: #142e4d; }
    .rp-empty { padding: 42px 16px !important; text-align: center; color: #8a97a8 !important; }
    .rp-empty-icon {
      width: 42px;
      height: 42px;
      margin: 0 auto 10px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: #f1f5f9;
      color: #8292a6;
    }
    .rp-empty-icon svg { width: 21px; height: 21px; }
    .rp-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding-top: 18px;
      flex-wrap: wrap;
    }
    .rp-showing { color: #78869a; font-size: 12px; }
    .rp-pagination { display: flex; align-items: center; gap: 5px; margin: 0; padding: 0; list-style: none; }
    .rp-page-btn {
      min-width: 33px;
      height: 33px;
      padding: 0 9px;
      border: 1px solid #e0e6ee;
      border-radius: 7px;
      background: #fff;
      color: #53647a;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: .2s ease;
    }
    .rp-page-btn:hover:not(:disabled) { background: #f0f4f9; border-color: #cbd7e5; }
    .rp-page-btn.rp-active { background: #1c3a5d; border-color: #1c3a5d; color: #fff; }
    .rp-page-btn:disabled { opacity: .42; cursor: not-allowed; }

    .rp-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(10, 25, 43, .55);
      backdrop-filter: blur(3px);
    }
    .rp-modal {
      width: 100%;
      max-width: 460px;
      overflow: hidden;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 18px 55px rgba(8, 24, 43, .24);
      font-family: 'Inter', sans-serif;
    }
    .rp-modal-header {
      min-height: 68px;
      padding: 17px 21px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .rp-modal-title { margin: 0; font-size: 17px; font-weight: 700; }
    .rp-modal-close {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 7px;
      background: rgba(255,255,255,.1);
      color: #fff;
      font-size: 21px;
      line-height: 1;
      cursor: pointer;
    }
    .rp-modal-body { padding: 23px 22px 20px; }
    .rp-modal-label {
      display: block;
      margin: 0 0 7px;
      color: #40536c;
      font-size: 12px;
      font-weight: 600;
    }
    .rp-modal-input {
      width: 100%;
      min-height: 42px;
      padding: 9px 12px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      background: #fff;
      color: #26374d;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: .2s ease;
    }
    .rp-modal-footer {
      padding: 15px 22px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 9px;
      border-top: 1px solid #edf0f4;
    }
    .rp-modal-btn {
      min-height: 37px;
      padding: 8px 15px;
      border: 1px solid transparent;
      border-radius: 8px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: .2s ease;
    }
    .rp-modal-btn-primary { color: #fff; background: #1d3c60; border-color: #1d3c60; }
    .rp-modal-btn-primary:hover { background: #142e4d; border-color: #142e4d; }
    .rp-modal-btn-secondary { color: #43566e; background: #f4f6f9; border-color: #dfe5ec; }
    .rp-modal-btn-secondary:hover { background: #e9eef4; border-color: #cbd6e2; }

    @media (max-width: 640px) {
      .rp-page { padding: 12px 8px; }
      .rp-header { padding: 15px; align-items: flex-start; }
      .rp-title { font-size: 17px; }
      .rp-body { padding: 16px 12px; }
      .rp-toolbar { align-items: flex-start; flex-direction: column; }
      .rp-search-wrap { width: 100%; justify-content: space-between; }
      .rp-search-box, .rp-search-input { width: 100%; }
      .rp-search-box { flex: 1; }
      .rp-footer { align-items: flex-start; flex-direction: column; }
      .rp-modal-footer { flex-direction: column-reverse; }
      .rp-modal-btn { width: 100%; }
    }
  `;

  return (
    <div className="rp-page container-fluid">
      <style>{styles}</style>

      <div className="rp-card">
        <div className="rp-header">
          <div className="rp-heading-wrap">
            <div className="rp-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4.5 6v5.2c0 4.7 3.2 8.1 7.5 9.8 4.3-1.7 7.5-5.1 7.5-9.8V6L12 3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h5 className="rp-title">Roles Master</h5>
              <p className="rp-subtitle">Manage roles and configure application permissions</p>
            </div>
          </div>

          {hasPermission("Roles", "ADD") && (
            <button
              className="rp-add-btn"
              onClick={() => {
                setEditData(null);
                setRoleName("");
                setShowModal(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add New Role
            </button>
          )}
        </div>

        <div className="rp-body">
          <div className="rp-toolbar">
            <div className="rp-entries">
              <span>Show</span>
              <select
                className="rp-select"
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Number of entries to display"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="rp-search-wrap">
              <label htmlFor="rp-role-search">Search</label>
              <div className="rp-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  id="rp-role-search"
                  type="text"
                  className="rp-search-input"
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th className="rp-sortable" onClick={() => handleSort("name")}>
                    Role Name <span className="rp-sort-arrow">{getArrow("name")}</span>
                  </th>
                  <th>Set Role Permission</th>
                </tr>
              </thead>

              <tbody>
                {currentRoles.length > 0 ? (
                  currentRoles.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {hasPermission("Roles", "EDIT") && (
                          <button
                            className="rp-action-btn"
                            onClick={() => {
                              setEditData(r);
                              setRoleName(r.name);
                              setShowModal(true);
                            }}
                            title="Edit role"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
                            </svg>
                            Edit
                          </button>
                        )}
                      </td>

                      <td className="rp-role-name">{r.name}</td>

                      <td>
                        {hasPermission("Roles", "EDIT") && (
                          <button
                            className="rp-action-btn rp-permission-btn"
                            onClick={() => navigate(`/set-permission/${r.id}`)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="3" />
                              <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" />
                            </svg>
                            Set Permission
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="rp-empty" colSpan="3">
                      <div className="rp-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <circle cx="10.5" cy="10.5" r="6.5" />
                          <path d="m16 16 4 4M8 10.5h5" />
                        </svg>
                      </div>
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rp-footer">
            <div className="rp-showing">
              Showing {startEntry} to {endEntry} of {sortedRoles.length} entries
            </div>

            <nav aria-label="Roles list pagination">
              <ul className="rp-pagination">
                <li>
                  <button
                    className="rp-page-btn"
                    disabled={currentPage === 1 || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Prev
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li key={num}>
                    <button
                      className={`rp-page-btn ${currentPage === num ? "rp-active" : ""}`}
                      aria-current={currentPage === num ? "page" : undefined}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="rp-page-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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
          className="rp-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="rp-modal" role="dialog" aria-modal="true" aria-labelledby="rp-modal-title">
            <div className="rp-modal-header">
              <h5 className="rp-modal-title" id="rp-modal-title">
                {editData ? "Edit Role" : "New Role"}
              </h5>

              <button
                className="rp-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="rp-modal-body">
              <label className="rp-modal-label" htmlFor="rp-role-name">Role Name</label>
              <input
                id="rp-role-name"
                className="rp-modal-input"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>

            <div className="rp-modal-footer">
              <button
                className="rp-modal-btn rp-modal-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              {hasPermission("Roles", editData ? "EDIT" : "ADD") && (
                <button
                  className="rp-modal-btn rp-modal-btn-primary"
                  onClick={handleSaveRole}
                >
                  {editData ? "Update Role" : "Create Role"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;

// import React, { useState } from "react";
// import "../../../styles/allPatients.css";
// // import { roles } from "../../../data/roles";
// import { useNavigate } from "react-router-dom";
// import api from "../../../services/api";
// import { useEffect } from "react";
// import { hasPermission } from "../../permissionUtil";

// const RolesPermissions = () => {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [roleName, setRoleName] = useState("");

//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//   loadRoles();
// }, []);

// // const loadRoles = async () => {
// //   const res = await api.get("/users/roles"); // ✅ backend endpoint
// //   setRoles(res.data.data || []);
// // };
// const loadRoles = async () => {
//   try {
//     const res = await api.get("/users/roles");
//     setRoles(res.data.data || []);
//   } catch (err) {
//     console.error(err);

//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     } else {
//       alert("Failed to load roles");
//     }
//   }
// };

//   /* Sorting */

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   /* Search */

//   const filteredRoles = roles.filter((r) =>
//   r.name?.toLowerCase().includes(search.toLowerCase())
// );

//   /* Sorted */

//   const sortedRoles = [...filteredRoles].sort((a, b) => {
//     if (!sortColumn) return 0;

//     let valA = a[sortColumn];
//     let valB = b[sortColumn];

//     if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//     if (valA > valB) return sortDirection === "asc" ? 1 : -1;

//     return 0;
//   });

//   /* Pagination */

//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;

//   const currentRoles = sortedRoles.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(sortedRoles.length / entries);

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const startEntry = sortedRoles.length === 0 ? 0 : indexOfFirst + 1;
//   const endEntry = Math.min(indexOfLast, sortedRoles.length);

//   /* Arrow */

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

// //   const handleSaveRole = async () => {
// //   try {
// //     if (editData) {
// //       await api.put(`/roles/${editData.id}`, {
// //         name: roleName,
// //       });

// //       alert("Role updated successfully");
// //     } else {
// //       await api.post("/roles", {
// //         name: roleName,
// //       });

// //       alert("Role created successfully");
// //     }

// //     setShowModal(false);
// //     loadRoles();

// //   } catch (err) {
// //     alert(err.response?.data?.message || "Error saving role");
// //   }
// // };
// const handleSaveRole = async () => {
//    if (editData && !hasPermission("Roles", "EDIT")) {
//     alert("Access Denied ❌");
//     return;
//   }

//   if (!editData && !hasPermission("Roles", "ADD")) {
//     alert("Access Denied ❌");
//     return;
//   }
//   try {
//     if (editData) {
//       await api.put(`/users/roles/${editData.id}`, {
//         name: roleName,
//       });

//       alert("Role updated successfully");
//     } else {
//       await api.post("/users/roles", {
//         name: roleName,
//       });

//       alert("Role created successfully");
//     }

//     setShowModal(false);
//     loadRoles();

//   } catch (err) {
//     alert(err.response?.data?.message || "Error saving role");
//   }
// };

// const hasPermission = (module, action) => {
//   const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
//   console.log("Perms is"+ perms);

//   const p = perms.find((x) => x.module === module);

//   if (!p) return false;

//   if (action === "VIEW") return p.canView;
//   if (action === "ADD") return p.canAdd;
//   if (action === "EDIT") return p.canEdit;

//   return false;
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Roles Master</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => {
//               setEditData(null);
//               setRoleName("");
//               setShowModal(true);
//             }}
//           >
//             + Add New Roles
//           </button> */}
//           {hasPermission("Roles", "ADD") && (
//   <button
//     className="btn btn-light"
//     onClick={() => {
//       setEditData(null);
//       setRoleName("");
//       setShowModal(true);
//     }}
//   >
//     ➕ Add New Roles
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

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("name")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Role Name {getArrow("role")}
//                   </th>

//                   <th>Set Role Permission</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentRoles?.map((r) => (
//                   <tr key={r.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => {
//                           setEditData(r);
//                           setRoleName(r.name);
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Roles", "EDIT") && (
//   <button
//     className="btn btn-info btn-sm"
//     onClick={() => {
//       setEditData(r);
//       setRoleName(r.name);
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
//                           checked={true}
//                           readOnly
//                         />
//                       </div>
//                     </td> */}

//                     <td>{r.name}</td>

//                     <td>
//                       {/* <button
//                         className="btn btn-primary btn-sm"
//                         onClick={() => navigate(`/set-permission/${r.id}`)}
//                       >
//                         ⚙ Set Permission
//                       </button> */}
//                       {hasPermission("Roles", "EDIT") && (
//   <button
//     className="btn btn-primary btn-sm"
//     onClick={() => navigate(`/set-permission/${r.id}`)}
//   >
//     ⚙ Set Permission
//   </button>
// )}
//                       {/* {hasPermission("Roles", "EDIT") && (
//   <button
//     className="btn btn-primary btn-sm"
//     onClick={() => navigate(`/set-permission/${r.id}`)}
//   >
//     ⚙ Set Permission
//   </button>
// )} */}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing {startEntry} to {endEntry} of {sortedRoles.length} entries
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
//                   {editData ? "Edit Role" : "New Role"}
//                 </h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Role Name</label>

//                   <input
//                     className="form-control"
//                     value={roleName}
//                     onChange={(e) => setRoleName(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 {/* <button className="btn btn-primary submit-btn" onClick={handleSaveRole}>
//                   {editData ? "Update" : "Submit"}
//                 </button> */}
//                 {hasPermission("Roles", editData ? "EDIT" : "ADD") && (
//   <button
//     className="btn btn-primary submit-btn"
//     onClick={handleSaveRole}
//   >
//     {editData ? "Update" : "Submit"}
//   </button>
// )}

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

// export default RolesPermissions;
