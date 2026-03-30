// import React from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { patients } from "../../data/patients";
// import "../../styles/patientDetails.css";

// const PatientDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const patient = patients.find((p) => p.id === Number(id));

//   if (!patient) {
//     return <h3 className="text-center mt-5">Patient not found</h3>;
//   }

//   return (
//     <div className="container mt-3">
//       {/* Header section */}

//       <div className="patient-profile-card">
//         {/* Cover Photo */}

//         <div className="cover-photo"></div>

//         {/* Profile Info */}

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

//             <div className="ms-3 patient-name">{patient?.name}</div>
//           </div>

//           <div className="lm-number">
//             LM No.: <b>{patient?.lm}</b>
//           </div>

//           <button
//             className="btn edit-btn"
//             onClick={() => navigate(`/edit-patient/${id}`)}
//           >
//             ✏ Edit Patient Details
//           </button>
//         </div>
//       </div>

//       {/* Personal Details */}

//       <div className="card mb-3">
//         <div className="card-header bg-primary text-white">
//           Personal Details
//         </div>

//         <div className="card-body">
//   <div className="row">

//     <div className="col-md-6">

//       <p>
//         <b>Registration Date/Time :</b> {patient?.registered}
//       </p>

//       <p>
//         <b>LM No :</b> {patient?.lm}
//       </p>

//       <p>
//         <b>Address :</b> {patient?.address}
//       </p>

//       <p>
//         <b>State :</b> {patient?.state}
//       </p>

//       <p>
//         <b>Date of Birth :</b> {patient?.dob}
//       </p>

//       <p>
//         <b>Aadhar Card No. :</b> {patient?.nationalId}
//       </p>

//       <p>
//         <b>Currency :</b> {patient?.currency}
//       </p>

//       <p>
//         <b>Insurance :</b> {patient?.insurance}
//       </p>

//     </div>


//     <div className="col-md-6">

//       <p>
//         <b>Appointment Date/Time :</b> {patient?.appointment}
//       </p>

//       <p>
//         <b>Age/Gender :</b> {patient?.age} Year/{patient?.gender}
//       </p>

//       <p>
//         <b>Country :</b> {patient?.country}
//       </p>

//       <p>
//         <b>City :</b> {patient?.city}
//       </p>

//       <p>
//         <b>Mobile Number :</b> {patient?.mobile}
//       </p>

//       <p>
//         <b>Passport No. :</b> {patient?.passport}
//       </p>

//       <p>
//         <b>Organization :</b> {patient?.organization}
//       </p>

//     </div>

//   </div>
// </div>
//       </div>

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
//               {patient.tests.map((t, i) => (
//                 <tr key={i}>
//                   <td>{t.test}</td>
//                   <td>{t.type}</td>
//                   <td>{t.sample}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Risk Cards */}

//       <div className="row">
//         <div className="col-md-6">
//           <div className="card mb-3">
//             <div className="card-header">Cardiac Risk Profile : ASCVD</div>

//             <div className="card-body">
//               <div className="progress">
//                 <div
//                   className="progress-bar bg-danger"
//                   style={{ width: "60%" }}
//                 ></div>
//               </div>

//               <p className="mt-2">
//                 Risk Level : <b>High</b>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card mb-3">
//             <div className="card-header">Cardiac Risk Profile : Framingham</div>

//             <div className="card-body">
//               <div className="progress">
//                 <div
//                   className="progress-bar bg-warning"
//                   style={{ width: "30%" }}
//                 ></div>
//               </div>

//               <p className="mt-2">
//                 Risk Level : <b>Moderate</b>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientDetails;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/patientDetails.css";
import { getPatientById } from "../../services/patientService";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  // ✅ LOAD FROM API
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

  // ⏳ Loading
  if (!patient) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container mt-3">

      {/* Header */}
      <div className="patient-profile-card">
        <div className="cover-photo"></div>

        <div className="profile-info d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="profile-img-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="profile"
                className="profile-img"
              />
              <span className="verify-badge">✔</span>
            </div>

            {/* ✅ FIXED FIELD */}
            <div className="ms-3 patient-name">
              {patient.patientName}
            </div>
          </div>

          <div className="lm-number">
            LM No.: <b>{patient.id}</b>
          </div>

          <button
            className="btn edit-btn"
            onClick={() => navigate(`/edit-patient/${id}`)}
          >
            ✏ Edit Patient Details
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="card mb-3">
        <div className="card-header bg-primary text-white">
          Personal Details
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-6">

              <p><b>Address :</b> {patient.address}</p>
              <p><b>State :</b> {patient.state}</p>
              <p><b>Date of Birth :</b> {patient.dob}</p>
              <p><b>National ID :</b> {patient.nationalIdNumber}</p>
              <p><b>Currency :</b> {patient.currency}</p>
              <p><b>Insurance :</b> {patient.insuranceName}</p>

            </div>

            <div className="col-md-6">

              <p><b>Age/Gender :</b> {patient.age} / {patient.gender}</p>
              <p><b>Country :</b> {patient.country}</p>
              <p><b>City :</b> {patient.city}</p>
              <p><b>Mobile :</b> {patient.mobileNumber}</p>
              <p><b>Passport :</b> {patient.passportNumber}</p>
              <p><b>Organization :</b> {patient.organizationName}</p>

            </div>

          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="card mb-3">
        <div className="card-header bg-primary text-white">Test List</div>

        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Test Type</th>
                <th>Sample Type</th>
              </tr>
            </thead>

            <tbody>
              {patient.tests?.map((t, i) => (
                <tr key={i}>
                  <td>{t.testName}</td>
                  <td>{t.testType}</td>
                  <td>{t.sampleType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PatientDetails;
