import React, { useEffect, useState } from "react";
import "../../styles/addPatient.css";
import { useParams, useNavigate } from "react-router-dom";

import { updateAppointment } from "../../services/appointmentService";
// import { getAllServiceProviders } from "../../services/serviceProviderService";
import api from "../../services/api";
import { getDiagnosticCenters }
from "../../services/diagnosticCenterService";

const EditAppointment = () => {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  // const [providers, setProviders] = useState([]);
  const [diagnosticCenters,
setDiagnosticCenters] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    organizationId: "",
    // serviceProviderId: "",
    visitDate: "",
    // visitTime: "",
    diagnosticCenterId: "",
visitSlot: "",
visitType: "CENTER_VISIT",
medicalAddress: "",
diagnosticCenterName: "",
  });

  useEffect(() => {
    loadAppointment();
    loadDiagnosticCenters();
  }, []);

  // 🔥 LOAD APPOINTMENT (IMPORTANT)
  const loadAppointment = async () => {
    const res = await api.get(`/appointments/${id}`); // 👈 create this API if not exists
    const data = res.data.data;

    setPatient({
      patientName: data.patientName,
      organizationName: data.organizationName,
    });

    setForm({
      patientId: data.patientId,
      organizationId: data.organizationId,
      // serviceProviderId: data.serviceProviderId || "",
      visitDate: data.visitDate || "",
      // visitTime: data.visitTime || "",
      diagnosticCenterId:
  data.diagnosticCenterId || "",

visitSlot:
  data.visitSlot || "",

visitType:
  data.visitType || "CENTER_VISIT",

medicalAddress:
  data.medicalAddress || "",

diagnosticCenterName:
  data.diagnosticCenterName || "",
    });
  };

  // const loadProviders = async () => {
  //   const res = await getAllServiceProviders();
  //   setProviders(res.data.data);
  // };

  const loadDiagnosticCenters = async () => {

  try {

    const res =
      await getDiagnosticCenters(
        0,
        1000,
        ""
      );

    setDiagnosticCenters(
      res.data.content || []
    );

  } catch (err) {

    console.warn(
      "DC access denied"
    );

    setDiagnosticCenters([]);
  }
};

//   const handleSubmit = async () => {
//     await updateAppointment(id, form);
//     navigate("/today-appointments"); // or upcoming
//   };


// const handleSubmit = async () => {
//   await updateAppointment(id, form);

//   const today = new Date().toISOString().split("T")[0];

//   if (form.visitDate === today) {
//     navigate("/appointment/today");
//   } else {
//     navigate("/appointment/upcoming");
//   }
// };

const handleSubmit = async () => {
  try {
    const res = await updateAppointment(id, form);

    // ✅ Backend message
    alert(res.data.message); // "Appointment updated successfully"

    const today = new Date().toISOString().split("T")[0];

    if (form.visitDate === today) {
      navigate("/appointment/today");
    } else {
      navigate("/appointment/upcoming");
    }

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to update appointment ❌"
    );
  }
};

  return (
    <div className="container-fluid mt-3">
      <div className="card">

        {/* Header */}
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

            {/* Service Provider */}
            {/* <div className="col-md-6">
              <label>Service Provider</label>
              <select
                className="form-control"
                value={form.serviceProviderId}
                onChange={(e) =>
                  setForm({ ...form, serviceProviderId: e.target.value })
                }
              >
                <option value="">Select Provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="col-md-6">

  <label>Diagnostic Center</label>

  <select
    className="form-control"
    value={form.diagnosticCenterId}
    onChange={(e) => {

      const selectedDc =
        diagnosticCenters.find(
          dc => dc.id == e.target.value
        );

      setForm({

        ...form,

        diagnosticCenterId:
          e.target.value,

        diagnosticCenterName:
          selectedDc?.name || "",

        medicalAddress:
          selectedDc?.primaryAddress || ""
      });
    }}
  >

    <option value="">
      Select DC
    </option>

    {diagnosticCenters.map((dc) => (

      <option
        key={dc.id}
        value={dc.id}
      >

        {dc.name}
        {" - "}
        {dc.locationName}

      </option>
    ))}
  </select>
</div>

<div className="col-md-3">

  <label>Visit Type</label>

  <select
    className="form-control"
    value={form.visitType}
    onChange={(e) =>
      setForm({
        ...form,
        visitType: e.target.value
      })
    }
  >

    <option value="CENTER_VISIT">
      Center Visit
    </option>

    <option value="HOME_VISIT">
      Home Visit
    </option>

  </select>
</div>

            {/* Date */}
            <div className="col-md-3">
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

            {/* Time */}
            <div className="col-md-3">
              <label>Visit Time</label>
              <input
                type="time"
                className="form-control"
                value={form.visitSlot}
                onChange={(e) =>
                  setForm({ ...form, visitSlot: e.target.value })
                }
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-4">
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
              Update Appointment
            </button>

            <button
              className="btn btn-danger ms-3"
              onClick={() => navigate("/today-appointments")}
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