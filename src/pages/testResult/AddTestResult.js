import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { saveTestResult, getTestResult } from "../../services/testResultService";
import { getAppointmentById } from "../../services/appointmentService";
import { hasPermission } from "../permissionUtil";

const AddTestResult = () => {
  const canAdd = hasPermission("Test Result", "ADD");
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    appointmentId: id,
    results: [],
  });

  useEffect(() => {
    let active = true;

    const loadAppointment = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await getAppointmentById(id);
        const data = res.data.data;
        const resultRes = await getTestResult(id).catch(() => null);
        const existingMap = {};

        if (resultRes?.data?.data?.results) {
          resultRes.data.data.results.forEach((result) => {
            existingMap[result.testName] = result;
          });
        }

        const testList = Array.isArray(data.tests) ? data.tests : [];

        if (!active) return;

        setPatient(data);
        setTests(testList);
        setForm({
          appointmentId: id,
          results: testList.map((test) => {
            const existing = existingMap[test.testName];
            return {
              testId: test.testId,
              resultValue: existing?.resultValue || "",
              unit: existing?.unit || "",
              referenceRange: existing?.referenceRange || "",
              remarks: existing?.remarks || "",
            };
          }),
        });
      } catch (err) {
        console.error("Error loading appointment:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAppointment();
    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (index, field, value) => {
    setForm((current) => {
      const updated = [...current.results];
      updated[index] = { ...updated[index], [field]: value };
      return { ...current, results: updated };
    });
  };

  const handleSubmit = async () => {
    const validResults = form.results.filter(
      (result) => result.resultValue && result.resultValue.trim() !== ""
    );

    if (validResults.length === 0) {
      alert("Please enter at least one test result");
      return;
    }

    const payload = {
      appointmentId: form.appointmentId,
      results: validResults,
    };

    try {
      setSaving(true);
      const res = await saveTestResult(payload);
      alert(res.data.message);
      navigate("/test-result");
    } catch (err) {
      console.error("Error saving test result:", err);
      alert(err.response?.data?.message || "Failed to save test result ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="atr-state">
        <div className="atr-spinner" />
        <span>Loading appointment details...</span>
      </div>
    );
  }

  if (!canAdd) {
    return (
      <div className="atr-state">
        <div className="atr-state-icon">!</div>
        <h3>Access Denied</h3>
        <p>You do not have permission to add test results.</p>
        <button className="atr-btn atr-btn-secondary" onClick={() => navigate("/test-result")}>
          Back to Test Results
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="atr-state">
        <div className="atr-state-icon">!</div>
        <h3>Appointment details unavailable</h3>
        <p>Unable to load this appointment. Please try again.</p>
        <button className="atr-btn atr-btn-secondary" onClick={() => navigate("/test-result")}>
          Back to Test Results
        </button>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="atr-state">
        <div className="atr-state-icon">i</div>
        <h3>No tests found</h3>
        <p>No tests are associated with this appointment.</p>
        <button className="atr-btn atr-btn-secondary" onClick={() => navigate("/test-result")}>
          Back to Test Results
        </button>
      </div>
    );
  }

  return (
    <div className="atr-page">
      <style>{`
        .atr-page {
          width: 100%;
          padding: 18px 20px 28px;
          color: #18243a;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .atr-card {
          width: 100%;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e7edf3;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(20, 43, 67, .07);
        }
        .atr-header {
          min-height: 76px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .atr-heading { display: flex; align-items: center; gap: 13px; min-width: 0; }
        .atr-heading-icon {
          width: 42px; height: 42px; flex: 0 0 42px;
          display: grid; place-items: center; border-radius: 11px;
          background: rgba(255,255,255,.13); color: #fff;
        }
        .atr-heading-icon svg { width: 23px; height: 23px; }
        .atr-title { margin: 0; font-size: 19px; line-height: 1.3; font-weight: 700; }
        .atr-subtitle { margin: 4px 0 0; color: #c3d5e5; font-size: 12px; }
        .atr-header-id {
          color: #d8e6f2; font-size: 12px; white-space: nowrap;
          padding: 7px 11px; border: 1px solid rgba(255,255,255,.2);
          border-radius: 7px; background: rgba(255,255,255,.07);
        }
        .atr-body { padding: 22px 24px 24px; }
        .atr-patient {
          display: flex; align-items: center; gap: 14px;
          padding: 15px 17px; margin-bottom: 22px;
          border: 1px solid #e6edf4; border-radius: 10px;
          background: #f7f9fc;
        }
        .atr-patient-icon {
          width: 40px; height: 40px; flex: 0 0 40px;
          display: grid; place-items: center; border-radius: 10px;
          color: #0e4773; background: #e7f0f8;
        }
        .atr-patient-label { margin: 0 0 3px; color: #77869a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .55px; }
        .atr-patient-name { margin: 0; color: #18243a; font-size: 14px; font-weight: 700; }
        .atr-section-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin: 0 0 12px;
        }
        .atr-section-title { margin: 0; font-size: 14px; font-weight: 700; color: #23344b; }
        .atr-count {
          padding: 4px 9px; border-radius: 20px; color: #315c80;
          background: #edf4fa; font-size: 11px; font-weight: 700;
        }
        .atr-table-wrap { width: 100%; overflow-x: auto; border: 1px solid #e5ebf1; border-radius: 9px; }
        .atr-table { width: 100%; min-width: 850px; margin: 0; border-collapse: separate; border-spacing: 0; }
        .atr-table thead th {
          padding: 13px 14px; color: #617187; background: #f3f6f9;
          border-bottom: 1px solid #e4eaf0; font-size: 10.5px;
          font-weight: 700; letter-spacing: .55px; text-transform: uppercase;
          white-space: nowrap;
        }
        .atr-table tbody td {
          padding: 12px 14px; color: #34445a; font-size: 12.5px;
          vertical-align: middle; border-bottom: 1px solid #edf1f5;
        }
        .atr-table tbody tr:last-child td { border-bottom: 0; }
        .atr-table tbody tr:hover { background: #fbfcfe; }
        .atr-test-name { min-width: 180px; color: #1d3550 !important; font-weight: 700; }
        .atr-test-number {
          display: inline-grid; place-items: center; width: 25px; height: 25px;
          margin-right: 9px; border-radius: 7px; color: #315d80;
          background: #edf4f9; font-size: 11px; font-weight: 700;
        }
        .atr-input {
          width: 100%; min-width: 125px; height: 39px; padding: 8px 10px;
          color: #26364a; background: #fff; border: 1px solid #dce4ec;
          border-radius: 7px; outline: none; font-family: inherit; font-size: 12.5px;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .atr-input:focus { border-color: #3979a8; box-shadow: 0 0 0 3px rgba(57,121,168,.12); }
        .atr-input::placeholder { color: #a4afbb; }
        .atr-footer {
          display: flex; justify-content: space-between; align-items: center;
          gap: 14px; margin-top: 20px; padding-top: 18px;
          border-top: 1px solid #edf1f5;
        }
        .atr-hint { margin: 0; color: #7b8999; font-size: 11.5px; }
        .atr-actions { display: flex; align-items: center; gap: 9px; }
        .atr-btn {
          min-height: 39px; padding: 9px 16px; border: 1px solid transparent;
          border-radius: 7px; font-family: inherit; font-size: 12.5px;
          font-weight: 700; cursor: pointer; transition: .15s ease;
        }
        .atr-btn-primary { color: #fff; background: #0e3d66; border-color: #0e3d66; }
        .atr-btn-primary:hover { background: #092d4c; border-color: #092d4c; }
        .atr-btn-primary:disabled { opacity: .65; cursor: not-allowed; }
        .atr-btn-secondary { color: #46566b; background: #fff; border-color: #d9e1e9; }
        .atr-btn-secondary:hover { background: #f4f7fa; }
        .atr-state {
          min-height: 320px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          padding: 30px; color: #64748b; text-align: center;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .atr-state h3 { margin: 4px 0 0; color: #20334a; font-size: 17px; font-weight: 700; }
        .atr-state p { margin: 0 0 8px; font-size: 13px; }
        .atr-state-icon {
          width: 42px; height: 42px; display: grid; place-items: center;
          border-radius: 50%; color: #315d80; background: #edf4f9;
          font-size: 20px; font-weight: 700;
        }
        .atr-spinner {
          width: 30px; height: 30px; border: 3px solid #e2eaf1;
          border-top-color: #0e3d66; border-radius: 50%;
          animation: atr-spin .8s linear infinite;
        }
        @keyframes atr-spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .atr-page { padding: 12px 10px 22px; }
          .atr-header { padding: 15px; align-items: flex-start; }
          .atr-title { font-size: 17px; }
          .atr-header-id { display: none; }
          .atr-body { padding: 16px 13px 18px; }
          .atr-footer { align-items: flex-start; flex-direction: column; }
          .atr-actions { width: 100%; }
          .atr-actions .atr-btn { flex: 1; }
        }
      `}</style>

      <div className="atr-card">
        <div className="atr-header">
          <div className="atr-heading">
            <div className="atr-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3h8l3 3v15H5V3h3Z" />
                <path d="M8 3v5h8V3M8 13h8M8 17h5" />
                <path d="m15 10 1.5 1.5L19 9" />
              </svg>
            </div>
            <div>
              <h1 className="atr-title">Add Test Result</h1>
              <p className="atr-subtitle">Enter and save diagnostic results for this appointment</p>
            </div>
          </div>
          <div className="atr-header-id">Appointment ID: {id || "-"}</div>
        </div>

        <div className="atr-body">
          <div className="atr-patient">
            <div className="atr-patient-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20c.7-3.7 3.3-5.5 7.5-5.5s6.8 1.8 7.5 5.5" />
              </svg>
            </div>
            <div>
              <p className="atr-patient-label">Patient</p>
              <p className="atr-patient-name">{patient.patientName || "-"}</p>
            </div>
          </div>

          <div className="atr-section-head">
            <h2 className="atr-section-title">Test results</h2>
            <span className="atr-count">{tests.length} {tests.length === 1 ? "Test" : "Tests"}</span>
          </div>

          <div className="atr-table-wrap">
            <table className="atr-table">
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
                {form.results.map((result, index) => (
                  <tr key={result.testId ?? index}>
                    <td className="atr-test-name">
                      <span className="atr-test-number">{index + 1}</span>
                      {tests[index]?.testName || "-"}
                    </td>
                    <td>
                      <input
                        className="atr-input"
                        aria-label={`${tests[index]?.testName || "Test"} result`}
                        placeholder="Enter result"
                        value={result.resultValue ?? ""}
                        onChange={(e) => handleChange(index, "resultValue", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="atr-input"
                        aria-label={`${tests[index]?.testName || "Test"} unit`}
                        placeholder="e.g. mg/dL"
                        value={result.unit ?? ""}
                        onChange={(e) => handleChange(index, "unit", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="atr-input"
                        aria-label={`${tests[index]?.testName || "Test"} reference range`}
                        placeholder="Enter range"
                        value={result.referenceRange ?? ""}
                        onChange={(e) => handleChange(index, "referenceRange", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="atr-input"
                        aria-label={`${tests[index]?.testName || "Test"} remarks`}
                        placeholder="Optional remarks"
                        value={result.remarks ?? ""}
                        onChange={(e) => handleChange(index, "remarks", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="atr-footer">
            <p className="atr-hint">Only tests with a result value will be included when you save.</p>
            <div className="atr-actions">
              <button
                type="button"
                className="atr-btn atr-btn-secondary"
                onClick={() => navigate("/test-result")}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="atr-btn atr-btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Result"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestResult;

// // import React, { useEffect, useState } from "react";
// // import "../../styles/addPatient.css";
// // import { useParams, useNavigate } from "react-router-dom";

// // import { saveTestResult } from "../../services/testResultService";
// // import { getAppointmentById } from "../../services/appointmentService";


// // const AddTestResult = () => {
// //   const { id } = useParams(); // appointmentId
// //   const navigate = useNavigate();

// //   const [patient, setPatient] = useState(null);
// //   const [tests, setTests] = useState([]);

// //   const [form, setForm] = useState({
// //     appointmentId: id,
// //     results: [],
// //   });
// //   const loadAppointment = async () => {
// //     try {
// //       const res = await getAppointmentById(id);
// //       const data = res.data.data;
// //       console.log(res.data.data);

// //       setPatient(data);
// //       console.log(res.data.data);

// //       // 🔥 Tests from patient (IMPORTANT)
// //       const testList = Array.isArray(data.tests) ? data.tests : [];
// //       setTests(testList);

// //       // initialize results
// //       setForm({
// //         appointmentId: id,
// //         results: testList.map((t) => ({
// //           testId: t.testId,
// //           resultValue: "",
// //           unit: "",
// //           referenceRange: "",
// //           remarks: "",
// //         })),
// //       });

// //     } catch (err) {
// //       console.error("Error loading appointment:", err);
// //     }
// //   };

// //   // 🔥 Load Appointment + Tests
// //   useEffect(() => {
// //     loadAppointment();
// //   }, []);

  

// //   // 🔥 Handle input change
// //   const handleChange = (index, field, value) => {
// //     const updated = [...form.results];
// //     updated[index][field] = value;

// //     setForm({ ...form, results: updated });
// //   };

// //   // 🔥 Submit
// //   const handleSubmit = async () => {
// //     try {
// //       await saveTestResult(form);
// //       alert("Test Result Saved Successfully");

// //       navigate("/test-result");
// //     } catch (err) {
// //       console.error("Error saving result:", err);
// //       alert("Error saving test result");
// //     }
// //   };
  

// //   return (
    
// //     <div className="container-fluid mt-3">
// //       <div className="card">

// //         {/* HEADER */}
// //         <div className="card-header add-header">
// //           Add Test Result
// //         </div>

// //         <div className="card-body">

// //           {/* Patient Info */}
// //           <div className="mb-3">
// //             <b>Patient:</b> {patient?.patientName || "-"}
// //           </div>

// //           {/* No Tests */}
// //           {tests.length === 0 && (
// //             <div className="text-danger mb-3">
// //               No tests found for this appointment
// //             </div>
// //           )}

// //           {/* TABLE */}
// //           {tests.length > 0 && (
// //             <div className="table-responsive">
// //               <table className="table table-bordered">
// //                 <thead>
// //                   <tr>
// //                     <th>Test Name</th>
// //                     <th>Result</th>
// //                     <th>Unit</th>
// //                     <th>Reference Range</th>
// //                     <th>Remarks</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //   {form.results.map((r, index) => (
// //     <tr key={index}>

// //       <td>{tests[index]?.testName}</td>

// //       <td>
// //         <input
// //           className="form-control"
// //           value={r.resultValue ?? ""}
// //           onChange={(e) =>
// //             handleChange(index, "resultValue", e.target.value)
// //           }
// //         />
// //       </td>

// //       <td>
// //         <input
// //           className="form-control"
// //           value={r.unit ?? ""}
// //           onChange={(e) =>
// //             handleChange(index, "unit", e.target.value)
// //           }
// //         />
// //       </td>

// //       <td>
// //         <input
// //           className="form-control"
// //           value={r.referenceRange ?? ""}
// //           onChange={(e) =>
// //             handleChange(index, "referenceRange", e.target.value)
// //           }
// //         />
// //       </td>

// //       <td>
// //         <input
// //           className="form-control"
// //           value={r.remarks ?? ""}
// //           onChange={(e) =>
// //             handleChange(index, "remarks", e.target.value)
// //           }
// //         />
// //       </td>

// //     </tr>
// //   ))}
// // </tbody>
// //               </table>
// //             </div>
// //           )}

// //           {/* BUTTONS */}
// //           <div className="mt-3">
// //             <button className="btn btn-primary" onClick={handleSubmit}>
// //               Save Result
// //             </button>

// //             <button
// //               className="btn btn-danger ms-2"
// //               onClick={() => navigate("/test-result")}
// //             >
// //               Cancel
// //             </button>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddTestResult;

// import React, { useEffect, useState } from "react";
// import "../../styles/addPatient.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { saveTestResult } from "../../services/testResultService";
// import { getAppointmentById } from "../../services/appointmentService";
// import { getTestResult } from "../../services/testResultService";
// import { hasPermission } from "../permissionUtil";

// const AddTestResult = () => {

//   const canAdd = hasPermission("Test Result", "ADD");
//   const { id } = useParams(); // appointmentId
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
  
//   const [tests, setTests] = useState([]);
//   const [form, setForm] = useState({
//     appointmentId: id,
//     results: [],
//   });

//   // 🔥 Load Appointment + Tests
//   useEffect(() => {
//     if (id) {
//       loadAppointment();
//     }
//   }, [id]);

//   const loadAppointment = async () => {
//     try {
//       const res = await getAppointmentById(id);
//       const data = res.data.data;

//       // 🔍 DEBUG LOGS
//       console.log("🔥 API RESPONSE:", res);
//       console.log("🔥 DATA:", data);
//       console.log("🔥 TESTS:", data.tests);

//       setPatient(data);
//       const resultRes = await getTestResult(id).catch(() => null);

// let existingMap = {};

// if (resultRes?.data?.data?.results) {
//   resultRes.data.data.results.forEach(r => {
//     existingMap[r.testName] = r;
//   });
// }

//       const testList = Array.isArray(data.tests) ? data.tests : [];
//       setTests(testList);

//       // initialize form safely
//     //   setForm({
//     //     appointmentId: id,
//     //     results: testList.map((t) => ({
//     //       testId: t.testId,
//     //       resultValue: "",
//     //       unit: "",
//     //       referenceRange: "",
//     //       remarks: "",
//     //     })),
//     //   });

//     // }
//     setForm({
//   appointmentId: id,
//   results: testList.map((t) => {
//     const existing = existingMap[t.testName];

//     return {
//       testId: t.testId,
//       resultValue: existing?.resultValue || "",
//       unit: existing?.unit || "",
//       referenceRange: existing?.referenceRange || "",
//       remarks: existing?.remarks || "",
//     };
//   }),
// });}
//      catch (err) {
//       console.error("❌ Error loading appointment:", err);
//     }
//   };

//   // 🔥 Handle input change
//   const handleChange = (index, field, value) => {
//     const updated = [...form.results];
//     updated[index][field] = value;

//     setForm({ ...form, results: updated });
//   };

//   // 🔥 Submit
//   // const handleSubmit = async () => {
//   //   try {
//   //     console.log("📤 SUBMIT DATA:", form);

//   //     await saveTestResult(form);
//   //     alert("Test Result Saved Successfully");

//   //     navigate("/test-result");
//   //   } catch (err) {
//   //     console.error("❌ Error saving result:", err);
//   //     alert("Error saving test result");
//   //   }
//   // };


// //   const handleSubmit = async () => {
// //   try {
// //     // 🔥 FILTER EMPTY RESULTS
// //     const validResults = form.results.filter(
// //       (r) => r.resultValue && r.resultValue.trim() !== ""
// //     );

// //     // ❗ अगर कुछ भी filled नहीं है
// //     if (validResults.length === 0) {
// //       alert("Please enter at least one test result");
// //       return;
// //     }

// //     const payload = {
// //       appointmentId: form.appointmentId,
// //       results: validResults,
// //     };

// //     console.log("📤 FINAL PAYLOAD:", payload);

// //     await saveTestResult(payload);

// //     alert("Test Result Saved Successfully");
// //     navigate("/test-result");

// //   } catch (err) {
// //     console.error("❌ Error saving result:", err);
// //     alert("Error saving test result");
// //   }
// // };

// const handleSubmit = async () => {
//   try {
//     const validResults = form.results.filter(
//       (r) => r.resultValue && r.resultValue.trim() !== ""
//     );

//     if (validResults.length === 0) {
//       alert("Please enter at least one test result");
//       return;
//     }

//     const payload = {
//       appointmentId: form.appointmentId,
//       results: validResults,
//     };

//     console.log("📤 FINAL PAYLOAD:", payload);

//     const res = await saveTestResult(payload);

//     // ✅ Backend message use
//     alert(res.data.message); // "Test result saved"

//     navigate("/test-result");

//   } catch (err) {
//     console.error(err);

//     alert(
//       err.response?.data?.message ||
//       "Failed to save test result ❌"
//     );
//   }
// };

//   // 🔥 DEBUG STATE
//   console.log("🧠 FINAL STATE:", {
//     patient,
//     tests,
//     form,
//   });

//   // ⏳ Loading state
//   if (!patient) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   // ❗ No tests fallback
//   if (tests.length === 0) {
//     return (
//       <div className="text-center mt-5 text-danger">
//         No tests found for this appointment
//       </div>
//     );
//   }
//   if (!canAdd) {
//   return <h3>Access Denied ❌</h3>;
// }

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
//             <b>Patient:</b> {patient.patientName || "-"}
//           </div>

//           {/* TABLE */}
//           {tests.length > 0 && form.results.length > 0 && (
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
//                   {form.results.map((r, index) => (
//                     <tr key={index}>

//                       {/* Test Name */}
//                       <td>{tests[index]?.testName}</td>

//                       {/* Result */}
//                       <td>
//                         <input
//                           className="form-control"
//                           value={r.resultValue ?? ""}
//                           onChange={(e) =>
//                             handleChange(index, "resultValue", e.target.value)
//                           }
//                         />
//                       </td>

//                       {/* Unit */}
//                       <td>
//                         <input
//                           className="form-control"
//                           value={r.unit ?? ""}
//                           onChange={(e) =>
//                             handleChange(index, "unit", e.target.value)
//                           }
//                         />
//                       </td>

//                       {/* Reference Range */}
//                       <td>
//                         <input
//                           className="form-control"
//                           value={r.referenceRange ?? ""}
//                           onChange={(e) =>
//                             handleChange(index, "referenceRange", e.target.value)
//                           }
//                         />
//                       </td>

//                       {/* Remarks */}
//                       <td>
//                         <input
//                           className="form-control"
//                           value={r.remarks ?? ""}
//                           onChange={(e) =>
//                             handleChange(index, "remarks", e.target.value)
//                           }
//                         />
//                       </td>

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* BUTTONS */}
//           <div className="mt-3">
//             {/* <button className="btn btn-primary" onClick={handleSubmit}>
//               Save Result
//             </button> */}
//             {hasPermission("Test Result", "ADD") && (
//   <button className="btn btn-primary" onClick={handleSubmit}>
//     Save Result
//   </button>
// )}

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

