import React, { useEffect, useRef, useState } from "react";
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
        visitDate: data.visitDate ? String(data.visitDate).slice(0, 10) : "",
      });

      setDcSearchQuery(data.diagnosticCenterName || "");
    } catch (error) {
      console.error("Failed to load appointment:", error);
      alert(error.response?.data?.message || "Failed to load appointment.");
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
      (dc) => String(dc.id) === String(form.diagnosticCenterId)
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

  const selectedDiagnosticCenter = diagnosticCenters.find(
    (dc) => String(dc.id) === String(form.diagnosticCenterId)
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
        visitType === "CENTER_VISIT" ? dc.primaryAddress || "" : "",
    }));

    setDcSearchQuery(`${dc.name || ""} - ${dc.locationName || ""}`);
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
      (dc) => String(dc.id) === String(form.diagnosticCenterId)
    );

    setForm((prev) => ({
      ...prev,
      visitType,
      medicalAddress:
        visitType === "CENTER_VISIT" ? selectedDC?.primaryAddress || "" : "",
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

    if (form.diagnosticCenterId && !form.visitType) {
      alert("Please select a supported visit type.");
      return;
    }

    const selectedDC = diagnosticCenters.find(
      (dc) => String(dc.id) === String(form.diagnosticCenterId)
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
        error.response?.data?.message || "Failed to update appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="edit-appointment-access-denied">
        <style>{`
          .edit-appointment-access-denied {
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

  if (loading) {
    return (
      <div className="container-fluid edit-appointment-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .edit-appointment-page {
            width: 100%;
            max-width: none;
            padding: 18px 20px;
            font-family: Inter, sans-serif;
          }
          .edit-appointment-loading {
            padding: 24px;
            border: 1px solid #e7edf4;
            border-radius: 12px;
            background: #fff;
            color: #64748b;
            font-size: 13px;
            box-shadow: 0 5px 20px rgba(22, 42, 68, .06);
          }
        `}</style>
        <div className="edit-appointment-loading">Loading appointment...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid edit-appointment-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .edit-appointment-page {
          width: 100%;
          max-width: none;
          padding: 18px 20px 28px;
          color: #18243a;
          font-family: 'Inter', sans-serif;
        }

        .edit-appointment-page * {
          font-family: 'Inter', sans-serif;
        }

        .edit-appointment-card {
          width: 100%;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(22, 42, 68, .07);
          overflow: visible;
        }

        .edit-appointment-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 13px 13px 0 0;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }

        .edit-appointment-header-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, .13);
        }

        .edit-appointment-header-icon svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: #fff;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .edit-appointment-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -.25px;
        }

        .edit-appointment-subtitle {
          margin: 3px 0 0;
          color: #c3d5e5;
          font-size: 12px;
        }

        .edit-appointment-body {
          padding: 24px;
        }

        .edit-appointment-section-title {
          margin: 0 0 17px;
          color: #183b5b;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .2px;
        }

        .edit-appointment-field {
          position: relative;
        }

        .edit-appointment-field label {
          display: block;
          margin-bottom: 7px;
          color: #526278;
          font-size: 12px;
          font-weight: 600;
        }

        .edit-appointment-field .form-control {
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

        .edit-appointment-field .form-control:focus {
          border-color: #2b6f9f;
          box-shadow: 0 0 0 3px rgba(43, 111, 159, .11);
        }

        .edit-appointment-field .form-control[readonly] {
          background: #f5f8fb;
          color: #56677c;
        }

        .edit-appointment-field .form-control:disabled {
          background: #f1f4f7;
          color: #8b97a6;
          cursor: not-allowed;
        }

        .edit-appointment-divider {
          height: 1px;
          margin: 24px 0 20px;
          background: #e9eef4;
        }

        .edit-appointment-search-wrap {
          position: relative;
        }

        .edit-appointment-search-wrap::after {
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

        .edit-appointment-search-wrap::before {
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

        .edit-appointment-search-wrap input {
          padding-right: 34px !important;
        }

        .edit-appointment-dropdown {
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

        .edit-appointment-dropdown-item {
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

        .edit-appointment-dropdown-item:hover,
        .edit-appointment-dropdown-item:focus {
          outline: none;
          background: #f1f6fa;
        }

        .edit-appointment-dropdown-name {
          display: block;
          font-size: 12px;
          font-weight: 700;
        }

        .edit-appointment-dropdown-location {
          display: block;
          margin-top: 3px;
          color: #7b899a;
          font-size: 11px;
        }

        .edit-appointment-no-results {
          padding: 12px;
          color: #8491a1;
          font-size: 12px;
          text-align: center;
        }

        .edit-appointment-hint {
          margin-top: 6px;
          color: #8794a4;
          font-size: 11px;
        }

        .edit-appointment-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #e9eef4;
        }

        .edit-appointment-btn {
          min-height: 40px;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          transition: background .18s ease, border-color .18s ease;
        }

        .edit-appointment-save {
          border: 1px solid #0e3d66;
          background: #0e3d66;
          color: #fff;
        }

        .edit-appointment-save:hover:not(:disabled) {
          border-color: #0a2d4a;
          background: #0a2d4a;
          color: #fff;
        }

        .edit-appointment-save:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .edit-appointment-cancel {
          border: 1px solid #d9e1e9;
          background: #fff;
          color: #596a7e;
        }

        .edit-appointment-cancel:hover:not(:disabled) {
          border-color: #c4d0dc;
          background: #f5f8fb;
          color: #26364d;
        }

        @media (max-width: 768px) {
          .edit-appointment-page {
            padding: 12px 10px 22px;
          }

          .edit-appointment-header {
            min-height: 70px;
            padding: 14px 16px;
          }

          .edit-appointment-title {
            font-size: 17px;
          }

          .edit-appointment-body {
            padding: 18px 14px;
          }

          .edit-appointment-actions {
            flex-wrap: wrap;
          }

          .edit-appointment-btn {
            flex: 1 1 130px;
          }
        }
      `}</style>

      <div className="edit-appointment-card">
        <div className="edit-appointment-header">
          <div className="edit-appointment-header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16.5h3M15 13h2" />
              <path d="m14.5 17.5 1.5-1.5 2 2" />
            </svg>
          </div>
          <div>
            <h5 className="edit-appointment-title">Edit Appointment</h5>
            <p className="edit-appointment-subtitle">
              Review and update the patient appointment details
            </p>
          </div>
        </div>

        <div className="edit-appointment-body">
          <h6 className="edit-appointment-section-title">Patient Information</h6>
          <div className="row g-3">
            <div className="col-md-6 edit-appointment-field">
              <label>Patient Name</label>
              <input
                className="form-control"
                value={patient?.patientName || ""}
                readOnly
              />
            </div>

            <div className="col-md-6 edit-appointment-field">
              <label>Organization</label>
              <input
                className="form-control"
                value={patient?.organizationName || ""}
                readOnly
              />
            </div>
          </div>

          <div className="edit-appointment-divider" />

          <h6 className="edit-appointment-section-title">Appointment Details</h6>
          <div className="row g-3">
            <div
              className="col-md-6 edit-appointment-field"
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
                <div className="edit-appointment-search-wrap">
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
                    <div className="edit-appointment-dropdown">
                      {filteredDiagnosticCenters.length > 0 ? (
                        filteredDiagnosticCenters.map((dc) => (
                          <button
                            type="button"
                            key={dc.id}
                            className="edit-appointment-dropdown-item"
                            onClick={() => handleDiagnosticCenterSelect(dc)}
                          >
                            <span className="edit-appointment-dropdown-name">
                              {dc.name}
                            </span>
                            <span className="edit-appointment-dropdown-location">
                              {dc.locationName}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="edit-appointment-no-results">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="edit-appointment-hint">
                Search and select the diagnostic center for this appointment.
              </div>
            </div>

            <div className="col-md-3 edit-appointment-field">
              <label>Visit Type</label>
              <select
                className="form-control"
                value={form.visitType}
                disabled={!form.diagnosticCenterId || !canViewDc}
                onChange={handleVisitTypeChange}
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

            <div className="col-md-3 edit-appointment-field">
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

            <div className="col-md-3 edit-appointment-field">
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

          <div className="edit-appointment-actions">
            <button
              type="button"
              className="btn edit-appointment-btn edit-appointment-save"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Appointment"}
            </button>

            <button
              type="button"
              className="btn edit-appointment-btn edit-appointment-cancel"
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

// // import React, { useEffect, useState } from "react";
// // import "../../styles/addPatient.css";
// // import { useParams, useNavigate } from "react-router-dom";

// // import { updateAppointment } from "../../services/appointmentService";
// // // import { getAllServiceProviders } from "../../services/serviceProviderService";
// // import api from "../../services/api";
// // import { getDiagnosticCenters }
// // from "../../services/diagnosticCenterService";

// // const EditAppointment = () => {
// //   const { id } = useParams(); // appointmentId
// //   const navigate = useNavigate();

// //   const [patient, setPatient] = useState(null);
// //   // const [providers, setProviders] = useState([]);
// //   const [diagnosticCenters,
// // setDiagnosticCenters] = useState([]);

// //   const [form, setForm] = useState({
// //     patientId: "",
// //     organizationId: "",
// //     // serviceProviderId: "",
// //     visitDate: "",
// //     // visitTime: "",
// //     diagnosticCenterId: "",
// // visitSlot: "",
// // visitType: "CENTER_VISIT",
// // medicalAddress: "",
// // diagnosticCenterName: "",
// //   });

// //   useEffect(() => {
// //     loadAppointment();
// //     loadDiagnosticCenters();
// //   }, []);

// //   // 🔥 LOAD APPOINTMENT (IMPORTANT)
// //   const loadAppointment = async () => {
// //     const res = await api.get(`/appointments/${id}`); // 👈 create this API if not exists
// //     const data = res.data.data;

// //     setPatient({
// //       patientName: data.patientName,
// //       organizationName: data.organizationName,
// //     });

// //     setForm({
// //       patientId: data.patientId,
// //       organizationId: data.organizationId,
// //       // serviceProviderId: data.serviceProviderId || "",
// //       visitDate: data.visitDate || "",
// //       // visitTime: data.visitTime || "",
// //       diagnosticCenterId:
// //   data.diagnosticCenterId || "",

// // visitSlot:
// //   data.visitSlot || "",

// // visitType:
// //   data.visitType || "CENTER_VISIT",

// // medicalAddress:
// //   data.medicalAddress || "",

// // diagnosticCenterName:
// //   data.diagnosticCenterName || "",
// //     });
// //   };

// //   // const loadProviders = async () => {
// //   //   const res = await getAllServiceProviders();
// //   //   setProviders(res.data.data);
// //   // };

// //   const loadDiagnosticCenters = async () => {

// //   try {

// //     const res =
// //       await getDiagnosticCenters(
// //         0,
// //         1000,
// //         ""
// //       );

// //     setDiagnosticCenters(
// //       res.data.content || []
// //     );

// //   } catch (err) {

// //     console.warn(
// //       "DC access denied"
// //     );

// //     setDiagnosticCenters([]);
// //   }
// // };

// // //   const handleSubmit = async () => {
// // //     await updateAppointment(id, form);
// // //     navigate("/today-appointments"); // or upcoming
// // //   };


// // // const handleSubmit = async () => {
// // //   await updateAppointment(id, form);

// // //   const today = new Date().toISOString().split("T")[0];

// // //   if (form.visitDate === today) {
// // //     navigate("/appointment/today");
// // //   } else {
// // //     navigate("/appointment/upcoming");
// // //   }
// // // };

// // const handleSubmit = async () => {
// //   try {
// //     const res = await updateAppointment(id, form);

// //     // ✅ Backend message
// //     alert(res.data.message); // "Appointment updated successfully"

// //     const today = new Date().toISOString().split("T")[0];

// //     if (form.visitDate === today) {
// //       navigate("/appointment/today");
// //     } else {
// //       navigate("/appointment/upcoming");
// //     }

// //   } catch (error) {
// //     console.error(error);

// //     alert(
// //       error.response?.data?.message ||
// //       "Failed to update appointment ❌"
// //     );
// //   }
// // };

// //   return (
// //     <div className="container-fluid mt-3">
// //       <div className="card">

// //         {/* Header */}
// //         <div className="card-header add-header">
// //           Edit Appointment
// //         </div>

// //         <div className="card-body">
// //           <div className="row g-3">

// //             {/* Patient */}
// //             <div className="col-md-6">
// //               <label>Patient Name</label>
// //               <input
// //                 className="form-control"
// //                 value={patient?.patientName || ""}
// //                 readOnly
// //               />
// //             </div>

// //             {/* Organization */}
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
// //               </select>
// //             </div> */}
// //             <div className="col-md-6">

// //   <label>Diagnostic Center</label>

// //   <select
// //     className="form-control"
// //     value={form.diagnosticCenterId}
// //     onChange={(e) => {

// //       const selectedDc =
// //         diagnosticCenters.find(
// //           dc => dc.id == e.target.value
// //         );

// //       setForm({

// //         ...form,

// //         diagnosticCenterId:
// //           e.target.value,

// //         diagnosticCenterName:
// //           selectedDc?.name || "",

// //         medicalAddress:
// //           selectedDc?.primaryAddress || ""
// //       });
// //     }}
// //   >

// //     <option value="">
// //       Select DC
// //     </option>

// //     {diagnosticCenters.map((dc) => (

// //       <option
// //         key={dc.id}
// //         value={dc.id}
// //       >

// //         {dc.name}
// //         {" - "}
// //         {dc.locationName}

// //       </option>
// //     ))}
// //   </select>
// // </div>

// // <div className="col-md-3">

// //   <label>Visit Type</label>

// //   <select
// //     className="form-control"
// //     value={form.visitType}
// //     onChange={(e) =>
// //       setForm({
// //         ...form,
// //         visitType: e.target.value
// //       })
// //     }
// //   >

// //     <option value="CENTER_VISIT">
// //       Center Visit
// //     </option>

// //     <option value="HOME_VISIT">
// //       Home Visit
// //     </option>

// //   </select>
// // </div>

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
// //                 value={form.visitSlot}
// //                 onChange={(e) =>
// //                   setForm({ ...form, visitSlot: e.target.value })
// //                 }
// //               />
// //             </div>

// //           </div>

// //           {/* Buttons */}
// //           <div className="mt-4">
// //             <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
// //               Update Appointment
// //             </button>

// //             <button
// //               className="btn btn-danger ms-3"
// //               onClick={() => navigate("/today-appointments")}
// //             >
// //               Cancel
// //             </button>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditAppointment;


// import React, { useEffect, useRef, useState } from "react";
// import "../../styles/addPatient.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { updateAppointment } from "../../services/appointmentService";
// import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
// import { hasPermission } from "../permissionUtil";
// import api from "../../services/api";

// const EditAppointment = () => {
//   const canEdit = hasPermission("Appointment", "EDIT");
//   const canViewDc = hasPermission("Diagnostic Center", "VIEW");

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dcDropdownRef = useRef(null);

//   const [patient, setPatient] = useState(null);
//   const [diagnosticCenters, setDiagnosticCenters] = useState([]);
//   const [dcSearchQuery, setDcSearchQuery] = useState("");
//   const [showDcDropdown, setShowDcDropdown] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

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
//     loadAppointment();
//   }, [id]);

//   useEffect(() => {
//     if (canViewDc) {
//       loadDiagnosticCenters();
//     } else {
//       setDiagnosticCenters([]);
//     }
//   }, [canViewDc]);

//   // Close the diagnostic center dropdown on outside click.
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dcDropdownRef.current &&
//         !dcDropdownRef.current.contains(event.target)
//       ) {
//         setShowDcDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Load the existing appointment and prefill the form.
//   const loadAppointment = async () => {
//     setLoading(true);

//     try {
//       const res = await api.get(`/appointments/${id}`);
//       const data = res.data.data;

//       setPatient({
//         patientName: data.patientName || "",
//         organizationName: data.organizationName || "",
//       });

//       const diagnosticCenterId = data.diagnosticCenterId ?? "";

//       setForm({
//         patientId: data.patientId ?? "",
//         organizationId: data.organizationId ?? "",
//         diagnosticCenterId,
//         visitType: data.visitType || "CENTER_VISIT",
//         visitSlot: data.visitSlot || "",
//         medicalAddress: data.medicalAddress || "",
//         diagnosticCenterName: data.diagnosticCenterName || "",
//         visitDate: data.visitDate
//           ? String(data.visitDate).slice(0, 10)
//           : "",
//       });

//       setDcSearchQuery(data.diagnosticCenterName || "");
//     } catch (error) {
//       console.error("Failed to load appointment:", error);

//       alert(
//         error.response?.data?.message ||
//           "Failed to load appointment."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadDiagnosticCenters = async () => {
//     try {
//       const res = await getDiagnosticCenters(0, 1000, "");
//       setDiagnosticCenters(res.data.content || []);
//     } catch (error) {
//       console.warn("Diagnostic Center access denied", error);
//       setDiagnosticCenters([]);
//     }
//   };

//   // Match the saved diagnostic center to its current name and location.
//   useEffect(() => {
//     if (!form.diagnosticCenterId || diagnosticCenters.length === 0) {
//       return;
//     }

//     const selectedDC = diagnosticCenters.find(
//       (dc) =>
//         String(dc.id) === String(form.diagnosticCenterId)
//     );

//     if (selectedDC) {
//       setDcSearchQuery(
//         `${selectedDC.name} - ${selectedDC.locationName || ""}`
//       );

//       setForm((prev) => ({
//         ...prev,
//         diagnosticCenterName: selectedDC.name || "",
//       }));
//     }
//   }, [diagnosticCenters, form.diagnosticCenterId]);

//   const filteredDiagnosticCenters = diagnosticCenters.filter((dc) =>
//     `${dc.name || ""} ${dc.locationName || ""}`
//       .toLowerCase()
//       .includes(dcSearchQuery.toLowerCase())
//   );

//   // Select a diagnostic center and choose a supported visit type.
//   const handleDiagnosticCenterSelect = (dc) => {
//     const centreAvailable = dc.isCentreVisitAvailable === true;
//     const homeAvailable = dc.isHomeVisitAvailable === true;

//     let visitType = "";

//     if (centreAvailable) {
//       visitType = "CENTER_VISIT";
//     } else if (homeAvailable) {
//       visitType = "HOME_VISIT";
//     }

//     setForm((prev) => ({
//       ...prev,
//       diagnosticCenterId: dc.id,
//       diagnosticCenterName: dc.name || "",
//       visitType,
//       medicalAddress:
//         visitType === "CENTER_VISIT"
//           ? dc.primaryAddress || ""
//           : "",
//     }));

//     setDcSearchQuery(
//       `${dc.name || ""} - ${dc.locationName || ""}`
//     );

//     setShowDcDropdown(false);
//   };

//   const handleDcSearchChange = (e) => {
//     const value = e.target.value;

//     setDcSearchQuery(value);
//     setShowDcDropdown(true);

//     // Clear the selected center if the user edits the search text.
//     if (
//       !diagnosticCenters.some(
//         (dc) =>
//           String(dc.id) === String(form.diagnosticCenterId) &&
//           `${dc.name || ""} - ${dc.locationName || ""}` === value
//       )
//     ) {
//       setForm((prev) => ({
//         ...prev,
//         diagnosticCenterId: "",
//         diagnosticCenterName: "",
//         medicalAddress: "",
//         visitType: "",
//       }));
//     }
//   };

//   const handleVisitTypeChange = (e) => {
//     const visitType = e.target.value;

//     const selectedDC = diagnosticCenters.find(
//       (dc) =>
//         String(dc.id) === String(form.diagnosticCenterId)
//     );

//     setForm((prev) => ({
//       ...prev,
//       visitType,
//       medicalAddress:
//         visitType === "CENTER_VISIT"
//           ? selectedDC?.primaryAddress || ""
//           : "",
//     }));
//   };

//   const handleSubmit = async () => {
//     if (submitting) return;

//     if (!form.visitDate) {
//       alert("Please select a visit date.");
//       return;
//     }

//     if (!form.visitSlot) {
//       alert("Please select a visit time.");
//       return;
//     }

//     if (canViewDc && !form.diagnosticCenterId) {
//       alert("Please select a diagnostic center.");
//       return;
//     }

//     if (
//       form.diagnosticCenterId &&
//       !form.visitType
//     ) {
//       alert("Please select a supported visit type.");
//       return;
//     }

//     const selectedDC = diagnosticCenters.find(
//       (dc) =>
//         String(dc.id) === String(form.diagnosticCenterId)
//     );

//     if (selectedDC) {
//       if (
//         form.visitType === "CENTER_VISIT" &&
//         selectedDC.isCentreVisitAvailable !== true
//       ) {
//         alert("Centre Visit is not available at this diagnostic center.");
//         return;
//       }

//       if (
//         form.visitType === "HOME_VISIT" &&
//         selectedDC.isHomeVisitAvailable !== true
//       ) {
//         alert("Home Visit is not available at this diagnostic center.");
//         return;
//       }
//     }

//     setSubmitting(true);

//     try {
//       const res = await updateAppointment(id, form);

//       alert(res.data.message || "Appointment updated successfully.");

//       // Use the local calendar date for today's appointment comparison.
//       const now = new Date();
//       const today = [
//         now.getFullYear(),
//         String(now.getMonth() + 1).padStart(2, "0"),
//         String(now.getDate()).padStart(2, "0"),
//       ].join("-");

//       if (form.visitDate === today) {
//         navigate("/appointment/today");
//       } else {
//         navigate("/appointment/upcoming");
//       }
//     } catch (error) {
//       console.error("Failed to update appointment:", error);

//       alert(
//         error.response?.data?.message ||
//           "Failed to update appointment."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!canEdit) {
//     return <h3>Access Denied ❌</h3>;
//   }

//   if (loading) {
//     return (
//       <div className="container-fluid mt-3">
//         <div className="card">
//           <div className="card-body">Loading appointment...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
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

//             {/* Searchable Diagnostic Center */}
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

//                   {showDcDropdown && dcSearchQuery && (
//                     <div className="searchable-dropdown">
//                       {filteredDiagnosticCenters.length > 0 ? (
//                         filteredDiagnosticCenters.map((dc) => (
//                           <div
//                             key={dc.id}
//                             className="dropdown-item"
//                             onClick={() =>
//                               handleDiagnosticCenterSelect(dc)
//                             }
//                           >
//                             <strong>{dc.name}</strong>
//                             <br />
//                             <small>{dc.locationName}</small>
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

//             {/* Visit Type */}
//             <div className="col-md-3">
//               <label>Visit Type</label>

//               <select
//                 className="form-control"
//                 value={form.visitType}
//                 disabled={!form.diagnosticCenterId || !canViewDc}
//                 onChange={handleVisitTypeChange}
//               >
//                 <option value="">Select Visit Type</option>

//                 {(() => {
//                   const selectedDC = diagnosticCenters.find(
//                     (dc) =>
//                       String(dc.id) ===
//                       String(form.diagnosticCenterId)
//                   );

//                   if (!selectedDC) return null;

//                   return (
//                     <>
//                       {selectedDC.isCentreVisitAvailable === true && (
//                         <option value="CENTER_VISIT">
//                           Centre Visit
//                         </option>
//                       )}

//                       {selectedDC.isHomeVisitAvailable === true && (
//                         <option value="HOME_VISIT">
//                           Home Visit
//                         </option>
//                       )}
//                     </>
//                   );
//                 })()}
//               </select>
//             </div>

//             {/* Visit Date */}
//             <div className="col-md-3">
//               <label>Visit Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.visitDate}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     visitDate: e.target.value,
//                   }))
//                 }
//               />
//             </div>

//             {/* Visit Time */}
//             <div className="col-md-3">
//               <label>Visit Time</label>
//               <input
//                 type="time"
//                 className="form-control"
//                 value={form.visitSlot}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     visitSlot: e.target.value,
//                   }))
//                 }
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-4">
//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleSubmit}
//               disabled={submitting}
//             >
//               {submitting ? "Updating..." : "Update Appointment"}
//             </button>

//             <button
//               className="btn btn-danger ms-3"
//               onClick={() => navigate("/appointment/today")}
//               disabled={submitting}
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
