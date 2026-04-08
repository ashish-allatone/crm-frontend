import React, { useState ,useEffect} from "react";
import "../../styles/allPatients.css";
import { getAppointments } from "../../services/appointmentService";
import { getTestResult } from "../../services/testResultService";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

const TestResult = () => {
  //   const testResults = [];
  const pdfRef = useRef();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [appointments, setAppointments] = useState([]);
const [totalPages, setTotalPages] = useState(0);
const [selectedResult, setSelectedResult] = useState(null);
const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();

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

  const handleView = async (appointmentId) => {
  try {
    const res = await getTestResult(appointmentId);
    setSelectedResult(res.data.data);
    setShowModal(true); // 🔥 open modal
  } catch (err) {
    console.error(err);
    alert("No test result found for this appointment");
  }
};

const handleExportPDF = async () => {
  const input = pdfRef.current;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  
  const fileName = `${selectedResult.patientName}_TestResult_${new Date().
    toISOString().split("T")[0]}.pdf`;

  pdf.save(fileName);
};

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{ background: "#3fb4b6", color: "white" }}
        >
          <h5>Test Result</h5>
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

                  <th>VIEW DETAILS</th>
                </tr>
              </thead>

              <tbody>
  {appointments.length === 0 ? (
    <tr>
      <td colSpan="10" className="text-center">
        No data found
      </td>
    </tr>
  ) : (
    appointments.map((a) => (
      <tr key={a.appointmentId}>

        {/* ACTION */}
        <td>
          <div className="dropdown">
            <button className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown">
              Action
            </button>

            <ul className="dropdown-menu">

              {/* 🔥 ADD TEST RESULT */}
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    navigate(`/add-test-result/${a.appointmentId}`)
                  }
                >
                  Add Test Result
                </button>
              </li>

            </ul>
          </div>
        </td>

        <td>{a.appointmentId}</td>
        <td>{a.patientName}</td>
        <td>{a.mobile}</td>
        <td>{a.ageGender}</td>
        <td>{a.organizationName}</td>
        <td>{a.serviceProviderName}</td>
        <td>{a.insuranceName}</td>
        <td>{a.visitDate}</td>

        {/* 🔥 VIEW DETAILS */}
        <td
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => handleView(a.appointmentId)}
        >
          View
        </td>

      </tr>
    ))
  )}
</tbody>
            </table>
            {showModal && selectedResult && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">

        {/* HEADER */}
        <div className="modal-header">
          <h5 className="modal-title">
            Test Result - {selectedResult.patientName}
          </h5>
          <button
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        {/* BODY */}
        <div className="modal-body" ref={pdfRef}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Test</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Range</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {selectedResult.results.map((r, i) => (
                <tr key={i}>
                  <td>{r.testName}</td>
                  <td>{r.resultValue}</td>
                  <td>{r.unit}</td>
                  <td>{r.referenceRange}</td>
                  <td>{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">

  {/* 🔥 EXPORT BUTTON */}
  <button
    className="btn btn-success"
    onClick={handleExportPDF}
  >
    Export as PDF
  </button>

  <button
    className="btn btn-secondary"
    onClick={() => setShowModal(false)}
  >
    Close
  </button>

</div>

      </div>
    </div>
  </div>
)}
          {/* {selectedResult && (
  <div className="card mt-3">
    <div className="card-header bg-primary text-white">
      Test Result - {selectedResult.patientName}
    </div>

    <div className="card-body">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Test</th>
            <th>Result</th>
            <th>Unit</th>
            <th>Range</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {selectedResult.results.map((r, i) => (
            <tr key={i}>
              <td>{r.testName}</td>
              <td>{r.resultValue}</td>
              <td>{r.unit}</td>
              <td>{r.referenceRange}</td>
              <td>{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}   */}
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

export default TestResult;
