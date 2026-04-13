// import React, { useEffect, useState } from "react";
// import "../../styles/addPatient.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { saveTestResult } from "../../services/testResultService";
// import { getAppointmentById } from "../../services/appointmentService";


// const AddTestResult = () => {
//   const { id } = useParams(); // appointmentId
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   const [tests, setTests] = useState([]);

//   const [form, setForm] = useState({
//     appointmentId: id,
//     results: [],
//   });
//   const loadAppointment = async () => {
//     try {
//       const res = await getAppointmentById(id);
//       const data = res.data.data;
//       console.log(res.data.data);

//       setPatient(data);
//       console.log(res.data.data);

//       // 🔥 Tests from patient (IMPORTANT)
//       const testList = Array.isArray(data.tests) ? data.tests : [];
//       setTests(testList);

//       // initialize results
//       setForm({
//         appointmentId: id,
//         results: testList.map((t) => ({
//           testId: t.testId,
//           resultValue: "",
//           unit: "",
//           referenceRange: "",
//           remarks: "",
//         })),
//       });

//     } catch (err) {
//       console.error("Error loading appointment:", err);
//     }
//   };

//   // 🔥 Load Appointment + Tests
//   useEffect(() => {
//     loadAppointment();
//   }, []);

  

//   // 🔥 Handle input change
//   const handleChange = (index, field, value) => {
//     const updated = [...form.results];
//     updated[index][field] = value;

//     setForm({ ...form, results: updated });
//   };

//   // 🔥 Submit
//   const handleSubmit = async () => {
//     try {
//       await saveTestResult(form);
//       alert("Test Result Saved Successfully");

//       navigate("/test-result");
//     } catch (err) {
//       console.error("Error saving result:", err);
//       alert("Error saving test result");
//     }
//   };
  

//   return (
    
//     <div className="container-fluid mt-3">
//       <div className="card">

//         {/* HEADER */}
//         <div className="card-header add-header">
//           Add Test Result
//         </div>

//         <div className="card-body">

//           {/* Patient Info */}
//           <div className="mb-3">
//             <b>Patient:</b> {patient?.patientName || "-"}
//           </div>

//           {/* No Tests */}
//           {tests.length === 0 && (
//             <div className="text-danger mb-3">
//               No tests found for this appointment
//             </div>
//           )}

//           {/* TABLE */}
//           {tests.length > 0 && (
//             <div className="table-responsive">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Test Name</th>
//                     <th>Result</th>
//                     <th>Unit</th>
//                     <th>Reference Range</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//   {form.results.map((r, index) => (
//     <tr key={index}>

//       <td>{tests[index]?.testName}</td>

//       <td>
//         <input
//           className="form-control"
//           value={r.resultValue ?? ""}
//           onChange={(e) =>
//             handleChange(index, "resultValue", e.target.value)
//           }
//         />
//       </td>

//       <td>
//         <input
//           className="form-control"
//           value={r.unit ?? ""}
//           onChange={(e) =>
//             handleChange(index, "unit", e.target.value)
//           }
//         />
//       </td>

//       <td>
//         <input
//           className="form-control"
//           value={r.referenceRange ?? ""}
//           onChange={(e) =>
//             handleChange(index, "referenceRange", e.target.value)
//           }
//         />
//       </td>

//       <td>
//         <input
//           className="form-control"
//           value={r.remarks ?? ""}
//           onChange={(e) =>
//             handleChange(index, "remarks", e.target.value)
//           }
//         />
//       </td>

//     </tr>
//   ))}
// </tbody>
//               </table>
//             </div>
//           )}

//           {/* BUTTONS */}
//           <div className="mt-3">
//             <button className="btn btn-primary" onClick={handleSubmit}>
//               Save Result
//             </button>

//             <button
//               className="btn btn-danger ms-2"
//               onClick={() => navigate("/test-result")}
//             >
//               Cancel
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTestResult;

import React, { useEffect, useState } from "react";
import "../../styles/addPatient.css";
import { useParams, useNavigate } from "react-router-dom";

import { saveTestResult } from "../../services/testResultService";
import { getAppointmentById } from "../../services/appointmentService";
import { getTestResult } from "../../services/testResultService";
import { hasPermission } from "../permissionUtil";

