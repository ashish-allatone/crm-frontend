import React, { useState, useEffect } from "react";
import { createTest } from "../../../services/testService";
import { getOrganizationsAll } from "../../../services/organizationService";
import { getCurrentUser } from "../../../services/userService";
import { useNavigate } from "react-router-dom";

const AddTest = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const [form, setForm] = useState({
    organization: "All",
    testName: "",
    shortName: "",
    testCode: "",
    profileTest: "No",
    testType: "Pathology",
    sampleType: "Not Required",
    testCategory: "Normal",
    description: "",
  });

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const res = await getOrganizationsAll();
        setOrganizations(res.data.data || []);
      } catch (error) {
        console.error("Error loading organizations:", error);
      }
    };

    loadOrgs();
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        const user = res.data.data;

        setCurrentUser(user);

        const admin = user.roles?.some(
          (r) => r.name.toLowerCase() === "admin"
        );

        setIsAdmin(admin);

        if (!admin && user.organization) {
          setForm((prev) => ({
            ...prev,
            organization: user.organization.id.toString(),
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadCurrentUser();
  }, []);

  const payload = {
    organizationId: form.organization ? Number(form.organization) : null,
    testName: form.testName,
    shortName: form.shortName,
    testCode: form.testCode,
    profileTest: form.profileTest === "Yes",
    testType: form.testType,
    sampleType: form.sampleType,
    testCategory: form.testCategory,
    description: form.description,
  };

  const handleSubmit = async () => {
    try {
      const res = await createTest(payload);
      alert(res.data.message);
      navigate("/test-master");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong ❌");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .at-page {
      padding: 22px 20px;
      color: #18243a;
      font-family: 'Inter', sans-serif;
    }
    .at-card {
      overflow: hidden;
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, .06);
    }
    .at-header {
      display: flex;
      align-items: center;
      gap: 13px;
      min-height: 78px;
      padding: 18px 24px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .at-header-icon {
      display: grid;
      width: 43px;
      height: 43px;
      flex: 0 0 43px;
      place-items: center;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .at-header-icon svg { width: 22px; height: 22px; }
    .at-title { margin: 0; font-size: 19px; font-weight: 700; }
    .at-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .at-body { padding: 25px 26px 23px; }
    .at-section-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 19px;
      color: #263e5b;
      font-size: 14px;
      font-weight: 700;
    }
    .at-section-heading svg { width: 17px; height: 17px; color: #607b99; }
    .at-form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 22px;
      row-gap: 19px;
    }
    .at-field { min-width: 0; }
    .at-field-full { grid-column: 1 / -1; }
    .at-label {
      display: block;
      margin: 0 0 7px;
      color: #40536c;
      font-size: 12px;
      font-weight: 600;
    }
    .at-control {
      display: block;
      width: 100%;
      min-height: 42px;
      padding: 9px 12px;
      border: 1px solid #dce3ec;
      border-radius: 8px;
      background-color: #fff;
      color: #26374d;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color .2s ease, box-shadow .2s ease;
    }
    .at-control::placeholder { color: #a0aaba; }
    .at-control:focus {
      border-color: #52769d;
      box-shadow: 0 0 0 3px rgba(58, 94, 132, .11);
    }
    .at-control:disabled {
      color: #61738a;
      background: #f3f6f9;
      cursor: not-allowed;
    }
    .at-select {
      appearance: none;
      padding-right: 36px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2367798e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
    .at-textarea { min-height: 105px; resize: vertical; }
    .at-help {
      margin: 6px 0 0;
      color: #8794a5;
      font-size: 11px;
    }
    .at-divider { margin: 24px 0 19px; border: 0; border-top: 1px solid #e9edf2; }
    .at-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .at-actions-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .at-btn {
      display: inline-flex;
      min-height: 39px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid transparent;
      border-radius: 8px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: .2s ease;
    }
    .at-btn svg { width: 15px; height: 15px; }
    .at-btn-primary { color: #fff; background: #1d3c60; border-color: #1d3c60; }
    .at-btn-primary:hover { background: #142e4d; border-color: #142e4d; transform: translateY(-1px); }
    .at-btn-secondary { color: #43566e; background: #f4f6f9; border-color: #dfe5ec; }
    .at-btn-secondary:hover { background: #e9eef4; border-color: #cbd6e2; }
    .at-required-note { color: #8a97a8; font-size: 11px; }
    @media (max-width: 700px) {
      .at-page { padding: 12px 8px; }
      .at-body { padding: 19px 15px; }
      .at-form-grid { grid-template-columns: 1fr; row-gap: 16px; }
      .at-field-full { grid-column: auto; }
      .at-header { padding: 15px; }
      .at-title { font-size: 17px; }
      .at-actions { align-items: flex-start; flex-direction: column; }
      .at-actions-left { width: 100%; }
      .at-btn { flex: 1; }
    }
  `;

  return (
    <div className="at-page container-fluid">
      <style>{styles}</style>

      <div className="at-card">
        <div className="at-header">
          <div className="at-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M9 8h6M9 12h6M9 16h3" />
              <path d="M17 15v5M14.5 17.5h5" />
            </svg>
          </div>
          <div>
            <h5 className="at-title">Add New Test</h5>
            <p className="at-subtitle">Create and configure a diagnostic test</p>
          </div>
        </div>

        <div className="at-body">
          <h6 className="at-section-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16M4 12h16M4 19h16" />
              <circle cx="8" cy="5" r="1.5" fill="currentColor" />
              <circle cx="15" cy="12" r="1.5" fill="currentColor" />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
            </svg>
            Test Information
          </h6>

          <div className="at-form-grid">
            <div className="at-field">
              <label className="at-label" htmlFor="at-organization">Test For Organization</label>
              <select
                id="at-organization"
                className="at-control at-select"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                disabled={!isAdmin}
              >
                {isAdmin ? (
                  <>
                    <option value="">Select Organization</option>
                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.organizationName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value={currentUser?.organization?.id}>
                    {currentUser?.organization?.organizationName}
                  </option>
                )}
              </select>
              {!isAdmin && (
                <p className="at-help">Organization is assigned according to your user account.</p>
              )}
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-test-name">Test Name</label>
              <input
                id="at-test-name"
                type="text"
                className="at-control"
                name="testName"
                placeholder="Enter test name"
                value={form.testName}
                onChange={handleChange}
              />
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-short-name">Short Name</label>
              <input
                id="at-short-name"
                type="text"
                className="at-control"
                name="shortName"
                placeholder="Enter short name"
                value={form.shortName}
                onChange={handleChange}
              />
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-test-code">Test Code</label>
              <input
                id="at-test-code"
                type="text"
                className="at-control"
                name="testCode"
                placeholder="Enter test code"
                value={form.testCode}
                onChange={handleChange}
              />
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-profile-test">Profile Test</label>
              <select
                id="at-profile-test"
                className="at-control at-select"
                name="profileTest"
                value={form.profileTest}
                onChange={handleChange}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-test-type">Test Type</label>
              <select
                id="at-test-type"
                className="at-control at-select"
                name="testType"
                value={form.testType}
                onChange={handleChange}
              >
                <option>Pathology</option>
                <option>Radiology</option>
                <option>File Report</option>
              </select>
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-sample-type">Sample Type</label>
              <select
                id="at-sample-type"
                className="at-control at-select"
                name="sampleType"
                value={form.sampleType}
                onChange={handleChange}
              >
                <option>Not Required</option>
                <option>Blood</option>
                <option>Urine</option>
              </select>
            </div>

            <div className="at-field">
              <label className="at-label" htmlFor="at-test-category">Test Category</label>
              <select
                id="at-test-category"
                className="at-control at-select"
                name="testCategory"
                value={form.testCategory}
                onChange={handleChange}
              >
                <option>Normal</option>
                <option>Immunology</option>
              </select>
            </div>

            <div className="at-field at-field-full">
              <label className="at-label" htmlFor="at-description">Test Description</label>
              <textarea
                id="at-description"
                className="at-control at-textarea"
                rows="3"
                name="description"
                placeholder="Enter test description..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="at-divider" />

          <div className="at-actions">
            <span className="at-required-note">Please review the test information before submitting.</span>
            <div className="at-actions-left">
              <button className="at-btn at-btn-secondary" onClick={() => navigate("/test-master")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6M9 12h11" />
                </svg>
                Go to Test List
              </button>
              <button className="at-btn at-btn-primary" onClick={handleSubmit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTest;

// import React, { useState ,useEffect} from "react";
// import "../../../styles/addPatient.css";
// import { createTest } from "../../../services/testService";
// import { getOrganizationsAll } from "../../../services/organizationService";
// import { getCurrentUser } from "../../../services/userService";

// import { useNavigate } from "react-router-dom";

// const AddTest = () => {
//   const navigate = useNavigate();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
  

//   const [organizations, setOrganizations] = useState([]);
//   useEffect(() => {
//   const loadOrgs = async () => {
//     const res = await getOrganizationsAll();
//     setOrganizations(res.data.data);
//   };
//   loadOrgs();
// }, []);

// useEffect(() => {
//   const loadCurrentUser = async () => {
//     try {
//       const res = await getCurrentUser();

//       const user = res.data.data;

//       setCurrentUser(user);

//       const admin = user.roles?.some(
//         (r) => r.name.toLowerCase() === "admin"
//       );

//       setIsAdmin(admin);

//       if (!admin && user.organization) {
//         setForm((prev) => ({
//           ...prev,
//           organization: user.organization.id.toString(),
//         }));
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadCurrentUser();
// }, []);

//   const [form, setForm] = useState({
//     organization: "All",
//     testName: "",
//     shortName: "",
//     testCode: "",
//     profileTest: "No",
//     testType: "Pathology",
//     sampleType: "Not Required",
//     testCategory: "Normal",
//     description: "",
//   });
//   const payload = {
//   organizationId: form.organization ? Number(form.organization) : null,
//   testName: form.testName,
//   shortName: form.shortName,
//   testCode: form.testCode,
//   profileTest: form.profileTest === "Yes",
//   testType: form.testType,
//   sampleType: form.sampleType,
//   testCategory: form.testCategory,
//   description: form.description,
// };
// const handleSubmit = async () => {
//   try {
//     const res = await createTest(payload);

//     // ✅ Backend se message show karo
//     alert(res.data.message);

//     navigate("/test-master");

//   } catch (error) {
//     console.error(error);

//     // ❌ Backend error message show karo
//     alert(error.response?.data?.message || "Something went wrong ❌");
//   }
// };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Add New Test</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label>Test For Organization</label>

//              {/* <select
//   className="form-control"
//   name="organization"
//   value={form.organization}
//   onChange={handleChange}
// >
//   <option value="">All</option>

//   {organizations.map((o) => (
//     <option key={o.id} value={o.id}>
//       {o.organizationName}
//     </option>
//   ))}
// </select> */}
// <select
//   className="form-control"
//   name="organization"
//   value={form.organization}
//   onChange={handleChange}
//   disabled={!isAdmin}
// >
//   {isAdmin ? (
//     <>
//       <option value="">Select Organization</option>

//       {organizations.map((o) => (
//         <option key={o.id} value={o.id}>
//           {o.organizationName}
//         </option>
//       ))}
//     </>
//   ) : (
//     <option value={currentUser?.organization?.id}>
//       {currentUser?.organization?.organizationName}
//     </option>
//   )}
// </select>
//             </div>

//             <div className="col-md-6">
//               <label>Test Name</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="testName"
//                 placeholder="Test Name"
//                 value={form.testName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Short Name</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="shortName"
//                 placeholder="Short Name"
//                 value={form.shortName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Test Code</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="testCode"
//                 placeholder="Test Code"
//                 value={form.testCode}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Profile Test</label>

//               <select
//                 className="form-control"
//                 name="profileTest"
//                 value={form.profileTest}
//                 onChange={handleChange}
//               >
//                 <option>No</option>
//                 <option>Yes</option>
//               </select>
//             </div>

//             <div className="col-md-6">
//               <label>Test Type</label>

//               <select
//                 className="form-control"
//                 name="testType"
//                 value={form.testType}
//                 onChange={handleChange}
//               >
//                 <option>Pathology</option>
//                 <option>Radiology</option>
//                 <option>File Report</option>
//               </select>
//             </div>

//             <div className="col-md-6">
//               <label>Sample Type</label>

//               <select
//                 className="form-control"
//                 name="sampleType"
//                 value={form.sampleType}
//                 onChange={handleChange}
//               >
//                 <option>Not Required</option>
//                 <option>Blood</option>
//                 <option>Urine</option>
//               </select>
//             </div>

//             <div className="col-md-6">
//               <label>Test Category</label>

//               <select
//                 className="form-control"
//                 name="testCategory"
//                 value={form.testCategory}
//                 onChange={handleChange}
//               >
//                 <option>Normal</option>
//                 <option>Immunology</option>
//               </select>
//             </div>

//             <div className="col-md-12">
//               <label>Test Description</label>

//               <textarea
//                 className="form-control"
//                 rows="3"
//                 name="description"
//                 placeholder="Test Description"
//                 value={form.description}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <hr />

//           <div className="mt-3">
//             <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
//   Submit
// </button>

//             <button
//               className="btn btn-secondary ms-3"
//               onClick={() => navigate("/test-master")}
//             >
//               Goto all Test List
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTest;
