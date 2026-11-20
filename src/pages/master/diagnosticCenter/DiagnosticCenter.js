import React, { useState, useEffect } from "react";
import { getDiagnosticCenters, deleteDiagnosticCenter } from "../../../services/diagnosticCenterService";
import { hasPermission } from "../../permissionUtil";
import { useNavigate } from "react-router-dom";

const DiagnosticCenter = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Load diagnostic center list
  const loadDiagnosticCenters = async () => {
    try {
      const res = await getDiagnosticCenters(currentPage - 1, entries, search);
      setDiagnosticCenters(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      }
    }
  };

  useEffect(() => {
    loadDiagnosticCenters();
  }, [currentPage, entries, search]);

  // Pagination
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this DC?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDiagnosticCenter(id);
      alert("Diagnostic Center deleted successfully");
      getDiagnosticCenters();
    } catch (error) {
      console.error(error);
      alert("Delete failed ❌");
    }
  };

  const styles = `
     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


    .dc-page {
      min-height: calc(100vh - 70px);
      padding: 24px;
      background: #f4f7fb;
      color: #26364a;
      font-family: 'Inter', sans-serif;
    }
    .dc-card {
      width: 100%;
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e5eaf1;
      border-radius: 15px;
      box-shadow: 0 8px 28px rgba(24, 45, 75, .07);
    }
    .dc-header {
      min-height: 76px;
      padding: 18px 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .dc-heading {
      margin: 0;
      font-size: 19px;
      line-height: 1.35;
      font-weight: 750;
      letter-spacing: -.3px;
    }

    .dc-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.dc-header-icon {
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

.dc-header-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
    .dc-subtitle {
      margin: 5px 0 0;
      color: rgba(255,255,255,.73);
      font-size: 11px;
    }
    .dc-add-btn {
      border: 1px solid rgba(255,255,255,.42);
      border-radius: 8px;
      padding: 10px 15px;
      color: #183451;
      background: #fff;
      font: 650 12px 'Inter', sans-serif;
      white-space: nowrap;
      cursor: pointer;
      transition: .18s ease;
    }
    .dc-add-btn:hover {
      color: #142b4a;
      background: #edf3f9;
      transform: translateY(-1px);
    }
    .dc-body { padding: 24px 25px 25px; }
    .dc-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .dc-entries, .dc-search-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #65748a;
      font-size: 12px;
      white-space: nowrap;
    }
    .dc-select, .dc-search {
      min-height: 36px;
      border: 1px solid #d9e1eb;
      border-radius: 7px;
      padding: 7px 10px;
      color: #34465d;
      background: #fff;
      font: 400 12px 'Inter', sans-serif;
      outline: none;
    }
    .dc-select:focus, .dc-search:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49,87,127,.10);
    }
    .dc-search { width: 220px; }
    .dc-table-wrap {
      overflow: auto;
      max-height: 700px;
      border: 1px solid #e5eaf1;
      border-radius: 9px;
    }
    .dc-table {
      width: 100%;
      min-width: 1120px;
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
      color: #43536a;
      font-size: 11px;
    }
    .dc-table thead th {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 14px 12px;
      border: 0;
      border-bottom: 1px solid #dfe6ef;
      color: #29435f;
      background: #f1f5f9;
      font-size: 10px;
      font-weight: 750;
      letter-spacing: .2px;
      white-space: nowrap;
    }
    .dc-table tbody td {
      padding: 13px 12px;
      border: 0;
      border-bottom: 1px solid #edf0f4;
      vertical-align: middle;
      background: #fff;
    }
    .dc-table tbody tr:last-child td { border-bottom: 0; }
    .dc-table tbody tr:hover td { background: #f8fafd; }
    .dc-action-group { display: flex; align-items: center; gap: 7px; }
    .dc-action-btn {
      min-width: 54px;
      border-radius: 6px;
      padding: 6px 9px;
      font: 650 10px 'Inter', sans-serif;
      cursor: pointer;
      transition: .15s ease;
    }
    .dc-edit-btn {
      border: 1px solid #cbd9e7;
      color: #24496e;
      background: #edf3f9;
    }
    .dc-edit-btn:hover { background: #dfeaf5; }
    .dc-delete-btn {
      border: 1px solid #f0caca;
      color: #b34242;
      background: #fff1f1;
    }
    .dc-delete-btn:hover { background: #ffe4e4; }
    .dc-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 650;
    }
    .dc-status-yes { color: #28744c; background: #e8f5ed; }
    .dc-status-no { color: #7b8795; background: #eef1f4; }
    .dc-empty {
      padding: 34px 15px !important;
      color: #8a97a8;
      text-align: center;
    }
    .dc-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      margin-top: 18px;
      color: #758397;
      font-size: 11px;
    }
    .dc-pagination {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .dc-page-btn {
      min-width: 32px;
      height: 31px;
      padding: 0 9px;
      border: 1px solid #dce3ec;
      border-radius: 6px;
      color: #53657b;
      background: #fff;
      font: 500 11px 'Inter', sans-serif;
      cursor: pointer;
    }
    .dc-page-btn:hover:not(:disabled) { background: #f0f4f8; }
    .dc-page-btn:disabled { opacity: .45; cursor: not-allowed; }
    .dc-page-btn.active {
      border-color: #203e63;
      color: #fff;
      background: #203e63;
    }
    @media (max-width: 700px) {
      .dc-page { padding: 13px; }
      .dc-header { align-items: flex-start; padding: 17px; }
      .dc-body { padding: 17px; }
      .dc-toolbar { align-items: flex-start; flex-direction: column; }
      .dc-search-wrap { width: 100%; }
      .dc-search { flex: 1; width: auto; }
      .dc-footer { align-items: flex-start; flex-direction: column; }
      .dc-pagination { max-width: 100%; }
    }
    @media (max-width: 420px) {
      .dc-header { flex-direction: column; }
      .dc-add-btn { width: 100%; }
    }
  `;

  return (
    <div className="dc-page">
      <style>{styles}</style>

      <div className="dc-card">
        <div className="dc-header">
          <div className="dc-header-left">

  <div className="dc-header-icon">
    <svg viewBox="0 0 24 24">
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 7h6" />
      <path d="M12 4v6" />
      <path d="M9 14h1" />
      <path d="M14 14h1" />
      <path d="M9 18h1" />
      <path d="M14 18h1" />
      <path d="M11 21v-3h2v3" />
    </svg>
  </div>

  <div>
    <h2 className="dc-heading">Diagnostic Center (DC) Master</h2>
    <p className="dc-subtitle">
      Manage diagnostic centers and visit availability
    </p>
  </div>

</div>

          {hasPermission("Diagnostic Center", "ADD") && (
            <button
              className="dc-add-btn"
              onClick={() => navigate("/diagnostic-center/create")}
            >
              + Add Diagnostic Center
            </button>
          )}
        </div>

        <div className="dc-body">
          <div className="dc-toolbar">
            <div className="dc-entries">
              <span>Show</span>
              <select
                className="dc-select"
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

            <label className="dc-search-wrap">
              <span>Search</span>
              <input
                type="text"
                className="dc-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value.trimStart());
                  setCurrentPage(1);
                }}
                placeholder="Search diagnostic centers..."
              />
            </label>
          </div>

          <div className="dc-table-wrap">
            <table className="dc-table">
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
                  <th>Centre Visit</th>
                  <th>Address</th>
                </tr>
              </thead>

              <tbody>
                {diagnosticCenters?.length > 0 ? (
                  diagnosticCenters.map((dc) => (
                    <tr key={dc.id}>
                      <td>
                        {hasPermission("Diagnostic Center", "EDIT") && (
                          <div className="dc-action-group">
                            <button
                              className="dc-action-btn dc-edit-btn"
                              onClick={() => navigate(`/diagnostic-center/edit/${dc.id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="dc-action-btn dc-delete-btn"
                              onClick={() => handleDelete(dc.id)}
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
                        <span className={`dc-status ${dc.isHomeVisitAvailable ? "dc-status-yes" : "dc-status-no"}`}>
                          {dc.isHomeVisitAvailable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <span className={`dc-status ${dc.isPaidHomeVisit ? "dc-status-yes" : "dc-status-no"}`}>
                          {dc.isPaidHomeVisit ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <span className={`dc-status ${dc.isCentreVisitAvailable ? "dc-status-yes" : "dc-status-no"}`}>
                          {dc.isCentreVisitAvailable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>{dc.primaryAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="dc-empty" colSpan={10}>
                      No diagnostic centers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dc-footer">
            <div>
              Showing page {currentPage} of {totalPages}
            </div>

            <nav aria-label="Diagnostic center pagination">
              <ul className="dc-pagination">
                <li>
                  <button
                    className="dc-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {getPageNumbers().map((num) => (
                  <li key={num}>
                    <button
                      className={`dc-page-btn ${currentPage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="dc-page-btn"
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
    </div>
  );
};

export default DiagnosticCenter;

// import React, { useState, useEffect } from "react";
// import "../../../styles/allPatients.css";
// import { getDiagnosticCenters } from "../../../services/diagnosticCenterService";
// import { deleteDiagnosticCenter } from "../../../services/diagnosticCenterService";
// import { hasPermission } from "../../permissionUtil";
// import { useNavigate } from "react-router-dom";

// const DiagnosticCenter = () => {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [diagnosticCenters, setDiagnosticCenters] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   // ✅ LOAD DC LIST
//   const loadDiagnosticCenters = async () => {
//     try {
//       const res = await getDiagnosticCenters(currentPage - 1, entries, search);

//       setDiagnosticCenters(res.data.content || []);

//       setTotalPages(res.data.totalPages || 0);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };

//   useEffect(() => {
//     loadDiagnosticCenters();
//   }, [currentPage, entries, search]);

//   // ✅ PAGINATION
//   //   const pageNumbers = [];

//   //   for (let i = 1; i <= totalPages; i++) {
//   //     pageNumbers.push(i);
//   //   }

//   const getPageNumbers = () => {
//     const pages = [];

//     let startPage = Math.max(1, currentPage - 2);

//     let endPage = Math.min(totalPages, currentPage + 2);

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this DC?",
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       await deleteDiagnosticCenter(id);

//       alert("Diagnostic Center deleted successfully");

//       getDiagnosticCenters();
//     } catch (error) {
//       console.error(error);

//       alert("Delete failed ❌");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         {/* HEADER */}
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Diagnostic Center (DC) Master</h5>

//           {hasPermission("Diagnostic Center", "ADD") && (
//             <button
//               className="btn btn-light"
//               onClick={() => navigate("/diagnostic-center/create")}
//             >
//               ➕ Add DC
//             </button>
//           )}
//         </div>

//         <div className="card-body">
//           {/* SEARCH + ENTRIES */}
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
//                   setSearch(e.target.value.trimStart());
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//           </div>

//           {/* TABLE */}
//           <div
//             style={{
//               overflowX: "auto",
//               maxHeight: "700px",
//               overflowY: "auto",
//             }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th>Action</th>

//                   <th>DC Code</th>

//                   <th>DC Name</th>

//                   <th>Country</th>

//                   <th>Location</th>

//                   <th>Pincode</th>

//                   <th>Home Visit</th>

//                   <th>Paid Home Visit</th>

//                   <th>Centre Visit</th>

//                   <th>Address</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {diagnosticCenters?.map((dc) => (
//                   <tr key={dc.id}>
//                     <td>
//                       {hasPermission("Diagnostic Center", "EDIT") && (
//                         <div className="d-flex gap-2">
//                           <button
//                             className="btn btn-sm btn-info"
//                             onClick={() =>
//                               navigate(`/diagnostic-center/edit/${dc.id}`)
//                             }
//                           >
//                             Edit
//                           </button>

//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => handleDelete(dc.id)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>

//                     <td>{dc.dcCode}</td>

//                     <td>{dc.name}</td>

//                     <td>{dc.countryCode}</td>

//                     <td>{dc.locationName}</td>

//                     <td>{dc.pincode}</td>

//                     <td>{dc.isHomeVisitAvailable ? "Yes" : "No"}</td>

//                     <td>{dc.isPaidHomeVisit ? "Yes" : "No"}</td>

//                     <td>{dc.isCentreVisitAvailable ? "Yes" : "No"}</td>

//                     <td>{dc.primaryAddress}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER */}
//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing page {currentPage} of {totalPages}
//             </div>

//             <nav>
//               <ul className="pagination mb-0">
//                 {/* PREVIOUS */}
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

//                 {/* PAGE NUMBERS */}
//                 {getPageNumbers().map((num) => (
//                   <li
//                     key={num}
//                     className={`page-item ${
//                       currentPage === num ? "active" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(num)}
//                     >
//                       {num}
//                     </button>
//                   </li>
//                 ))}

//                 {/* NEXT */}
//                 <li
//                   className={`page-item ${
//                     currentPage === totalPages ? "disabled" : ""
//                   }`}
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
//     </div>
//   );
// };

// export default DiagnosticCenter;
