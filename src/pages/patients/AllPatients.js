import React, { useState, useEffect } from "react";
import "../../styles/allPatients.css";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { getPatients, deletePatient } from "../../services/patientService";
import { hasPermission } from "../permissionUtil";

const AllPatients = () => {
  const navigate = useNavigate();
  // const { id } = useParams();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // const loadPatients = async () => {
  //   const res = await getPatients(currentPage - 1, entries, search);

  //   setPatients(res.data.content);
  //   setTotalPages(res.data.totalPages);
  // };
  const loadPatients = async () => {
    try {
      const res = await getPatients(currentPage - 1, entries, search);
      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmDelete) return;

    try {
      await deletePatient(patientId);

      alert("Patient deleted successfully.");

      loadPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete patient.");
    }
  };

  useEffect(() => {
    loadPatients();
  }, [currentPage, entries, search]);

  const handleSort = (column) => {
    if (column === "insurance" || column === "approval") return;

    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getArrow = (column) => {
    if (column === "insurance" || column === "approval") return "";

    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>All Patient List</h5>

          {/* <button
            className="btn btn-light"
            onClick={() => navigate("/add-patient")}
          >
            👤 New Patient Registration
          </button> */}
          {hasPermission("Patients", "ADD") && (
            <button
              className="btn btn-light"
              onClick={() => navigate("/add-patient")}
            >
              👤 New Patient Registration
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
                  <th>Action</th>
                  {/* <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status {getArrow("status")}
                  </th> */}

                  <th
                    onClick={() => handleSort("lm")}
                    style={{ cursor: "pointer" }}
                  >
                    LM No. {getArrow("lm")}
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Patient Name {getArrow("name")}
                  </th>

                  <th
                    onClick={() => handleSort("mobile")}
                    style={{ cursor: "pointer" }}
                  >
                    Mobile {getArrow("mobile")}
                  </th>

                  <th
                    onClick={() => handleSort("age")}
                    style={{ cursor: "pointer" }}
                  >
                    Age / Gender {getArrow("age")}
                  </th>

                  <th
                    onClick={() => handleSort("org")}
                    style={{ cursor: "pointer" }}
                  >
                    Organization Name {getArrow("org")}
                  </th>

                  {/* <th
                    onClick={() => handleSort("provider")}
                    style={{ cursor: "pointer" }}
                  >
                    Services Provider {getArrow("provider")}
                  </th> */}
                  <th
                    onClick={() => handleSort("dc")}
                    style={{ cursor: "pointer" }}
                  >
                    Diagnostic Center {getArrow("dc")}
                  </th>

                  <th>Insurance</th>

                  {/* <th>Approval</th> */}

                  <th
                    onClick={() => handleSort("appointment")}
                    style={{ cursor: "pointer" }}
                  >
                    Appointment Date {getArrow("appointment")}
                  </th>

                  <th
                    onClick={() => handleSort("registered")}
                    style={{ cursor: "pointer" }}
                  >
                    Registered On {getArrow("registered")}
                  </th>

                  <th
                    onClick={() => handleSort("tat")}
                    style={{ cursor: "pointer" }}
                  >
                    TAT {getArrow("tat")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-info dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          Action
                        </button>

                        <ul className="dropdown-menu">
                          {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(`/patient-details/${p.id}`)
                              }
                            >
                              View Details
                            </button>
                          </li> */}
                          {hasPermission("Patients", "VIEW") && (
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  navigate(`/patient-details/${p.id}`)
                                }
                              >
                                View Details
                              </button>
                            </li>
                          )}

                          {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() => navigate(`/edit-patient/${p.id}`)}
                            >
                              Edit
                            </button>
                          </li> */}
                          {hasPermission("Patients", "EDIT") && (
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  navigate(`/edit-patient/${p.id}`)
                                }
                              >
                                Edit
                              </button>
                            </li>
                          )}

                          {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(`/create-appointment/${p.id}`)
                              }
                            >
                              Create Appointment
                            </button>
                          </li> */}
                          {/* {hasPermission("Patients", "ADD") && ( */}
                          {hasPermission("Appointment", "ADD") && !p.hasAppointment && (
  <li>
    <button
      className="dropdown-item"
      onClick={() => navigate(`/create-appointment/${p.id}`)}
    >
      Create Appointment
    </button>
  </li>
)}

{/* For showing proper alert on click create appointment */}
{/* {hasPermission("Appointment", "ADD") && (
  <li>
    <button
      className="dropdown-item"
      onClick={() => {
        if (p.hasAppointment) {
          alert("Patient appointment already done earlier.");
          return;
        }

        navigate(`/create-appointment/${p.id}`);
      }}
    >
      Create Appointment
    </button>
  </li>
)} */}

                          {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                navigate(`/add-package-price/${p.id}`)
                              }
                            >
                              Add Package Price
                            </button>
                          </li> */}
                          {hasPermission("Patients", "EDIT") && (
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  navigate(`/add-package-price/${p.id}`)
                                }
                              >
                                Add Package Price
                              </button>
                            </li>
                          )}
                          <li>
                            {hasPermission("Patients", "EDIT") && (
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(p.id)}
                              >
                                Delete Patient
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </td>

                    {/* <td>{p.status}</td> */}
                    <td>{p.id}</td>
                    <td className="text-primary">{p.patientName}</td>
                    <td>{p.mobileNumber}</td>
                    <td>
                      {p.age} / {p.gender}
                    </td>
                    <td>{p.organizationName}</td>
                    <td>{p.diagnosticCenterName || "-"}</td>
                    <td>{p.insuranceName}</td>
                    {/* <td>{p.approval}</td> */}
                    <td>{p.appointmentDate}</td>
                    <td>
                      {p.registered
                        ? new Date(p.registered).toLocaleString()
                        : "-"}
                    </td>
                    <td>{p.tat || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          {/* Table Footer */}

          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Showing Entries */}

            <div>
              Showing page {currentPage} of {totalPages}
            </div>

            {/* Pagination */}

            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
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
    </div>
  );
};

export default AllPatients;
