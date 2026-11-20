import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";

import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  changePassword,
  toggleStatus,
} from "../../../services/userService";

import { getOrganizationsAll } from "../../../services/organizationService";
import { getLatestPrivacyNotice } from "../../../services/dpdpService";
import { hasPermission } from "../../permissionUtil";

/* -------------------------------------------------------------------------- */
/*                              USERS PAGE THEME                              */
/* -------------------------------------------------------------------------- */

const usersStyles = `
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


  .up-page {
  font-family: 'Inter', sans-serif;
  background: #f5f7fb;
  min-height: 100vh;
  padding: 24px;
  color: #18243a;
}

.up-page button,
.up-page input,
.up-page select,
.up-page textarea {
  font-family: 'Inter', sans-serif;
}

  .up-card {
  background: #fff;
  border: 1px solid #e7ebf2;
  border-radius: 14px;
  box-shadow: 0 5px 22px rgba(20, 43, 85, 0.07);
  overflow: hidden;
}

  .up-header {
  min-height: 76px;
  background: linear-gradient(
    120deg,
    #0e3d66 0%,
    #0a2d4a 60%,
    #061d30 100%
  );
  padding: 16px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

  .up-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.up-header-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

  .up-header h5 {
  font-family: 'Inter', sans-serif;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.35;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
}
  .up-header-subtitle {
  margin: 4px 0 0;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  font-weight: 400;
}

  .up-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: #fff;
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 8px;
  color: #0a2d4a;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 16px;
  cursor: pointer;
  transition: .2s ease;
  white-space: nowrap;
}

.up-add-btn:hover {
  background: #eaf1fb;
  transform: translateY(-1px);
}

  .up-body { padding: 1.5rem 1.75rem; }

  .up-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: .75rem;
  }

  .up-entries, .up-search-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: #555;
  }

  .up-select, .up-search {
    height: 36px;
    padding: 0 10px;
    border: 1px solid #d5d9df;
    border-radius: 7px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #333;
    background: #fff;
    outline: none;
  }
  .up-select { cursor: pointer; }
  .up-select:focus, .up-search:focus,
  .up-form-input:focus, .up-form-select:focus, .up-form-textarea:focus {
    border-color: #185fa5;
    box-shadow: 0 0 0 3px rgba(24,95,165,.09);
  }

  .up-search-wrap { gap: 8px; }
  .up-search-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .up-search {
    width: 230px;
    padding: 0 10px 0 34px;
  }
  .up-search::placeholder { color: #a5aab1; }
  .up-search-icon {
    position: absolute;
    left: 10px;
    color: #89919a;
    display: flex;
    pointer-events: none;
  }

  .up-table-wrap {
    border: 1px solid #e5e8ec;
    border-radius: 10px;
    overflow: auto;
    max-height: 520px;
  }
  .up-table {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  margin: 0;
}
  .up-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #edf2f9;
  padding: 13px 15px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .55px;
  text-transform: uppercase;
  color: #233e66;
  border-bottom: 1px solid #d9e3f0;
  white-space: nowrap;
  user-select: none;
}
  .up-table thead th.sortable { cursor: pointer; }
  .up-table thead th.sortable:hover { color: #0a2d4a; background: #eef1f5; }
  .up-table tbody tr { transition: background .12s; }
  .up-table tbody tr:not(:last-child) td { border-bottom: 1px solid #f0f1f3; }
  .up-table tbody tr:hover { background: #f7fbff; }
  .up-table td {
  padding: 13px 15px;
  color: #394b62;
  font-size: 13px;
  white-space: nowrap;
  vertical-align: middle;
  background: transparent;
}
  .up-sort-arrow {
    display: inline-block;
    margin-left: 5px;
    font-size: 10px;
    opacity: .45;
  }
  .up-sort-arrow.active { opacity: 1; color: #0a2d4a; }

  .up-name-cell { display: flex; align-items: center; }
  .up-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e8f0fb;
    color: #185fa5;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
    flex-shrink: 0;
    text-transform: uppercase;
  }
  .up-username { font-weight: 600; color: #0a2d4a !important; }
  .up-role-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    background: rgba(10,45,74,.08);
    color: #0a2d4a;
  }

  .up-btn-edit, .up-btn-pwd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 11px;
    border-radius: 6px;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
    white-space: nowrap;
  }
  .up-btn-edit {
    border: 1px solid #b8d4f0;
    background: #e8f0fb;
    color: #185fa5;
    margin-right: 6px;
  }
  .up-btn-edit:hover { background: #d0e4f7; }
  .up-btn-pwd {
    border: 1px solid #c8dff8;
    background: #f0f5ff;
    color: #0a2d4a;
  }
  .up-btn-pwd:hover { background: #ddeaf8; }

  .up-empty {
    text-align: center;
    padding: 3rem 1rem !important;
    color: #929aa3 !important;
    font-size: 14px;
  }

  .up-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.25rem;
    flex-wrap: wrap;
    gap: .75rem;
  }
  .up-page-info { font-size: 13px; color: #777; }
  .up-pagination { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  .up-page-btn {
    height: 34px;
    min-width: 34px;
    padding: 0 10px;
    border-radius: 7px;
    border: 1px solid #ddd;
    background: #fff;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #444;
    cursor: pointer;
    transition: background .12s, border-color .12s, color .12s;
  }
  .up-page-btn:hover:not(:disabled):not(.active) {
    background: #f0f5ff;
    border-color: #b8d4f0;
  }
  .up-page-btn.active {
    background: #0a2d4a;
    border-color: #0a2d4a;
    color: #fff;
    font-weight: 600;
  }
  .up-page-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* Add/Edit and password modal */
  .up-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.48);
    z-index: 1055;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow-y: auto;
    animation: up-fade-in .15s ease;
  }
  @keyframes up-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .up-modal {
    background: #fff;
    border-radius: 14px;
    width: 100%;
    max-width: 760px;
    max-height: calc(100vh - 2rem);
    box-shadow: 0 20px 60px rgba(0,0,0,.2);
    overflow: auto;
    animation: up-slide-up .18s ease;
  }
  .up-modal-sm { max-width: 440px; }
  @keyframes up-slide-up {
    from { transform: translateY(16px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .up-modal-header {
    background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 100%);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .up-modal-title {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
  .up-modal-close {
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 6px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
  }
  .up-modal-close:hover { background: rgba(255,255,255,.22); }
  .up-modal-body { padding: 1.5rem; }
  .up-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  .up-form-full { grid-column: 1 / -1; }
  .up-form-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .up-form-label {
    font-size: 11.5px;
    font-weight: 600;
    color: #626d78;
    letter-spacing: .045em;
    text-transform: uppercase;
  }
  .up-form-input, .up-form-select, .up-form-textarea {
    min-height: 39px;
    padding: 8px 11px;
    border: 1px solid #d5d9df;
    border-radius: 7px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #222;
    background: #fff;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    width: 100%;
  }
  .up-form-textarea { min-height: 76px; resize: vertical; }
  .up-check-panel {
    background: #f7f9fc;
    border: 1px solid #e4eaf1;
    border-radius: 8px;
    padding: 12px 14px;
  }
  .up-check-panel .form-check-label { color: #273746; font-size: 13px; }
  .up-help-text { color: #7b8792; font-size: 12px; margin: 5px 0 0 25px; }
  .up-modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: .75rem;
    background: #fff;
  }
  .up-btn-submit, .up-btn-cancel {
    min-height: 39px;
    padding: 0 20px;
    border-radius: 7px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
  }
  .up-btn-submit {
    background: #0a2d4a;
    color: #fff;
    border: 1px solid #0a2d4a;
  }
  .up-btn-submit:hover:not(:disabled) { background: #0e3d66; }
  .up-btn-submit:disabled { opacity: .6; cursor: not-allowed; }
  .up-btn-cancel {
    background: #fff;
    color: #b33b32;
    border: 1px solid #efc5c1;
  }
  .up-btn-cancel:hover { background: #fff5f4; }

  /* Privacy notice modal retains the original consent workflow */
  .up-privacy-overlay {
    position: fixed;
    inset: 0;
    z-index: 1065;
    background: rgba(0,0,0,.58);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .up-privacy-modal {
    width: 100%;
    max-width: 760px;
    max-height: calc(100vh - 2rem);
    overflow: auto;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,.22);
  }
  .up-privacy-content {
    max-height: 350px;
    overflow-y: auto;
    border: 1px solid #e1e5ea;
    padding: 15px;
    border-radius: 7px;
    white-space: pre-wrap;
    line-height: 1.6;
    color: #39434d;
    font-size: 13.5px;
  }

  @media (max-width: 700px) {
    .up-page { padding: .75rem; }
    .up-body { padding: 1rem; }
    .up-header { padding: 1rem; }
    .up-form-grid { grid-template-columns: 1fr; }
    .up-form-full { grid-column: 1; }
    .up-search { width: 190px; }
  }
  @media (max-width: 480px) {
    .up-toolbar { align-items: stretch; }
    .up-search-wrap { justify-content: space-between; }
    .up-search-icon-wrap { flex: 1; }
    .up-search { width: 100%; }
    .up-header h5 { font-size: 16px; }
    .up-add-btn { padding: 8px 10px; font-size: 12px; }
    .up-modal-body { padding: 1rem; }
    .up-modal-footer { padding: .85rem 1rem; }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

const IconUsers = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="#fff"
      strokeWidth="1.7"
    />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
    <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <rect x="2" y="5.5" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="6.5" cy="8.5" r=".9" fill="currentColor" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const initials = (firstName = "", lastName = "") => {
  const value = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  return value || "?";
};

/* -------------------------------------------------------------------------- */
/*                               USERS COMPONENT                              */
/* -------------------------------------------------------------------------- */

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
  const [organizations, setOrganizations] = useState([]);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [loadingConsent, setLoadingConsent] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    employeeNo: "",
    mobile: "",
    gender: "",
    dob: "",
    roleName: "",
    organizationId: "",
    allOrganizations: false,
    address: "",
    password: "",
  });

  /* ------------------------------- API calls ------------------------------ */

  const loadUsers = async () => {
    try {
      const res = await getUsers(currentPage - 1, entries, search);
      setUsers(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
      console.log("API RESPONSE 👉", res.data);
    } catch (error) {
      console.error("Unable to load users:", error);
      setUsers([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    loadUsers();
    // Keep the existing server-side pagination and search behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, entries, search]);

  useEffect(() => {
    getRoles()
      .then((res) => setRoles(res.data.data || []))
      .catch((error) => console.error("Unable to load roles:", error));
  }, []);

  useEffect(() => {
    getOrganizationsAll()
      .then((res) => setOrganizations(res.data.data || []))
      .catch(console.error);
  }, []);

  /* -------------------------------- Sorting -------------------------------- */

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }
    setSortColumn(column);
    setSortDirection(direction);
  };

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  /* ---------------------------- Add / Edit user --------------------------- */

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
      roleName: "",
      organizationId: "",
      allOrganizations: false,
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
      roleName: user.roles?.[0]?.name || "",
      organizationId: user.organization?.id || "",
      allOrganizations: user.allOrganizations || false,
      address: user.address || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    if (!form.organizationId) {
      alert("Please select Organization");
      return;
    }

    try {
      const payload = {
        ...form,
        role: form.roleName,
        organizationId: Number(form.organizationId),
        allOrganizations: form.allOrganizations,
      };

      let res;
      if (editData) {
        res = await updateUser(editData.id, payload);
      } else {
        res = await createUser(payload);
      }

      alert(res.data.message);
      setShowModal(false);
      setCurrentPage(1);
      loadUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed ❌");
    }
  };

  const handleSubmit = async () => {
    if (editData) {
      await saveUser();
      return;
    }

    if (!form.organizationId) {
      alert("Please select Organization");
      return;
    }

    try {
      setLoadingConsent(true);
      const res = await getLatestPrivacyNotice();
      setPrivacyNotice(res.data.data);
      setConsentChecked(false);
      setShowPrivacyModal(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to fetch latest Privacy Notice."
      );
    } finally {
      setLoadingConsent(false);
    }
  };

  /* ---------------------------- Change password --------------------------- */

  const handleChangePassword = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await changePassword(editData.id, {
        password,
        confirmPassword,
      });

      alert(res.data.message);
      setShowPasswordModal(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Password change failed ❌");
    }
  };

  /* ------------------------------- User status ---------------------------- */

  const handleStatusToggle = async (id) => {
    try {
      const res = await toggleStatus(id);
      alert(res.data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed ❌");
    }
  };

  return (
    <>
      <style>{usersStyles}</style>

      <div className="up-page">
        <div className="up-card">
          {/* Page header */}
          <div className="up-header">
            <div className="up-header-left">
              <div className="up-header-icon">
                <IconUsers />
              </div>
              <div>
  <h5>User List</h5>
  <p className="up-header-subtitle">
    Manage users, roles and organization access
  </p>
</div>
            </div>

            {hasPermission("Users", "ADD") && (
              <button type="button" className="up-add-btn" onClick={openAdd}>
                <IconPlus />
                Add New User
              </button>
            )}
          </div>

          <div className="up-body">
            {/* Search and page-size toolbar */}
            <div className="up-toolbar">
              <div className="up-entries">
                <span>Show</span>
                <select
                  className="up-select"
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Entries per page"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              <div className="up-search-wrap">
                <label htmlFor="users-search">Search:</label>
                <div className="up-search-icon-wrap">
                  <span className="up-search-icon">
                    <IconSearch />
                  </span>
                  <input
                    id="users-search"
                    type="text"
                    className="up-search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="up-table-wrap">
              <table className="up-table">
                <thead>
                  <tr>
                    <th>Actions</th>

                    <th
                      className="sortable"
                      onClick={() => handleSort("username")}
                    >
                      Username
                      <span
                        className={`up-sort-arrow ${
                          sortColumn === "username" ? "active" : ""
                        }`}
                      >
                        {getArrow("username")}
                      </span>
                    </th>

                    <th>Full Name</th>

                    <th
                      className="sortable"
                      onClick={() => handleSort("mobile")}
                    >
                      Phone
                      <span
                        className={`up-sort-arrow ${
                          sortColumn === "mobile" ? "active" : ""
                        }`}
                      >
                        {getArrow("mobile")}
                      </span>
                    </th>

                    <th
                      className="sortable"
                      onClick={() => handleSort("role")}
                    >
                      Role
                      <span
                        className={`up-sort-arrow ${
                          sortColumn === "role" ? "active" : ""
                        }`}
                      >
                        {getArrow("role")}
                      </span>
                    </th>

                    <th
                      className="sortable"
                      onClick={() => handleSort("organization")}
                    >
                      Organization
                      <span
                        className={`up-sort-arrow ${
                          sortColumn === "organization" ? "active" : ""
                        }`}
                      >
                        {getArrow("organization")}
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="up-empty">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          {hasPermission("Users", "EDIT") && (
                            <button
                              type="button"
                              className="up-btn-edit"
                              onClick={() => openEdit(u)}
                            >
                              <IconEdit />
                              Edit
                            </button>
                          )}

                          {hasPermission("Users", "EDIT") && (
                            <button
                              type="button"
                              className="up-btn-pwd"
                              onClick={() => {
                                setEditData(u);
                                setPassword("");
                                setConfirmPassword("");
                                setShowPasswordModal(true);
                              }}
                            >
                              <IconLock />
                              Change Password
                            </button>
                          )}
                        </td>

                        <td className="up-username">{u.username}</td>

                        <td>
                          <div className="up-name-cell">
                            <span className="up-avatar">
                              {initials(u.firstName, u.lastName)}
                            </span>
                            <span>
                              {u.firstName} {u.lastName}
                            </span>
                          </div>
                        </td>

                        <td>{u.mobile}</td>

                        <td>
                          {u.roles?.[0]?.name && (
                            <span className="up-role-badge">
                              {u.roles[0].name}
                            </span>
                          )}
                        </td>

                        <td>
                          {u.roles?.[0]?.name === "Admin"
                            ? "All Organizations"
                            : u.allOrganizations
                              ? "All Organizations"
                              : u.organization?.organizationName}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="up-footer">
              <div className="up-page-info">
                Showing page {currentPage} of {totalPages}
              </div>

              <nav className="up-pagination" aria-label="User list pagination">
                <button
                  type="button"
                  className="up-page-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  ← Previous
                </button>

                {pageNumbers.map((num) => (
                  <button
                    type="button"
                    key={num}
                    className={`up-page-btn ${
                      currentPage === num ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(num)}
                    aria-current={currentPage === num ? "page" : undefined}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  className="up-page-btn"
                  disabled={totalPages === 0 || currentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next →
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                         ADD / EDIT USER MODAL                      */}
      {/* ------------------------------------------------------------------ */}

      {showModal && (
        <div
          className="up-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="up-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
          >
            <div className="up-modal-header">
              <h5 className="up-modal-title" id="user-modal-title">
                {editData ? "Edit User" : "New User"}
              </h5>
              <button
                type="button"
                className="up-modal-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                <IconClose />
              </button>
            </div>

            <div className="up-modal-body">
              <div className="up-form-grid">
                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="up-form-input"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="up-form-input"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    className="up-form-input"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="up-form-input"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="employeeNo">
                    Employee No / Payroll No
                  </label>
                  <input
                    id="employeeNo"
                    className="up-form-input"
                    name="employeeNo"
                    value={form.employeeNo}
                    onChange={handleChange}
                    placeholder="Employee number"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="up-form-input"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="mobile">
                    Mobile No
                  </label>
                  <input
                    id="mobile"
                    className="up-form-input"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="up-form-select"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className="up-form-input"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-form-label" htmlFor="roleName">
                    Role
                  </label>
                  <select
                    id="roleName"
                    className="up-form-select"
                    value={form.roleName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roleName: e.target.value,
                        allOrganizations:
                          e.target.value === "Admin"
                            ? false
                            : form.allOrganizations,
                      })
                    }
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="up-form-group">
                  <label
                    className="up-form-label"
                    htmlFor="organizationId"
                  >
                    Organization
                  </label>
                  <select
                    id="organizationId"
                    className="up-form-select"
                    value={form.organizationId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        organizationId: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Organization</option>
                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.organizationName}
                      </option>
                    ))}
                  </select>
                </div>

                {form.roleName !== "Admin" && (
                  <div className="up-form-full">
                    <div className="up-check-panel">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="allOrganizations"
                          checked={form.allOrganizations}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              allOrganizations: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="allOrganizations"
                          style={{ cursor: "pointer" }}
                        >
                          Access All Organizations
                        </label>
                      </div>
                      <p className="up-help-text">
                        Enable this to grant the user access to data across all
                        organizations.
                      </p>
                    </div>
                  </div>
                )}

                <div className="up-form-group up-form-full">
                  <label className="up-form-label" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    id="address"
                    className="up-form-textarea"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            <div className="up-modal-footer">
              <button
                type="button"
                className="up-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              {hasPermission("Users", editData ? "EDIT" : "ADD") && (
                <button
                  type="button"
                  className="up-btn-submit"
                  onClick={handleSubmit}
                  disabled={loadingConsent}
                >
                  {loadingConsent
                    ? "Loading..."
                    : editData
                      ? "Update User"
                      : "Create User"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                       PRIVACY NOTICE / CONSENT                     */}
      {/* ------------------------------------------------------------------ */}

      {showPrivacyModal && (
        <div className="up-privacy-overlay">
          <div
            className="up-privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
          >
            <div className="up-modal-header">
              <h5 className="up-modal-title" id="privacy-modal-title">
                Privacy Notice
              </h5>
              <button
                type="button"
                className="up-modal-close"
                aria-label="Close"
                onClick={() => {
                  setConsentChecked(false);
                  setShowPrivacyModal(false);
                }}
              >
                <IconClose />
              </button>
            </div>

            <div className="up-modal-body">
              <div className="alert alert-info">
                <h6>
                  Purpose: <strong>User Registration</strong>
                </h6>
                <p className="mb-2">
                  <strong>Title: </strong>
                  {privacyNotice?.title}
                </p>
                <p className="mb-0">
                  <strong>Version: </strong>
                  {privacyNotice?.version}
                </p>
              </div>

              <div className="up-privacy-content">
                {privacyNotice?.content}
              </div>

              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacyConsent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="privacyConsent"
                >
                  I have read and understood the Privacy Notice and agree to
                  the processing of my personal data for User Registration.
                </label>
              </div>
            </div>

            <div className="up-modal-footer">
              <button
                type="button"
                className="up-btn-cancel"
                onClick={() => {
                  setConsentChecked(false);
                  setShowPrivacyModal(false);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="up-btn-submit"
                disabled={!consentChecked}
                onClick={async () => {
                  await saveUser();
                  setConsentChecked(false);
                  setShowPrivacyModal(false);
                }}
              >
                Accept &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                         CHANGE PASSWORD MODAL                      */}
      {/* ------------------------------------------------------------------ */}

      {showPasswordModal && (
        <div
          className="up-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false);
            }
          }}
        >
          <div
            className="up-modal up-modal-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
          >
            <div className="up-modal-header">
              <h5 className="up-modal-title" id="password-modal-title">
                Change Password
              </h5>
              <button
                type="button"
                className="up-modal-close"
                aria-label="Close"
                onClick={() => setShowPasswordModal(false)}
              >
                <IconClose />
              </button>
            </div>

            <div className="up-modal-body">
              <div className="up-form-group mb-3">
                <label className="up-form-label" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="up-form-input"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="up-form-group">
                <label className="up-form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="up-form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="up-modal-footer">
              <button
                type="button"
                className="up-btn-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="up-btn-submit"
                onClick={handleChangePassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;

// import React, { useState, useEffect } from "react";
// import "../../../styles/allPatients.css";
// // import { users } from "../../../data/users";
// import {
//   getUsers,
//   getRoles,
//   createUser,
//   updateUser,
//   changePassword,
//   toggleStatus,
// } from "../../../services/userService";

// import { getOrganizationsAll } from "../../../services/organizationService";

// import { getLatestPrivacyNotice } from "../../../services/dpdpService";

// import { hasPermission } from "../../permissionUtil";

// const Users = () => {
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [roles, setRoles] = useState([]);

//   const [organizations, setOrganizations] = useState([]);

//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);

//   const [privacyNotice, setPrivacyNotice] = useState(null);

//   const [consentChecked, setConsentChecked] = useState(false);

//   const [loadingConsent, setLoadingConsent] = useState(false);

//   const token = localStorage.getItem("token");

//   const loadUsers = async () => {
//     const res = await getUsers(currentPage - 1, entries, search);
//     // setUsers(res.data.content);
//     // setTotalPages(res.data.totalPages);
//     setUsers(res.data?.content || []);
//     setTotalPages(res.data?.totalPages || 0);
//     console.log("API RESPONSE 👉", res.data);
//     // setUsers(res.data.content);
//     // setTotalPages(res.data.data?.totalPages || 0); // ✅ FIX
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [currentPage, entries, search]);

//   useEffect(() => {
//     getRoles().then((res) => setRoles(res.data.data || []));
//   }, []);

//   useEffect(() => {
//     getOrganizationsAll()
//       .then((res) => {
//         setOrganizations(res.data.data || []);
//       })
//       .catch(console.error);
//   }, []);

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     email: "",
//     employeeNo: "",
//     mobile: "",
//     gender: "",
//     dob: "",
//     // role: "",
//     // roleId: "",
//     roleName: "",
//     organizationId: "",
//     allOrganizations: false,
//     address: "",
//     password: "",
//   });

//   /* Sorting */

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   /* Modal open */

//   const openAdd = () => {
//     setEditData(null);

//     setForm({
//       firstName: "",
//       lastName: "",
//       username: "",
//       email: "",
//       employeeNo: "",
//       mobile: "",
//       gender: "",
//       dob: "",
//       // role: "",
//       roleId: "",
//       organizationId: "",
//       allOrganizations: false,
//       address: "",
//       password: "",
//     });

//     setShowModal(true);
//   };

//   const openEdit = (user) => {
//     setEditData(user);

//     setForm({
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       username: user.username || "",
//       email: user.email || "",
//       employeeNo: user.employeeNo || "",
//       mobile: user.mobile || "",
//       gender: user.gender || "",
//       dob: user.dob || "",
//       // role: user.roles?.[0]?.name || "", // ✅ IMPORTANT
//       // roleId: user.roles?.[0]?.id,
//       roleName: user.roles?.[0]?.name || "",
//       organizationId: user.organization?.id || "",

//       allOrganizations: user.allOrganizations || false,
//       address: user.address || "",
//       password: "", // blank
//     });

//     setShowModal(true);
//   };

//   /* Form change */

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async () => {
//   //   if (editData) {
//   //     await updateUser(editData.id, form);
//   //   } else {
//   //     await createUser(form);
//   //   }

//   //   setShowModal(false);
//   //   setCurrentPage(1);
//   //   loadUsers();
//   // };
//   const saveUser = async () => {
//     if (!form.organizationId) {
//       alert("Please select Organization");
//       return;
//     }
//     try {
//       let res;
//       const payload = {
//         ...form,
//         role: form.roleName, // 🔥 IMPORTANT
//         organizationId: Number(form.organizationId),

//         allOrganizations: form.allOrganizations,
//       };

//       if (editData) {
//         res = await updateUser(editData.id, payload);
//       } else {
//         res = await createUser(payload);
//       }

//       // ✅ Backend message
//       alert(res.data.message);

//       setShowModal(false);
//       setCurrentPage(1);
//       loadUsers();
//     } catch (error) {
//       console.error(error);

//       alert(error.response?.data?.message || "Operation failed ❌");
//     }
//   };

//   const handleSubmit = async () => {
//     if (editData) {
//       await saveUser();
//       return;
//     }

//     if (!form.organizationId) {
//       alert("Please select Organization");
//       return;
//     }

//     try {
//       setLoadingConsent(true);

//       const res = await getLatestPrivacyNotice();

//       setPrivacyNotice(res.data.data);

//       setConsentChecked(false);

//       setShowPrivacyModal(true);
//     } catch (e) {
//       alert(
//         e.response?.data?.message || "Unable to fetch latest Privacy Notice.",
//       );
//     } finally {
//       setLoadingConsent(false);
//     }
//   };

//   // const handleChangePassword = async () => {
//   //   if (password !== confirmPassword) {
//   //     alert("Passwords do not match");
//   //     return;
//   //   }

//   //   await changePassword(editData.id, { password, confirmPassword });

//   //   setShowPasswordModal(false);
//   // };

//   const handleChangePassword = async () => {
//     try {
//       if (password !== confirmPassword) {
//         alert("Passwords do not match");
//         return;
//       }

//       const res = await changePassword(editData.id, {
//         password,
//         confirmPassword,
//       });

//       // ✅ Backend message
//       alert(res.data.message);

//       setShowPasswordModal(false);
//     } catch (error) {
//       console.error(error);

//       alert(error.response?.data?.message || "Password change failed ❌");
//     }
//   };

//   // const handleStatusToggle = async (id) => {
//   //   await toggleStatus(id);

//   //   setUsers((prev) =>
//   //     prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u)),
//   //   );
//   // };

//   const handleStatusToggle = async (id) => {
//     try {
//       const res = await toggleStatus(id);

//       alert(res.data.message); // ✅ NEW

//       setUsers((prev) =>
//         prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u)),
//       );
//     } catch (error) {
//       alert(error.response?.data?.message || "Status update failed ❌");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>User List</h5>

//           {/* <button className="btn btn-light" onClick={openAdd}>
//             + Add New User
//           </button> */}
//           {hasPermission("Users", "ADD") && (
//             <button className="btn btn-light" onClick={openAdd}>
//               ➕ Add New User
//             </button>
//           )}
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
//                 // onChange={(e) => setSearch(e.target.value)}
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
//                   <th>Actions</th>

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("username")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Username {getArrow("username")}
//                   </th>

//                   <th>Full Name</th>

//                   <th
//                     onClick={() => handleSort("mobile")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Phone {getArrow("mobile")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("role")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Role {getArrow("role")}
//                   </th>
//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Organization {getArrow("organization")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {users?.map((u) => (
//                   <tr key={u.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm me-2"
//                         onClick={() => openEdit(u)}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Users", "EDIT") && (
//                         <button
//                           className="btn btn-info btn-sm me-2"
//                           onClick={() => openEdit(u)}
//                         >
//                           Edit
//                         </button>
//                       )}

//                       {/* <button
//                         className="btn btn-primary btn-sm"
//                         onClick={() => {
//                           setEditData(u); // ✅ yahan sahi hai
//                           setShowPasswordModal(true);
//                         }}
//                       >
//                         🔒 Change Password
//                       </button> */}
//                       {hasPermission("Users", "EDIT") && (
//                         <button
//                           className="btn btn-primary btn-sm"
//                           onClick={() => {
//                             setEditData(u);
//                             setShowPasswordModal(true);
//                           }}
//                         >
//                           🔒 Change Password
//                         </button>
//                       )}
//                     </td>

//                     {/* <td>
//                       <div className="form-check form-switch">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           checked={u.status}
//                           onChange={() => handleStatusToggle(u.id)}
//                         />
//                       </div>
//                     </td> */}

//                     <td>{u.username}</td>

//                     <td>
//                       {u.firstName} {u.lastName}
//                     </td>

//                     <td>{u.mobile}</td>

//                     <td>{u.roles?.[0]?.name}</td>
//                     <td>
//                       {u.roles?.[0]?.name === "Admin"
//                         ? "All Organizations"
//                         : u.allOrganizations
//                           ? "All Organizations"
//                           : u.organization?.organizationName}
//                     </td>
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

//       {/* MODAL */}

//       {showModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">
//                   {editData ? "Edit User" : "New User"}
//                 </h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label>First Name</label>
//                     <input
//                       className="form-control"
//                       name="firstName"
//                       value={form.firstName}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Last Name</label>
//                     <input
//                       className="form-control"
//                       name="lastName"
//                       value={form.lastName}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Username</label>
//                     <input
//                       className="form-control"
//                       name="username"
//                       value={form.username}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label>Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       name="password"
//                       value={form.password}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Employee No / Payroll No</label>
//                     <input
//                       className="form-control"
//                       name="employeeNo"
//                       value={form.employeeNo}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Email</label>
//                     <input
//                       className="form-control"
//                       name="email"
//                       value={form.email}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Mobile No</label>
//                     <input
//                       className="form-control"
//                       name="mobile"
//                       value={form.mobile}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Gender</label>
//                     <select
//                       className="form-control"
//                       name="gender"
//                       value={form.gender}
//                       onChange={handleChange}
//                     >
//                       <option>--Select--</option>
//                       <option>Male</option>
//                       <option>Female</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Date of Birth</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="dob"
//                       value={form.dob}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Role</label>

//                     {/* <select
//                       name="role"
//                       value={form.role}
//                       onChange={handleChange}
//                       className="form-control"
//                     >
//                       <option>--Select--</option>
//                       {roles.map((r) => (
//                         <option key={r.id} value={r.name}>
//                           {r.name}
//                         </option>
//                       ))}
//                     </select> */}
//                     <select
//                       className="form-control"
//                       value={form.roleName}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,

//                           roleName: e.target.value,

//                           allOrganizations:
//                             e.target.value === "Admin"
//                               ? false
//                               : form.allOrganizations,
//                         })
//                       }
//                     >
//                       <option value="">Select Role</option>

//                       {roles.map((r) => (
//                         <option key={r.id} value={r.name}>
//                           {r.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Organization</label>

//                     <select
//                       className="form-control"
//                       value={form.organizationId}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           organizationId: Number(e.target.value),
//                         })
//                       }
//                     >
//                       <option value="">Select Organization</option>

//                       {organizations.map((o) => (
//                         <option key={o.id} value={o.id}>
//                           {o.organizationName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {form.roleName !== "Admin" && (
//                     <div className="col-md-12 mb-3">
//                       <div className="form-check form-switch">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           role="switch"
//                           id="allOrganizations"
//                           checked={form.allOrganizations}
//                           onChange={(e) =>
//                             setForm({
//                               ...form,
//                               allOrganizations: e.target.checked,
//                             })
//                           }
//                         />
//                         <label
//                           className="form-check-label fw-semibold"
//                           htmlFor="allOrganizations"
//                           style={{ cursor: "pointer" }}
//                         >
//                           Access All Organizations
//                         </label>
//                       </div>
//                       <small className="text-muted ms-4 d-block">
//                         Enable this to grant the user access to data across all
//                         organizations.
//                       </small>
//                     </div>
//                   )}
//                   <div className="col-md-12 mb-3">
//                     <label>Address</label>
//                     <textarea
//                       className="form-control"
//                       name="address"
//                       value={form.address}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 {/* <button
//                   className="btn btn-primary submit-btn"
//                   onClick={handleSubmit}
//                 >
//                   {editData ? "Update" : "Submit"}
//                 </button> */}
//                 {hasPermission("Users", editData ? "EDIT" : "ADD") && (
//                   <button
//                     className="btn btn-primary submit-btn"
//                     onClick={handleSubmit}
//                     disabled={loadingConsent}
//                   >
//                     {loadingConsent
//                       ? "Loading..."
//                       : editData
//                         ? "Update"
//                         : "Submit"}
//                   </button>
//                 )}

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

//       {showPrivacyModal && (
//         <>
//           <div
//             className="modal fade show"
//             style={{
//               display: "block",
//               backgroundColor: "rgba(0,0,0,0.6)",
//             }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-scrollable">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Privacy Notice</h5>

//                   <button
//                     className="btn-close"
//                     onClick={() => {
//                       setConsentChecked(false);
//                       setShowPrivacyModal(false);
//                     }}
//                   />
//                 </div>

//                 <div className="modal-body">
//                   <div className="alert alert-info">
//                     <h6>
//                       Purpose :<strong> User Registration</strong>
//                     </h6>

//                     <p>
//                       <strong>Title :</strong>
//                       {privacyNotice?.title}
//                     </p>

//                     <p>
//                       <strong>Version :</strong>
//                       {privacyNotice?.version}
//                     </p>
//                   </div>

//                   <div
//                     style={{
//                       maxHeight: "350px",
//                       overflowY: "auto",
//                       border: "1px solid #ddd",
//                       padding: "15px",
//                       borderRadius: "5px",
//                     }}
//                   >
//                     {privacyNotice?.content}
//                   </div>

//                   <div className="form-check mt-4">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={consentChecked}
//                       onChange={(e) => setConsentChecked(e.target.checked)}
//                     />

//                     <label className="form-check-label">
//                       I have read and understood the Privacy Notice and agree to
//                       the processing of my personal data for User Registration.
//                     </label>
//                   </div>
//                 </div>

//                 <div className="modal-footer">
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() => {
//                       setConsentChecked(false);
//                       setShowPrivacyModal(false);
//                     }}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     className="btn btn-primary"
//                     disabled={!consentChecked}
//                     onClick={async () => {
//                       await saveUser();

//                       setConsentChecked(false);

//                       setShowPrivacyModal(false);
//                     }}
//                   >
//                     Accept & Continue
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="modal-backdrop fade show"></div>
//         </>
//       )}

//       {showPasswordModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Change Password</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowPasswordModal(false)} // ✅ correct
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label>Password</label>

//                   <input
//                     type="password"
//                     className="form-control"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label>Confirm Password</label>

//                   <input
//                     type="password"
//                     className="form-control"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="btn btn-primary submit-btn"
//                   onClick={handleChangePassword}
//                 >
//                   Submit
//                 </button>

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setShowPasswordModal(false)}
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

// export default Users;

// import React, { useState, useEffect } from "react";
// import "../../../styles/allPatients.css";
// import {
//   getUsers,
//   getRoles,
//   createUser,
//   updateUser,
//   changePassword,
//   toggleStatus,
// } from "../../../services/userService";

// // ── Injected Styles (same theme as Login) ────────────────────────────────────
// const usersStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

//   .up-page {
//     font-family: 'DM Sans', sans-serif;
//     background: #f0f2f5;
//     min-height: 100vh;
//     padding: 1.5rem;
//   }

//   /* ── Card ── */
//   .up-card {
//     background: #ffffff;
//     border-radius: 16px;
//     box-shadow: 0 4px 24px rgba(0,0,0,0.08);
//     overflow: hidden;
//   }

//   /* ── Header ── */
//   .up-header {
//     background: #0a2d4a;
//     padding: 1.1rem 1.75rem;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     position: relative;
//     overflow: hidden;
//   }

//   .up-header::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
//   }

//   .up-header-left {
//     position: relative;
//     z-index: 1;
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }

//   .up-header-icon {
//     width: 34px;
//     height: 34px;
//     background: rgba(91,191,255,0.15);
//     border: 0.5px solid rgba(91,191,255,0.3);
//     border-radius: 9px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .up-header h5 {
//     font-family: 'Playfair Display', serif;
//     font-size: 18px;
//     font-weight: 600;
//     color: #ffffff;
//     margin: 0;
//   }

//   .up-add-btn {
//     position: relative;
//     z-index: 1;
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     background: rgba(255,255,255,0.12);
//     border: 0.5px solid rgba(255,255,255,0.3);
//     border-radius: 8px;
//     color: #ffffff;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     padding: 8px 16px;
//     cursor: pointer;
//     transition: background 0.15s;
//   }
//   .up-add-btn:hover { background: rgba(255,255,255,0.2); }

//   /* ── Body ── */
//   .up-body { padding: 1.5rem 1.75rem; }

//   /* ── Toolbar ── */
//   .up-toolbar {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 1.25rem;
//     flex-wrap: wrap;
//     gap: 0.75rem;
//   }

//   .up-entries {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     font-size: 13.5px;
//     color: #555;
//   }

//   .up-select {
//     height: 34px;
//     padding: 0 10px;
//     border: 0.5px solid #ccc;
//     border-radius: 7px;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     color: #333;
//     background: #fff;
//     outline: none;
//     cursor: pointer;
//   }
//   .up-select:focus { border-color: #185fa5; box-shadow: 0 0 0 3px rgba(24,95,165,0.08); }

//   .up-search-wrap {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     font-size: 13.5px;
//     color: #555;
//   }

//   .up-search {
//     height: 34px;
//     padding: 0 10px 0 34px;
//     border: 0.5px solid #ccc;
//     border-radius: 7px;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     color: #333;
//     background: #fff;
//     outline: none;
//     width: 200px;
//     transition: border-color 0.15s, box-shadow 0.15s;
//   }
//   .up-search:focus { border-color: #185fa5; box-shadow: 0 0 0 3px rgba(24,95,165,0.08); }
//   .up-search::placeholder { color: #bbb; }

//   .up-search-icon-wrap {
//     position: relative;
//     display: flex;
//     align-items: center;
//   }
//   .up-search-icon {
//     position: absolute;
//     left: 9px;
//     opacity: 0.35;
//     pointer-events: none;
//   }

//   /* ── Table ── */
//   .up-table-wrap {
//     border-radius: 10px;
//     border: 0.5px solid #e5e5e5;
//     overflow: auto;
//     max-height: 520px;
//   }

//   .up-table {
//     width: max-content;
//     min-width: 100%;
//     border-collapse: collapse;
//     font-size: 13.5px;
//   }

//   .up-table thead th {
//     position: sticky;
//     top: 0;
//     background: #f7f8fa;
//     z-index: 2;
//     padding: 11px 16px;
//     font-size: 11.5px;
//     font-weight: 500;
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//     color: #666;
//     border-bottom: 0.5px solid #e5e5e5;
//     white-space: nowrap;
//     user-select: none;
//   }

//   .up-table thead th.sortable { cursor: pointer; }
//   .up-table thead th.sortable:hover { color: #0a2d4a; background: #eef0f3; }

//   .up-table tbody tr {
//     border-bottom: 0.5px solid #f0f0f0;
//     transition: background 0.1s;
//   }
//   .up-table tbody tr:last-child { border-bottom: none; }
//   .up-table tbody tr:hover { background: #f7fbff; }

//   .up-table td {
//     padding: 11px 16px;
//     color: #333;
//     white-space: nowrap;
//     vertical-align: middle;
//   }

//   .up-sort-arrow {
//     display: inline-block;
//     margin-left: 5px;
//     font-size: 10px;
//     opacity: 0.5;
//   }
//   .up-sort-arrow.active { opacity: 1; color: #0a2d4a; }

//   /* ── Avatar ── */
//   .up-avatar {
//     width: 30px;
//     height: 30px;
//     border-radius: 50%;
//     background: #e8f0fb;
//     color: #185fa5;
//     font-size: 11px;
//     font-weight: 500;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     margin-right: 8px;
//     flex-shrink: 0;
//     text-transform: uppercase;
//   }

//   .up-name-cell { display: flex; align-items: center; }

//   /* ── Role Badge ── */
//   .up-role-badge {
//     display: inline-block;
//     padding: 3px 10px;
//     border-radius: 20px;
//     font-size: 11.5px;
//     font-weight: 500;
//     background: rgba(10,45,74,0.08);
//     color: #0a2d4a;
//     letter-spacing: 0.03em;
//   }

//   /* ── Status Toggle ── */
//   .up-toggle-wrap { display: flex; align-items: center; gap: 7px; }

//   .up-toggle {
//     position: relative;
//     display: inline-block;
//     width: 36px;
//     height: 20px;
//     flex-shrink: 0;
//   }
//   .up-toggle input { opacity: 0; width: 0; height: 0; }
//   .up-toggle-slider {
//     position: absolute;
//     inset: 0;
//     background: #ddd;
//     border-radius: 20px;
//     cursor: pointer;
//     transition: background 0.2s;
//   }
//   .up-toggle-slider::before {
//     content: '';
//     position: absolute;
//     width: 14px;
//     height: 14px;
//     left: 3px;
//     top: 3px;
//     background: #fff;
//     border-radius: 50%;
//     transition: transform 0.2s;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.2);
//   }
//   .up-toggle input:checked + .up-toggle-slider { background: #0a2d4a; }
//   .up-toggle input:checked + .up-toggle-slider::before { transform: translateX(16px); }

//   .up-status-label { font-size: 12px; }
//   .up-status-label.active { color: #0f6e56; font-weight: 500; }
//   .up-status-label.inactive { color: #999; }

//   /* ── Action Buttons ── */
//   .up-btn-edit {
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     padding: 5px 11px;
//     border-radius: 6px;
//     font-size: 12.5px;
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     cursor: pointer;
//     border: 0.5px solid #b8d4f0;
//     background: #e8f0fb;
//     color: #185fa5;
//     transition: background 0.15s;
//     margin-right: 6px;
//   }
//   .up-btn-edit:hover { background: #d0e4f7; }

//   .up-btn-pwd {
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     padding: 5px 11px;
//     border-radius: 6px;
//     font-size: 12.5px;
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     cursor: pointer;
//     border: 0.5px solid #c8dff8;
//     background: #f0f5ff;
//     color: #0a2d4a;
//     transition: background 0.15s;
//   }
//   .up-btn-pwd:hover { background: #ddeaf8; }

//   /* ── Footer / Pagination ── */
//   .up-footer {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: 1.25rem;
//     flex-wrap: wrap;
//     gap: 0.75rem;
//   }

//   .up-page-info { font-size: 13px; color: #777; }

//   .up-pagination { display: flex; align-items: center; gap: 4px; }

//   .up-page-btn {
//     height: 32px;
//     min-width: 32px;
//     padding: 0 10px;
//     border-radius: 7px;
//     border: 0.5px solid #ddd;
//     background: #fff;
//     font-size: 13px;
//     font-family: 'DM Sans', sans-serif;
//     color: #444;
//     cursor: pointer;
//     transition: background 0.12s, border-color 0.12s, color 0.12s;
//   }
//   .up-page-btn:hover:not(:disabled):not(.active) { background: #f0f5ff; border-color: #b8d4f0; }
//   .up-page-btn.active { background: #0a2d4a; border-color: #0a2d4a; color: #fff; font-weight: 500; }
//   .up-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

//   /* ── Modal Overlay ── */
//   .up-overlay {
//     position: fixed;
//     inset: 0;
//     background: rgba(0,0,0,0.45);
//     z-index: 1050;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 1rem;
//     animation: up-fade-in 0.15s ease;
//   }
//   @keyframes up-fade-in { from { opacity:0 } to { opacity:1 } }

//   .up-modal {
//     background: #fff;
//     border-radius: 14px;
//     width: 100%;
//     max-width: 680px;
//     box-shadow: 0 20px 60px rgba(0,0,0,0.18);
//     overflow: hidden;
//     animation: up-slide-up 0.18s ease;
//   }
//   .up-modal-sm { max-width: 420px; }
//   @keyframes up-slide-up { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }

//   .up-modal-header {
//     background: #0a2d4a;
//     padding: 1rem 1.5rem;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     position: relative;
//     overflow: hidden;
//   }
//   .up-modal-header::before {
//     content:'';
//     position:absolute;
//     inset:0;
//     background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 100%);
//   }

//   .up-modal-title {
//     font-family: 'Playfair Display', serif;
//     font-size: 16px;
//     font-weight: 600;
//     color: #fff;
//     position: relative;
//     z-index: 1;
//     margin: 0;
//   }

//   .up-modal-close {
//     position: relative;
//     z-index: 1;
//     background: rgba(255,255,255,0.12);
//     border: 0.5px solid rgba(255,255,255,0.25);
//     border-radius: 6px;
//     width: 28px;
//     height: 28px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     color: #fff;
//     transition: background 0.15s;
//   }
//   .up-modal-close:hover { background: rgba(255,255,255,0.22); }

//   .up-modal-body { padding: 1.5rem; }

//   /* ── Form ── */
//   .up-form-grid {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 1rem;
//   }
//   .up-form-full { grid-column: 1 / -1; }

//   .up-form-group { display: flex; flex-direction: column; gap: 5px; }

//   .up-form-label {
//     font-size: 12px;
//     font-weight: 500;
//     color: #666;
//     letter-spacing: 0.04em;
//     text-transform: uppercase;
//   }

//   .up-form-input,
//   .up-form-select,
//   .up-form-textarea {
//     height: 38px;
//     padding: 0 11px;
//     border: 0.5px solid #ccc;
//     border-radius: 7px;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     color: #111;
//     background: #fff;
//     outline: none;
//     transition: border-color 0.15s, box-shadow 0.15s;
//     width: 100%;
//   }
//   .up-form-textarea { height: 72px; padding: 9px 11px; resize: vertical; }
//   .up-form-input:focus,
//   .up-form-select:focus,
//   .up-form-textarea:focus {
//     border-color: #185fa5;
//     box-shadow: 0 0 0 3px rgba(24,95,165,0.09);
//   }

//   /* ── Modal Footer ── */
//   .up-modal-footer {
//     padding: 1rem 1.5rem;
//     border-top: 0.5px solid #eee;
//     display: flex;
//     justify-content: flex-end;
//     gap: 0.75rem;
//   }

//   .up-btn-submit {
//     height: 38px;
//     padding: 0 20px;
//     background: #0a2d4a;
//     color: #fff;
//     border: none;
//     border-radius: 7px;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     cursor: pointer;
//     transition: background 0.15s;
//   }
//   .up-btn-submit:hover { background: #0e3d66; }

//   .up-btn-cancel {
//     height: 38px;
//     padding: 0 20px;
//     background: #fff;
//     color: #c0392b;
//     border: 0.5px solid #f5c0bb;
//     border-radius: 7px;
//     font-size: 13.5px;
//     font-family: 'DM Sans', sans-serif;
//     font-weight: 500;
//     cursor: pointer;
//     transition: background 0.15s;
//   }
//   .up-btn-cancel:hover { background: #fff5f4; }

//   /* ── Empty state ── */
//   .up-empty {
//     text-align: center;
//     padding: 3rem 1rem;
//     color: #aaa;
//     font-size: 14px;
//   }

//   @media (max-width: 600px) {
//     .up-form-grid { grid-template-columns: 1fr; }
//     .up-form-full { grid-column: 1; }
//   }
// `;

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const IconUsers = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="6" cy="5" r="2.5" stroke="rgba(91,191,255,0.9)" strokeWidth="1.3"/>
//     <path d="M1 13c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="rgba(91,191,255,0.9)" strokeWidth="1.3" strokeLinecap="round"/>
//     <circle cx="12" cy="5" r="2" stroke="rgba(91,191,255,0.6)" strokeWidth="1.3"/>
//     <path d="M14 12.5c0-1.5-1.3-2.8-3-3.2" stroke="rgba(91,191,255,0.6)" strokeWidth="1.3" strokeLinecap="round"/>
//   </svg>
// );

// const IconPlus = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <line x1="7" y1="2" x2="7" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//     <line x1="2" y1="7" x2="12" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// );

// const IconSearch = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
//     <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//   </svg>
// );

// const IconEdit = () => (
//   <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//     <path d="M9 2l2 2-7 7H2v-2L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
//   </svg>
// );

// const IconLock = () => (
//   <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//     <rect x="2" y="5.5" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
//     <path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     <circle cx="6.5" cy="8.5" r="0.9" fill="currentColor"/>
//   </svg>
// );

// const IconClose = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <line x1="3" y1="3" x2="11" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//     <line x1="11" y1="3" x2="3" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// );

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function initials(firstName = "", lastName = "") {
//   return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// const Users = () => {
//   // ── original state (unchanged) ──
//   const [search, setSearch]             = useState("");
//   const [entries, setEntries]           = useState(10);
//   const [currentPage, setCurrentPage]   = useState(1);
//   const [sortColumn, setSortColumn]     = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [showModal, setShowModal]       = useState(false);
//   const [editData, setEditData]         = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [password, setPassword]         = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [users, setUsers]               = useState([]);
//   const [totalPages, setTotalPages]     = useState(0);
//   const [roles, setRoles]               = useState([]);

//   const [form, setForm] = useState({
//     firstName: "", lastName: "", username: "", email: "",
//     employeeNo: "", mobile: "", gender: "", dob: "",
//     role: "", address: "", password: "",
//   });

//   // ── original data loading (unchanged) ──
//   const loadUsers = async () => {
//     const res = await getUsers(currentPage - 1, entries, search);
//     setUsers(res.data.content);
//     setTotalPages(res.data.totalPages);
//   };

//   useEffect(() => { loadUsers(); }, [currentPage, entries, search]);
//   useEffect(() => { getRoles().then((res) => setRoles(res.data)); }, []);

//   // ── original handlers (unchanged) ──
//   const handleSort = (column) => {
//     setSortDirection(sortColumn === column && sortDirection === "asc" ? "desc" : "asc");
//     setSortColumn(column);
//   };

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";
//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   const openAdd = () => {
//     setEditData(null);
//     setForm({ firstName:"", lastName:"", username:"", email:"",
//               employeeNo:"", mobile:"", gender:"", dob:"",
//               role:"", address:"", password:"" });
//     setShowModal(true);
//   };

//   const openEdit = (user) => {
//     setEditData(user);
//     setForm({
//       firstName: user.firstName || "", lastName: user.lastName || "",
//       username: user.username || "", email: user.email || "",
//       employeeNo: user.employeeNo || "", mobile: user.mobile || "",
//       gender: user.gender || "", dob: user.dob || "",
//       role: user.roles?.[0]?.name || "", address: user.address || "", password: "",
//     });
//     setShowModal(true);
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     if (editData) { await updateUser(editData.id, form); }
//     else          { await createUser(form); }
//     setShowModal(false);
//     setCurrentPage(1);
//     loadUsers();
//   };

//   const handleChangePassword = async () => {
//     if (password !== confirmPassword) { alert("Passwords do not match"); return; }
//     await changePassword(editData.id, { password, confirmPassword });
//     setShowPasswordModal(false);
//   };

//   const handleStatusToggle = async (id) => {
//     await toggleStatus(id);
//     setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: !u.status } : u));
//   };

//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{usersStyles}</style>

//       <div className="up-page">
//         <div className="up-card">

//           {/* ── Header ── */}
//           <div className="up-header">
//             <div className="up-header-left">
//               <div className="up-header-icon"><IconUsers /></div>
//               <h5>User List</h5>
//             </div>
//             <button className="up-add-btn" onClick={openAdd}>
//               <IconPlus /> Add New User
//             </button>
//           </div>

//           {/* ── Body ── */}
//           <div className="up-body">

//             {/* Toolbar */}
//             <div className="up-toolbar">
//               <div className="up-entries">
//                 Show
//                 <select
//                   className="up-select"
//                   value={entries}
//                   onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }}
//                 >
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                 </select>
//                 entries
//               </div>

//               <div className="up-search-wrap">
//                 Search:
//                 <div className="up-search-icon-wrap">
//                   <span className="up-search-icon"><IconSearch /></span>
//                   <input
//                     type="text"
//                     className="up-search"
//                     placeholder="Search users..."
//                     value={search}
//                     onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="up-table-wrap">
//               <table className="up-table">
//                 <thead>
//                   <tr>
//                     <th>Actions</th>
//                     <th className="sortable" onClick={() => handleSort("status")}>
//                       Status <span className={`up-sort-arrow ${sortColumn==="status"?"active":""}`}>{getArrow("status")}</span>
//                     </th>
//                     <th className="sortable" onClick={() => handleSort("username")}>
//                       Username <span className={`up-sort-arrow ${sortColumn==="username"?"active":""}`}>{getArrow("username")}</span>
//                     </th>
//                     <th>Full Name</th>
//                     <th className="sortable" onClick={() => handleSort("mobile")}>
//                       Phone <span className={`up-sort-arrow ${sortColumn==="mobile"?"active":""}`}>{getArrow("mobile")}</span>
//                     </th>
//                     <th className="sortable" onClick={() => handleSort("role")}>
//                       Role <span className={`up-sort-arrow ${sortColumn==="role"?"active":""}`}>{getArrow("role")}</span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.length === 0 ? (
//                     <tr>
//                       <td colSpan={6}>
//                         <div className="up-empty">No users found.</div>
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((u) => (
//                       <tr key={u.id}>
//                         {/* Actions */}
//                         <td>
//                           <button className="up-btn-edit" onClick={() => openEdit(u)}>
//                             <IconEdit /> Edit
//                           </button>
//                           <button
//                             className="up-btn-pwd"
//                             onClick={() => { setEditData(u); setShowPasswordModal(true); }}
//                           >
//                             <IconLock /> Change Password
//                           </button>
//                         </td>

//                         {/* Status toggle */}
//                         <td>
//                           <div className="up-toggle-wrap">
//                             <label className="up-toggle">
//                               <input
//                                 type="checkbox"
//                                 checked={u.status}
//                                 onChange={() => handleStatusToggle(u.id)}
//                               />
//                               <span className="up-toggle-slider" />
//                             </label>
//                             <span className={`up-status-label ${u.status ? "active" : "inactive"}`}>
//                               {u.status ? "Active" : "Inactive"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* Username */}
//                         <td style={{ fontWeight: 500, color: "#0a2d4a" }}>{u.username}</td>

//                         {/* Full Name with avatar */}
//                         <td>
//                           <div className="up-name-cell">
//                             <div className="up-avatar">{initials(u.firstName, u.lastName)}</div>
//                             {u.firstName} {u.lastName}
//                           </div>
//                         </td>

//                         {/* Phone */}
//                         <td>{u.mobile}</td>

//                         {/* Role */}
//                         <td>
//                           {u.roles?.[0]?.name && (
//                             <span className="up-role-badge">{u.roles[0].name}</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer */}
//             <div className="up-footer">
//               <div className="up-page-info">
//                 Showing page {currentPage} of {totalPages}
//               </div>
//               <div className="up-pagination">
//                 <button
//                   className="up-page-btn"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                 >
//                   ← Prev
//                 </button>

//                 {pageNumbers.map((num) => (
//                   <button
//                     key={num}
//                     className={`up-page-btn ${currentPage === num ? "active" : ""}`}
//                     onClick={() => setCurrentPage(num)}
//                   >
//                     {num}
//                   </button>
//                 ))}

//                 <button
//                   className="up-page-btn"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ══════════ ADD / EDIT MODAL ══════════ */}
//       {showModal && (
//         <div className="up-overlay">
//           <div className="up-modal">
//             <div className="up-modal-header">
//               <h5 className="up-modal-title">{editData ? "Edit User" : "New User"}</h5>
//               <button className="up-modal-close" onClick={() => setShowModal(false)}>
//                 <IconClose />
//               </button>
//             </div>

//             <div className="up-modal-body">
//               <div className="up-form-grid">

//                 <div className="up-form-group">
//                   <label className="up-form-label">First Name</label>
//                   <input className="up-form-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Last Name</label>
//                   <input className="up-form-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Username</label>
//                   <input className="up-form-input" name="username" value={form.username} onChange={handleChange} placeholder="Username"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Password</label>
//                   <input type="password" className="up-form-input" name="password" value={form.password} onChange={handleChange} placeholder="Password"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Employee No / Payroll No</label>
//                   <input className="up-form-input" name="employeeNo" value={form.employeeNo} onChange={handleChange} placeholder="EMP-001"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Email</label>
//                   <input className="up-form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@hospital.com"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Mobile No</label>
//                   <input className="up-form-input" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 00000 00000"/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Gender</label>
//                   <select className="up-form-select" name="gender" value={form.gender} onChange={handleChange}>
//                     <option value="">-- Select --</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                   </select>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Date of Birth</label>
//                   <input type="date" className="up-form-input" name="dob" value={form.dob} onChange={handleChange}/>
//                 </div>

//                 <div className="up-form-group">
//                   <label className="up-form-label">Role</label>
//                   <select className="up-form-select" name="role" value={form.role} onChange={handleChange}>
//                     <option value="">-- Select --</option>
//                     {roles.map((r) => (
//                       <option key={r.id} value={r.name}>{r.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="up-form-group up-form-full">
//                   <label className="up-form-label">Address</label>
//                   <textarea className="up-form-textarea" name="address" value={form.address} onChange={handleChange} placeholder="Full address"/>
//                 </div>

//               </div>
//             </div>

//             <div className="up-modal-footer">
//               <button className="up-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
//               <button className="up-btn-submit" onClick={handleSubmit}>
//                 {editData ? "Update User" : "Create User"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════ CHANGE PASSWORD MODAL ══════════ */}
//       {showPasswordModal && (
//         <div className="up-overlay">
//           <div className="up-modal up-modal-sm">
//             <div className="up-modal-header">
//               <h5 className="up-modal-title">Change Password</h5>
//               <button className="up-modal-close" onClick={() => setShowPasswordModal(false)}>
//                 <IconClose />
//               </button>
//             </div>

//             <div className="up-modal-body">
//               <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
//                 <div className="up-form-group">
//                   <label className="up-form-label">New Password</label>
//                   <input
//                     type="password"
//                     className="up-form-input"
//                     placeholder="Enter new password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 <div className="up-form-group">
//                   <label className="up-form-label">Confirm Password</label>
//                   <input
//                     type="password"
//                     className="up-form-input"
//                     placeholder="Confirm new password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="up-modal-footer">
//               <button className="up-btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
//               <button className="up-btn-submit" onClick={handleChangePassword}>Update Password</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Users;
