import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";
// import { users } from "../../../data/users";
import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  changePassword,
  toggleStatus,
} from "../../../services/userService";

const Users = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [roles, setRoles] = useState([]);

  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    const res = await getUsers(currentPage - 1, entries, search);
    setUsers(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, entries, search]);

  useEffect(() => {
    getRoles().then((res) => setRoles(res.data));
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    employeeNo: "",
    mobile: "",
    gender: "",
    dob: "",
    role: "",
    address: "",
    password: "",
  });

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

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  /* Modal open */

  const openAdd = () => {
    setEditData(null);

    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      employeeNo: "",
      mobile: "",
      gender: "",
      dob: "",
      role: "",
      address: "",
      password: "",
    });

    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditData(user);

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      employeeNo: user.employeeNo || "",
      mobile: user.mobile || "",
      gender: user.gender || "",
      dob: user.dob || "",
      role: user.roles?.[0]?.name || "", // ✅ IMPORTANT
      address: user.address || "",
      password: "", // blank
    });

    setShowModal(true);
  };

  /* Form change */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editData) {
      await updateUser(editData.id, form);
    } else {
      await createUser(form);
    }

    setShowModal(false);
    setCurrentPage(1);
    loadUsers();
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await changePassword(editData.id, { password, confirmPassword });

    setShowPasswordModal(false);
  };

  const handleStatusToggle = async (id) => {
    await toggleStatus(id);

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u)),
    );
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>User List</h5>

          <button className="btn btn-light" onClick={openAdd}>
            + Add New User
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
                // onChange={(e) => setSearch(e.target.value)}
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
                    onClick={() => handleSort("username")}
                    style={{ cursor: "pointer" }}
                  >
                    Username {getArrow("username")}
                  </th>

                  <th>Full Name</th>

                  <th
                    onClick={() => handleSort("mobile")}
                    style={{ cursor: "pointer" }}
                  >
                    Phone {getArrow("mobile")}
                  </th>

                  <th
                    onClick={() => handleSort("role")}
                    style={{ cursor: "pointer" }}
                  >
                    Role {getArrow("role")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditData(u); // ✅ yahan sahi hai
                          setShowPasswordModal(true);
                        }}
                      >
                        🔒 Change Password
                      </button>
                    </td>

                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={u.status}
                          onChange={() => handleStatusToggle(u.id)}
                        />
                      </div>
                    </td>

                    <td>{u.username}</td>

                    <td>
                      {u.firstName} {u.lastName}
                    </td>

                    <td>{u.mobile}</td>

                    <td>{u.roles?.[0]?.name}</td>
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

      {/* MODAL */}

      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">
                  {editData ? "Edit User" : "New User"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      className="form-control"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Username</label>
                    <input
                      className="form-control"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Employee No / Payroll No</label>
                    <input
                      className="form-control"
                      name="employeeNo"
                      value={form.employeeNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Mobile No</label>
                    <input
                      className="form-control"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Gender</label>
                    <select
                      className="form-control"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option>--Select--</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Role</label>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option>--Select--</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12 mb-3">
                    <label>Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary submit-btn"
                  onClick={handleSubmit}
                >
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

      {showPasswordModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">Change Password</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)} // ✅ correct
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>Password</label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>

                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary submit-btn"
                  onClick={handleChangePassword}
                >
                  Submit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => setShowPasswordModal(false)}
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

export default Users;
