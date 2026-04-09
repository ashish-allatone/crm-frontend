import React, { useState } from "react";
import "../../../styles/allPatients.css";
// import { roles } from "../../../data/roles";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useEffect } from "react";

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
}, []);

const loadRoles = async () => {
  const res = await api.get("/users/roles"); // ✅ backend endpoint
  setRoles(res.data.data || []);
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

    let valA = a[sortColumn];
    let valB = b[sortColumn];

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

  /* Arrow */

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

//   const handleSaveRole = async () => {
//   try {
//     if (editData) {
//       await api.put(`/roles/${editData.id}`, {
//         name: roleName,
//       });

//       alert("Role updated successfully");
//     } else {
//       await api.post("/roles", {
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
const handleSaveRole = async () => {
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

const hasPermission = (module, action) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  console.log("Perms is"+ perms);

  const p = perms.find((x) => x.module === module);

  if (!p) return false;

  if (action === "VIEW") return p.canView;
  if (action === "ADD") return p.canAdd;
  if (action === "EDIT") return p.canEdit;

  return false;
};

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Roles Master</h5>

          <button
            className="btn btn-light"
            onClick={() => {
              setEditData(null);
              setRoleName("");
              setShowModal(true);
            }}
          >
            + Add New Roles
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
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Role Name {getArrow("role")}
                  </th>

                  <th>Set Role Permission</th>
                </tr>
              </thead>

              <tbody>
                {currentRoles?.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          setEditData(r);
                          setRoleName(r.name);
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
                          checked={true}
                          readOnly
                        />
                      </div>
                    </td>

                    <td>{r.name}</td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/set-permission/${r.id}`)}
                      >
                        ⚙ Set Permission
                      </button>
                      {/* {hasPermission("Roles", "EDIT") && (
  <button
    className="btn btn-primary btn-sm"
    onClick={() => navigate(`/set-permission/${r.id}`)}
  >
    ⚙ Set Permission
  </button>
)} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {startEntry} to {endEntry} of {sortedRoles.length} entries
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
                  {editData ? "Edit Role" : "New Role"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Role Name</label>

                  <input
                    className="form-control"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-primary submit-btn" onClick={handleSaveRole}>
                  {editData ? "Update" : "Submit"}
                </button>

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

export default RolesPermissions;
