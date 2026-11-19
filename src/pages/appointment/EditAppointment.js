// import React, { useEffect, useState } from "react";
// import "../../styles/addPatient.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { updateAppointment } from "../../services/appointmentService";
// // import { getAllServiceProviders } from "../../services/serviceProviderService";
// import api from "../../services/api";
// import { getDiagnosticCenters }
// from "../../services/diagnosticCenterService";

// const EditAppointment = () => {
//   const { id } = useParams(); // appointmentId
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   // const [providers, setProviders] = useState([]);
//   const [diagnosticCenters,
// setDiagnosticCenters] = useState([]);

//   const [form, setForm] = useState({
//     patientId: "",
//     organizationId: "",
//     // serviceProviderId: "",
//     visitDate: "",
//     // visitTime: "",
//     diagnosticCenterId: "",
// visitSlot: "",
// visitType: "CENTER_VISIT",
// medicalAddress: "",
// diagnosticCenterName: "",
//   });

//   useEffect(() => {
//     loadAppointment();
//     loadDiagnosticCenters();
//   }, []);

//   // 🔥 LOAD APPOINTMENT (IMPORTANT)
//   const loadAppointment = async () => {
//     const res = await api.get(`/appointments/${id}`); // 👈 create this API if not exists
//     const data = res.data.data;

//     setPatient({
//       patientName: data.patientName,
//       organizationName: data.organizationName,
//     });

//     setForm({
//       patientId: data.patientId,
//       organizationId: data.organizationId,
//       // serviceProviderId: data.serviceProviderId || "",
//       visitDate: data.visitDate || "",
//       // visitTime: data.visitTime || "",
//       diagnosticCenterId:
//   data.diagnosticCenterId || "",

// visitSlot:
//   data.visitSlot || "",

// visitType:
//   data.visitType || "CENTER_VISIT",

// medicalAddress:
//   data.medicalAddress || "",

// diagnosticCenterName:
//   data.diagnosticCenterName || "",
//     });
//   };

//   // const loadProviders = async () => {
//   //   const res = await getAllServiceProviders();
//   //   setProviders(res.data.data);
//   // };

//   const loadDiagnosticCenters = async () => {

//   try {

//     const res =
//       await getDiagnosticCenters(
//         0,
//         1000,
//         ""
//       );

//     setDiagnosticCenters(
//       res.data.content || []
//     );

//   } catch (err) {

//     console.warn(
//       "DC access denied"
//     );

//     setDiagnosticCenters([]);
//   }
// };

// //   const handleSubmit = async () => {
// //     await updateAppointment(id, form);
// //     navigate("/today-appointments"); // or upcoming
// //   };


// // const handleSubmit = async () => {
// //   await updateAppointment(id, form);

// //   const today = new Date().toISOString().split("T")[0];

// //   if (form.visitDate === today) {
// //     navigate("/appointment/today");
// //   } else {
// //     navigate("/appointment/upcoming");
// //   }
// // };

// const handleSubmit = async () => {
//   try {
//     const res = await updateAppointment(id, form);

//     // ✅ Backend message
//     alert(res.data.message); // "Appointment updated successfully"

//     const today = new Date().toISOString().split("T")[0];

//     if (form.visitDate === today) {
//       navigate("/appointment/today");
//     } else {
//       navigate("/appointment/upcoming");
//     }

//   } catch (error) {
//     console.error(error);

//     alert(
//       error.response?.data?.message ||
//       "Failed to update appointment ❌"
//     );
//   }
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">

//         {/* Header */}
//         <div className="card-header add-header">
//           Edit Appointment
//         </div>

//         <div className="card-body">
//           <div className="row g-3">

//             {/* Patient */}
//             <div className="col-md-6">
//               <label>Patient Name</label>
//               <input
//                 className="form-control"
//                 value={patient?.patientName || ""}
//                 readOnly
//               />
//             </div>

//             {/* Organization */}
//             <div className="col-md-6">
//               <label>Organization</label>
//               <input
//                 className="form-control"
//                 value={patient?.organizationName || ""}
//                 readOnly
//               />
//             </div>

