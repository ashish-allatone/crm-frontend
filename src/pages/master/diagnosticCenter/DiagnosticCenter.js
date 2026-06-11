
import React, { useState, useEffect } from "react";
import "../../../styles/allPatients.css";
import { getDiagnosticCenters } from "../../../services/diagnosticCenterService";
import {
  deleteDiagnosticCenter
} from "../../../services/diagnosticCenterService";
import { hasPermission } from "../../permissionUtil";
import { useNavigate } from "react-router-dom";

const DiagnosticCenter = () => {

  const navigate = useNavigate();  

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ LOAD DC LIST
  const loadDiagnosticCenters = async () => {

    try {

     const res = await getDiagnosticCenters(
  currentPage - 1,
  entries,
  search
);

setDiagnosticCenters(
  res.data.content || []
);

setTotalPages(
  res.data.totalPages || 0
);

    } catch (err) {

      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  useEffect(() => {
    loadDiagnosticCenters();
  }, [currentPage, entries, search]);

  // ✅ PAGINATION
//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

const getPageNumbers = () => {

  const pages = [];

  let startPage = Math.max(
    1,
    currentPage - 2
  );

  let endPage = Math.min(
    totalPages,
    currentPage + 2
  );

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};

const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this DC?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    await deleteDiagnosticCenter(id);

    alert(
      "Diagnostic Center deleted successfully"
    );

    getDiagnosticCenters();

  } catch (error) {

    console.error(error);

    alert("Delete failed ❌");
  }
};

  return (
    <div className="container-fluid mt-3">

      <div className="card">

        {/* HEADER */}
       <div
  className="card-header d-flex justify-content-between align-items-center"
  style={{ background: "#3fb4b6", color: "white" }}
>
  <h5>Diagnostic Center (DC) Master</h5>

  {hasPermission("Diagnostic Center", "ADD") && (
    <button
      className="btn btn-light"
      onClick={() =>
        navigate("/diagnostic-center/create")
      }
    >
      ➕ Add DC
    </button>
  )}
</div>

        <div className="card-body">

          {/* SEARCH + ENTRIES */}
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

          {/* TABLE */}
          <div
            style={{
              overflowX: "auto",
              maxHeight: "700px",
              overflowY: "auto"
            }}
            className="table-scroll"
          >

            <table className="table table-bordered all-table">

              <thead>

                <tr>
                  <th>Action</th>  

                  <th>DC Code</th>

                  <th>DC Name</th>

                  <th>Country</th>

                  <th>Location</th>

                  <th>Pincode</th>

                  <th>Home Visit</th>

                  <th>Paid Home Visit</th>

                  <th>Address</th>

                </tr>

              </thead>

              <tbody>

                {diagnosticCenters?.map((dc) => (

                    

                  <tr key={dc.id}>

                    <td>

  {hasPermission(
    "Diagnostic Center",
    "EDIT"
  ) && (

    <div className="d-flex gap-2">

  <button
    className="btn btn-sm btn-info"
    onClick={() =>
      navigate(
        `/diagnostic-center/edit/${dc.id}`
      )
    }
  >
    Edit
  </button>

  <button
    className="btn btn-sm btn-danger"
    onClick={() =>
      handleDelete(dc.id)
    }
  >
    Delete
  </button>

</div>

  )}

</td>

                    <td>{dc.dcCode}</td>

                    <td>{dc.name}</td>

                    <td>{dc.countryCode}</td>

                    <td>{dc.locationName}</td>

                    <td>{dc.pincode}</td>

                    <td>
                      {dc.isHomeVisitAvailable ? "Yes" : "No"}
                    </td>

                    <td>
                      {dc.isPaidHomeVisit ? "Yes" : "No"}
                    </td>

                    <td>{dc.primaryAddress}</td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-between align-items-center mt-3">

            <div>
              Showing page {currentPage} of {totalPages}
            </div>

            <nav>

              <ul className="pagination mb-0">

                {/* PREVIOUS */}
                <li
                  className={`page-item ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage(currentPage - 1)
                    }
                  >
                    Previous
                  </button>
                </li>

                {/* PAGE NUMBERS */}
               {getPageNumbers().map((num) => (

                  <li
                    key={num}
                    className={`page-item ${
                      currentPage === num ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                {/* NEXT */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage(currentPage + 1)
                    }
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

export default DiagnosticCenter;

