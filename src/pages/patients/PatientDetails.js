import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../../services/patientService";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  // Load patient details from API
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const res = await getPatientById(id);
        setPatient(res.data.data);
      } catch (err) {
        console.error("Error loading patient:", err);
      }
    };

    loadPatient();
  }, [id]);

  // Loading state
  if (!patient) {
    return (
      <div className="container mt-3 app-patient-details-page">
        <style>{patientDetailsStyles}</style>
        <div className="app-patient-details-state">
          <div className="app-patient-details-state-icon">⌛</div>
          <h5>Loading patient details...</h5>
          <p>Please wait while the patient record is being retrieved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3 app-patient-details-page">
      <style>{patientDetailsStyles}</style>

      <div className="app-patient-details-profile">
        <div className="app-patient-details-cover">
          <div className="app-patient-details-cover-pattern" />
          <div className="app-patient-details-cover-label">
            Patient Profile
          </div>
        </div>

        <div className="app-patient-details-profile-content">
          <div className="app-patient-details-identity">
            <div className="app-patient-details-avatar-wrap">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Patient profile"
                className="app-patient-details-avatar"
              />
              <span className="app-patient-details-verified" title="Patient record">
                ✓
              </span>
            </div>

            <div className="app-patient-details-name-block">
              <h3>{patient.patientName || "Patient"}</h3>
              <p>Patient registration record</p>
            </div>
          </div>

          <div className="app-patient-details-lm">
            <span>LM No.</span>
            <strong>{patient.lmNo || "-"}</strong>
          </div>
        </div>
      </div>

      <section className="app-patient-details-card">
        <div className="app-patient-details-card-header">
          <div className="app-patient-details-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h5>Personal Details</h5>
            <p>Patient demographic and contact information</p>
          </div>
        </div>

        <div className="app-patient-details-card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <Detail label="Address" value={patient.address} />
              <Detail label="State" value={patient.state} />
              <Detail label="Date of Birth" value={patient.dob} />
              <Detail label="National ID" value={patient.nationalIdNumber} />
              <Detail label="Currency" value={patient.currency} />
              <Detail label="Insurance" value={patient.insuranceName} />
            </div>

            <div className="col-md-6">
              <Detail
                label="Age / Gender"
                value={`${patient.age ?? "-"} / ${patient.gender || "-"}`}
              />
              <Detail label="Country" value={patient.country} />
              <Detail label="City" value={patient.city} />
              <Detail label="Mobile" value={patient.mobileNumber} />
              <Detail label="Passport" value={patient.passportNumber} />
              <Detail label="Organization" value={patient.organizationName} />
            </div>
          </div>
        </div>
      </section>

      <section className="app-patient-details-card">
        <div className="app-patient-details-card-header">
          <div className="app-patient-details-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m8 14 2 2 5-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h5>Registration Details</h5>
            <p>Current registration status and cancellation information</p>
          </div>
        </div>

        <div className="app-patient-details-card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="app-patient-details-info-row">
                <span className="app-patient-details-info-label">Status</span>
                <span className="app-patient-details-info-value">
                  {patient.status === "ACTIVE" ? (
                    <span className="app-patient-details-status app-patient-details-status-active">
                      Active
                    </span>
                  ) : (
                    <span className="app-patient-details-status app-patient-details-status-cancelled">
                      Registration Cancelled
                    </span>
                  )}
                </span>
              </div>

              {patient.status === "REGISTRATION_CANCELLED" && (
                <Detail
                  label="Cancellation Reason"
                  value={patient.cancellationReason}
                />
              )}
            </div>

            <div className="col-md-6">
              {patient.status === "REGISTRATION_CANCELLED" && (
                <>
                  <Detail label="Cancelled By" value={patient.cancelledBy} />
                  <Detail
                    label="Cancelled On"
                    value={
                      patient.cancelledAt
                        ? new Date(patient.cancelledAt).toLocaleString()
                        : "-"
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="app-patient-details-card app-patient-details-tests-card">
        <div className="app-patient-details-card-header">
          <div className="app-patient-details-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 3h6m-5 0v6l-5.5 9.2A1.8 1.8 0 0 0 6.1 21h11.8a1.8 1.8 0 0 0 1.6-2.8L14 9V3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 16h9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h5>Test List</h5>
            <p>Tests associated with this patient registration</p>
          </div>
          <span className="app-patient-details-test-count">
            {patient.tests?.length || 0}{" "}
            {(patient.tests?.length || 0) === 1 ? "Test" : "Tests"}
          </span>
        </div>

        <div className="app-patient-details-card-body app-patient-details-table-wrap">
          <table className="table app-patient-details-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Test Type</th>
                <th>Sample Type</th>
              </tr>
            </thead>
            <tbody>
              {patient.tests?.length ? (
                patient.tests.map((t, i) => (
                  <tr key={i}>
                    <td className="app-patient-details-test-name">
                      {t.testName || "-"}
                    </td>
                    <td>{t.testType || "-"}</td>
                    <td>{t.sampleType || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="app-patient-details-empty">
                    No tests found for this patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="app-patient-details-actions">
        <button
          type="button"
          className="btn app-patient-details-back"
          onClick={() => navigate("/patients")}
        >
          Back to Patients
        </button>
        <button
          type="button"
          className="btn app-patient-details-dashboard"
          onClick={() => navigate("/")}
        >
          Goto Dashboard
        </button>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="app-patient-details-info-row">
    <span className="app-patient-details-info-label">{label}</span>
    <span className="app-patient-details-info-value">
      {value === null || value === undefined || value === "" ? "-" : value}
    </span>
  </div>
);

const patientDetailsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .app-patient-details-page {
    padding-bottom: 24px;
    color: #18243a;
    font-family: 'Inter', sans-serif;
  }

  .app-patient-details-profile {
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid #e5ebf2;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 5px 22px rgba(17, 39, 65, .07);
  }

  .app-patient-details-cover {
    position: relative;
    height: 112px;
    overflow: hidden;
    background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
  }

  .app-patient-details-cover::before,
  .app-patient-details-cover::after {
    position: absolute;
    content: "";
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 50%;
  }

  .app-patient-details-cover::before {
    width: 260px;
    height: 260px;
    top: -150px;
    right: 8%;
  }

  .app-patient-details-cover::after {
    width: 190px;
    height: 190px;
    top: -105px;
    right: 19%;
  }

  .app-patient-details-cover-label {
    position: absolute;
    right: 24px;
    bottom: 18px;
    color: rgba(255,255,255,.78);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .app-patient-details-profile-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 24px 20px;
  }

  .app-patient-details-identity {
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 0;
    margin-top: -32px;
  }

  .app-patient-details-avatar-wrap {
    position: relative;
    width: 82px;
    height: 82px;
    flex: 0 0 82px;
    padding: 4px;
    border: 1px solid #e1e8f0;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 3px 10px rgba(17,39,65,.10);
  }

  .app-patient-details-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #eef3f8;
  }

  .app-patient-details-verified {
    position: absolute;
    right: 1px;
    bottom: 3px;
    display: grid;
    width: 21px;
    height: 21px;
    place-items: center;
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
    background: #16845e;
    font-size: 11px;
    font-weight: 700;
  }

  .app-patient-details-name-block {
    min-width: 0;
    padding-top: 34px;
  }

  .app-patient-details-name-block h3 {
    overflow-wrap: anywhere;
    margin: 0;
    color: #18243a;
    font-size: 18px;
    font-weight: 700;
  }

  .app-patient-details-name-block p {
    margin: 4px 0 0;
    color: #7a8798;
    font-size: 11px;
  }

  .app-patient-details-lm {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    padding-top: 18px;
  }

  .app-patient-details-lm span {
    color: #7b8798;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
  }

  .app-patient-details-lm strong {
    color: #0e3d66;
    font-size: 14px;
    font-weight: 700;
  }

  .app-patient-details-card {
    overflow: hidden;
    margin-bottom: 18px;
    border: 1px solid #e5ebf2;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 3px 14px rgba(17,39,65,.045);
  }

  .app-patient-details-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 68px;
    padding: 13px 20px;
    border-bottom: 1px solid #e8edf3;
    background: #fbfcfe;
  }

  .app-patient-details-card-icon {
    display: grid;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    place-items: center;
    border-radius: 10px;
    color: #164d77;
    background: #eaf1f7;
  }

  .app-patient-details-card-icon svg {
    width: 20px;
    height: 20px;
  }

  .app-patient-details-card-header h5 {
    margin: 0;
    color: #18243a;
    font-size: 14px;
    font-weight: 700;
  }

  .app-patient-details-card-header p {
    margin: 4px 0 0;
    color: #7b8798;
    font-size: 10px;
  }

  .app-patient-details-card-body {
    padding: 19px 20px;
  }

  .app-patient-details-info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    min-height: 39px;
    padding: 9px 0;
    border-bottom: 1px solid #f0f3f6;
  }

  .app-patient-details-info-row:last-child {
    border-bottom: 0;
  }

  .app-patient-details-info-label {
    flex: 0 0 42%;
    color: #718095;
    font-size: 11px;
    font-weight: 600;
  }

  .app-patient-details-info-value {
    min-width: 0;
    color: #27384d;
    font-size: 12px;
    font-weight: 500;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .app-patient-details-status {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
  }

  .app-patient-details-status-active {
    color: #14734f;
    background: #e6f5ee;
  }

  .app-patient-details-status-cancelled {
    color: #a33c42;
    background: #fbeaec;
  }

  .app-patient-details-test-count {
    margin-left: auto;
    padding: 5px 10px;
    border-radius: 20px;
    color: #49627c;
    background: #edf3f8;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
  }

  .app-patient-details-table-wrap {
    overflow-x: auto;
    padding: 0;
  }

  .app-patient-details-table {
    min-width: 540px;
    margin: 0;
    vertical-align: middle;
    font-family: 'Inter', sans-serif;
  }

  .app-patient-details-table thead th {
    padding: 13px 17px;
    border-bottom: 1px solid #dfe7ef;
    color: #53657a;
    background: #f3f6f9;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .55px;
    text-transform: uppercase;
  }

  .app-patient-details-table tbody td {
    padding: 13px 17px;
    border-color: #edf1f5;
    color: #46556a;
    font-size: 12px;
  }

  .app-patient-details-test-name {
    color: #1d3550 !important;
    font-weight: 600;
  }

  .app-patient-details-empty {
    padding: 25px !important;
    color: #7b8798 !important;
    text-align: center;
  }

  .app-patient-details-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }

  .app-patient-details-actions .btn {
    min-height: 39px;
    padding: 9px 16px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  .app-patient-details-back {
    color: #fff;
    border: 1px solid #0d3a60;
    background: #0d3a60;
  }

  .app-patient-details-back:hover {
    color: #fff;
    border-color: #092b48;
    background: #092b48;
  }

  .app-patient-details-dashboard {
    color: #fff;
    border: 1px solid #657386;
    background: #657386;
  }

  .app-patient-details-dashboard:hover {
    color: #fff;
    border-color: #4d5c6e;
    background: #4d5c6e;
  }

  .app-patient-details-state {
    padding: 48px 20px;
    border: 1px solid #e5ebf2;
    border-radius: 14px;
    background: #fff;
    color: #53657a;
    text-align: center;
    font-family: 'Inter', sans-serif;
  }

  .app-patient-details-state-icon {
    margin-bottom: 12px;
    font-size: 28px;
  }

  .app-patient-details-state h5 {
    margin: 0 0 6px;
    color: #18243a;
    font-size: 15px;
    font-weight: 700;
  }

  .app-patient-details-state p {
    margin: 0;
    font-size: 12px;
  }

  @media (max-width: 767.98px) {
    .app-patient-details-cover {
      height: 90px;
    }

    .app-patient-details-profile-content {
      align-items: flex-start;
      padding: 0 15px 17px;
    }

    .app-patient-details-avatar-wrap {
      width: 70px;
      height: 70px;
      flex-basis: 70px;
    }

    .app-patient-details-name-block h3 {
      font-size: 15px;
    }

    .app-patient-details-lm {
      padding-top: 14px;
    }

    .app-patient-details-card-header {
      padding: 12px 14px;
    }

    .app-patient-details-card-body {
      padding: 14px;
    }

    .app-patient-details-info-row {
      gap: 10px;
    }

    .app-patient-details-info-label {
      flex-basis: 40%;
    }
  }

  @media (max-width: 420px) {
    .app-patient-details-profile-content {
      flex-wrap: wrap;
    }

    .app-patient-details-lm {
      align-items: flex-start;
      width: 100%;
      padding: 0 0 0 84px;
    }

    .app-patient-details-info-row {
      flex-direction: column;
      gap: 3px;
    }

    .app-patient-details-info-value {
      text-align: left;
    }
  }
`;

export default PatientDetails;

// // import React from "react";
// // import { useParams } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";
// // import { patients } from "../../data/patients";
// // import "../../styles/patientDetails.css";

// // const PatientDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const patient = patients.find((p) => p.id === Number(id));

// //   if (!patient) {
// //     return <h3 className="text-center mt-5">Patient not found</h3>;
// //   }

// //   return (
// //     <div className="container mt-3">
// //       {/* Header section */}

// //       <div className="patient-profile-card">
// //         {/* Cover Photo */}

// //         <div className="cover-photo"></div>

// //         {/* Profile Info */}

// //         <div className="profile-info d-flex align-items-center justify-content-between">
// //           <div className="d-flex align-items-center">
// //             <div className="profile-img-wrapper">
// //               <img
// //                 src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
// //                 alt="profile"
// //                 className="profile-img"
// //               />

// //               <span className="verify-badge">✔</span>
// //             </div>

// //             <div className="ms-3 patient-name">{patient?.name}</div>
// //           </div>

// //           <div className="lm-number">
// //             LM No.: <b>{patient?.lm}</b>
// //           </div>

// //           <button
// //             className="btn edit-btn"
// //             onClick={() => navigate(`/edit-patient/${id}`)}
// //           >
// //             ✏ Edit Patient Details
// //           </button>
// //         </div>
// //       </div>

// //       {/* Personal Details */}

// //       <div className="card mb-3">
// //         <div className="card-header bg-primary text-white">
// //           Personal Details
// //         </div>

// //         <div className="card-body">
// //   <div className="row">

// //     <div className="col-md-6">

// //       <p>
// //         <b>Registration Date/Time :</b> {patient?.registered}
// //       </p>

// //       <p>
// //         <b>LM No :</b> {patient?.lm}
// //       </p>

// //       <p>
// //         <b>Address :</b> {patient?.address}
// //       </p>

// //       <p>
// //         <b>State :</b> {patient?.state}
// //       </p>

// //       <p>
// //         <b>Date of Birth :</b> {patient?.dob}
// //       </p>

// //       <p>
// //         <b>Aadhar Card No. :</b> {patient?.nationalId}
// //       </p>

// //       <p>
// //         <b>Currency :</b> {patient?.currency}
// //       </p>

// //       <p>
// //         <b>Insurance :</b> {patient?.insurance}
// //       </p>

// //     </div>


// //     <div className="col-md-6">

// //       <p>
// //         <b>Appointment Date/Time :</b> {patient?.appointment}
// //       </p>

// //       <p>
// //         <b>Age/Gender :</b> {patient?.age} Year/{patient?.gender}
// //       </p>

// //       <p>
// //         <b>Country :</b> {patient?.country}
// //       </p>

// //       <p>
// //         <b>City :</b> {patient?.city}
// //       </p>

// //       <p>
// //         <b>Mobile Number :</b> {patient?.mobile}
// //       </p>

// //       <p>
// //         <b>Passport No. :</b> {patient?.passport}
// //       </p>

// //       <p>
// //         <b>Organization :</b> {patient?.organization}
// //       </p>

// //     </div>

// //   </div>
// // </div>
// //       </div>

// //       {/* Test List */}

// //       <div className="card mb-3">
// //         <div className="card-header bg-primary text-white">Test List</div>

// //         <div className="card-body">
// //           <table className="table table-bordered">
// //             <thead>
// //               <tr>
// //                 <th>Test Name</th>
// //                 <th>Test Type</th>
// //                 <th>Sample Type</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {patient.tests.map((t, i) => (
// //                 <tr key={i}>
// //                   <td>{t.test}</td>
// //                   <td>{t.type}</td>
// //                   <td>{t.sample}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Risk Cards */}

// //       <div className="row">
// //         <div className="col-md-6">
// //           <div className="card mb-3">
// //             <div className="card-header">Cardiac Risk Profile : ASCVD</div>

// //             <div className="card-body">
// //               <div className="progress">
// //                 <div
// //                   className="progress-bar bg-danger"
// //                   style={{ width: "60%" }}
// //                 ></div>
// //               </div>

// //               <p className="mt-2">
// //                 Risk Level : <b>High</b>
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-md-6">
// //           <div className="card mb-3">
// //             <div className="card-header">Cardiac Risk Profile : Framingham</div>

// //             <div className="card-body">
// //               <div className="progress">
// //                 <div
// //                   className="progress-bar bg-warning"
// //                   style={{ width: "30%" }}
// //                 ></div>
// //               </div>

// //               <p className="mt-2">
// //                 Risk Level : <b>Moderate</b>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PatientDetails;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/patientDetails.css";
// import { getPatientById } from "../../services/patientService";

// const PatientDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);

//   // ✅ LOAD FROM API
//   useEffect(() => {
//     const loadPatient = async () => {
//       try {
//         const res = await getPatientById(id);
//         setPatient(res.data.data);
//       } catch (err) {
//         console.error("Error loading patient:", err);
//       }
//     };

//     loadPatient();
//   }, [id]);

//   // ⏳ Loading
//   if (!patient) {
//     return <h3 className="text-center mt-5">Loading...</h3>;
//   }

//   return (
//     <div className="container mt-3">

//       {/* Header */}
//       <div className="patient-profile-card">
//         <div className="cover-photo"></div>

//         <div className="profile-info d-flex align-items-center justify-content-between">
//           <div className="d-flex align-items-center">
//             <div className="profile-img-wrapper">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                 alt="profile"
//                 className="profile-img"
//               />
//               <span className="verify-badge">✔</span>
//             </div>

//             {/* ✅ FIXED FIELD */}
//             <div className="ms-3 patient-name">
//               {patient.patientName}
//             </div>
//           </div>

//           {/* <div className="lm-number">
//             LM No.: <b>{patient.id}</b>
//           </div> */}
//           <div className="lm-number">
//   LM No.: <b>{patient.lmNo || "-"}</b>
// </div>

//           {/* <button
//             className="btn edit-btn"
//             onClick={() => navigate(`/edit-patient/${id}`)}
//           >
//             ✏ Edit Patient Details
//           </button> */}
//         </div>
//       </div>

//       {/* Personal Details */}
//       <div className="card mb-3">
//         <div className="card-header bg-primary text-white">
//           Personal Details
//         </div>

//         <div className="card-body">
//           <div className="row">

//             <div className="col-md-6">

//               <p><b>Address :</b> {patient.address}</p>
//               <p><b>State :</b> {patient.state}</p>
//               <p><b>Date of Birth :</b> {patient.dob}</p>
//               <p><b>National ID :</b> {patient.nationalIdNumber}</p>
//               <p><b>Currency :</b> {patient.currency}</p>
//               <p><b>Insurance :</b> {patient.insuranceName}</p>

//             </div>

//             <div className="col-md-6">

//               <p><b>Age/Gender :</b> {patient.age} / {patient.gender}</p>
//               <p><b>Country :</b> {patient.country}</p>
//               <p><b>City :</b> {patient.city}</p>
//               <p><b>Mobile :</b> {patient.mobileNumber}</p>
//               <p><b>Passport :</b> {patient.passportNumber}</p>
//               <p><b>Organization :</b> {patient.organizationName}</p>

//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Registration Details */}
// <div className="card mb-3">
//   <div className="card-header bg-primary text-white">
//     Registration Details
//   </div>

//   <div className="card-body">

//     <div className="row">

//       <div className="col-md-6">

//         <p>
//           <b>Status :</b>{" "}
//           {patient.status === "ACTIVE" ? (
//             <span className="badge bg-success">Active</span>
//           ) : (
//             <span className="badge bg-danger">
//               Registration Cancelled
//             </span>
//           )}
//         </p>

//         {patient.status === "REGISTRATION_CANCELLED" && (
//           <p>
//             <b>Cancellation Reason :</b>{" "}
//             {patient.cancellationReason || "-"}
//           </p>
//         )}

//       </div>

//       <div className="col-md-6">

//         {patient.status === "REGISTRATION_CANCELLED" && (
//           <>
//             <p>
//               <b>Cancelled By :</b>{" "}
//               {patient.cancelledBy || "-"}
//             </p>

//             <p>
//               <b>Cancelled On :</b>{" "}
//               {patient.cancelledAt
//                 ? new Date(patient.cancelledAt).toLocaleString()
//                 : "-"}
//             </p>
//           </>
//         )}

//       </div>

//     </div>

//   </div>
// </div>

//       {/* Test List */}
//       <div className="card mb-3">
//         <div className="card-header bg-primary text-white">Test List</div>

//         <div className="card-body">
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Test Name</th>
//                 <th>Test Type</th>
//                 <th>Sample Type</th>
//               </tr>
//             </thead>

//             <tbody>
//               {patient.tests?.map((t, i) => (
//                 <tr key={i}>
//                   <td>{t.testName}</td>
//                   <td>{t.testType}</td>
//                   <td>{t.sampleType}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default PatientDetails;
