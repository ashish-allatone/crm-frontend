import React, { useState, useEffect } from "react";
import {
  getInsurances,
  createInsurance,
  updateInsurance,
} from "../../../services/insuranceService";
import api from "../../../services/api";
import { getOrganizationsAll } from "../../../services/organizationService";
import { hasPermission } from "../../permissionUtil";
import { getCurrentUser } from "../../../services/userService";

const InsuranceCompany = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const [insurances, setInsurances] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    insuranceName: "",
    organizationId: "",
    file: null,
  });

  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const res = await getOrganizationsAll();
        setOrganizations(res.data.data);
      } catch (err) {
        console.warn("Organization access denied");
        setOrganizations([]);
      }
    };
    loadOrgs();
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        const user = res.data.data;
        setCurrentUser(user);

        const admin = user.roles?.some(
          (r) => r.name?.toLowerCase() === "admin"
        );

        setIsAdmin(admin);

        if (!admin && user.organization) {
          setForm((prev) => ({
            ...prev,
            organizationId: user.organization.id,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadCurrentUser();
  }, []);

  const loadInsurances = async () => {
    try {
      const res = await getInsurances(currentPage - 1, entries, search);
      setInsurances(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  useEffect(() => {
    loadInsurances();
  }, [currentPage, entries, search]);

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("insuranceName", form.insuranceName);

      if (form.organizationId) {
        formData.append("organizationId", Number(form.organizationId));
      }

      if (form.file) formData.append("file", form.file);

      let res;
      if (editData) {
        res = await updateInsurance(editData.id, formData);
      } else {
        res = await createInsurance(formData);
      }

      if (res.data.success) {
        alert(res.data.message);
        setShowModal(false);
        loadInsurances();
      } else {
        alert(res.data.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed ❌");
    }
  };

  const canViewOrg = hasPermission("Organization", "VIEW");

  const openAddModal = () => {
    setEditData(null);
    setShowModal(true);
  };

  const openEditModal = (insurance) => {
    setEditData(insurance);
    setForm({
      insuranceName: insurance.insuranceName,
      organizationId:
        !isAdmin && currentUser?.organization
          ? currentUser.organization.id
          : insurance.organizationId || "",
      file: null,
    });
    setShowModal(true);
  };

  const closeInsuranceModal = () => setShowModal(false);

  const styles = `
     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


    .im-page {
      min-height: calc(100vh - 70px);
      padding: 24px;
      background: #f4f7fb;
      color: #26364a;
      font-family: 'Inter', sans-serif;
    }
    .im-card {
      
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e5eaf1;
      border-radius: 15px;
      box-shadow: 0 8px 28px rgba(24, 45, 75, .07);
    }
    .im-header {
      min-height: 76px;
      padding: 18px 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .im-title {
      margin: 0;
      font-size: 19px;
      line-height: 1.35;
      font-weight: 750;
      letter-spacing: -.3px;
    }

    .im-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.im-header-icon {
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

.im-header-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
    .im-subtitle {
      margin: 5px 0 0;
      color: rgba(255,255,255,.72);
      font-size: 11px;
    }
    .im-add-btn {
      border: 1px solid rgba(255,255,255,.42);
      border-radius: 8px;
      padding: 10px 15px;
      color: #183451;
      background: #fff;
      font: 650 12px 'Inter', sans-serif;
      white-space: nowrap;
      transition: .18s ease;
    }
    .im-add-btn:hover {
      color: #142b4a;
      background: #edf3f9;
      transform: translateY(-1px);
    }
    .im-body { padding: 24px 25px 25px; }
    .im-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .im-entries, .im-search-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #65748a;
      font-size: 12px;
      white-space: nowrap;
    }
    .im-select, .im-search {
      min-height: 36px;
      border: 1px solid #d9e1eb;
      border-radius: 7px;
      padding: 7px 10px;
      color: #34465d;
      background: #fff;
      font: 400 12px 'Inter', sans-serif;
      outline: none;
    }
    .im-select:focus, .im-search:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49,87,127,.10);
    }
    .im-search { width: 220px; }
    .im-table-wrap {
      overflow: auto;
      max-height: 700px;
      border: 1px solid #e5eaf1;
      border-radius: 9px;
    }
    .im-table {
      width: 100%;
      min-width: 560px;
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
      color: #43536a;
      font-size: 12px;
    }
    .im-table thead th {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 14px 15px;
      border: 0;
      border-bottom: 1px solid #dfe6ef;
      color: #29435f;
      background: #f1f5f9;
      font-size: 11px;
      font-weight: 750;
      letter-spacing: .2px;
      white-space: nowrap;
    }
    .im-table tbody td {
      padding: 13px 15px;
      border: 0;
      border-bottom: 1px solid #edf0f4;
      vertical-align: middle;
      background: #fff;
    }
    .im-table tbody tr:last-child td { border-bottom: 0; }
    .im-table tbody tr:hover td { background: #f8fafd; }
    .im-sort {
      margin-left: 7px;
      color: #8392a5;
      font-size: 10px;
    }
    .im-action-btn {
      border: 1px solid #cbd9e7;
      border-radius: 6px;
      padding: 6px 11px;
      color: #24496e;
      background: #edf3f9;
      font: 650 11px 'Inter', sans-serif;
      transition: .15s ease;
    }
    .im-action-btn:hover { background: #dfeaf5; }
    .im-view-btn {
      border: 0;
      padding: 4px 2px;
      color: #315c86;
      background: transparent;
      font: 650 11px 'Inter', sans-serif;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .im-view-btn:hover { color: #142b4a; }
    .im-empty {
      padding: 32px 15px !important;
      color: #8a97a8;
      text-align: center;
    }
    .im-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      margin-top: 18px;
      color: #758397;
      font-size: 11px;
    }
    .im-pagination {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .im-page-btn {
      min-width: 32px;
      height: 31px;
      padding: 0 9px;
      border: 1px solid #dce3ec;
      border-radius: 6px;
      color: #53657b;
      background: #fff;
      font: 500 11px 'Inter', sans-serif;
    }
    .im-page-btn:hover:not(:disabled) { background: #f0f4f8; }
    .im-page-btn:disabled { opacity: .45; cursor: not-allowed; }
    .im-page-btn.active {
      border-color: #203e63;
      color: #fff;
      background: #203e63;
    }
    .im-overlay {
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-y: auto;
      padding: 20px;
      background: rgba(13, 27, 44, .58);
      backdrop-filter: blur(3px);
    }
    .im-modal {
      width: 100%;
      max-width: 520px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 20px 60px rgba(7, 20, 36, .25);
    }
    .im-modal-wide { max-width: 1000px; }
    .im-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      padding: 17px 21px;
      color: #fff;
      background: linear-gradient(110deg, #142b4a 0%, #203e63 100%);
    }
    .im-modal-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
    }
    .im-close {
      width: 29px;
      height: 29px;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 7px;
      color: #fff;
      background: rgba(255,255,255,.12);
      font-size: 19px;
      line-height: 1;
    }
    .im-modal-body { padding: 22px; }
    .im-form-group { margin-bottom: 17px; }
    .im-form-group:last-child { margin-bottom: 0; }
    .im-label {
      display: block;
      margin-bottom: 7px;
      color: #46566b;
      font-size: 11px;
      font-weight: 650;
    }
    .im-control {
      display: block;
      width: 100%;
      min-height: 41px;
      padding: 9px 11px;
      border: 1px solid #d9e1eb;
      border-radius: 7px;
      color: #2b3e54;
      background: #fff;
      font: 400 12px 'Inter', sans-serif;
      outline: none;
      box-sizing: border-box;
    }
    .im-control:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49,87,127,.10);
    }
    .im-control:disabled { background: #f2f5f8; color: #8b97a6; }
    .im-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 9px;
      padding: 15px 21px;
      border-top: 1px solid #edf0f4;
      background: #fbfcfe;
    }
    .im-btn {
      min-height: 37px;
      padding: 8px 15px;
      border: 1px solid transparent;
      border-radius: 7px;
      font: 650 11px 'Inter', sans-serif;
      cursor: pointer;
      transition: .15s ease;
    }
    .im-btn-primary {
      color: #fff;
      border-color: #203e63;
      background: linear-gradient(110deg, #142b4a 0%, #284c73 100%);
    }
    .im-btn-primary:hover { box-shadow: 0 4px 10px rgba(26,55,88,.18); }
    .im-btn-cancel {
      color: #5c6a7d;
      border-color: #d7dee8;
      background: #fff;
    }
    .im-btn-cancel:hover { background: #f1f4f7; }
    .im-preview-frame {
      display: block;
      width: 100%;
      height: 68vh;
      border: 1px solid #e5eaf1;
      border-radius: 6px;
    }
    @media (max-width: 700px) {
      .im-page { padding: 13px; }
      .im-header { align-items: flex-start; padding: 17px; }
      .im-body { padding: 17px; }
      .im-toolbar { align-items: flex-start; flex-direction: column; }
      .im-search-wrap { width: 100%; }
      .im-search { flex: 1; width: auto; }
      .im-footer { align-items: flex-start; flex-direction: column; }
      .im-pagination { max-width: 100%; }
    }
    @media (max-width: 420px) {
      .im-header { flex-direction: column; }
      .im-add-btn { width: 100%; }
      .im-modal-footer { flex-direction: column-reverse; }
      .im-btn { width: 100%; }
      .im-overlay { padding: 10px; }
    }
  `;

  return (
    <div className="im-page">
      <style>{styles}</style>

      <div className="im-card">
        <div className="im-header">
          <div className="im-header-left">

  <div className="im-header-icon">
    <svg viewBox="0 0 24 24">
      <path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  </div>

  <div>
    <h2 className="im-title">Insurance Master</h2>
    <p className="im-subtitle">
      Manage insurance companies and their documents
    </p>
  </div>

</div>

          {hasPermission("Insurance", "ADD") && (
            <button className="im-add-btn" onClick={openAddModal}>
              + Add New Insurance
            </button>
          )}
        </div>

        <div className="im-body">
          <div className="im-toolbar">
            <div className="im-entries">
              <span>Show</span>
              <select
                className="im-select"
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
              <span>entries</span>
            </div>

            <label className="im-search-wrap">
              <span>Search</span>
              <input
                type="text"
                className="im-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search insurance..."
              />
            </label>
          </div>

          <div className="im-table-wrap">
            <table className="im-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th
                    onClick={() => handleSort("company")}
                    style={{ cursor: "pointer" }}
                  >
                    Company Name <span className="im-sort">{getArrow("company")}</span>
                  </th>
                  <th
                    onClick={() => handleSort("document")}
                    style={{ cursor: "pointer" }}
                  >
                    Document <span className="im-sort">{getArrow("document")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {insurances.length > 0 ? (
                  insurances.map((insurance) => (
                    <tr key={insurance.id}>
                      <td>
                        {hasPermission("Insurance", "EDIT") && (
                          <button
                            className="im-action-btn"
                            onClick={() => openEditModal(insurance)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td>{insurance.insuranceName}</td>
                      <td>
                        {hasPermission("Insurance", "VIEW") && (
                          <button
                            className="im-view-btn"
                            onClick={() =>
                              setPdfPreview(
                                `${api.defaults.baseURL}/insurances/file/${insurance.id}`
                              )
                            }
                          >
                            View Document
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="im-empty" colSpan={3}>
                      No insurance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="im-footer">
            <div>
              Showing page {currentPage} of {totalPages}
            </div>

            <nav aria-label="Insurance pagination">
              <ul className="im-pagination">
                <li>
                  <button
                    className="im-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li key={num}>
                    <button
                      className={`im-page-btn ${currentPage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="im-page-btn"
                    disabled={currentPage === totalPages}
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
        <div className="im-overlay" role="presentation">
          <div className="im-modal" role="dialog" aria-modal="true" aria-labelledby="im-insurance-title">
            <div className="im-modal-header">
              <h3 className="im-modal-title" id="im-insurance-title">
                {editData ? "Edit Insurance" : "New Insurance"}
              </h3>
              <button
                className="im-close"
                aria-label="Close"
                onClick={closeInsuranceModal}
              >
                ×
              </button>
            </div>

            <div className="im-modal-body">
              <div className="im-form-group">
                <label className="im-label" htmlFor="im-insurance-name">
                  {editData ? "Company Name" : "Insurance Name"}
                </label>
                <input
                  id="im-insurance-name"
                  className="im-control"
                  name="insuranceName"
                  value={form.insuranceName}
                  onChange={handleChange}
                />
              </div>

              <div className="im-form-group">
                <label className="im-label" htmlFor="im-organization">
                  Organization
                </label>

                {canViewOrg ? (
                  isAdmin ? (
                    <select
                      id="im-organization"
                      className="im-control"
                      name="organizationId"
                      value={form.organizationId}
                      onChange={handleChange}
                    >
                      <option value="">Select Organization</option>
                      {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                          {organization.organizationName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="im-organization"
                      className="im-control"
                      value={currentUser?.organization?.organizationName || ""}
                      disabled
                      readOnly
                    />
                  )
                ) : (
                  <input
                    id="im-organization"
                    className="im-control"
                    value="No Organization Access"
                    disabled
                    readOnly
                  />
                )}
              </div>

              <div className="im-form-group">
                <label className="im-label" htmlFor="im-insurance-file">
                  Upload Insurance PDF
                </label>
                <input
                  id="im-insurance-file"
                  type="file"
                  className="im-control"
                  name="file"
                  accept="application/pdf,.pdf"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="im-modal-footer">
              <button className="im-btn im-btn-cancel" onClick={closeInsuranceModal}>
                Cancel
              </button>
              <button className="im-btn im-btn-primary" onClick={handleSubmit}>
                {editData ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pdfPreview && (
        <div className="im-overlay" role="presentation">
          <div className="im-modal im-modal-wide" role="dialog" aria-modal="true" aria-labelledby="im-preview-title">
            <div className="im-modal-header">
              <h3 className="im-modal-title" id="im-preview-title">Document Preview</h3>
              <button
                className="im-close"
                aria-label="Close preview"
                onClick={() => setPdfPreview(null)}
              >
                ×
              </button>
            </div>

            <div className="im-modal-body">
              <iframe
                src={pdfPreview}
                className="im-preview-frame"
                title="PDF Preview"
                onError={() => alert("Preview failed")}
              />
            </div>

            <div className="im-modal-footer">
              <button
                className="im-btn im-btn-cancel"
                onClick={() => setPdfPreview(null)}
              >
                Close
              </button>
              <a
                href={pdfPreview}
                download
                className="im-btn im-btn-primary"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                Download
              </a>
              <button
                className="im-btn im-btn-primary"
                onClick={() => window.open(pdfPreview, "_blank")}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCompany;

// import React, { useState, useEffect } from "react";

// import "../../../styles/allPatients.css";

// import {
//   getInsurances,
//   createInsurance,
//   updateInsurance,
//   deleteInsurance,
// } from "../../../services/insuranceService";

// import api from "../../../services/api";


// import { getOrganizationsAll } from "../../../services/organizationService";
// import { hasPermission } from "../../permissionUtil";

// import { getCurrentUser } from "../../../services/userService";

// const InsuranceCompany = () => {
//   // const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [showModal, setShowModal] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const [pdfPreview, setPdfPreview] = useState(null);

//   const [insurances, setInsurances] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   const [currentUser, setCurrentUser] = useState(null);
// const [isAdmin, setIsAdmin] = useState(false);

//   const [form, setForm] = useState({
//     insuranceName: "",
//     organizationId: "",
//     file: null,
//   });

//   const [organizations, setOrganizations] = useState([]);
//   // useEffect(() => {
//   //   const loadOrgs = async () => {
//   //     const res = await getOrganizationsAll();
//   //     setOrganizations(res.data.data);
//   //   };
//   //   loadOrgs();
//   // }, []);
//   useEffect(() => {
//   const loadOrgs = async () => {
//     try {
//       const res = await getOrganizationsAll();
//       setOrganizations(res.data.data);
//     } catch (err) {
//       console.warn("Organization access denied");

//       setOrganizations([]); // fallback
//     }
//   };
//   loadOrgs();
// }, []);

// useEffect(() => {
//   const loadCurrentUser = async () => {
//     try {
//       const res = await getCurrentUser();

//       const user = res.data.data;

//       setCurrentUser(user);

//       const admin = user.roles?.some(
//         (r) => r.name?.toLowerCase() === "admin"
//       );

//       setIsAdmin(admin);

//       // Non-admin => organization auto set
//       if (!admin && user.organization) {
//         setForm((prev) => ({
//           ...prev,
//           organizationId: user.organization.id,
//         }));
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadCurrentUser();
// }, []);

//   // const loadInsurances = async () => {
//   //   const res = await getInsurances(currentPage - 1, entries, search);

//   //   setInsurances(res.data.content);
//   //   setTotalPages(res.data.totalPages);
//   // };
//   const loadInsurances = async () => {
//   try {
//     const res = await getInsurances(currentPage - 1, entries, search);

//     setInsurances(res.data.content);
//     setTotalPages(res.data.totalPages);
//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };

//   useEffect(() => {
//     loadInsurances();
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
//     const { name, value, files } = e.target;

//     if (name === "file") {
//       setForm({ ...form, file: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   // const handleSubmit = async () => {
//   //   const formData = new FormData();

//   //   formData.append("insuranceName", form.insuranceName);
//   //   if (form.organizationId)
//   //     formData.append("organizationId", Number(form.organizationId));

//   //   if (form.file) formData.append("file", form.file);

//   //   if (editData) {
//   //     await updateInsurance(editData.id, formData);
//   //   } else {
//   //     await createInsurance(formData);
//   //   }

//   //   setShowModal(false);
//   //   loadInsurances();
//   // };
//   const handleSubmit = async () => {
//   try {
//     const formData = new FormData();

//     formData.append("insuranceName", form.insuranceName);

//     if (form.organizationId)
//       formData.append("organizationId", Number(form.organizationId));

//     if (form.file) formData.append("file", form.file);

//     let res;

//     if (editData) {
//       res = await updateInsurance(editData.id, formData);
//     } else {
//       res = await createInsurance(formData);
//     }

//     // ✅ Backend message show
//     if (res.data.success) {
//       alert(res.data.message); // "Insurance created successfully" / "updated successfully"

//       setShowModal(false);
//       loadInsurances();
//     } else {
//       alert(res.data.message || "Something went wrong ❌");
//     }

//   } catch (error) {
//     console.error(error);

//     // ❌ Error message
//     alert(
//       error.response?.data?.message ||
//       "Operation failed ❌"
//     );
//   }
// };
// const canViewOrg = hasPermission("Organization", "VIEW");

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
//           <h5>Insurance Master</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => {
//               setEditData(null);
//               setShowModal(true);
//             }}
//           >
//             + Add New Insurance
//           </button> */}
//           {hasPermission("Insurance", "ADD") && (
//   <button
//     className="btn btn-light"
//     onClick={() => {
//       setEditData(null);
//       setShowModal(true);
//     }}
//   >
//     ➕ Add New Insurance
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
//                   <th>Actions</th>

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("company")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Company Name {getArrow("company")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("document")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Document {getArrow("document")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {insurances.map((i) => (
//                   <tr key={i.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => {
//                           setEditData(i);
//                           setForm({
//                             insuranceName: i.insuranceName,
//                             organizationId: i.organizationId || "",
//                             file: null,
//                           });
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Insurance", "EDIT") && (
//   <button
//     className="btn btn-info btn-sm"
//     onClick={() => {
//       setEditData(i);
//       // setForm({
//       //   insuranceName: i.insuranceName,
//       //   organizationId: i.organizationId || "",
//       //   file: null,
//       // });
//       setForm({
//   insuranceName: i.insuranceName,
//   organizationId:
//     !isAdmin && currentUser?.organization
//       ? currentUser.organization.id
//       : i.organizationId || "",
//   file: null,
// });
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
//                           checked={i.isActive}
//                         />
//                       </div>
//                     </td> */}

//                     <td>{i.insuranceName}</td>

//                     <td>
//                       {/* <button
//                         className="btn btn-link"
//                         style={{ color: "#6c63ff" }}
//                         onClick={() =>
//                           setPdfPreview(
//                             `http://localhost:8080/api/insurances/file/${i.id}`,
//                           )
//                         }
//                       >
//                         View
//                       </button> */}
//                       {hasPermission("Insurance", "VIEW") && (
//   <button
//     className="btn btn-link"
//     style={{ color: "#6c63ff" }}
//     onClick={() =>
//       // setPdfPreview(`http://localhost:9090/insurances/file/${i.id}`)
//       // setPdfPreview(`https://uatdms.healncare.in/crm-api/insurances/file/${i.id}`)
//       setPdfPreview(
//   `${api.defaults.baseURL}/insurances/file/${i.id}`
// )
//     }
//   >
//     View
//   </button>
// )}
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
//       {showModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">
//                   {editData ? "Edit Insurance" : "New Insurance"}
//                 </h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">
//                     {editData ? "Company Name" : "Insurance Name"}
//                   </label>

//                   <input
//                     className="form-control"
//                     name="insuranceName"
//                     value={form.insuranceName}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* <div className="mb-3">
//                   <label className="form-label">Organization</label>
//                   {canViewOrg ? (
//                   <select
//                     className="form-control"
//                     name="organizationId"
//                     value={form.organizationId}
//                     onChange={handleChange}
//                   >
//                     <option value="">All</option>

//                     {organizations.map((o) => (
//                       <option key={o.id} value={o.id}>
//                         {o.organizationName}
//                       </option>
//                     ))}
//                   </select>) : (
//   <input
//     className="form-control"
//     value="No Organization Access"
//     disabled
//   />
// )}
//                 </div> */}
//                 <div className="mb-3">
//   <label className="form-label">Organization</label>

//   {canViewOrg ? (
//     isAdmin ? (
//       <select
//         className="form-control"
//         name="organizationId"
//         value={form.organizationId}
//         onChange={handleChange}
//       >
//         <option value="">Select Organization</option>

//         {organizations.map((o) => (
//           <option key={o.id} value={o.id}>
//             {o.organizationName}
//           </option>
//         ))}
//       </select>
//     ) : (
//       <input
//         className="form-control"
//         value={currentUser?.organization?.organizationName || ""}
//         disabled
//       />
//     )
//   ) : (
//     <input
//       className="form-control"
//       value="No Organization Access"
//       disabled
//     />
//   )}
// </div>

//                 <div className="mb-3">
//                   <label className="form-label">Upload Insurance PDF</label>

//                   <input
//                     type="file"
//                     className="form-control"
//                     name="file"
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                <button
//   className="btn btn-primary submit-btn"
//   onClick={handleSubmit}
// >
//   {editData ? "Update" : "Submit"}
// </button>

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

//       {pdfPreview && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog modal-xl">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Document Preview</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setPdfPreview(null)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <iframe
//                   src={pdfPreview}
//                   width="100%"
//                   height="600px"
//                   title="PDF Preview"
//                   style={{ border: "none" }}
//                   onError={() => alert("Preview failed")}
//                 ></iframe>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => window.open(pdfPreview, "_blank")}
//                 >
//                   Print
//                 </button>

//                 <a href={pdfPreview} download className="btn btn-success">
//                   Download
//                 </a>

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setPdfPreview(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InsuranceCompany;
