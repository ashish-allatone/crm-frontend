import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAppointment } from "../../services/appointmentService";
import { getPatientById } from "../../services/patientService";
import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
import { hasPermission } from "../permissionUtil";

const CreateAppointment = () => {
  const canAdd = hasPermission("Appointment", "ADD");
  const canViewDc = hasPermission("Diagnostic Center", "VIEW");
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  const [dcSearchQuery, setDcSearchQuery] = useState("");
  const [showDcDropdown, setShowDcDropdown] = useState(false);
  const dcDropdownRef = useRef(null);

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
    loadPatient();

    if (canViewDc) {
      loadDiagnosticCenters();
    } else {
      setDiagnosticCenters([]);
    }
  }, [canViewDc]);

  // Close the diagnostic-center dropdown when clicking outside.
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadPatient = async () => {
    const res = await getPatientById(id);
    const data = res.data.data;

    setPatient(data);

    setForm((prev) => ({
      ...prev,
      patientId: data.id,
      organizationId: data.organizationId,
    }));
  };

  const loadDiagnosticCenters = async () => {
    try {
      const res = await getDiagnosticCenters(0, 1000, "");
      setDiagnosticCenters(res.data.content || []);
    } catch (err) {
      console.warn("DC access denied");
      setDiagnosticCenters([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await createAppointment(form);
      alert(res.data.message);
      navigate("/patients");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create appointment ");
    }
  };

  const filteredDiagnosticCenters = diagnosticCenters.filter((dc) =>
    `${dc.name} ${dc.locationName}`
      .toLowerCase()
      .includes(dcSearchQuery.toLowerCase())
  );

  const handleDiagnosticCenterSelect = (dc) => {
    const homeAvailable = dc.isHomeVisitAvailable === true;
    const centreAvailable = dc.isCentreVisitAvailable === true;

    let visitType = "";

    if (centreAvailable) {
      visitType = "CENTER_VISIT";
    } else if (homeAvailable) {
      visitType = "HOME_VISIT";
    }

    setForm((prev) => ({
      ...prev,
      diagnosticCenterId: dc.id,
      diagnosticCenterName: dc.name,
      visitType,
      medicalAddress:
        visitType === "CENTER_VISIT" ? dc.primaryAddress || "" : "",
    }));

    setDcSearchQuery(`${dc.name} - ${dc.locationName}`);
    setShowDcDropdown(false);
  };

  const handleDcSearchChange = (e) => {
    const value = e.target.value;
    setDcSearchQuery(value);
    setShowDcDropdown(true);

    // Clear selected center details when the user clears the search field.
    if (value === "") {
      setForm({
        ...form,
        diagnosticCenterId: "",
        diagnosticCenterName: "",
        medicalAddress: "",
      });
    }
  };

  const selectedDiagnosticCenter = diagnosticCenters.find(
    (dc) => String(dc.id) === String(form.diagnosticCenterId)
  );

  if (!canAdd) {
    return (
      <div className="create-appointment-access-denied">
        <style>{`
          .create-appointment-access-denied {
            margin: 28px 20px;
            padding: 22px;
            border: 1px solid #f0d6d6;
            border-radius: 12px;
            background: #fff8f8;
            color: #a83232;
            font-family: Inter, sans-serif;
            font-weight: 600;
          }
        `}</style>
        Access Denied ❌
      </div>
    );
  }

  return (
    <div className="container-fluid create-appointment-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .create-appointment-page {
          width: 100%;
          max-width: none;
          padding: 18px 20px 28px;
          color: #18243a;
          font-family: 'Inter', sans-serif;
        }

        .create-appointment-page * {
          font-family: 'Inter', sans-serif;
        }

        .create-appointment-card {
          width: 100%;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(22, 42, 68, .07);
          overflow: visible;
        }

        .create-appointment-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 13px 13px 0 0;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }

        .create-appointment-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, .13);
        }

        .create-appointment-header-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: #fff;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .create-appointment-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -.25px;
        }

        .create-appointment-subtitle {
          margin: 3px 0 0;
          color: #c3d5e5;
          font-size: 12px;
        }

        .create-appointment-body {
          padding: 24px;
        }

        .create-appointment-section-title {
          margin: 0 0 17px;
          color: #183b5b;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .2px;
        }

        .create-appointment-field {
          position: relative;
        }

        .create-appointment-field label {
          display: block;
          margin-bottom: 7px;
          color: #526278;
          font-size: 12px;
          font-weight: 600;
        }

        .create-appointment-field .form-control {
          min-height: 42px;
          padding: 9px 12px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          background-color: #fff;
          color: #26364d;
          font-size: 13px;
          box-shadow: none;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .create-appointment-field .form-control:focus {
          border-color: #2b6f9f;
          box-shadow: 0 0 0 3px rgba(43, 111, 159, .11);
        }

        .create-appointment-field .form-control[readonly] {
          background: #f5f8fb;
          color: #56677c;
        }

        .create-appointment-field .form-control:disabled {
          background: #f1f4f7;
          color: #8b97a6;
          cursor: not-allowed;
        }

        .create-appointment-divider {
          height: 1px;
          margin: 24px 0 20px;
          background: #e9eef4;
        }

        .create-appointment-search-wrap {
          position: relative;
        }

        .create-appointment-search-wrap::after {
          content: "";
          position: absolute;
          top: 13px;
          right: 13px;
          width: 10px;
          height: 10px;
          border: 1.7px solid #8292a5;
          border-radius: 50%;
          pointer-events: none;
        }

        .create-appointment-search-wrap::before {
          content: "";
          position: absolute;
          top: 23px;
          right: 10px;
          width: 6px;
          height: 1.7px;
          transform: rotate(45deg);
          background: #8292a5;
          pointer-events: none;
        }

        .create-appointment-search-wrap input {
          padding-right: 34px !important;
        }

        .create-appointment-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          z-index: 20;
          max-height: 245px;
          overflow-y: auto;
          padding: 5px;
          border: 1px solid #dfe7ef;
          border-radius: 9px;
          background: #fff;
          box-shadow: 0 10px 25px rgba(22, 42, 68, .14);
        }

        .create-appointment-dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 11px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #26364d;
          text-align: left;
          cursor: pointer;
        }

        .create-appointment-dropdown-item:hover,
        .create-appointment-dropdown-item:focus {
          outline: none;
          background: #f1f6fa;
        }

        .create-appointment-dropdown-name {
          display: block;
          font-size: 12px;
          font-weight: 700;
        }

        .create-appointment-dropdown-location {
          display: block;
          margin-top: 3px;
          color: #7b899a;
          font-size: 11px;
        }

        .create-appointment-no-results {
          padding: 12px;
          color: #8491a1;
          font-size: 12px;
          text-align: center;
        }

        .create-appointment-hint {
          margin-top: 6px;
          color: #8794a4;
          font-size: 11px;
        }

        .create-appointment-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #e9eef4;
        }

        .create-appointment-btn {
          min-height: 40px;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          transition: background .18s ease, border-color .18s ease;
        }

        .create-appointment-save {
          border: 1px solid #0e3d66;
          background: #0e3d66;
          color: #fff;
        }

        .create-appointment-save:hover {
          border-color: #0a2d4a;
          background: #0a2d4a;
          color: #fff;
        }

        .create-appointment-cancel {
          border: 1px solid #d9e1e9;
          background: #fff;
          color: #596a7e;
        }

        .create-appointment-cancel:hover {
          border-color: #c4d0dc;
          background: #f5f8fb;
          color: #26364d;
        }

        @media (max-width: 768px) {
          .create-appointment-page {
            padding: 12px 10px 22px;
          }

          .create-appointment-header {
            min-height: 70px;
            padding: 14px 16px;
          }

          .create-appointment-title {
            font-size: 17px;
          }

          .create-appointment-body {
            padding: 18px 14px;
          }

          .create-appointment-actions {
            flex-wrap: wrap;
          }

          .create-appointment-btn {
            flex: 1 1 130px;
          }
        }
      `}</style>

      <div className="create-appointment-card">
        <div className="create-appointment-header">
          <div className="create-appointment-header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16.5h3M15 13h2" />
            </svg>
          </div>
          <div>
            <h5 className="create-appointment-title">Create Appointment</h5>
            <p className="create-appointment-subtitle">
              Schedule a patient visit at a diagnostic center or home
            </p>
          </div>
        </div>

        <div className="create-appointment-body">
          <h6 className="create-appointment-section-title">Patient Information</h6>
          <div className="row g-3">
            <div className="col-md-6 create-appointment-field">
              <label>Patient Name</label>
              <input
                className="form-control"
                value={patient?.patientName || ""}
                readOnly
              />
            </div>

            <div className="col-md-6 create-appointment-field">
              <label>Organization</label>
              <input
                className="form-control"
                value={patient?.organizationName || ""}
                readOnly
              />
            </div>
          </div>

          <div className="create-appointment-divider" />

          <h6 className="create-appointment-section-title">Appointment Details</h6>
          <div className="row g-3">
            <div
              className="col-md-6 create-appointment-field"
              ref={dcDropdownRef}
            >
              <label>Diagnostic Center</label>
              {!canViewDc ? (
                <input
                  className="form-control"
                  value="No Diagnostic Center Access"
                  disabled
                />
              ) : (
                <div className="create-appointment-search-wrap">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search diagnostic center by name or location..."
                    value={dcSearchQuery}
                    onChange={handleDcSearchChange}
                    onFocus={() => setShowDcDropdown(true)}
                    autoComplete="off"
                  />

                  {showDcDropdown && dcSearchQuery && (
                    <div className="create-appointment-dropdown">
                      {filteredDiagnosticCenters.length > 0 ? (
                        filteredDiagnosticCenters.map((dc) => (
                          <button
                            type="button"
                            key={dc.id}
                            className="create-appointment-dropdown-item"
                            onClick={() => handleDiagnosticCenterSelect(dc)}
                          >
                            <span className="create-appointment-dropdown-name">
                              {dc.name}
                            </span>
                            <span className="create-appointment-dropdown-location">
                              {dc.locationName}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="create-appointment-no-results">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="create-appointment-hint">
                Search and select the diagnostic center for this appointment.
              </div>
            </div>

            <div className="col-md-3 create-appointment-field">
              <label>Visit Type</label>
              <select
                className="form-control"
                value={form.visitType}
                disabled={!form.diagnosticCenterId}
                onChange={(e) => {
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
                }}
              >
                <option value="">Select Visit Type</option>
                {selectedDiagnosticCenter?.isCentreVisitAvailable === true && (
                  <option value="CENTER_VISIT">Centre Visit</option>
                )}
                {selectedDiagnosticCenter?.isHomeVisitAvailable === true && (
                  <option value="HOME_VISIT">Home Visit</option>
                )}
              </select>
            </div>

            <div className="col-md-3 create-appointment-field">
              <label>Visit Date</label>
              <input
                type="date"
                className="form-control"
                value={form.visitDate}
                onChange={(e) =>
                  setForm({ ...form, visitDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-3 create-appointment-field">
              <label>Visit Time</label>
              <input
                type="time"
                className="form-control"
                value={form.visitSlot}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visitSlot: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="create-appointment-actions">
            <button
              type="button"
              className="btn create-appointment-btn create-appointment-save"
              onClick={handleSubmit}
            >
              Save Appointment
            </button>

            <button
              type="button"
              className="btn create-appointment-btn create-appointment-cancel"
              onClick={() => navigate("/patients")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;

// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { createAppointment } from "../../services/appointmentService";
// // import { getPatientById } from "../../services/patientService";
// // import { getAllServiceProviders } from "../../services/serviceProviderService";

// // export default function CreateAppointment() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [patient, setPatient] = useState(null);
// //   const [providers, setProviders] = useState([]);

// //   const [form, setForm] = useState({
// //     patientId: "",
// //     organizationId: "",
// //     serviceProviderId: "",
// //     visitDate: "",
// //     visitTime: "",
// //   });

// //   useEffect(() => {
// //     loadPatient();
// //     loadProviders();
// //   }, []);

// //   const loadPatient = async () => {
// //     const res = await getPatientById(id);
// //     const data = res.data.data;

// //     setPatient(data);

// //     setForm((prev) => ({
// //       ...prev,
// //       patientId: data.id,
// //       organizationId: data.organizationId,
// //     }));
// //   };

// //   const loadProviders = async () => {
// //     const res = await getAllServiceProviders();
// //     setProviders(res.data.data);
// //   };

// //   const handleSubmit = async () => {
// //     await createAppointment(form);
// //     navigate("/patients"); // back to list
// //   };

// //   return (
// //     <div className="container mt-3">
// //       <h4>Create Appointment</h4>

// //       <div className="card p-3">

// //         <div className="mb-2">
// //           <b>Patient:</b> {patient?.patientName}
// //         </div>

// //         <div className="mb-2">
// //           <label>Service Provider</label>
// //           <select
// //             className="form-control"
// //             value={form.serviceProviderId}
// //             onChange={(e) =>
// //               setForm({ ...form, serviceProviderId: e.target.value })
// //             }
// //           >
// //             <option value="">Select</option>
// //             {providers.map((p) => (
// //               <option key={p.id} value={p.id}>
// //                 {p.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div className="mb-2">
// //           <label>Date</label>
// //           <input
// //             type="date"
// //             className="form-control"
// //             value={form.visitDate}
// //             onChange={(e) =>
// //               setForm({ ...form, visitDate: e.target.value })
// //             }
// //           />
// //         </div>

// //         <div className="mb-2">
// //           <label>Time</label>
// //           <input
// //             type="time"
// //             className="form-control"
// //             value={form.visitTime}
// //             onChange={(e) =>
// //               setForm({ ...form, visitTime: e.target.value })
// //             }
// //           />
// //         </div>

// //         <button className="btn btn-success mt-2" onClick={handleSubmit}>
// //           Save Appointment
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// // import React, { useEffect, useState } from "react";
// // import "../../styles/addPatient.css";
// // import { useParams, useNavigate } from "react-router-dom";

// // import { createAppointment } from "../../services/appointmentService";
// // import { getPatientById } from "../../services/patientService";
// // // import { getAllServiceProviders } from "../../services/serviceProviderService";
// // import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
// // import { hasPermission } from "../permissionUtil";

// // const CreateAppointment = () => {
// //   const canAdd = hasPermission("Appointment", "ADD");
// //   const canViewDc = hasPermission("Diagnostic Center", "VIEW");
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [patient, setPatient] = useState(null);
// //   // const [providers, setProviders] = useState([]);
// //   const [diagnosticCenters, setDiagnosticCenters] = useState([]);

// //   const [form, setForm] = useState({
// //     patientId: "",
// //     organizationId: "",
// //     // serviceProviderId: "",
// //     diagnosticCenterId: "",
// //     visitType: "CENTER_VISIT",
// //     visitSlot: "",
// //     medicalAddress: "",
// //     diagnosticCenterName: "",
// //     visitDate: "",
// //   });

// //   // useEffect(() => {
// //   //   loadPatient();
// //   //   loadProviders();
// //   // }, []);
// //   useEffect(() => {
// //     loadPatient();

// //     if (canViewDc) {
// //       // loadProviders();
// //       loadDiagnosticCenters();
// //     } else {
// //       setDiagnosticCenters([]);
// //     }
// //   }, [canViewDc]);

// //   const loadPatient = async () => {
// //     const res = await getPatientById(id);
// //     const data = res.data.data;

// //     setPatient(data);

// //     setForm((prev) => ({
// //       ...prev,
// //       patientId: data.id,
// //       organizationId: data.organizationId,
// //     }));
// //   };

// //   // const loadProviders = async () => {
// //   //   const res = await getAllServiceProviders();
// //   //   setProviders(res.data.data);
// //   // };
// //   //   const loadProviders = async () => {
// //   //   try {
// //   //     const res = await getAllServiceProviders();
// //   //     setProviders(res.data.data || []);
// //   //   } catch (err) {
// //   //     console.warn("Service Provider access denied");
// //   //     setProviders([]);
// //   //   }
// //   // };

// //   const loadDiagnosticCenters = async () => {
// //     try {
// //       const res = await getDiagnosticCenters(0, 1000, "");

// //       setDiagnosticCenters(res.data.content || []);
// //     } catch (err) {
// //       console.warn("DC access denied");

// //       setDiagnosticCenters([]);
// //     }
// //   };

// //   // const handleSubmit = async () => {
// //   //   await createAppointment(form);
// //   //   navigate("/patients");
// //   // };
// //   const handleSubmit = async () => {
// //     try {
// //       const res = await createAppointment(form);

// //       // ✅ Backend message
// //       alert(res.data.message); // "Appointment created successfully"

// //       navigate("/patients");
// //     } catch (error) {
// //       console.error(error);

// //       alert(error.response?.data?.message || "Failed to create appointment ❌");
// //     }
// //   };
// //   if (!canAdd) {
// //     return <h3>Access Denied ❌</h3>;
// //   }
// //   return (
// //     <div className="container-fluid mt-3">
// //       <div className="card">
// //         {/* Header */}
// //         <div className="card-header add-header">Create Appointment</div>

// //         <div className="card-body">
// //           <div className="row g-3">
// //             {/* Patient Info */}
// //             <div className="col-md-6">
// //               <label>Patient Name</label>
// //               <input
// //                 className="form-control"
// //                 value={patient?.patientName || ""}
// //                 readOnly
// //               />
// //             </div>

// //             <div className="col-md-6">
// //               <label>Organization</label>
// //               <input
// //                 className="form-control"
// //                 value={patient?.organizationName || ""}
// //                 readOnly
// //               />
// //             </div>

// //             {/* Service Provider */}
// //             {/* <div className="col-md-6">
// //               <label>Service Provider</label>
// //               {!canViewProvider ? (
// //   <input
// //     className="form-control"
// //     value="No Service Provider Access"
// //     disabled
// //   />
// // ) : (
// //               <select
// //                 className="form-control"
// //                 value={form.serviceProviderId}
// //                 onChange={(e) =>
// //                   setForm({ ...form, serviceProviderId: e.target.value })
// //                 }
// //               >
// //                 <option value="">Select Provider</option>
// //                 {providers.map((p) => (
// //                   <option key={p.id} value={p.id}>
// //                     {p.name}
// //                   </option>
// //                 ))}
// //               </select>)}
// //             </div> */}

// //             <div className="col-md-6">
// //               <label>Diagnostic Center</label>
// //               {!canViewDc ? (
// //                 <input
// //                   className="form-control"
// //                   value="No Diagnostic Center Access"
// //                   disabled
// //                 />
// //               ) : (
// //                 <select
// //                   className="form-control"
// //                   value={form.diagnosticCenterId}
// //                   onChange={(e) => {
// //                     const selectedDc = diagnosticCenters.find(
// //                       (dc) => dc.id == e.target.value,
// //                     );

// //                     setForm({
// //                       ...form,

// //                       diagnosticCenterId: e.target.value,

// //                       diagnosticCenterName: selectedDc?.name || "",

// //                       medicalAddress: selectedDc?.primaryAddress || "",
// //                     });
// //                   }}
// //                 >
// //                   <option value="">Select DC</option>

// //                   {diagnosticCenters.map((dc) => (
// //                     <option key={dc.id} value={dc.id}>
// //                       {dc.name}
// //                       {" - "}
// //                       {dc.locationName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               )}
// //             </div>

// //             <div className="col-md-3">
// //               <label>Visit Type</label>

// //               <select
// //                 className="form-control"
// //                 value={form.visitType}
// //                 onChange={(e) =>
// //                   setForm({
// //                     ...form,
// //                     visitType: e.target.value,
// //                   })
// //                 }
// //               >
// //                 <option value="CENTER_VISIT">Center Visit</option>

// //                 <option value="HOME_VISIT">Home Visit</option>
// //               </select>
// //             </div>

// //             {/* Date */}
// //             <div className="col-md-3">
// //               <label>Visit Date</label>
// //               <input
// //                 type="date"
// //                 className="form-control"
// //                 value={form.visitDate}
// //                 onChange={(e) =>
// //                   setForm({ ...form, visitDate: e.target.value })
// //                 }
// //               />
// //             </div>

// //             {/* Time */}
// //             <div className="col-md-3">
// //               <label>Visit Time</label>
// //               <input
// //                 type="time"
// //                 className="form-control"
// //                 onChange={(e) =>
// //                   setForm({
// //                     ...form,
// //                     visitSlot: e.target.value,
// //                   })
// //                 }
// //               />
// //             </div>
// //           </div>

// //           {/* Buttons */}
// //           <div className="mt-4">
// //             <button
// //               className="btn btn-primary submit-btn"
// //               onClick={handleSubmit}
// //             >
// //               Save Appointment
// //             </button>

// //             <button
// //               className="btn btn-danger ms-3"
// //               onClick={() => navigate("/patients")}
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateAppointment;

// import React, { useEffect, useState, useRef } from "react";
// import "../../styles/addPatient.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { createAppointment } from "../../services/appointmentService";
// import { getPatientById } from "../../services/patientService";
// import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
// import { hasPermission } from "../permissionUtil";

// const CreateAppointment = () => {
//   const canAdd = hasPermission("Appointment", "ADD");
//   const canViewDc = hasPermission("Diagnostic Center", "VIEW");
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   const [diagnosticCenters, setDiagnosticCenters] = useState([]);
  
//   // ✅ NEW: Search states
//   const [dcSearchQuery, setDcSearchQuery] = useState("");
//   const [showDcDropdown, setShowDcDropdown] = useState(false);
//   const dcDropdownRef = useRef(null);

//   const [form, setForm] = useState({
//     patientId: "",
//     organizationId: "",
//     diagnosticCenterId: "",
//     visitType: "CENTER_VISIT",
//     visitSlot: "",
//     medicalAddress: "",
//     diagnosticCenterName: "",
//     visitDate: "",
//   });

//   useEffect(() => {
//     loadPatient();

//     if (canViewDc) {
//       loadDiagnosticCenters();
//     } else {
//       setDiagnosticCenters([]);
//     }
//   }, [canViewDc]);

//   // ✅ NEW: Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dcDropdownRef.current && !dcDropdownRef.current.contains(event.target)) {
//         setShowDcDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const loadPatient = async () => {
//     const res = await getPatientById(id);
//     const data = res.data.data;

//     setPatient(data);

//     setForm((prev) => ({
//       ...prev,
//       patientId: data.id,
//       organizationId: data.organizationId,
//     }));
//   };

//   const loadDiagnosticCenters = async () => {
//     try {
//       const res = await getDiagnosticCenters(0, 1000, "");
//       setDiagnosticCenters(res.data.content || []);
//     } catch (err) {
//       console.warn("DC access denied");
//       setDiagnosticCenters([]);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await createAppointment(form);
//       alert(res.data.message);
//       navigate("/patients");
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to create appointment ");
//     }
//   };

//   // ✅ NEW: Filter diagnostic centers based on search
//   const filteredDiagnosticCenters = diagnosticCenters.filter((dc) =>
//     `${dc.name} ${dc.locationName}`.toLowerCase().includes(dcSearchQuery.toLowerCase())
//   );

//   // ✅ NEW: Handle DC selection
//   // const handleDiagnosticCenterSelect = (dc) => {
//   //   setForm({
//   //     ...form,
//   //     diagnosticCenterId: dc.id,
//   //     diagnosticCenterName: dc.name,
//   //     medicalAddress: dc.primaryAddress || "",
//   //   });
//   //   setDcSearchQuery(`${dc.name} - ${dc.locationName}`);
//   //   setShowDcDropdown(false);
//   // };
//   const handleDiagnosticCenterSelect = (dc) => {
//   const homeAvailable = dc.isHomeVisitAvailable === true;
//   const centreAvailable = dc.isCentreVisitAvailable === true;

//   let visitType = "";

//   if (centreAvailable) {
//     visitType = "CENTER_VISIT";
//   } else if (homeAvailable) {
//     visitType = "HOME_VISIT";
//   }

//   setForm((prev) => ({
//     ...prev,
//     diagnosticCenterId: dc.id,
//     diagnosticCenterName: dc.name,
//     visitType,
//     medicalAddress:
//       visitType === "CENTER_VISIT"
//         ? dc.primaryAddress || ""
//         : "",
//   }));

//   setDcSearchQuery(`${dc.name} - ${dc.locationName}`);
//   setShowDcDropdown(false);
// };

//   // ✅ NEW: Handle search input change
//   const handleDcSearchChange = (e) => {
//     const value = e.target.value;
//     setDcSearchQuery(value);
//     setShowDcDropdown(true);
    
//     // Clear selection if user types
//     if (value === "") {
//       setForm({
//         ...form,
//         diagnosticCenterId: "",
//         diagnosticCenterName: "",
//         medicalAddress: "",
//       });
//     }
//   };

//   if (!canAdd) {
//     return <h3>Access Denied ❌</h3>;
//   }

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Create Appointment</div>

//         <div className="card-body">
//           <div className="row g-3">
//             {/* Patient Info */}
//             <div className="col-md-6">
//               <label>Patient Name</label>
//               <input
//                 className="form-control"
//                 value={patient?.patientName || ""}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Organization</label>
//               <input
//                 className="form-control"
//                 value={patient?.organizationName || ""}
//                 readOnly
//               />
//             </div>

//             {/* ✅ UPDATED: Searchable Diagnostic Center */}
//             <div className="col-md-6" ref={dcDropdownRef}>
//               <label>Diagnostic Center</label>
//               {!canViewDc ? (
//                 <input
//                   className="form-control"
//                   value="No Diagnostic Center Access"
//                   disabled
//                 />
//               ) : (
//                 <div className="searchable-select-container">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search Diagnostic Center..."
//                     value={dcSearchQuery}
//                     onChange={handleDcSearchChange}
//                     onFocus={() => setShowDcDropdown(true)}
//                   />
                  
//                   {/* Dropdown */}
//                   {showDcDropdown && dcSearchQuery && (
//                     <div className="searchable-dropdown">
//                       {filteredDiagnosticCenters.length > 0 ? (
//                         filteredDiagnosticCenters.map((dc) => (
//                           <div
//                             key={dc.id}
//                             className="dropdown-item"
//                             onClick={() => handleDiagnosticCenterSelect(dc)}
//                           >
//                             <strong>{dc.name}</strong>
//                             <br />
//                             <small className="">{dc.locationName}</small>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="dropdown-item disabled">
//                           No results found
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* <div className="col-md-3">
//               <label>Visit Type</label>
//               <select
//                 className="form-control"
//                 value={form.visitType}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     visitType: e.target.value,
//                   })
//                 }
//               >
//                 <option value="CENTER_VISIT">Center Visit</option>
//                 <option value="HOME_VISIT">Home Visit</option>
//               </select>
//             </div> */}

//             <div className="col-md-3">
//   <label>Visit Type</label>

//   <select
//     className="form-control"
//     value={form.visitType}
//     disabled={!form.diagnosticCenterId}
//     onChange={(e) => {
//   const visitType = e.target.value;

//   const selectedDC = diagnosticCenters.find(
//     (dc) => String(dc.id) === String(form.diagnosticCenterId)
//   );

//   setForm((prev) => ({
//     ...prev,
//     visitType,
//     medicalAddress:
//       visitType === "CENTER_VISIT"
//         ? selectedDC?.primaryAddress || ""
//         : "",
//   }));
// }}
//   >
//     <option value="">Select Visit Type</option>

//     {(() => {
//       const selectedDC = diagnosticCenters.find(
//         (dc) =>
//           String(dc.id) === String(form.diagnosticCenterId)
//       );

//       if (!selectedDC) return null;

//       return (
//         <>
//           {selectedDC.isCentreVisitAvailable === true && (
//             <option value="CENTER_VISIT">
//               Centre Visit
//             </option>
//           )}

//           {selectedDC.isHomeVisitAvailable === true && (
//             <option value="HOME_VISIT">
//               Home Visit
//             </option>
//           )}
//         </>
//       );
//     })()}
//   </select>
// </div>
// {/* {form.visitType === "HOME_VISIT" && (
//   <div className="col-md-6">
//     <label>Patient Home Address *</label>

//     <textarea
//       className="form-control"
//       rows="2"
//       placeholder="Enter patient's complete home address"
//       value={form.medicalAddress}
//       onChange={(e) =>
//         setForm((prev) => ({
//           ...prev,
//           medicalAddress: e.target.value,
//         }))
//       }
//       required
//     />
//   </div>
// )} */}

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
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     visitSlot: e.target.value,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-4">
//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleSubmit}
//             >
//               Save Appointment
//             </button>

//             <button
//               className="btn btn-danger ms-3"
//               onClick={() => navigate("/patients")}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAppointment;
