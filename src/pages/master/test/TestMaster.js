import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTests } from "../../../services/testService";
import { hasPermission } from "../../permissionUtil";

const TestMaster = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [tests, setTests] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const loadTests = async () => {
    try {
      const res = await getTests(currentPage - 1, entries, search);
      setTests(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied ❌");
      } else {
        console.error("Error loading tests:", err);
      }
    }
  };

  useEffect(() => {
    loadTests();
    // loadTests is intentionally triggered when server-side query parameters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, entries, search]);

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column);
    setSortDirection(direction);
  };

  const getArrow = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .tm-page {
      font-family: 'Inter', sans-serif;
      padding: 22px 20px;
      color: #18243a;
    }
    .tm-card {
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, 0.06);
      overflow: hidden;
    }
    .tm-header {
      min-height: 76px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .tm-heading-wrap { display: flex; align-items: center; gap: 13px; }
    .tm-heading-icon {
      width: 42px; height: 42px; display: grid; place-items: center;
      border: 1px solid rgba(255,255,255,.2); border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .tm-heading-icon svg { width: 22px; height: 22px; }
    .tm-title { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: .1px; }
    .tm-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .tm-add-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 39px; padding: 8px 15px; border: 0; border-radius: 8px;
      background: #fff; color: #183554; font-size: 13px; font-weight: 700;
      transition: .2s ease; white-space: nowrap;
    }
    .tm-add-btn:hover { background: #eaf1f8; transform: translateY(-1px); }
    .tm-add-btn svg { width: 16px; height: 16px; }
    .tm-body { padding: 22px 24px 18px; }
    .tm-toolbar {
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px; margin-bottom: 17px; flex-wrap: wrap;
    }
    .tm-entries { display: flex; align-items: center; gap: 9px; color: #66758a; font-size: 13px; }
    .tm-select {
      min-width: 72px; height: 37px; padding: 0 28px 0 11px;
      border: 1px solid #dce3ec; border-radius: 8px; background-color: #fff;
      color: #26374d; font: inherit; outline: none;
    }
    .tm-select:focus, .tm-search-input:focus {
      border-color: #52769d; box-shadow: 0 0 0 3px rgba(58, 94, 132, .11);
    }
    .tm-search-wrap { display: flex; align-items: center; gap: 9px; color: #66758a; font-size: 13px; }
    .tm-search-box { position: relative; }
    .tm-search-box svg {
      position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
      width: 16px; height: 16px; color: #8795a8; pointer-events: none;
    }
    .tm-search-input {
      width: 245px; height: 37px; padding: 0 12px 0 35px;
      border: 1px solid #dce3ec; border-radius: 8px; color: #26374d;
      font: inherit; font-size: 13px; outline: none; transition: .2s ease;
    }
    .tm-table-wrap {
      width: 100%; overflow: auto; max-height: 650px;
      border: 1px solid #e7ebf1; border-radius: 10px;
    }
    .tm-table { width: 100%; min-width: 760px; margin: 0; border-collapse: separate; border-spacing: 0; }
    .tm-table thead th {
      position: sticky; top: 0; z-index: 2; padding: 14px 15px;
      background: #f4f7fb; color: #53647a; border-bottom: 1px solid #e4eaf1;
      font-size: 11px; font-weight: 700; letter-spacing: .55px;
      text-transform: uppercase; white-space: nowrap;
    }
    .tm-table thead th.tm-sortable { cursor: pointer; user-select: none; }
    .tm-table thead th.tm-sortable:hover { color: #193b60; }
    .tm-sort-arrow { margin-left: 6px; color: #8b9aae; font-size: 13px; }
    .tm-table tbody td {
      padding: 14px 15px; border-bottom: 1px solid #edf0f4;
      color: #35445a; font-size: 13px; vertical-align: middle; white-space: nowrap;
    }
    .tm-table tbody tr:last-child td { border-bottom: 0; }
    .tm-table tbody tr:hover { background: #f8fafd; }
    .tm-test-name { color: #203b5d !important; font-weight: 600; }
    .tm-org { color: #52647b !important; font-weight: 500; }
    .tm-type-pill {
      display: inline-flex; align-items: center; min-height: 25px; padding: 4px 9px;
      border-radius: 6px; background: #eef3f8; color: #405d7b;
      font-size: 11px; font-weight: 600;
    }
    .tm-sample-pill {
      display: inline-flex; align-items: center; min-height: 25px; padding: 4px 9px;
      border-radius: 6px; background: #f1f4f7; color: #58677a;
      font-size: 11px; font-weight: 600;
    }
    .tm-action-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      min-height: 30px; padding: 5px 10px; border: 1px solid #d7e2ee;
      border-radius: 7px; background: #f5f8fc; color: #294e74;
      font-size: 12px; font-weight: 600; transition: .2s ease;
    }
    .tm-action-btn:hover { background: #e8f0f8; border-color: #b9cadd; }
    .tm-action-btn svg { width: 14px; height: 14px; }
    .tm-empty { padding: 42px 16px !important; text-align: center; color: #8a97a8 !important; }
    .tm-empty-icon {
      width: 42px; height: 42px; margin: 0 auto 10px; display: grid;
      place-items: center; border-radius: 12px; background: #f1f5f9; color: #8292a6;
    }
    .tm-empty-icon svg { width: 21px; height: 21px; }
    .tm-footer {
      display: flex; align-items: center; justify-content: space-between;
      gap: 14px; padding-top: 18px; flex-wrap: wrap;
    }
    .tm-showing { color: #78869a; font-size: 12px; }
    .tm-pagination { display: flex; align-items: center; gap: 5px; margin: 0; padding: 0; list-style: none; }
    .tm-page-btn {
      min-width: 33px; height: 33px; padding: 0 9px; border: 1px solid #e0e6ee;
      border-radius: 7px; background: #fff; color: #53647a;
      font-size: 12px; font-weight: 600; transition: .2s ease;
    }
    .tm-page-btn:hover:not(:disabled) { background: #f0f4f9; border-color: #cbd7e5; }
    .tm-page-btn.tm-active { background: #1c3a5d; border-color: #1c3a5d; color: #fff; }
    .tm-page-btn:disabled { opacity: .42; cursor: not-allowed; }
    @media (max-width: 640px) {
      .tm-page { padding: 12px 8px; }
      .tm-header { padding: 15px; align-items: flex-start; }
      .tm-title { font-size: 17px; }
      .tm-body { padding: 16px 12px; }
      .tm-toolbar { align-items: flex-start; flex-direction: column; }
      .tm-search-wrap { width: 100%; justify-content: space-between; }
      .tm-search-box, .tm-search-input { width: 100%; }
      .tm-search-box { flex: 1; }
      .tm-footer { align-items: flex-start; flex-direction: column; }
    }
  `;

  return (
    <div className="tm-page container-fluid">
      <style>{styles}</style>

      <div className="tm-card">
        <div className="tm-header">
          <div className="tm-heading-wrap">
            <div className="tm-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M9 8h6M9 12h6M9 16h3" />
              </svg>
            </div>
            <div>
              <h5 className="tm-title">Test Master</h5>
              <p className="tm-subtitle">Manage and maintain diagnostic test details</p>
            </div>
          </div>

          {hasPermission("Test Master", "ADD") && (
            <button className="tm-add-btn" onClick={() => navigate("/add-test")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add New Test
            </button>
          )}
        </div>

        <div className="tm-body">
          <div className="tm-toolbar">
            <div className="tm-entries">
              <span>Show</span>
              <select
                className="tm-select"
                value={entries}
                onChange={(e) => {
                  setEntries(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Number of entries to display"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="tm-search-wrap">
              <label htmlFor="tm-test-search">Search</label>
              <div className="tm-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  id="tm-test-search"
                  type="text"
                  className="tm-search-input"
                  placeholder="Search tests..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="tm-table-wrap">
            <table className="tm-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th className="tm-sortable" onClick={() => handleSort("organization")}>
                    Organization <span className="tm-sort-arrow">{getArrow("organization")}</span>
                  </th>
                  <th className="tm-sortable" onClick={() => handleSort("testName")}>
                    Test Name <span className="tm-sort-arrow">{getArrow("testName")}</span>
                  </th>
                  <th className="tm-sortable" onClick={() => handleSort("shortName")}>
                    Short Name <span className="tm-sort-arrow">{getArrow("shortName")}</span>
                  </th>
                  <th className="tm-sortable" onClick={() => handleSort("testType")}>
                    Test Type <span className="tm-sort-arrow">{getArrow("testType")}</span>
                  </th>
                  <th className="tm-sortable" onClick={() => handleSort("sampleType")}>
                    Sample Type <span className="tm-sort-arrow">{getArrow("sampleType")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {tests.length > 0 ? (
                  tests.map((t) => (
                    <tr key={t.id}>
                      <td>
                        {hasPermission("Test Master", "EDIT") && (
                          <button
                            className="tm-action-btn"
                            onClick={() => navigate(`/edit-test/${t.id}`)}
                            title="Edit test"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
                            </svg>
                            Edit
                          </button>
                        )}
                      </td>
                      <td className="tm-org">{t.organizationName}</td>
                      <td className="tm-test-name">{t.testName}</td>
                      <td>{t.shortName}</td>
                      <td><span className="tm-type-pill">{t.testType || "—"}</span></td>
                      <td><span className="tm-sample-pill">{t.sampleType || "—"}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="tm-empty" colSpan="6">
                      <div className="tm-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <circle cx="10.5" cy="10.5" r="6.5" />
                          <path d="m16 16 4 4M8 10.5h5" />
                        </svg>
                      </div>
                      No tests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tm-footer">
            <div className="tm-showing">
              Showing page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </div>

            <nav aria-label="Test list pagination">
              <ul className="tm-pagination">
                <li>
                  <button
                    className="tm-page-btn"
                    disabled={currentPage === 1 || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Prev
                  </button>
                </li>

                {pageNumbers.map((num) => (
                  <li key={num}>
                    <button
                      className={`tm-page-btn ${currentPage === num ? "tm-active" : ""}`}
                      aria-current={currentPage === num ? "page" : undefined}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="tm-page-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

export default TestMaster;
// import React, { useState, useEffect} from "react";
// import "../../../styles/allPatients.css";
// import { useNavigate } from "react-router-dom";
// // import { tests } from "../../../data/tests";
// import { getTests, deleteTest } from "../../../services/testService";
// import { hasPermission } from "../../permissionUtil";

// const TestMaster = () => {
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [tests, setTests] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

// //   const loadTests = async () => {
// //   const res = await getTests(currentPage - 1, entries, search);

// //   setTests(res.data.content);
// //   setTotalPages(res.data.totalPages);
// // };
// const loadTests = async () => {
//   try {
//     const res = await getTests(currentPage - 1, entries, search);
//     setTests(res.data.content);
//     setTotalPages(res.data.totalPages);
//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };

// useEffect(() => {
//   loadTests();
// }, [currentPage, entries, search]);

//   const navigate = useNavigate();

//   /* Sorting */

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   /* Search */

//   // const filteredTests = tests.filter((t) =>
//   //   Object.values(t).join(" ").toLowerCase().includes(search.toLowerCase()),
//   // );

//   /* Sorted Data */

//   // const sortedTests = [...filteredTests].sort((a, b) => {
//   //   if (!sortColumn) return 0;

//   //   let valA = a[sortColumn];
//   //   let valB = b[sortColumn];

//   //   if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//   //   if (valA > valB) return sortDirection === "asc" ? 1 : -1;

//   //   return 0;
//   // });

//   /* Pagination */

//   // const indexOfLast = currentPage * entries;
//   // const indexOfFirst = indexOfLast - entries;

//   // const currentTests = sortedTests.slice(indexOfFirst, indexOfLast);

//   // const totalPages = Math.ceil(sortedTests.length / entries);

//   // const pageNumbers = [];

//   // for (let i = 1; i <= totalPages; i++) {
//   //   pageNumbers.push(i);
//   // }

//   // const startEntry = sortedTests.length === 0 ? 0 : indexOfFirst + 1;
//   // const endEntry = Math.min(indexOfLast, sortedTests.length);

//   /* Arrow */

//   const getArrow = (column) => {
//     if (sortColumn !== column) return "⇅";

//     return sortDirection === "asc" ? "▲" : "▼";
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Test Master</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => navigate("/add-test")}
//           >
//             + Add New Test
//           </button> */}
//           {hasPermission("Test Master", "ADD") && (
//   <button
//     className="btn btn-light"
//     onClick={() => navigate("/add-test")}
//   >
//     ➕ Add New Test
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
//   setEntries(e.target.value);
//   setCurrentPage(1);
// }}
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
//                 onChange={(e) => setSearch(e.target.value)}
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
//                   <th>Action</th>

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("organization")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Organization {getArrow("organization")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("testName")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Test Name {getArrow("testName")}
//                   </th>
//                   <th
//                     onClick={() => handleSort("shortName")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Short Name {getArrow("shortName")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("testType")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Test Type {getArrow("testType")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("sampleType")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Sample Type {getArrow("sampleType")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {tests.map((t) => (
//                   <tr key={t.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => navigate(`/edit-test/${t.id}`)}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Test Master", "EDIT") && (
//   <button
//     className="btn btn-info btn-sm"
//     onClick={() => navigate(`/edit-test/${t.id}`)}
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
//                           checked={t.status}
//                           readOnly
//                         />
//                       </div>
//                     </td> */}

//                     <td>{t.organizationName}</td>

//                     <td>{t.testName}</td>
//                     <td>{t.shortName}</td>

//                     <td>{t.testType}</td>

//                     <td>{t.sampleType}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}

//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//                Showing page {currentPage} of {totalPages}
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
//                     Prev
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

// export default TestMaster;
