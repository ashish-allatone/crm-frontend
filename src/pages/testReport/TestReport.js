import React, { useState , useEffect } from "react";
import "../../styles/allPatients.css";
import { getAppointments } from "../../services/appointmentService";
import { useNavigate} from "react-router-dom";

const TestReport = () => {

//   const reports = [];

  const navigate=useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [appointments, setAppointments] = useState([]);
const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  loadAppointments();
}, [currentPage, entries, search]);

const loadAppointments = async () => {
  const res = await getAppointments(currentPage - 1, entries, search);

  setAppointments(res.data.content);
  setTotalPages(res.data.totalPages);
};

  const handleSort = (column) => {

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

    if (sortColumn !== column) return "⇅";

    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (

    <div className="container-fluid mt-3">

      <div className="card">

        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Test Report</h5>
        </div>

        <div className="card-body">

          {/* Entries + Search */}

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

          {/* Table */}

          <div
            style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
            className="table-scroll"
          >

            <table className="table table-bordered all-table">

              <thead>

                <tr>

                  <th>Actions</th>

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
                    MOBILE {getArrow("mobile")}
                  </th>

                  <th
                    onClick={() => handleSort("age")}
                    style={{ cursor: "pointer" }}
                  >
                    AGE / GENDER {getArrow("age")}
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
                    onClick={() => handleSort("registered")}
                    style={{ cursor: "pointer" }}
                  >
                    REGISTERED ON {getArrow("registered")}
                  </th>

                  <th
                    onClick={() => handleSort("details")}
                    style={{ cursor: "pointer" }}
                  >
                    VIEW DETAILS {getArrow("details")}
                  </th>

                </tr>

              </thead>

              <tbody>

                {appointments.length === 0 ? (

                  <tr>
                    <td colSpan="10" className="text-center">
                      No matching records found
                    </td>
                  </tr>

                ) : (

                 appointments.map((a) => (

                    <tr key={a.appointmentId}>

                      <td>
                        <button
className="btn btn-info btn-sm"
onClick={() =>
  navigate(`/test-report-upload/${a.appointmentId}`)
}
>
View Test Report
</button>
                      </td>

                     <td>{a.appointmentId}</td>
<td>{a.patientName}</td>
<td>{a.mobile}</td>
<td>{a.ageGender}</td>
<td>{a.organizationName}</td>
<td>{a.serviceProviderName}</td>
<td>{a.insuranceName}</td>
<td>{a.visitDate}</td>

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

export default TestReport;