//             {/* Service Provider */}
//             {/* <div className="col-md-6">
//               <label>Service Provider</label>
//               <select
//                 className="form-control"
//                 value={form.serviceProviderId}
//                 onChange={(e) =>
//                   setForm({ ...form, serviceProviderId: e.target.value })
//                 }
//               >
//                 <option value="">Select Provider</option>
//                 {providers.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div> */}
//             <div className="col-md-6">

//   <label>Diagnostic Center</label>

//   <select
//     className="form-control"
//     value={form.diagnosticCenterId}
//     onChange={(e) => {

//       const selectedDc =
//         diagnosticCenters.find(
//           dc => dc.id == e.target.value
//         );

//       setForm({

//         ...form,

//         diagnosticCenterId:
//           e.target.value,

//         diagnosticCenterName:
//           selectedDc?.name || "",

//         medicalAddress:
//           selectedDc?.primaryAddress || ""
//       });
//     }}
//   >

//     <option value="">
//       Select DC
//     </option>

//     {diagnosticCenters.map((dc) => (

//       <option
//         key={dc.id}
//         value={dc.id}
//       >

//         {dc.name}
//         {" - "}
//         {dc.locationName}

//       </option>
//     ))}
//   </select>
// </div>

// <div className="col-md-3">

//   <label>Visit Type</label>

//   <select
//     className="form-control"
//     value={form.visitType}
//     onChange={(e) =>
//       setForm({
//         ...form,
//         visitType: e.target.value
//       })
//     }
//   >

//     <option value="CENTER_VISIT">
//       Center Visit
//     </option>

//     <option value="HOME_VISIT">
//       Home Visit
//     </option>

//   </select>
// </div>

//             {/* Date */}
//             <div className="col-md-3">
//               <label>Visit Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.visitDate}
//                 onChange={(e) =>
//                   setForm({ ...form, visitDate: e.target.value })
//                 }
//               />
//             </div>

//             {/* Time */}
//             <div className="col-md-3">
//               <label>Visit Time</label>
//               <input
//                 type="time"
//                 className="form-control"
//                 value={form.visitSlot}
//                 onChange={(e) =>
//                   setForm({ ...form, visitSlot: e.target.value })
//                 }
//               />
//             </div>

//           </div>

//           {/* Buttons */}
//           <div className="mt-4">
//             <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
//               Update Appointment
//             </button>

//             <button
//               className="btn btn-danger ms-3"
//               onClick={() => navigate("/today-appointments")}
//             >
//               Cancel
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditAppointment;


import React, { useEffect, useRef, useState } from "react";
import "../../styles/addPatient.css";
import { useParams, useNavigate } from "react-router-dom";

import { updateAppointment } from "../../services/appointmentService";
import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
import { hasPermission } from "../permissionUtil";
import api from "../../services/api";

