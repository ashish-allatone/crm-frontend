import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizations } from "../../../services/organizationService";
import { hasPermission } from "../../permissionUtil";

const Organization = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [organizations, setOrganizations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const loadOrganizations = async () => {
    try {
      const res = await getOrganizations(currentPage - 1, entries, search);
      setOrganizations(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      if (err.response?.status === 403) alert("Access Denied ❌");
      else console.error("Error loading organizations:", err);
    }
  };

  useEffect(() => {
    loadOrganizations();
    // Fetch again when server-side query parameters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, entries, search]);

  const handleSort = (column) => {
    let direction = "asc";
    if (sortColumn === column && sortDirection === "asc") direction = "desc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const getArrow = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startEntry = organizations.length === 0 ? 0 : (currentPage - 1) * Number(entries) + 1;
  const endEntry = organizations.length === 0 ? 0 : (currentPage - 1) * Number(entries) + organizations.length;
  const totalEntries = totalPages === 0 ? 0 : (totalPages - 1) * Number(entries) + organizations.length;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .om-page{font-family:'Inter',sans-serif;padding:22px 20px;color:#18243a}
    .om-card{overflow:hidden;background:#fff;border:1px solid #e7ebf2;border-radius:14px;box-shadow:0 5px 22px rgba(22,36,58,.06)}
    .om-header{min-height:76px;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;color:#fff;background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);}
    .om-heading-wrap{display:flex;align-items:center;gap:13px}
    .om-heading-icon{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(255,255,255,.11)}
    .om-heading-icon svg{width:22px;height:22px}
    .om-title{margin:0;font-size:19px;font-weight:700;letter-spacing:.1px}
    .om-subtitle{margin:4px 0 0;color:#c4d2e3;font-size:12px}
    .om-add-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;padding:8px 15px;border:0;border-radius:8px;background:#fff;color:#183554;font-size:13px;font-weight:700;transition:.2s ease;white-space:nowrap}
    .om-add-btn:hover{background:#eaf1f8;transform:translateY(-1px)}
    .om-add-btn svg{width:16px;height:16px}
    .om-body{padding:22px 24px 18px}
    .om-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:17px;flex-wrap:wrap}
    .om-entries{display:flex;align-items:center;gap:9px;color:#66758a;font-size:13px}
    .om-select{min-width:72px;height:37px;padding:0 28px 0 11px;border:1px solid #dce3ec;border-radius:8px;background:#fff;color:#26374d;font:inherit;outline:none}
    .om-select:focus,.om-search-input:focus{border-color:#52769d;box-shadow:0 0 0 3px rgba(58,94,132,.11)}
    .om-search-wrap{display:flex;align-items:center;gap:9px;color:#66758a;font-size:13px}
    .om-search-box{position:relative}
    .om-search-box svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#8795a8;pointer-events:none}
    .om-search-input{width:245px;height:37px;padding:0 12px 0 35px;border:1px solid #dce3ec;border-radius:8px;color:#26374d;font:inherit;font-size:13px;outline:none;transition:.2s ease}
    .om-table-wrap{width:100%;overflow:auto;max-height:650px;border:1px solid #e7ebf1;border-radius:10px}
    .om-table{width:100%;min-width:1500px;margin:0;border-collapse:separate;border-spacing:0}
    .om-table thead th{position:sticky;top:0;z-index:2;padding:14px 13px;background:#f4f7fb;color:#53647a;border-bottom:1px solid #e4eaf1;font-size:11px;font-weight:700;letter-spacing:.45px;text-transform:uppercase;white-space:nowrap}
    .om-table thead th.om-sortable{cursor:pointer;user-select:none}
    .om-table thead th.om-sortable:hover{color:#193b60}
    .om-sort-arrow{margin-left:5px;color:#8b9aae;font-size:13px}
    .om-table tbody td{padding:13px;border-bottom:1px solid #edf0f4;color:#43536a;font-size:12px;vertical-align:middle;white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}
    .om-table tbody tr:last-child td{border-bottom:0}
    .om-table tbody tr:hover{background:#f8fafd}
    .om-org-name{color:#203b5d!important;font-weight:600}
    .om-code{display:inline-flex;align-items:center;padding:4px 8px;border-radius:6px;background:#eef3f8;color:#405d7b;font-size:11px;font-weight:700;letter-spacing:.2px}
    .om-credit{color:#315b4a!important;font-weight:600}
    .om-meta-pill{display:inline-flex;align-items:center;min-height:24px;padding:4px 8px;border-radius:6px;background:#f1f4f7;color:#58677a;font-size:11px;font-weight:600}
    .om-action-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px;padding:5px 10px;border:1px solid #d7e2ee;border-radius:7px;background:#f5f8fc;color:#294e74;font-size:12px;font-weight:600;transition:.2s ease}
    .om-action-btn:hover{background:#e8f0f8;border-color:#b9cadd}
    .om-action-btn svg{width:14px;height:14px}
    .om-empty{padding:42px 16px!important;text-align:center;color:#8a97a8!important}
    .om-empty-icon{width:42px;height:42px;margin:0 auto 10px;display:grid;place-items:center;border-radius:12px;background:#f1f5f9;color:#8292a6}
    .om-empty-icon svg{width:21px;height:21px}
    .om-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:18px;flex-wrap:wrap}
    .om-showing{color:#78869a;font-size:12px}
    .om-pagination{display:flex;align-items:center;gap:5px;margin:0;padding:0;list-style:none}
    .om-page-btn{min-width:33px;height:33px;padding:0 9px;border:1px solid #e0e6ee;border-radius:7px;background:#fff;color:#53647a;font-size:12px;font-weight:600;transition:.2s ease}
    .om-page-btn:hover:not(:disabled){background:#f0f4f9;border-color:#cbd7e5}
    .om-page-btn.om-active{background:#1c3a5d;border-color:#1c3a5d;color:#fff}
    .om-page-btn:disabled{opacity:.42;cursor:not-allowed}
    @media(max-width:640px){.om-page{padding:12px 8px}.om-header{padding:15px;align-items:flex-start}.om-title{font-size:17px}.om-body{padding:16px 12px}.om-toolbar{align-items:flex-start;flex-direction:column}.om-search-wrap{width:100%;justify-content:space-between}.om-search-box,.om-search-input{width:100%}.om-search-box{flex:1}.om-footer{align-items:flex-start;flex-direction:column}}
  `;

  return (
    <div className="om-page container-fluid">
      <style>{styles}</style>
      <div className="om-card">
        <div className="om-header">
          <div className="om-heading-wrap">
            <div className="om-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 12h.01M15 12h.01" />
              </svg>
            </div>
            <div>
              <h5 className="om-title">Organization Master</h5>
              <p className="om-subtitle">Manage organization profiles and business details</p>
            </div>
          </div>
          {hasPermission("Organization", "ADD") && (
            <button className="om-add-btn" onClick={() => navigate("/add-organization")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              Add New Organization
            </button>
          )}
        </div>

        <div className="om-body">
          <div className="om-toolbar">
            <div className="om-entries">
              <span>Show</span>
              <select className="om-select" value={entries} onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1); }} aria-label="Number of entries to display">
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="om-search-wrap">
              <label htmlFor="om-organization-search">Search</label>
              <div className="om-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                <input id="om-organization-search" type="text" className="om-search-input" placeholder="Search organizations..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>
          </div>

          <div className="om-table-wrap">
            <table className="om-table">
              <thead><tr>
                <th>Actions</th>
                <th className="om-sortable" onClick={() => handleSort("name")}>Name <span className="om-sort-arrow">{getArrow("name")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("contact")}>Contact <span className="om-sort-arrow">{getArrow("contact")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("creditLimit")}>Credit Limit <span className="om-sort-arrow">{getArrow("creditLimit")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("code")}>Code <span className="om-sort-arrow">{getArrow("code")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("address")}>Address <span className="om-sort-arrow">{getArrow("address")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("city")}>City <span className="om-sort-arrow">{getArrow("city")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("state")}>State <span className="om-sort-arrow">{getArrow("state")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("country")}>Country <span className="om-sort-arrow">{getArrow("country")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("currency")}>Currency <span className="om-sort-arrow">{getArrow("currency")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("paymentMode")}>Payment Mode <span className="om-sort-arrow">{getArrow("paymentMode")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("source")}>Source <span className="om-sort-arrow">{getArrow("source")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("marketingPerson")}>Marketing Person <span className="om-sort-arrow">{getArrow("marketingPerson")}</span></th>
                <th className="om-sortable" onClick={() => handleSort("tat")}>Turn Around Time <span className="om-sort-arrow">{getArrow("tat")}</span></th>
              </tr></thead>
              <tbody>
                {organizations.length > 0 ? organizations.map((o) => (
                  <tr key={o.id}>
                    <td>
                      {hasPermission("Organization", "EDIT") && (
                        <button className="om-action-btn" onClick={() => navigate(`/edit-organization/${o.id}`)} title="Edit organization">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" /></svg>
                          Edit
                        </button>
                      )}
                    </td>
                    <td className="om-org-name" title={o.organizationName}>{o.organizationName}</td>
                    <td>{o.contact}</td>
                    <td className="om-credit">{o.creditLimit}</td>
                    <td><span className="om-code">{o.code || "—"}</span></td>
                    <td title={o.address}>{o.address}</td>
                    <td>{o.city}</td><td>{o.state}</td><td>{o.country}</td>
                    <td><span className="om-meta-pill">{o.currency || "—"}</span></td>
                    <td>{o.paymentMode}</td><td>{o.source}</td><td>{o.marketingPerson}</td><td>{o.turnAroundTime}</td>
                  </tr>
                )) : (
                  <tr><td className="om-empty" colSpan="14">
                    <div className="om-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4M8 10.5h5" /></svg></div>
                    No organizations found
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="om-footer">
            <div className="om-showing">
              Showing {startEntry} to {endEntry} of {totalEntries} entries
              <span> (Page {totalPages === 0 ? 0 : currentPage} of {totalPages})</span>
            </div>
            <nav aria-label="Organization list pagination">
              <ul className="om-pagination">
                <li><button className="om-page-btn" disabled={currentPage === 1 || totalPages === 0} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button></li>
                {pageNumbers.map((num) => (
                  <li key={num}><button className={`om-page-btn ${currentPage === num ? "om-active" : ""}`} aria-current={currentPage === num ? "page" : undefined} onClick={() => setCurrentPage(num)}>{num}</button></li>
                ))}
                <li><button className="om-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;

// import React, { useState, useEffect} from "react";
// import "../../../styles/allPatients.css";
// import { useNavigate } from "react-router-dom";
// // import { organizations } from "../../../data/organizations";
// import { getOrganizations, deleteOrganization } from "../../../services/organizationService";
// import { hasPermission } from "../../permissionUtil";

// const Organization = () => {
  
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [sortColumn, setSortColumn] = useState("");
//   const [sortDirection, setSortDirection] = useState("asc");

//   const [organizations, setOrganizations] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);

//   /* Sorting */
// //   const loadOrganizations = async () => {
// //   const res = await getOrganizations(currentPage - 1, entries, search);

// //   setOrganizations(res.data.content);
// //   setTotalPages(res.data.totalPages);
// // };
// const loadOrganizations = async () => {
//   try {
//     const res = await getOrganizations(currentPage - 1, entries, search);

//     setOrganizations(res.data.content);
//     setTotalPages(res.data.totalPages);
//   } catch (err) {
//     if (err.response?.status === 403) {
//       alert("Access Denied ❌");
//     }
//   }
// };

// useEffect(() => {
//   loadOrganizations();
// }, [currentPage, entries, search]);

//   const handleSort = (column) => {
//     let direction = "asc";

//     if (sortColumn === column && sortDirection === "asc") {
//       direction = "desc";
//     }

//     setSortColumn(column);
//     setSortDirection(direction);
//   };

//   /* Search */

//   // const filteredData = organizations.filter((o) =>
//   //   Object.values(o).join(" ").toLowerCase().includes(search.toLowerCase()),
//   // );

//   // /* Sorted */

//   // const sortedData = [...filteredData].sort((a, b) => {
//   //   if (!sortColumn) return 0;

//   //   let valA = a[sortColumn];
//   //   let valB = b[sortColumn];

//   //   if (valA < valB) return sortDirection === "asc" ? -1 : 1;
//   //   if (valA > valB) return sortDirection === "asc" ? 1 : -1;

//   //   return 0;
//   // });
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

// const startEntry = organizations.length === 0 ? 0 : (currentPage - 1) * entries + 1;

// const endEntry = Math.min(currentPage * entries, totalPages * entries);

//   /* Pagination */

//   // const indexOfLast = currentPage * entries;
//   // const indexOfFirst = indexOfLast - entries;

//   // const currentData = sortedData.slice(indexOfFirst, indexOfLast);

//   // const totalPages = Math.ceil(sortedData.length / entries);

//   // const pageNumbers = [];

//   // for (let i = 1; i <= totalPages; i++) {
//   //   pageNumbers.push(i);
//   // }

//   // const startEntry = sortedData.length === 0 ? 0 : indexOfFirst + 1;
//   // const endEntry = Math.min(indexOfLast, sortedData.length);

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
//           style={{
//             background: "linear-gradient(90deg,#6a5acd,#7b68ee)",
//             color: "white",
//           }}
//         >
//           <h5>Organization Master</h5>

//           {/* <button
//             className="btn btn-light"
//             onClick={() => navigate("/add-organization")}
//           >
//             Add New Organization
//           </button> */}
//           {hasPermission("Organization", "ADD") && (
//   <button
//     className="btn btn-light"
//     onClick={() => navigate("/add-organization")}
//   >
//     ➕ Add New Organization
//   </button>
// )}
//         </div>

//         <div className="card-body">
//           {/* Show entries + search */}

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
//   setSearch(e.target.value);
//   setCurrentPage(1);
// }}
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
//                   <th>Actions</th>

//                   {/* <th
//                     onClick={() => handleSort("status")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Status {getArrow("status")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("name")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Name {getArrow("name")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("contact")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Contact {getArrow("contact")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("creditLimit")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Credit Limit {getArrow("creditLimit")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("code")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Code {getArrow("code")}
//                   </th>

//                   {/* <th
//                     onClick={() => handleSort("email")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Email {getArrow("email")}
//                   </th> */}

//                   <th
//                     onClick={() => handleSort("address")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Address {getArrow("address")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("city")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     City {getArrow("city")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("state")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     State {getArrow("state")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("country")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Country {getArrow("country")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("currency")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Currency {getArrow("currency")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("paymentMode")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Payment Mode {getArrow("paymentMode")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("source")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Source {getArrow("source")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("marketingPerson")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Marketing Person {getArrow("marketingPerson")}
//                   </th>

//                   <th
//                     onClick={() => handleSort("tat")}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Turn Around Time {getArrow("tat")}
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {/* {currentData.map((o) => ( */}
//                 {organizations.map((o) => (
//                   <tr key={o.id}>
//                     <td>
//                       {/* <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => navigate(`/edit-organization/${o.id}`)}
//                       >
//                         Edit
//                       </button> */}
//                       {hasPermission("Organization", "EDIT") && (
//   <button
//     className="btn btn-info btn-sm"
//     onClick={() => navigate(`/edit-organization/${o.id}`)}
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
//                           checked={true}
//                           readOnly
//                         />
//                       </div>
//                     </td> */}

//                     <td>{o.organizationName}</td>
//                     <td>{o.contact}</td>
//                     <td>{o.creditLimit}</td>
//                     <td>{o.code}</td>
//                     {/* <td>{o.email}</td> */}
//                     <td>{o.address}</td>
//                     <td>{o.city}</td>
//                     <td>{o.state}</td>
//                     <td>{o.country}</td>
//                     <td>{o.currency}</td>
//                     <td>{o.paymentMode}</td>
//                     <td>{o.source}</td>
//                     <td>{o.marketingPerson}</td>
//                     <td>{o.turnAroundTime}</td>
//                   </tr>
//                 ))}
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

// export default Organization;
