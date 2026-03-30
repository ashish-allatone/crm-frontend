import React, { useState } from "react";
import "../../../styles/allPatients.css";
import { permissionsData } from "../../../data/permissionsData";

const SetPermission = () => {
  const [permissions, setPermissions] = useState(permissionsData);

  const togglePermission = (id, type) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
    );
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header" style={{ background: "#f5f5f5" }}>
          <div className="row fw-bold">
            <div className="col-md-4">Controller Name</div>

            <div className="col-md-2 text-center">View</div>

            <div className="col-md-2 text-center">Add</div>

            <div className="col-md-2 text-center">Edit</div>
          </div>
        </div>

        <div className="card-body p-0">
          {permissions.map((p) => (
            <div
              key={p.id}
              className="row align-items-center border-bottom py-3 px-3"
            >
              <div className="col-md-4">{p.controller}</div>

              <div className="col-md-2 text-center">
                <div className="d-flex justify-content-center align-items-center gap-2">

<div className="form-check form-switch m-0">

<input
className="form-check-input"
type="checkbox"
checked={p.view}
onChange={()=>togglePermission(p.id,"view")}
/>

</div>

<span className="mb-0">View</span>

</div>
              </div>

              <div className="col-md-2 text-center">
                <div className="d-flex justify-content-center align-items-center gap-2">

<div className="form-check form-switch m-0">

<input
className="form-check-input"
type="checkbox"
checked={p.add}
onChange={()=>togglePermission(p.id,"add")}
/>

</div>

<span className="mb-0">Add</span>

</div>
              </div>

              <div className="col-md-2 text-center">
                <div className="d-flex justify-content-center align-items-center gap-2">

<div className="form-check form-switch m-0">

<input
className="form-check-input"
type="checkbox"
checked={p.edit}
onChange={()=>togglePermission(p.id,"edit")}
/>

</div>

<span className="mb-0">Edit</span>

</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetPermission;
