import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestById, updateTest } from "../../../services/testService";
import { getOrganizationsAll } from "../../../services/organizationService";
import { getCurrentUser } from "../../../services/userService";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({});
  const [organizations, setOrganizations] = useState([]);

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
      } catch (err) {
        console.error(err);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const res = await getTestById(id);
        const data = res.data.data;

        setForm({
          organization: data.organizationId || "",
          testName: data.testName || "",
          shortName: data.shortName || "",
          testCode: data.testCode || "",
          profileTest: data.profileTest ? "Yes" : "No",
          testType: data.testType || "",
          sampleType: data.sampleType || "",
          testCategory: data.testCategory || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error loading test:", error);
        alert(error.response?.data?.message || "Failed to load test details");
      }
    };

    loadTest();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const payload = {
        organizationId: form.organization
          ? Number(form.organization)
          : null,
        testName: form.testName,
        shortName: form.shortName,
        testCode: form.testCode,
        profileTest: form.profileTest === "Yes",
        testType: form.testType,
        sampleType: form.sampleType,
        testCategory: form.testCategory,
        description: form.description,
      };

      const res = await updateTest(id, payload);
      alert(res.data.message);
      navigate("/test-master");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update test ❌");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .et-page {
      padding: 22px 20px;
      color: #18243a;
      font-family: 'Inter', sans-serif;
    }
    .et-card {
      overflow: hidden;
      background: #fff;
      border: 1px solid #e7ebf2;
      border-radius: 14px;
      box-shadow: 0 5px 22px rgba(22, 36, 58, .06);
    }
    .et-header {
      display: flex;
      align-items: center;
      gap: 13px;
      min-height: 78px;
      padding: 18px 24px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .et-header-icon {
      display: grid;
      width: 43px;
      height: 43px;
      flex: 0 0 43px;
      place-items: center;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 11px;
      background: rgba(255,255,255,.11);
    }
    .et-header-icon svg { width: 22px; height: 22px; }
    .et-title { margin: 0; font-size: 19px; font-weight: 700; }
    .et-subtitle { margin: 4px 0 0; color: #c4d2e3; font-size: 12px; }
    .et-body { padding: 25px 26px 23px; }
    .et-section-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 19px;
      color: #263e5b;
      font-size: 14px;
      font-weight: 700;
    }
    .et-section-heading svg { width: 17px; height: 17px; color: #607b99; }
    .et-form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 22px;
      row-gap: 19px;
    }
    .et-field { min-width: 0; }
    .et-field-full { grid-column: 1 / -1; }
    .et-label {
      display: block;
      margin: 0 0 7px;
      color: #40536c;
      font-size: 12px;
      font-weight: 600;
    }
    .et-control {
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
    .et-control:focus {
      border-color: #52769d;
      box-shadow: 0 0 0 3px rgba(58, 94, 132, .11);
    }
    .et-control:disabled {
      color: #61738a;
      background: #f3f6f9;
      cursor: not-allowed;
    }
    .et-control::placeholder { color: #a0aaba; }
    .et-select {
      appearance: none;
      padding-right: 36px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2367798e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
    .et-textarea { min-height: 105px; resize: vertical; }
    .et-help { margin: 6px 0 0; color: #8794a5; font-size: 11px; }
    .et-divider { margin: 24px 0 19px; border: 0; border-top: 1px solid #e9edf2; }
    .et-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .et-actions-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .et-btn {
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
    .et-btn svg { width: 15px; height: 15px; }
    .et-btn-primary { color: #fff; background: #1d3c60; border-color: #1d3c60; }
    .et-btn-primary:hover { background: #142e4d; border-color: #142e4d; transform: translateY(-1px); }
    .et-btn-secondary { color: #43566e; background: #f4f6f9; border-color: #dfe5ec; }
    .et-btn-secondary:hover { background: #e9eef4; border-color: #cbd6e2; }
    .et-required-note { color: #8a97a8; font-size: 11px; }
    @media (max-width: 700px) {
      .et-page { padding: 12px 8px; }
      .et-body { padding: 19px 15px; }
      .et-form-grid { grid-template-columns: 1fr; row-gap: 16px; }
      .et-field-full { grid-column: auto; }
      .et-header { padding: 15px; }
      .et-title { font-size: 17px; }
      .et-actions { align-items: flex-start; flex-direction: column; }
      .et-actions-left { width: 100%; }
      .et-btn { flex: 1; }
    }
  `;

  return (
    <div className="et-page container-fluid">
      <style>{styles}</style>

      <div className="et-card">
        <div className="et-header">
          <div className="et-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
            </svg>
          </div>
          <div>
            <h5 className="et-title">Edit Test</h5>
            <p className="et-subtitle">Update diagnostic test information</p>
          </div>
        </div>

        <div className="et-body">
          <h6 className="et-section-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16M4 12h16M4 19h16" />
              <circle cx="8" cy="5" r="1.5" fill="currentColor" />
              <circle cx="15" cy="12" r="1.5" fill="currentColor" />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
            </svg>
            Test Information
          </h6>

          <div className="et-form-grid">
            <div className="et-field">
              <label className="et-label" htmlFor="et-organization">Test For Organization</label>
              <select
                id="et-organization"
                className="et-control et-select"
                name="organization"
                value={form.organization || ""}
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
                <p className="et-help">Organization is assigned according to your user account.</p>
              )}
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-test-name">Test Name</label>
              <input
                id="et-test-name"
                type="text"
                className="et-control"
                name="testName"
                placeholder="Enter test name"
                value={form.testName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-short-name">Short Name</label>
              <input
                id="et-short-name"
                type="text"
                className="et-control"
                name="shortName"
                placeholder="Enter short name"
                value={form.shortName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-test-code">Test Code</label>
              <input
                id="et-test-code"
                type="text"
                className="et-control"
                name="testCode"
                placeholder="Enter test code"
                value={form.testCode || ""}
                onChange={handleChange}
              />
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-profile-test">Profile Test</label>
              <select
                id="et-profile-test"
                className="et-control et-select"
                name="profileTest"
                value={form.profileTest || ""}
                onChange={handleChange}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-test-type">Test Type</label>
              <select
                id="et-test-type"
                className="et-control et-select"
                name="testType"
                value={form.testType || ""}
                onChange={handleChange}
              >
                <option>Pathology</option>
                <option>Radiology</option>
              </select>
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-sample-type">Sample Type</label>
              <select
                id="et-sample-type"
                className="et-control et-select"
                name="sampleType"
                value={form.sampleType || ""}
                onChange={handleChange}
              >
                <option>Blood</option>
                <option>Not Required</option>
              </select>
            </div>

            <div className="et-field">
              <label className="et-label" htmlFor="et-test-category">Test Category</label>
              <select
                id="et-test-category"
                className="et-control et-select"
                name="testCategory"
                value={form.testCategory || ""}
                onChange={handleChange}
              >
                <option>Normal</option>
                <option>Immunology</option>
              </select>
            </div>

            <div className="et-field et-field-full">
              <label className="et-label" htmlFor="et-description">Test Description</label>
              <textarea
                id="et-description"
                className="et-control et-textarea"
                name="description"
                placeholder="Enter test description..."
                value={form.description || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="et-divider" />

          <div className="et-actions">
            <span className="et-required-note">Review the updated test information before saving.</span>
            <div className="et-actions-left">
              <button className="et-btn et-btn-secondary" onClick={() => navigate("/test-master")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6M9 12h11" />
                </svg>
                Go to Test List
              </button>
              <button className="et-btn et-btn-primary" onClick={handleSubmit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                Update Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTest;

// import React, { useState ,useEffect} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../../styles/addPatient.css";
// // import { tests } from "../../../data/tests";
// import { getTestById, updateTest } from "../../../services/testService";
// import { getOrganizationsAll } from "../../../services/organizationService";
// import { getCurrentUser } from "../../../services/userService";

// const EditTest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // const test = tests.find((t) => t.id === Number(id));

//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//  const [form, setForm] = useState({});
//  const [organizations, setOrganizations] = useState([]);
//    useEffect(() => {
//    const loadOrgs = async () => {
//      const res = await getOrganizationsAll();
//      setOrganizations(res.data.data);
//    };
//    loadOrgs();
//  }, []);

//  useEffect(() => {
//   const loadCurrentUser = async () => {
//     try {

//       const res = await getCurrentUser();

//       const user = res.data.data;

//       setCurrentUser(user);

//       const admin = user.roles?.some(
//         (r) => r.name.toLowerCase() === "admin"
//       );

//       setIsAdmin(admin);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadCurrentUser();

// }, []);

// useEffect(() => {
//   const loadTest = async () => {
//     const res = await getTestById(id);

//     const data = res.data.data;

//     setForm({
//       organization: data.organizationId || "",
//       testName: data.testName || "",
//       shortName: data.shortName || "",
//       testCode: data.testCode || "",
//       profileTest: data.profileTest ? "Yes" : "No",
//       testType: data.testType || "",
//       sampleType: data.sampleType || "",
//       testCategory: data.testCategory || "",
//       description: data.description || "",
//     });
//   };

//   loadTest();
// }, [id]);

// const handleSubmit = async () => {
//   try {
//     const payload = {
//       organizationId: form.organization
//         ? Number(form.organization)
//         : null,
//       testName: form.testName,
//       shortName: form.shortName,
//       testCode: form.testCode,
//       profileTest: form.profileTest === "Yes",
//       testType: form.testType,
//       sampleType: form.sampleType,
//       testCategory: form.testCategory,
//       description: form.description,
//     };

//     const res = await updateTest(id, payload);

//     // ✅ Backend message show
//     alert(res.data.message);

//     navigate("/test-master");

//   } catch (error) {
//     console.error(error);

//     // ❌ Backend error show
//     alert(error.response?.data?.message || "Failed to update test ❌");
//   }
// };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

  

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Edit Test</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label>Test For Organization</label>

//               {/* <select
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
//                 className="form-control"
//                 name="testName"
//                 value={form.testName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Short Name</label>

//               <input
//                 className="form-control"
//                 name="shortName"
//                 value={form.shortName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Test Code</label>

//               <input
//                 className="form-control"
//                 name="testCode"
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
//                 <option>Blood</option>
//                 <option>Not Required</option>
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
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <hr />

//           <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
//   Update
// </button>

//           <button
//             className="btn btn-secondary ms-3"
//             onClick={() => navigate("/test-master")}
//           >
//             Goto all Test List
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTest;