const AddTestResult = () => {

  const canAdd = hasPermission("Test Result", "ADD");
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  
  const [tests, setTests] = useState([]);
  const [form, setForm] = useState({
    appointmentId: id,
    results: [],
  });

  // 🔥 Load Appointment + Tests
  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    try {
      const res = await getAppointmentById(id);
      const data = res.data.data;

      // 🔍 DEBUG LOGS
      console.log("🔥 API RESPONSE:", res);
      console.log("🔥 DATA:", data);
      console.log("🔥 TESTS:", data.tests);

      setPatient(data);
      const resultRes = await getTestResult(id).catch(() => null);

let existingMap = {};

if (resultRes?.data?.data?.results) {
  resultRes.data.data.results.forEach(r => {
    existingMap[r.testName] = r;
  });
}

      const testList = Array.isArray(data.tests) ? data.tests : [];
      setTests(testList);

      // initialize form safely
    //   setForm({
    //     appointmentId: id,
    //     results: testList.map((t) => ({
    //       testId: t.testId,
    //       resultValue: "",
    //       unit: "",
    //       referenceRange: "",
    //       remarks: "",
    //     })),
    //   });

    // }
    setForm({
  appointmentId: id,
  results: testList.map((t) => {
    const existing = existingMap[t.testName];

    return {
      testId: t.testId,
      resultValue: existing?.resultValue || "",
      unit: existing?.unit || "",
      referenceRange: existing?.referenceRange || "",
      remarks: existing?.remarks || "",
    };
  }),
});}
     catch (err) {
      console.error("❌ Error loading appointment:", err);
    }
  };

  // 🔥 Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...form.results];
    updated[index][field] = value;

    setForm({ ...form, results: updated });
  };

  // 🔥 Submit
  // const handleSubmit = async () => {
  //   try {
  //     console.log("📤 SUBMIT DATA:", form);

  //     await saveTestResult(form);
  //     alert("Test Result Saved Successfully");

  //     navigate("/test-result");
  //   } catch (err) {
  //     console.error("❌ Error saving result:", err);
  //     alert("Error saving test result");
  //   }
  // };


//   const handleSubmit = async () => {
//   try {
//     // 🔥 FILTER EMPTY RESULTS
//     const validResults = form.results.filter(
//       (r) => r.resultValue && r.resultValue.trim() !== ""
//     );

//     // ❗ अगर कुछ भी filled नहीं है
//     if (validResults.length === 0) {
//       alert("Please enter at least one test result");
//       return;
//     }

//     const payload = {
//       appointmentId: form.appointmentId,
//       results: validResults,
//     };

//     console.log("📤 FINAL PAYLOAD:", payload);

//     await saveTestResult(payload);

//     alert("Test Result Saved Successfully");
//     navigate("/test-result");

//   } catch (err) {
//     console.error("❌ Error saving result:", err);
//     alert("Error saving test result");
//   }
// };

const handleSubmit = async () => {
  try {
    const validResults = form.results.filter(
      (r) => r.resultValue && r.resultValue.trim() !== ""
    );

    if (validResults.length === 0) {
      alert("Please enter at least one test result");
      return;
    }

    const payload = {
      appointmentId: form.appointmentId,
      results: validResults,
    };

    console.log("📤 FINAL PAYLOAD:", payload);

    const res = await saveTestResult(payload);

    // ✅ Backend message use
    alert(res.data.message); // "Test result saved"

    navigate("/test-result");

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to save test result ❌"
    );
  }
};

  // 🔥 DEBUG STATE
  console.log("🧠 FINAL STATE:", {
    patient,
    tests,
    form,
  });

  // ⏳ Loading state
  if (!patient) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // ❗ No tests fallback
  if (tests.length === 0) {
    return (
      <div className="text-center mt-5 text-danger">
        No tests found for this appointment
      </div>
    );
  }
  if (!canAdd) {
  return <h3>Access Denied ❌</h3>;
}

  return (
    <div className="container-fluid mt-3">
      <div className="card">

        {/* HEADER */}
        <div className="card-header add-header">
          Add Test Result
        </div>

        <div className="card-body">

          {/* Patient Info */}
          <div className="mb-3">
            <b>Patient:</b> {patient.patientName || "-"}
          </div>

          {/* TABLE */}
          {tests.length > 0 && form.results.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {form.results.map((r, index) => (
                    <tr key={index}>

                      {/* Test Name */}
                      <td>{tests[index]?.testName}</td>

                      {/* Result */}
                      <td>
                        <input
                          className="form-control"
                          value={r.resultValue ?? ""}
                          onChange={(e) =>
                            handleChange(index, "resultValue", e.target.value)
                          }
                        />
                      </td>

                      {/* Unit */}
                      <td>
                        <input
                          className="form-control"
                          value={r.unit ?? ""}
                          onChange={(e) =>
                            handleChange(index, "unit", e.target.value)
                          }
                        />
                      </td>

                      {/* Reference Range */}
                      <td>
                        <input
                          className="form-control"
                          value={r.referenceRange ?? ""}
                          onChange={(e) =>
                            handleChange(index, "referenceRange", e.target.value)
                          }
                        />
                      </td>

                      {/* Remarks */}
                      <td>
                        <input
                          className="form-control"
                          value={r.remarks ?? ""}
                          onChange={(e) =>
                            handleChange(index, "remarks", e.target.value)
                          }
                        />
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-3">
            {/* <button className="btn btn-primary" onClick={handleSubmit}>
              Save Result
            </button> */}
            {hasPermission("Test Result", "ADD") && (
  <button className="btn btn-primary" onClick={handleSubmit}>
    Save Result
  </button>
)}

            <button
              className="btn btn-danger ms-2"
              onClick={() => navigate("/test-result")}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddTestResult;

