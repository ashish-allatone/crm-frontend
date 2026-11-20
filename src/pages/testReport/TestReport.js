import React, { useState, useEffect } from "react";
import { getTestModuleAppointments } from "../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../permissionUtil";

const TestReport = () => {
  const navigate = useNavigate();
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
    try {
      const res = await getTestModuleAppointments(currentPage - 1, entries, search);
      setAppointments(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      if (err.response?.status === 403) alert("Access Denied ❌");
    }
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") direction = "desc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const getArrow = (column) => {
    if (sortColumn !== column) return "⇅";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="container-fluid test-report-page mt-3">
      <style>{`
        .test-report-page { font-family: "Inter", sans-serif; color: #18243a; padding-bottom: 24px; }
        .test-report-page .report-card { overflow: hidden; border: 1px solid #e6ebf1; border-radius: 14px; background: #fff; box-shadow: 0 5px 20px rgba(18,39,63,.06); }
        .test-report-page .report-header { min-height: 76px; padding: 16px 24px; display: flex; align-items: center; gap: 14px; color: #fff; background: linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%); }
        .test-report-page .report-header-icon { width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center; border-radius: 11px; background: rgba(255,255,255,.13); }
        .test-report-page .report-header-icon svg { width: 21px; height: 21px; }
        .test-report-page .report-title { margin: 0; font-size: 19px; line-height: 1.3; font-weight: 700; letter-spacing: -.2px; }
        .test-report-page .report-subtitle { margin: 4px 0 0; color: #c7d8e8; font-size: 12px; }
        .test-report-page .report-body { padding: 22px 24px 20px; }
        .test-report-page .report-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 17px; }
        .test-report-page .report-entries,.test-report-page .report-search { display: flex; align-items: center; gap: 9px; color: #637187; font-size: 12px; font-weight: 600; }
        .test-report-page .report-select,.test-report-page .report-search-input { height: 40px; border: 1px solid #dce4ed; border-radius: 8px; background: #fff; color: #18243a; font-size: 13px; outline: none; transition: border-color .2s,box-shadow .2s; }
        .test-report-page .report-select { padding: 0 30px 0 11px; }
        .test-report-page .report-search-wrap { position: relative; }
        .test-report-page .report-search-input { width: 240px; padding: 0 12px 0 35px; }
        .test-report-page .report-search-icon { position: absolute; left: 12px; top: 13px; color: #8795a8; font-size: 13px; }
        .test-report-page .report-select:focus,.test-report-page .report-search-input:focus { border-color: #3b719b; box-shadow: 0 0 0 3px rgba(14,61,102,.09); }
        .test-report-page .report-table-wrap { width: 100%; max-height: 700px; overflow: auto; border: 1px solid #e5ebf1; border-radius: 10px; }
        .test-report-page .report-table { width: 100%; min-width: 1120px; margin: 0; border-collapse: separate; border-spacing: 0; }
        .test-report-page .report-table thead th { position: sticky; top: 0; z-index: 2; padding: 13px 12px; border: 0; border-bottom: 1px solid #dfe7ef; background: #f3f6fa; color: #58677c; white-space: nowrap; font-size: 10.5px; font-weight: 700; letter-spacing: .55px; text-transform: uppercase; }
        .test-report-page .report-table thead th.sortable { cursor: pointer; }
        .test-report-page .report-table thead th.sortable:hover { color: #0e3d66; }
        .test-report-page .report-table tbody td { padding: 13px 12px; border: 0; border-bottom: 1px solid #edf1f5; color: #35445a; vertical-align: middle; font-size: 12.5px; white-space: nowrap; }
        .test-report-page .report-table tbody tr:last-child td { border-bottom: 0; }
        .test-report-page .report-table tbody tr:hover { background: #f8fafc; }
        .test-report-page .view-report-btn { display: inline-flex; align-items: center; gap: 7px; padding: 7px 11px; border: 1px solid #c8d8e7; border-radius: 7px; background: #edf4fa; color: #0e3d66; font-size: 11.5px; font-weight: 700; transition: all .2s ease; }
        .test-report-page .view-report-btn:hover { border-color: #0e3d66; background: #0e3d66; color: #fff; }
        .test-report-page .report-empty { padding: 36px 16px !important; color: #8190a3 !important; text-align: center; font-size: 13px !important; }
        .test-report-page .report-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-top: 18px; }
        .test-report-page .report-page-info { color: #77869a; font-size: 12px; }
        .test-report-page .pagination { gap: 4px; }
        .test-report-page .page-link { min-width: 34px; height: 34px; display: grid; place-items: center; padding: 0 9px; border: 1px solid #e0e7ef; border-radius: 7px !important; background: #fff; color: #42536a; font-size: 12px; box-shadow: none; }
        .test-report-page .page-item.active .page-link { border-color: #0e3d66; background: #0e3d66; color: #fff; }
        .test-report-page .page-item.disabled .page-link { background: #f8fafc; color: #b5bfcb; }
        @media (max-width:767px) {
          .test-report-page { padding-left: 8px; padding-right: 8px; }
          .test-report-page .report-header { padding: 15px 16px; }
          .test-report-page .report-body { padding: 16px 12px; }
          .test-report-page .report-search-input { width: min(220px,58vw); }
          .test-report-page .report-toolbar,.test-report-page .report-footer { align-items: flex-start; }
        }
      `}</style>

      <div className="report-card">
        <div className="report-header">
          <div className="report-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M14 3v5h5M9 13h6M9 17h6M9 9h1" />
            </svg>
          </div>
          <div>
            <h5 className="report-title">Test Report</h5>
            <p className="report-subtitle">View patient test report records and open report details</p>
          </div>
        </div>

        <div className="report-body">
          <div className="report-toolbar">
            <div className="report-entries">
              <span>Show</span>
              <select className="report-select" value={entries} onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }} aria-label="Entries per page">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>

            <label className="report-search">
              <span>Search</span>
              <span className="report-search-wrap">
                <svg className="report-search-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" />
                </svg>
                <input type="text" className="report-search-input" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search test reports..." aria-label="Search test reports" />
              </span>
            </label>
          </div>

          <div className="report-table-wrap">
            <table className="table report-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>S.No. {getArrow("lm")}</th>
                  <th className="sortable" onClick={() => handleSort("lm")}>LM No. {getArrow("lm")}</th>
                  <th className="sortable" onClick={() => handleSort("name")}>Patient Name {getArrow("name")}</th>
                  <th className="sortable" onClick={() => handleSort("mobile")}>Mobile {getArrow("mobile")}</th>
                  <th className="sortable" onClick={() => handleSort("age")}>Age / Gender {getArrow("age")}</th>
                  <th className="sortable" onClick={() => handleSort("organization")}>Organization Name {getArrow("organization")}</th>
                  <th className="sortable" onClick={() => handleSort("dc")}>Diagnostic Center {getArrow("dc")}</th>
                  <th className="sortable" onClick={() => handleSort("insurance")}>Insurance Company {getArrow("insurance")}</th>
                  <th className="sortable" onClick={() => handleSort("registered")}>Registered On {getArrow("registered")}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="10" className="report-empty">No test report appointments found</td></tr>
                ) : (
                  appointments.map((a, index) => (
                    <tr key={a.appointmentId}>
                      <td>
                        {hasPermission("Test Report", "VIEW") && (
                          <button type="button" className="view-report-btn" onClick={() => navigate(`/test-report-upload/${a.appointmentId}`)}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                            View Test Report
                          </button>
                        )}
                      </td>
                      <td>{(currentPage - 1) * entries + index + 1}</td>
                      <td>{a.lmNo || "-"}</td>
                      <td>{a.patientName || "-"}</td>
                      <td>{a.mobile || "-"}</td>
                      <td>{a.ageGender || "-"}</td>
                      <td>{a.organizationName || "-"}</td>
                      <td>{a.diagnosticCenterName || "-"}</td>
                      <td>{a.insuranceName || "-"}</td>
                      <td>{a.visitDate || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="report-footer">
            <div className="report-page-info">Showing page {currentPage} of {totalPages}</div>
            <nav aria-label="Test report pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button type="button" className="page-link" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                </li>
                {pageNumbers.map((num) => (
                  <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                    <button type="button" className="page-link" onClick={() => setCurrentPage(num)}>{num}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                  <button type="button" className="page-link" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
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

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";
// import { getAppointments } from "../../services/appointmentService";
// import { useNavigate } from "react-router-dom";
// import { hasPermission } from "../permissionUtil";
// import { getTestModuleAppointments } from "../../services/appointmentService";

// const TestReport = () => {
//   //   const reports = [];

//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [appointments, setAppointments] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     loadAppointments();
//   }, [currentPage, entries, search]);

//   // const loadAppointments = async () => {
//   //   const res = await getAppointments(currentPage - 1, entries, search);

//   //   setAppointments(res.data.content);
//   //   setTotalPages(res.data.totalPages);
//   // };
//   const loadAppointments = async () => {
//     try {
//       const res = await getTestModuleAppointments(
//         currentPage - 1,
//         entries,
//         search,
//       );

//       setAppointments(res.data.data.content);
//       setTotalPages(res.data.data.totalPages);
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Access Denied ❌");
//       }
//     }
//   };

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Test Report</h5>
//         </div>

//         <div className="card-body">
//           {/* Entries + Search */}

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
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
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

//           {/* Table */}

//           <div
//             style={{ overflowX: "auto", maxHeight: "700px", overflowY: "auto" }}
//             className="table-scroll"
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//                   <th>Actions</th>
//                   <th
//                     onClick={() => handleSort("lm")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     S.NO.{getArrow("lm")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("lm")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     LM NO. {getArrow("lm")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("name")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     PATIENT NAME {getArrow("name")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("mobile")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     MOBILE {getArrow("mobile")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("age")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     AGE / GENDER {getArrow("age")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     ORGANIZATION NAME {getArrow("organization")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("dc")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Diagnostic Center {getArrow("dc")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("insurance")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     INSURANCE COMPANY {getArrow("insurance")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("registered")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     REGISTERED ON {getArrow("registered")}
//                   </th>

//                   {/* <th
//                     onClick={() => handleSort("details")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     VIEW DETAILS {getArrow("details")}
//                   </th> */}
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="text-center">
//                       No data found for the appoitnments
//                     </td>
//                   </tr>
//                 ) : (
//                   appointments.map((a, index) => (
//                     <tr key={a.appointmentId}>
//                       <td>
//                         {/* <button
//                           className="btn btn-info btn-sm"
//                           onClick={() =>
//                             navigate(`/test-report-upload/${a.appointmentId}`)
//                           }
//                         >
//                           View Test Report
//                         </button> */}
//                         {hasPermission("Test Report", "VIEW") && (
//                           <button
//                             className="btn btn-info btn-sm"
//                             onClick={() =>
//                               navigate(`/test-report-upload/${a.appointmentId}`)
//                             }
//                           >
//                             View Test Report
//                           </button>
//                         )}
//                       </td>

//                       <td>{(currentPage - 1) * entries + index + 1}</td>
//                       {/* <td>{a.patientId}</td> */}
//                       <td>{a.lmNo || "-"}</td>
//                       <td>{a.patientName}</td>
//                       <td>{a.mobile}</td>
//                       <td>{a.ageGender}</td>
//                       <td>{a.organizationName}</td>
//                       <td>{a.diagnosticCenterName || "-"}</td>
//                       <td>{a.insuranceName}</td>
//                       <td>{a.visitDate}</td>
//                     </tr>
//                   ))
//                 )}
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
//     </div>
//   );
// };

// export default TestReport;
