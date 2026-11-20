import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

const SetPermission = () => {
  const { roleId } = useParams();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await api.get(`/permissions/${roleId}`);
      if (!res.data.data || res.data.data.length === 0) {
        setPermissions([
          { module: "Dashboard", canView: false, canAdd: false, canEdit: false },
          { module: "Test Master", canView: false, canAdd: false, canEdit: false },
          { module: "Organization", canView: false, canAdd: false, canEdit: false },
          { module: "Insurance", canView: false, canAdd: false, canEdit: false },
          { module: "Service Provider", canView: false, canAdd: false, canEdit: false },
          { module: "Diagnostic Center", canView: false, canAdd: false, canEdit: false },
          { module: "Currency", canView: false, canAdd: false, canEdit: false },
          { module: "Users", canView: false, canAdd: false, canEdit: false },
          { module: "Roles", canView: false, canAdd: false, canEdit: false },
          { module: "Patients", canView: false, canAdd: false, canEdit: false },
          { module: "Appointment", canView: false, canAdd: false, canEdit: false },
          { module: "Test Result", canView: false, canAdd: false, canEdit: false },
          { module: "Test Report", canView: false, canAdd: false, canEdit: false },
          { module: "Invoice", canView: false, canAdd: false, canEdit: false },
        ]);
      } else {
        setPermissions(res.data.data);
      }
      console.log(res.data);
    } catch (err) {
      console.error("Permission load error:", err);
      setPermissions([]);
    }
  };

  const togglePermission = (module, type) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === module ? { ...p, [type]: !p[type] } : p
      )
    );
  };

  const handleSave = async () => {
    await api.post("/permissions", {
      roleId: Number(roleId),
      permissions,
    });

    // Reload permissions after saving
    const res = await api.get(`/permissions/${roleId}`);
    localStorage.setItem("permissions", JSON.stringify(res.data.data));

    alert("Permissions saved successfully");
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .sp-page {
      width: 100%;
      padding: 22px 20px;
      color: #18243a;
      font-family: 'Inter', sans-serif;
    }
    .sp-card {
      width: 100%;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, .06);
    }
    .sp-header {
      min-height: 76px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .sp-heading-wrap { display: flex; align-items: center; gap: 13px; min-width: 0; }
    .sp-heading-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .sp-heading-icon svg { width: 22px; height: 22px; }
    .sp-title { margin: 0; font-size: 19px; font-weight: 700; letter-spacing: .1px; }
    .sp-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .sp-body { padding: 22px 24px 20px; }
    .sp-intro {
      margin: 0 0 17px;
      color: #66758a;
      font-size: 13px;
      line-height: 1.6;
    }
    .sp-table-wrap {
      width: 100%;
      overflow: auto;
      border: 1px solid #e7ebf1;
      border-radius: 10px;
    }
    .sp-table {
      width: 100%;
      min-width: 650px;
      margin: 0;
      border-collapse: separate;
      border-spacing: 0;
    }
    .sp-table thead th {
      padding: 14px 18px;
      background: #f4f7fb;
      color: #53647a;
      border-bottom: 1px solid #e4eaf1;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .55px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .sp-table thead th:not(:first-child) { text-align: center; }
    .sp-table tbody td {
      padding: 13px 18px;
      border-bottom: 1px solid #edf0f4;
      color: #35445a;
      font-size: 13px;
      vertical-align: middle;
    }
    .sp-table tbody tr:last-child td { border-bottom: 0; }
    .sp-table tbody tr:hover { background: #f8fafd; }
    .sp-module-name { color: #203b5d !important; font-weight: 600; }
    .sp-empty { padding: 42px 16px !important; text-align: center; color: #8a97a8 !important; font-size: 13px; }
    .sp-module-cell { display: flex; align-items: center; gap: 10px; }
    .sp-module-marker {
      width: 7px;
      height: 7px;
      flex: 0 0 7px;
      border-radius: 50%;
      background: #7890aa;
    }
    .sp-toggle-cell { text-align: center; }
    .sp-toggle-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      min-width: 82px;
    }
    .sp-switch {
      position: relative;
      display: inline-flex;
      width: 36px;
      height: 20px;
      flex: 0 0 36px;
      margin: 0;
    }
    .sp-switch input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
    .sp-switch-track {
      position: absolute;
      inset: 0;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      background: #e5eaf0;
      cursor: pointer;
      transition: .2s ease;
    }
    .sp-switch-track::before {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(20, 35, 55, .2);
      content: "";
      transition: .2s ease;
    }
    .sp-switch input:checked + .sp-switch-track {
      border-color: #1d557f;
      background: #1d557f;
    }
    .sp-switch input:checked + .sp-switch-track::before { transform: translateX(16px); }
    .sp-switch input:focus-visible + .sp-switch-track {
      outline: 3px solid rgba(58, 94, 132, .2);
      outline-offset: 2px;
    }
    .sp-switch-label {
      min-width: 29px;
      color: #66758a;
      font-size: 12px;
      font-weight: 600;
      text-align: left;
    }
    .sp-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding-top: 19px;
      flex-wrap: wrap;
    }
    .sp-note { color: #8794a5; font-size: 11px; }
    .sp-save-btn {
      min-height: 39px;
      padding: 8px 17px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 1px solid #1d3c60;
      border-radius: 8px;
      background: #1d3c60;
      color: #fff;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: .2s ease;
    }
    .sp-save-btn:hover {
      background: #142e4d;
      border-color: #142e4d;
      transform: translateY(-1px);
    }
    .sp-save-btn svg { width: 15px; height: 15px; }
    @media (max-width: 640px) {
      .sp-page { padding: 12px 8px; }
      .sp-header { padding: 15px; }
      .sp-title { font-size: 17px; }
      .sp-body { padding: 16px 12px; }
      .sp-footer { align-items: flex-start; flex-direction: column; }
      .sp-save-btn { width: 100%; }
    }
  `;

  return (
    <div className="sp-page container-fluid">
      <style>{styles}</style>

      <div className="sp-card">
        <div className="sp-header">
          <div className="sp-heading-wrap">
            <div className="sp-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4.5 6v5.2c0 4.7 3.2 8.1 7.5 9.8 4.3-1.7 7.5-5.1 7.5-9.8V6L12 3Z" />
                <path d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <div>
              <h5 className="sp-title">Set Role Permissions</h5>
              <p className="sp-subtitle">Control module access for this role</p>
            </div>
          </div>
        </div>

        <div className="sp-body">
          <p className="sp-intro">
            Configure which actions this role can perform in each application module.
          </p>

          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Controller Name</th>
                  <th>View</th>
                  <th>Add</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {permissions?.length > 0 ? (
                  permissions.map((p) => (
                    <tr key={p.module}>
                      <td className="sp-module-name">
                        <div className="sp-module-cell">
                          <span className="sp-module-marker" />
                          {p.module}
                        </div>
                      </td>

                      <td className="sp-toggle-cell">
                        <div className="sp-toggle-wrap">
                          <label className="sp-switch">
                            <input
                              type="checkbox"
                              checked={p.canView}
                              onChange={() => togglePermission(p.module, "canView")}
                              aria-label={`View permission for ${p.module}`}
                            />
                            <span className="sp-switch-track" />
                          </label>
                          <span className="sp-switch-label">{p.canView ? "On" : "Off"}</span>
                        </div>
                      </td>

                      <td className="sp-toggle-cell">
                        <div className="sp-toggle-wrap">
                          <label className="sp-switch">
                            <input
                              type="checkbox"
                              checked={p.canAdd}
                              onChange={() => togglePermission(p.module, "canAdd")}
                              aria-label={`Add permission for ${p.module}`}
                            />
                            <span className="sp-switch-track" />
                          </label>
                          <span className="sp-switch-label">{p.canAdd ? "On" : "Off"}</span>
                        </div>
                      </td>

                      <td className="sp-toggle-cell">
                        <div className="sp-toggle-wrap">
                          <label className="sp-switch">
                            <input
                              type="checkbox"
                              checked={p.canEdit}
                              onChange={() => togglePermission(p.module, "canEdit")}
                              aria-label={`Edit permission for ${p.module}`}
                            />
                            <span className="sp-switch-track" />
                          </label>
                          <span className="sp-switch-label">{p.canEdit ? "On" : "Off"}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="sp-empty" colSpan="4">
                      No permission modules available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="sp-footer">
            <span className="sp-note">Review the selected permissions before saving.</span>
            <button className="sp-save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5 9.5 17 19 7.5" />
              </svg>
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPermission;

// import React, { useState } from "react";
// import "../../../styles/allPatients.css";
// import { useParams } from "react-router-dom";
// import api from "../../../services/api";
// import { useEffect } from "react";

// const SetPermission = () => {
//   const { roleId } = useParams();
//   const [permissions, setPermissions] = useState([]);

//   useEffect(() => {
//     loadPermissions();
//   }, []);

//  const loadPermissions = async () => {
//   try {
//     const res = await api.get(`/permissions/${roleId}`);
//     if (!res.data.data || res.data.data.length === 0) {
//   // setPermissions([
//   //   { module: "Dashboard", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Test Master", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Organization", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Patients", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Appointment", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Test Result", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Test Report", canView: false, canAdd: false, canEdit: false },
//   //   { module: "Invoice", canView: false, canAdd: false, canEdit: false },
//   // ]);
//   setPermissions([
//   { module: "Dashboard", canView: false, canAdd: false, canEdit: false },
//   { module: "Test Master", canView: false, canAdd: false, canEdit: false },
//   { module: "Organization", canView: false, canAdd: false, canEdit: false },
//   { module: "Insurance", canView: false, canAdd: false, canEdit: false },
//   { module: "Service Provider", canView: false, canAdd: false, canEdit: false },
//   { module: "Diagnostic Center", canView: false, canAdd: false, canEdit: false },
//   { module: "Currency", canView: false, canAdd: false, canEdit: false },
//   { module: "Users", canView: false, canAdd: false, canEdit: false }, 
//   { module: "Roles", canView: false, canAdd: false, canEdit: false },
//   { module: "Patients", canView: false, canAdd: false, canEdit: false },
//   { module: "Appointment", canView: false, canAdd: false, canEdit: false },
//   { module: "Test Result", canView: false, canAdd: false, canEdit: false },
//   { module: "Test Report", canView: false, canAdd: false, canEdit: false },
//   { module: "Invoice", canView: false, canAdd: false, canEdit: false },
// ]);
// } else {
//   setPermissions(res.data.data);
// }
//     console.log(res.data);
//   } catch (err) {
//     console.error("Permission load error:", err);
//     setPermissions([]); // prevent crash
//   }
// };

//   // const togglePermission = (id, type) => {
//   //   setPermissions((prev) =>
//   //     prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
//   //   );
//   // };
//   // const togglePermission = (id, type) => {
//   //   setPermissions((prev) =>
//   //     prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
//   //   );
//   // };
//   const togglePermission = (module, type) => {
//   setPermissions((prev) =>
//     prev.map((p) =>
//       p.module === module ? { ...p, [type]: !p[type] } : p
//     )
//   );
// };

//   // const handleSave = async () => {
//   //   await api.post("/permissions", {
//   //     roleId: Number(roleId),
//   //     permissions: permissions.map((p) => ({
//   //       module: p.module,
//   //       canView: p.canView,
//   //       canAdd: p.canAdd,
//   //       canEdit: p.canEdit,
//   //     })),
//   //   });

//   //   alert("Permissions saved successfully");
//   // };
//   const handleSave = async () => {
//   await api.post("/permissions", {
//     roleId: Number(roleId),
//     permissions,
//   });

//   // 🔥 reload permissions
//   const res = await api.get(`/permissions/${roleId}`);
//   localStorage.setItem("permissions", JSON.stringify(res.data.data));

//   alert("Permissions saved successfully");
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header" style={{ background: "#f5f5f5" }}>
//           <div className="row fw-bold">
//             <div className="col-md-4">Controller Name</div>

//             <div className="col-md-2 text-center">View</div>

//             <div className="col-md-2 text-center">Add</div>

//             <div className="col-md-2 text-center">Edit</div>
//           </div>
//         </div>

//         <div className="card-body p-0">
//           {permissions?.map((p) => (
//             <div
//               // key={p.id}
//               key={p.module}
//               className="row align-items-center border-bottom py-3 px-3"
//             >
//               <div className="col-md-4">{p.module}</div>

//               <div className="col-md-2 text-center">
//                 <div className="d-flex justify-content-center align-items-center gap-2">
//                   <div className="form-check form-switch m-0">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={p.canView}
//                       // onChange={() => togglePermission(p.id, "canView")}
//                       onChange={() => togglePermission(p.module, "canView")}
                      
//                     />
//                   </div>

//                   <span className="mb-0">View</span>
//                 </div>
//               </div>

//               <div className="col-md-2 text-center">
//                 <div className="d-flex justify-content-center align-items-center gap-2">
//                   <div className="form-check form-switch m-0">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={p.canAdd}
//                       // onChange={() => togglePermission(p.id, "canAdd")}
//                       onChange={() => togglePermission(p.module, "canAdd")}
//                     />
//                   </div>

//                   <span className="mb-0">Add</span>
//                 </div>
//               </div>

//               <div className="col-md-2 text-center">
//                 <div className="d-flex justify-content-center align-items-center gap-2">
//                   <div className="form-check form-switch m-0">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={p.canEdit}
//                       // onChange={() => togglePermission(p.id, "canEdit")}
//                       onChange={() => togglePermission(p.module, "canEdit")}
//                     />
//                   </div>

//                   <span className="mb-0">Edit</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="p-3 text-end">
//           <button className="btn btn-success" onClick={handleSave}>
//             Save Permissions
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetPermission;