const EditAppointment = () => {
  const canEdit = hasPermission("Appointment", "EDIT");
  const canViewDc = hasPermission("Diagnostic Center", "VIEW");

  const { id } = useParams();
  const navigate = useNavigate();
  const dcDropdownRef = useRef(null);

  const [patient, setPatient] = useState(null);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [dcSearchQuery, setDcSearchQuery] = useState("");
  const [showDcDropdown, setShowDcDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    organizationId: "",
    diagnosticCenterId: "",
    visitType: "CENTER_VISIT",
    visitSlot: "",
    medicalAddress: "",
    diagnosticCenterName: "",
    visitDate: "",
  });

  useEffect(() => {
    loadAppointment();
  }, [id]);

  useEffect(() => {
    if (canViewDc) {
      loadDiagnosticCenters();
    } else {
      setDiagnosticCenters([]);
    }
  }, [canViewDc]);

  // Close the diagnostic center dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dcDropdownRef.current &&
        !dcDropdownRef.current.contains(event.target)
      ) {
        setShowDcDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load the existing appointment and prefill the form.
  const loadAppointment = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/appointments/${id}`);
      const data = res.data.data;

      setPatient({
        patientName: data.patientName || "",
        organizationName: data.organizationName || "",
      });

      const diagnosticCenterId = data.diagnosticCenterId ?? "";

      setForm({
        patientId: data.patientId ?? "",
        organizationId: data.organizationId ?? "",
        diagnosticCenterId,
        visitType: data.visitType || "CENTER_VISIT",
        visitSlot: data.visitSlot || "",
        medicalAddress: data.medicalAddress || "",
        diagnosticCenterName: data.diagnosticCenterName || "",
        visitDate: data.visitDate
          ? String(data.visitDate).slice(0, 10)
          : "",
      });

      setDcSearchQuery(data.diagnosticCenterName || "");
    } catch (error) {
      console.error("Failed to load appointment:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDiagnosticCenters = async () => {
    try {
      const res = await getDiagnosticCenters(0, 1000, "");
      setDiagnosticCenters(res.data.content || []);
    } catch (error) {
      console.warn("Diagnostic Center access denied", error);
      setDiagnosticCenters([]);
    }
  };

  // Match the saved diagnostic center to its current name and location.
  useEffect(() => {
    if (!form.diagnosticCenterId || diagnosticCenters.length === 0) {
      return;
    }

    const selectedDC = diagnosticCenters.find(
      (dc) =>
        String(dc.id) === String(form.diagnosticCenterId)
    );

    if (selectedDC) {
      setDcSearchQuery(
        `${selectedDC.name} - ${selectedDC.locationName || ""}`
      );

      setForm((prev) => ({
        ...prev,
        diagnosticCenterName: selectedDC.name || "",
      }));
    }
  }, [diagnosticCenters, form.diagnosticCenterId]);

  const filteredDiagnosticCenters = diagnosticCenters.filter((dc) =>
    `${dc.name || ""} ${dc.locationName || ""}`
      .toLowerCase()
      .includes(dcSearchQuery.toLowerCase())
  );

  // Select a diagnostic center and choose a supported visit type.
  const handleDiagnosticCenterSelect = (dc) => {
    const centreAvailable = dc.isCentreVisitAvailable === true;
    const homeAvailable = dc.isHomeVisitAvailable === true;

    let visitType = "";

    if (centreAvailable) {
      visitType = "CENTER_VISIT";
    } else if (homeAvailable) {
      visitType = "HOME_VISIT";
    }

    setForm((prev) => ({
      ...prev,
      diagnosticCenterId: dc.id,
      diagnosticCenterName: dc.name || "",
      visitType,
      medicalAddress:
        visitType === "CENTER_VISIT"
          ? dc.primaryAddress || ""
          : "",
    }));

    setDcSearchQuery(
      `${dc.name || ""} - ${dc.locationName || ""}`
    );

    setShowDcDropdown(false);
  };

  const handleDcSearchChange = (e) => {
    const value = e.target.value;

    setDcSearchQuery(value);
    setShowDcDropdown(true);

    // Clear the selected center if the user edits the search text.
    if (
      !diagnosticCenters.some(
        (dc) =>
          String(dc.id) === String(form.diagnosticCenterId) &&
          `${dc.name || ""} - ${dc.locationName || ""}` === value
      )
    ) {
      setForm((prev) => ({
        ...prev,
        diagnosticCenterId: "",
        diagnosticCenterName: "",
        medicalAddress: "",
        visitType: "",
      }));
    }
  };

  const handleVisitTypeChange = (e) => {
    const visitType = e.target.value;

    const selectedDC = diagnosticCenters.find(
      (dc) =>
        String(dc.id) === String(form.diagnosticCenterId)
    );

    setForm((prev) => ({
      ...prev,
      visitType,
      medicalAddress:
        visitType === "CENTER_VISIT"
          ? selectedDC?.primaryAddress || ""
          : "",
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!form.visitDate) {
      alert("Please select a visit date.");
      return;
    }

    if (!form.visitSlot) {
      alert("Please select a visit time.");
      return;
    }

    if (canViewDc && !form.diagnosticCenterId) {
      alert("Please select a diagnostic center.");
      return;
    }

    if (
      form.diagnosticCenterId &&
      !form.visitType
    ) {
      alert("Please select a supported visit type.");
      return;
    }

    const selectedDC = diagnosticCenters.find(
      (dc) =>
        String(dc.id) === String(form.diagnosticCenterId)
    );

    if (selectedDC) {
      if (
        form.visitType === "CENTER_VISIT" &&
        selectedDC.isCentreVisitAvailable !== true
      ) {
        alert("Centre Visit is not available at this diagnostic center.");
        return;
      }

      if (
        form.visitType === "HOME_VISIT" &&
        selectedDC.isHomeVisitAvailable !== true
      ) {
        alert("Home Visit is not available at this diagnostic center.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await updateAppointment(id, form);

      alert(res.data.message || "Appointment updated successfully.");

      // Use the local calendar date for today's appointment comparison.
      const now = new Date();
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");

      if (form.visitDate === today) {
        navigate("/appointment/today");
      } else {
        navigate("/appointment/upcoming");
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!canEdit) {
    return <h3>Access Denied ❌</h3>;
  }

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="card">
          <div className="card-body">Loading appointment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">
          Edit Appointment
        </div>

        <div className="card-body">
          <div className="row g-3">
            {/* Patient */}
            <div className="col-md-6">
              <label>Patient Name</label>
              <input
                className="form-control"
                value={patient?.patientName || ""}
                readOnly
              />
            </div>

            {/* Organization */}
            <div className="col-md-6">
              <label>Organization</label>
              <input
                className="form-control"
                value={patient?.organizationName || ""}
                readOnly
              />
            </div>

            {/* Searchable Diagnostic Center */}
            <div className="col-md-6" ref={dcDropdownRef}>
              <label>Diagnostic Center</label>

              {!canViewDc ? (
                <input
                  className="form-control"
                  value="No Diagnostic Center Access"
                  disabled
                />
              ) : (
                <div className="searchable-select-container">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Diagnostic Center..."
                    value={dcSearchQuery}
                    onChange={handleDcSearchChange}
                    onFocus={() => setShowDcDropdown(true)}
                  />

                  {showDcDropdown && dcSearchQuery && (
                    <div className="searchable-dropdown">
                      {filteredDiagnosticCenters.length > 0 ? (
                        filteredDiagnosticCenters.map((dc) => (
                          <div
                            key={dc.id}
                            className="dropdown-item"
                            onClick={() =>
                              handleDiagnosticCenterSelect(dc)
                            }
                          >
                            <strong>{dc.name}</strong>
                            <br />
                            <small>{dc.locationName}</small>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-item disabled">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Visit Type */}
            <div className="col-md-3">
              <label>Visit Type</label>

              <select
                className="form-control"
                value={form.visitType}
                disabled={!form.diagnosticCenterId || !canViewDc}
                onChange={handleVisitTypeChange}
              >
                <option value="">Select Visit Type</option>

                {(() => {
                  const selectedDC = diagnosticCenters.find(
                    (dc) =>
                      String(dc.id) ===
                      String(form.diagnosticCenterId)
                  );

                  if (!selectedDC) return null;

                  return (
                    <>
                      {selectedDC.isCentreVisitAvailable === true && (
                        <option value="CENTER_VISIT">
                          Centre Visit
                        </option>
                      )}

                      {selectedDC.isHomeVisitAvailable === true && (
                        <option value="HOME_VISIT">
                          Home Visit
                        </option>
                      )}
                    </>
                  );
                })()}
              </select>
            </div>

            {/* Visit Date */}
            <div className="col-md-3">
              <label>Visit Date</label>
              <input
                type="date"
                className="form-control"
                value={form.visitDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    visitDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* Visit Time */}
            <div className="col-md-3">
              <label>Visit Time</label>
              <input
                type="time"
                className="form-control"
                value={form.visitSlot}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    visitSlot: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Appointment"}
            </button>

            <button
              className="btn btn-danger ms-3"
              onClick={() => navigate("/appointment/today")}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;
