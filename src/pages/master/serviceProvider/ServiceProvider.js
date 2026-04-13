import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";
import { useNavigate } from "react-router-dom";
// import { serviceProviders } from "../../../data/serviceProviders";
import {
  getServiceProviders,
  deleteServiceProvider,
} from "../../../services/serviceProviderService";
import { hasPermission } from "../../permissionUtil";

const ServiceProvider = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [providers, setProviders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // const loadProviders = async () => {
  //   const res = await getServiceProviders(currentPage - 1, entries, search);

  //   setProviders(res.data.content);
  //   setTotalPages(res.data.totalPages);
  // };
  const loadProviders = async () => {
  try {
    const res = await getServiceProviders(currentPage - 1, entries, search);

    setProviders(res.data.content);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    if (err.response?.status === 403) {
      alert("Access Denied ❌");
    }
  }
};

  useEffect(() => {
    loadProviders();
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

  /* Search */

  /* Sorted */

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  /* Arrow */

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
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
          <h5>Service Provider (Labs) Master</h5>

          {/* <button
            className="btn btn-light"
            onClick={() => navigate("/add-service-provider")}
          >
            Add New Service Provider
          </button> */}
          {hasPermission("Service Provider", "ADD") && (
  <button
    className="btn btn-light"
    onClick={() => navigate("/add-service-provider")}
  >
    Add New Service Provider
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
                  setSearch(e.target.value.trimStart());
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

                  {/* <th
                    onClick={() => handleSort("sno")}
                    style={{ cursor: "pointer" }}
                  >
                    S.No. {getArrow("sno")}
                  </th> */}

                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Provider Name {getArrow("name")}
                  </th>

                  <th
                    onClick={() => handleSort("type")}
                    style={{ cursor: "pointer" }}
                  >
                    Type {getArrow("type")}
                  </th>

                  {/* <th
                    onClick={() => handleSort("code")}
                    style={{ cursor: "pointer" }}
                  >
                    Code {getArrow("code")}
                  </th> */}

                  <th
                    onClick={() => handleSort("address")}
                    style={{ cursor: "pointer" }}
                  >
                    Address {getArrow("address")}
                  </th>

                  <th
                    onClick={() => handleSort("city")}
                    style={{ cursor: "pointer" }}
                  >
                    City {getArrow("city")}
                  </th>

                  <th
                    onClick={() => handleSort("state")}
                    style={{ cursor: "pointer" }}
                  >
                    State {getArrow("state")}
                  </th>

                  <th
                    onClick={() => handleSort("country")}
                    style={{ cursor: "pointer" }}
                  >
                    Country {getArrow("country")}
                  </th>

                  <th
                    onClick={() => handleSort("registrationNo")}
                    style={{ cursor: "pointer" }}
                  >
                    Registration No. {getArrow("registrationNo")}
                  </th>

                  <th
                    onClick={() => handleSort("contactPerson")}
                    style={{ cursor: "pointer" }}
                  >
                    Contact Person Name {getArrow("contactPerson")}
                  </th>

                  <th
                    onClick={() => handleSort("mobile")}
                    style={{ cursor: "pointer" }}
                  >
                    Mobile No. {getArrow("mobile")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {providers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {/* <button
                        className="btn btn-info btn-sm"
                        onClick={() =>
                          navigate(`/edit-service-provider/${p.id}`)
                        }
                      >
                        Edit
                      </button> */}
                      {hasPermission("Service Provider", "EDIT") && (
  <button
    className="btn btn-info btn-sm"
    onClick={() =>
      navigate(`/edit-service-provider/${p.id}`)
    }
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
                          checked={p.status}
                          readOnly
                        />
                      </div>
                    </td> */}

                    {/* <td>{p.sno}</td> */}
                    <td>{p.name}</td>
                    <td>{p.providerType}</td>
                    {/* <td>{p.code}</td> */}
                    <td>{p.address}</td>
                    <td>{p.city}</td>
                    <td>{p.state}</td>
                    <td>{p.country}</td>
                    <td>{p.licenseNumber}</td>
                    <td>{p.contactPersonName}</td>
                    <td>{p.contactMobile}</td>
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
    </div>
  );
};

export default ServiceProvider;
