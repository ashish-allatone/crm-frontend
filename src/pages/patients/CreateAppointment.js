// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { createAppointment } from "../../services/appointmentService";
// import { getPatientById } from "../../services/patientService";
// import { getAllServiceProviders } from "../../services/serviceProviderService";

// export default function CreateAppointment() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   const [providers, setProviders] = useState([]);

//   const [form, setForm] = useState({
//     patientId: "",
//     organizationId: "",
//     serviceProviderId: "",
//     visitDate: "",
//     visitTime: "",
//   });

//   useEffect(() => {
//     loadPatient();
//     loadProviders();
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

//   const loadProviders = async () => {
//     const res = await getAllServiceProviders();
//     setProviders(res.data.data);
//   };

//   const handleSubmit = async () => {
//     await createAppointment(form);
//     navigate("/patients"); // back to list
//   };

//   return (
//     <div className="container mt-3">
//       <h4>Create Appointment</h4>

//       <div className="card p-3">

//         <div className="mb-2">
//           <b>Patient:</b> {patient?.patientName}
//         </div>

//         <div className="mb-2">
//           <label>Service Provider</label>
//           <select
//             className="form-control"
//             value={form.serviceProviderId}
//             onChange={(e) =>
//               setForm({ ...form, serviceProviderId: e.target.value })
//             }
//           >
//             <option value="">Select</option>
//             {providers.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-2">
//           <label>Date</label>
//           <input
//             type="date"
//             className="form-control"
//             value={form.visitDate}
//             onChange={(e) =>
//               setForm({ ...form, visitDate: e.target.value })
//             }
//           />
//         </div>

//         <div className="mb-2">
//           <label>Time</label>
//           <input
//             type="time"
//             className="form-control"
//             value={form.visitTime}
//             onChange={(e) =>
//               setForm({ ...form, visitTime: e.target.value })
//             }
//           />
//         </div>

//         <button className="btn btn-success mt-2" onClick={handleSubmit}>
//           Save Appointment
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "../../styles/addPatient.css";
import { useParams, useNavigate } from "react-router-dom";

import { createAppointment } from "../../services/appointmentService";
import { getPatientById } from "../../services/patientService";
// import { getAllServiceProviders } from "../../services/serviceProviderService";
import { getDiagnosticCenters } from "../../services/diagnosticCenterService";
import { hasPermission } from "../permissionUtil";

const CreateAppointment = () => {
  const canAdd = hasPermission("Appointment", "ADD");
  const canViewDc = hasPermission("Diagnostic Center", "VIEW");
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  // const [providers, setProviders] = useState([]);
  const [diagnosticCenters, setDiagnosticCenters] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    organizationId: "",
    // serviceProviderId: "",
    diagnosticCenterId: "",
    visitType: "CENTER_VISIT",
    visitSlot: "",
    medicalAddress: "",
    diagnosticCenterName: "",
    visitDate: "",
  });

  // useEffect(() => {
  //   loadPatient();
  //   loadProviders();
  // }, []);
  useEffect(() => {
    loadPatient();

    if (canViewDc) {
      // loadProviders();
      loadDiagnosticCenters();
    } else {
      setDiagnosticCenters([]);
    }
  }, [canViewDc]);

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

  // const loadProviders = async () => {
  //   const res = await getAllServiceProviders();
  //   setProviders(res.data.data);
  // };
  //   const loadProviders = async () => {
  //   try {
  //     const res = await getAllServiceProviders();
  //     setProviders(res.data.data || []);
  //   } catch (err) {
  //     console.warn("Service Provider access denied");
  //     setProviders([]);
  //   }
  // };

  const loadDiagnosticCenters = async () => {
    try {
      const res = await getDiagnosticCenters(0, 1000, "");

      setDiagnosticCenters(res.data.content || []);
    } catch (err) {
      console.warn("DC access denied");

      setDiagnosticCenters([]);
    }
  };

  // const handleSubmit = async () => {
  //   await createAppointment(form);
  //   navigate("/patients");
  // };
  const handleSubmit = async () => {
    try {
      const res = await createAppointment(form);

      // ✅ Backend message
      alert(res.data.message); // "Appointment created successfully"

      navigate("/patients");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create appointment ❌");
    }
  };
  if (!canAdd) {
    return <h3>Access Denied ❌</h3>;
  }
  return (
    <div className="container-fluid mt-3">
      <div className="card">
        {/* Header */}
        <div className="card-header add-header">Create Appointment</div>

        <div className="card-body">
          <div className="row g-3">
            {/* Patient Info */}
            <div className="col-md-6">
              <label>Patient Name</label>
              <input
                className="form-control"
                value={patient?.patientName || ""}
                readOnly
              />
            </div>

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
              {!canViewProvider ? (
  <input
    className="form-control"
    value="No Service Provider Access"
    disabled
  />
) : (
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
              </select>)}
            </div> */}

            <div className="col-md-6">
              <label>Diagnostic Center</label>
              {!canViewDc ? (
                <input
                  className="form-control"
                  value="No Diagnostic Center Access"
                  disabled
                />
              ) : (
                <select
                  className="form-control"
                  value={form.diagnosticCenterId}
                  onChange={(e) => {
                    const selectedDc = diagnosticCenters.find(
                      (dc) => dc.id == e.target.value,
                    );

                    setForm({
                      ...form,

                      diagnosticCenterId: e.target.value,

                      diagnosticCenterName: selectedDc?.name || "",

                      medicalAddress: selectedDc?.primaryAddress || "",
                    });
                  }}
                >
                  <option value="">Select DC</option>

                  {diagnosticCenters.map((dc) => (
                    <option key={dc.id} value={dc.id}>
                      {dc.name}
                      {" - "}
                      {dc.locationName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-md-3">
              <label>Visit Type</label>

              <select
                className="form-control"
                value={form.visitType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visitType: e.target.value,
                  })
                }
              >
                <option value="CENTER_VISIT">Center Visit</option>

                <option value="HOME_VISIT">Home Visit</option>
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
                
                onChange={(e) =>
                  setForm({
  ...form,
  visitSlot: e.target.value
})
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
            >
              Save Appointment
            </button>

            <button
              className="btn btn-danger ms-3"
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
