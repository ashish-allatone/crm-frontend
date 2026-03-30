import React, { useState ,useEffect} from "react";
import "../../styles/allPatients.css";

import { getTodayAppointments } from "../../services/appointmentService";
import { getAppointments } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";
const UpcommingAppointment = () => {

  
    const navigate=useNavigate();
  
    const [appointments, setAppointments] = useState([]);
    
  
  
  
  const [totalPages, setTotalPages] = useState(0);
  
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
  
    const handleSort = (column) => {
  
      let direction = "asc";
  
      if (sortColumn === column && sortDirection === "asc") {
        direction = "desc";
      }
  
      setSortColumn(column);
      setSortDirection(direction);
    };
  const loadAppointments = async () => {
    const res = await getAppointments(
      currentPage - 1,
      entries,
      search,
      "UPCOMING"
    );
  
    setAppointments(res.data.content);
    setTotalPages(res.data.totalPages);
  };  
  
    // search filter
  useEffect(() => {
    loadAppointments();
  }, [currentPage, entries, search]);  
  
  
  
   
  
    const getArrow = (column) => {
  
      if (sortColumn !== column) return "⇅";
  
      return sortDirection === "asc" ? "▲" : "▼";
    };
  
    const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
    return (
  
      <div className="container-fluid mt-3">
  
        <div className="card">
  
          <div
            className="card-header"
            style={{ background: "#3fb4b6", color: "white" }}
          >
            <h5>Upcomming Appointment</h5>
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
  
                    <th>Action</th>
  
                    <th
                      onClick={() => handleSort("lm")}
                      style={{ cursor: "pointer" }}
                    >
                      LM NO. {getArrow("lm")}
                    </th>
  
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      PATIENT NAME {getArrow("name")}
                    </th>
  
                    <th
                      onClick={() => handleSort("mobile")}
                      style={{ cursor: "pointer" }}
                    >
                      MOBILE NO. {getArrow("mobile")}
                    </th>
  
                    <th
                      onClick={() => handleSort("organization")}
                      style={{ cursor: "pointer" }}
                    >
                      ORGANIZATION NAME {getArrow("organization")}
                    </th>
  
                    <th
                      onClick={() => handleSort("provider")}
                      style={{ cursor: "pointer" }}
                    >
                      SERVICES PROVIDER {getArrow("provider")}
                    </th>
  
                    <th
                      onClick={() => handleSort("insurance")}
                      style={{ cursor: "pointer" }}
                    >
                      INSURANCE COMPANY {getArrow("insurance")}
                    </th>
  
                    <th
                      onClick={() => handleSort("visit")}
                      style={{ cursor: "pointer" }}
                    >
                      VISIT DATE {getArrow("visit")}
                    </th>
  
                    <th>
                      VIEW DETAILS
                    </th>
  
                  </tr>
  
                </thead>
  
                <tbody>
    {appointments.length === 0 ? (
      <tr>
        <td colSpan="9" className="text-center">
          No appointments found
        </td>
      </tr>
    ) : (
      appointments.map((a) => (
        <tr key={a.appointmentId}>
  
          {/* ✅ ACTION FIRST */}
          <td>
            <div className="dropdown">
              <button
                className="btn btn-info dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Action
              </button>
  
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      navigate(`/edit-appointment/${a.appointmentId}`)
                    }
                  >
                    Edit Appointment
                  </button>
                </li>
              </ul>
            </div>
          </td>
  
          {/* ✅ LM NO */}
          <td>{a.appointmentId}</td>
  
          {/* ✅ PATIENT NAME */}
          <td>{a.patientName}</td>
  
          {/* ✅ MOBILE */}
          <td>{a.mobile}</td>
  
          {/* ✅ ORGANIZATION */}
          <td>{a.organizationName}</td>
  
          {/* ✅ SERVICE PROVIDER */}
          <td>{a.serviceProviderName}</td>
  
          {/* ✅ INSURANCE */}
          <td>{a.insuranceName}</td>
  
          {/* ✅ VISIT DATE */}
          <td>{a.visitDate}</td>
  
          {/* ✅ VIEW */}
          <td className="text-primary" style={{ cursor: "pointer" }}>
            View
          </td>
  
        </tr>
      ))
    )}
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
  
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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

export default UpcommingAppointment;