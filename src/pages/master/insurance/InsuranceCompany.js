import React, { useState, useEffect } from "react";

import "../../../styles/allPatients.css";

import {
  getInsurances,
  createInsurance,
  updateInsurance,
  deleteInsurance,
} from "../../../services/insuranceService";

import { getOrganizationsAll } from "../../../services/organizationService";
import { hasPermission } from "../../permissionUtil";

const InsuranceCompany = () => {
  // const navigate = useNavigate();

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

  const [form, setForm] = useState({
    insuranceName: "",
    organizationId: "",
    file: null,
  });

  const [organizations, setOrganizations] = useState([]);
  // useEffect(() => {
  //   const loadOrgs = async () => {
  //     const res = await getOrganizationsAll();
  //     setOrganizations(res.data.data);
  //   };
  //   loadOrgs();
  // }, []);
  useEffect(() => {
  const loadOrgs = async () => {
    try {
      const res = await getOrganizationsAll();
      setOrganizations(res.data.data);
    } catch (err) {
      console.warn("Organization access denied");

      setOrganizations([]); // fallback
    }
  };
  loadOrgs();
}, []);

  // const loadInsurances = async () => {
  //   const res = await getInsurances(currentPage - 1, entries, search);

  //   setInsurances(res.data.content);
  //   setTotalPages(res.data.totalPages);
  // };
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

  // const handleSubmit = async () => {
  //   const formData = new FormData();

  //   formData.append("insuranceName", form.insuranceName);
  //   if (form.organizationId)
  //     formData.append("organizationId", Number(form.organizationId));

  //   if (form.file) formData.append("file", form.file);

  //   if (editData) {
  //     await updateInsurance(editData.id, formData);
  //   } else {
  //     await createInsurance(formData);
  //   }

  //   setShowModal(false);
  //   loadInsurances();
  // };
  const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append("insuranceName", form.insuranceName);

    if (form.organizationId)
      formData.append("organizationId", Number(form.organizationId));

    if (form.file) formData.append("file", form.file);

    let res;

    if (editData) {
      res = await updateInsurance(editData.id, formData);
    } else {
      res = await createInsurance(formData);
    }

    // ✅ Backend message show
    if (res.data.success) {
      alert(res.data.message); // "Insurance created successfully" / "updated successfully"

      setShowModal(false);
      loadInsurances();
    } else {
      alert(res.data.message || "Something went wrong ❌");
    }

  } catch (error) {
    console.error(error);

    // ❌ Error message
    alert(
      error.response?.data?.message ||
      "Operation failed ❌"
    );
  }
};
const canViewOrg = hasPermission("Organization", "VIEW");

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
          <h5>Insurance Master</h5>

          {/* <button
            className="btn btn-light"
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
          >
            + Add New Insurance
          </button> */}
          {hasPermission("Insurance", "ADD") && (
  <button
    className="btn btn-light"
    onClick={() => {
      setEditData(null);
      setShowModal(true);
    }}
  >
    + Add New Insurance
  </button>
)}
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
                  <th>Actions</th>

                  {/* <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th> */}

                  <th
                    onClick={() => handleSort("company")}
                    style={{ cursor: "pointer" }}
                  >
                    Company Name {getArrow("company")}
                  </th>

                  <th
                    onClick={() => handleSort("document")}
                    style={{ cursor: "pointer" }}
                  >
                    Document {getArrow("document")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {insurances.map((i) => (
                  <tr key={i.id}>
                    <td>
                      {/* <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          setEditData(i);
                          setForm({
                            insuranceName: i.insuranceName,
                            organizationId: i.organizationId || "",
                            file: null,
                          });
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button> */}
                      {hasPermission("Insurance", "EDIT") && (
  <button
    className="btn btn-info btn-sm"
    onClick={() => {
      setEditData(i);
      setForm({
        insuranceName: i.insuranceName,
        organizationId: i.organizationId || "",
        file: null,
      });
      setShowModal(true);
    }}
  >
    Edit
  </button>
)}
                    </td>

                    {/* <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={i.isActive}
                        />
                      </div>
                    </td> */}

                    <td>{i.insuranceName}</td>

                    <td>
                      {/* <button
                        className="btn btn-link"
                        style={{ color: "#6c63ff" }}
                        onClick={() =>
                          setPdfPreview(
                            `http://localhost:8080/api/insurances/file/${i.id}`,
                          )
                        }
                      >
                        View
                      </button> */}
                      {hasPermission("Insurance", "VIEW") && (
  <button
    className="btn btn-link"
    style={{ color: "#6c63ff" }}
    onClick={() =>
      setPdfPreview(`http://localhost:8080/api/insurances/file/${i.id}`)
    }
  >
    View
  </button>
)}
                    </td>
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
                  {editData ? "Edit Insurance" : "New Insurance"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    {editData ? "Company Name" : "Insurance Name"}
                  </label>

                  <input
                    className="form-control"
                    name="insuranceName"
                    value={form.insuranceName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Organization</label>
                  {canViewOrg ? (
                  <select
                    className="form-control"
                    name="organizationId"
                    value={form.organizationId}
                    onChange={handleChange}
                  >
                    <option value="">All</option>

                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.organizationName}
                      </option>
                    ))}
                  </select>) : (
  <input
    className="form-control"
    value="No Organization Access"
    disabled
  />
)}
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload Insurance PDF</label>

                  <input
                    type="file"
                    className="form-control"
                    name="file"
                    onChange={handleChange}
                  />
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

      {pdfPreview && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">Document Preview</h5>

                <button
                  className="btn-close"
                  onClick={() => setPdfPreview(null)}
                ></button>
              </div>

              <div className="modal-body">
                <iframe
                  src={pdfPreview}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                  style={{ border: "none" }}
                  onError={() => alert("Preview failed")}
                ></iframe>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => window.open(pdfPreview, "_blank")}
                >
                  Print
                </button>

                <a href={pdfPreview} download className="btn btn-success">
                  Download
                </a>

                <button
                  className="btn btn-danger"
                  onClick={() => setPdfPreview(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCompany;
