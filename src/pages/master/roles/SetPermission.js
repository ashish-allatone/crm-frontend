import React, { useState } from "react";
import "../../../styles/allPatients.css";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useEffect } from "react";

const SetPermission = () => {
  const { roleId } = useParams();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadPermissions();
  }, []);

 const loadPermissions = async () => {
  try {
    const res = await api.get(`/permissions/${roleId}`);
    if (res.data.data.length === 0) {
  setPermissions([
    { id: 1, module: "Test Master", canView: false, canAdd: false, canEdit: false },
    { id: 2, module: "Patient", canView: false, canAdd: false, canEdit: false },
  ]);
}
    setPermissions(res.data.data || []);
    console.log(res.data);
  } catch (err) {
    console.error("Permission load error:", err);
    setPermissions([]); // prevent crash
  }
};

  // const togglePermission = (id, type) => {
  //   setPermissions((prev) =>
  //     prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
  //   );
  // };
  // const togglePermission = (id, type) => {
  //   setPermissions((prev) =>
  //     prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
  //   );
  // };
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
      permissions: permissions.map((p) => ({
        module: p.module,
        canView: p.canView,
        canAdd: p.canAdd,
        canEdit: p.canEdit,
      })),
    });

    alert("Permissions saved successfully");
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
          {permissions?.map((p) => (
            <div
              // key={p.id}
              key={p.module}
              className="row align-items-center border-bottom py-3 px-3"
            >
              <div className="col-md-4">{p.module}</div>

              <div className="col-md-2 text-center">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={p.canView}
                      // onChange={() => togglePermission(p.id, "canView")}
                      onChange={() => togglePermission(p.module, "canView")}
                      
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
                      checked={p.canAdd}
                      // onChange={() => togglePermission(p.id, "canAdd")}
                      onChange={() => togglePermission(p.module, "canAdd")}
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
                      checked={p.canEdit}
                      // onChange={() => togglePermission(p.id, "canEdit")}
                      onChange={() => togglePermission(p.module, "canEdit")}
                    />
                  </div>

                  <span className="mb-0">Edit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-end">
          <button className="btn btn-success" onClick={handleSave}>
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPermission;
