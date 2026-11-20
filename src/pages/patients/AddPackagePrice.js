import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../../services/patientService";
import {
  getPackagePrices,
  savePackagePrices,
} from "../../services/packageService";
import { getCurrencies } from "../../services/currencyService";

const AddPackagePrice = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientRes = await getPatientById(id);
      const currencyRes = await getCurrencies(0, 100, "");

      setPatient(patientRes.data.data);
      setCurrencies(currencyRes.data.content);

      // Tests from patient
      const packageRes = await getPackagePrices(id);

      if (packageRes.data.data.length > 0) {
        setPackages(packageRes.data.data);
      } else {
        // Fallback for a new package-price entry
        const testList = patientRes.data.data.tests || [];

        setPackages(
          testList.map((t) => ({
            testId: t.testId,
            testName: t.testName,
            testType: t.testType,
            sampleType: t.sampleType,
            price: "",
            currencyId: "",
            conversionRate: 0,
            inrPrice: 0,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCurrencyChange = (index, currencyId) => {
    const updated = [...packages];
    const currency = currencies.find((c) => c.id === Number(currencyId));

    updated[index].currencyId = currencyId;
    updated[index].conversionRate = currency?.rateToInr || 0;

    // Recalculate INR
    updated[index].inrPrice =
      Number(updated[index].price) * updated[index].conversionRate;

    setPackages(updated);
  };

  const handlePriceChange = (index, value) => {
    const updated = [...packages];

    updated[index].price = value;
    updated[index].inrPrice =
      Number(value) * updated[index].conversionRate;

    setPackages(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = packages.map((p) => ({
        patientId: id,
        testId: p.testId,
        currencyId: p.currencyId,
        price: Number(p.price),
      }));

      const res = await savePackagePrices(payload);

      // Use backend message
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to save package price ❌"
      );
    }
  };

  if (!patient) {
    return (
      <div className="container-fluid mt-3">
        <style>{packagePriceStyles}</style>
        <div className="app-package-price-state">
          <div className="app-package-price-state-icon">⌛</div>
          <h5>Loading patient details...</h5>
          <p>Please wait while the patient and package information is loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3 app-package-price-page">
      <style>{packagePriceStyles}</style>

      <div className="app-package-price-card">
        <div className="app-package-price-header">
          <div className="app-package-price-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21M8 5.3l8 4.6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="app-package-price-heading">
            <h4>Add Package Price</h4>
            <p>Review patient information and configure test pricing</p>
          </div>
        </div>

        <div className="app-package-price-body">
          <section className="app-package-price-section">
            <div className="app-package-price-section-heading">
              <div>
                <h5>Patient Information</h5>
                <p>Patient details are displayed in read-only mode</p>
              </div>
              <span className="app-package-price-readonly">Read only</span>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="app-package-price-label">Patient Name</label>
                <input
                  className="form-control app-package-price-input"
                  value={`${patient.title || ""}${patient.title ? ". " : ""}${patient.patientName || ""}`}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label className="app-package-price-label">Gender</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.gender || ""}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label className="app-package-price-label">DOB</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.dob || ""}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label className="app-package-price-label">Age</label>
                <input
                  className="form-control app-package-price-input"
                  value={`${patient.age ?? ""} ${patient.ageType || ""}`.trim()}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label className="app-package-price-label">Mobile No.</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.mobileNumber || ""}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="app-package-price-label">Address</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.address || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">Country</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.country || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">State</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.state || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">City</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.city || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">Proposal Id</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.proposalId || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">Organization</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.organizationName || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="app-package-price-label">Insurance Company</label>
                <input
                  className="form-control app-package-price-input"
                  value={patient.insuranceName || ""}
                  readOnly
                />
              </div>
            </div>
          </section>

          <section className="app-package-price-section app-package-price-tests-section">
            <div className="app-package-price-section-heading">
              <div>
                <h5>Test List & Pricing</h5>
                <p>Enter the test price and select its currency to calculate INR</p>
              </div>
              <span className="app-package-price-count">
                {packages.length} {packages.length === 1 ? "Test" : "Tests"}
              </span>
            </div>

            <div className="app-package-price-table-wrap">
              <table className="table app-package-price-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Test Type</th>
                    <th>Sample Type</th>
                    <th>Price</th>
                    <th>Currency</th>
                    <th>Rate (INR)</th>
                    <th>INR Price</th>
                  </tr>
                </thead>

                <tbody>
                  {packages.length > 0 ? (
                    packages.map((p, index) => (
                      <tr key={index}>
                        <td className="app-package-price-test-name">
                          {p.testName || "—"}
                        </td>
                        <td>{p.testType || "—"}</td>
                        <td>{p.sampleType || "—"}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="form-control app-package-price-input app-package-price-number"
                            value={p.price ?? ""}
                            onChange={(e) =>
                              handlePriceChange(index, e.target.value)
                            }
                            placeholder="Enter price"
                          />
                        </td>
                        <td>
                          <select
                            className="form-select app-package-price-input"
                            value={p.currencyId ?? ""}
                            onChange={(e) =>
                              handleCurrencyChange(index, e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {currencies.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.currencyCode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="app-package-price-numeric">
                          {p.conversionRate ?? 0}
                        </td>
                        <td className="app-package-price-inr">
                          {p.inrPrice ?? 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="app-package-price-empty">
                        No tests are available for this patient.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="app-package-price-actions">
            <button
              type="button"
              className="btn app-package-price-save"
              onClick={handleSubmit}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h12l3 3v13H4V4h1Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 4v6h8V4M8 20v-7h8v7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Save
            </button>

            <button
              type="button"
              className="btn app-package-price-dashboard"
              onClick={() => navigate("/")}
            >
              Goto Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const packagePriceStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .app-package-price-page {
    color: #18243a;
    font-family: 'Inter', sans-serif;
    padding-bottom: 24px;
  }

  .app-package-price-card {
    width: 100%;
    overflow: hidden;
    background: #fff;
    border: 1px solid #e7edf4;
    border-radius: 14px;
    box-shadow: 0 5px 22px rgba(17, 39, 65, 0.07);
  }

  .app-package-price-header {
    min-height: 76px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    color: #fff;
    background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
  }

  .app-package-price-header-icon {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 11px;
    background: rgba(255,255,255,.11);
  }

  .app-package-price-header-icon svg {
    width: 23px;
    height: 23px;
  }

  .app-package-price-heading h4 {
    margin: 0;
    color: #fff;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -.2px;
  }

  .app-package-price-heading p {
    margin: 4px 0 0;
    color: #c5d6e6;
    font-size: 12px;
    font-weight: 400;
  }

  .app-package-price-body {
    padding: 24px;
  }

  .app-package-price-section {
    margin-bottom: 26px;
  }

  .app-package-price-section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 17px;
  }

  .app-package-price-section-heading h5 {
    margin: 0;
    color: #18243a;
    font-size: 15px;
    font-weight: 700;
  }

  .app-package-price-section-heading p {
    margin: 4px 0 0;
    color: #7b8798;
    font-size: 11px;
  }

  .app-package-price-readonly,
  .app-package-price-count {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    color: #49627c;
    background: #edf3f8;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
  }

  .app-package-price-label {
    display: block;
    margin-bottom: 7px;
    color: #46556a;
    font-size: 12px;
    font-weight: 600;
  }

  .app-package-price-input {
    min-height: 42px;
    border: 1px solid #dce4ed;
    border-radius: 8px;
    color: #26364b;
    background-color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    box-shadow: none;
  }

  .app-package-price-input:focus {
    border-color: #477ba5;
    box-shadow: 0 0 0 3px rgba(30, 91, 137, .10);
  }

  .app-package-price-input[readonly] {
    color: #58677a;
    background: #f7f9fb;
  }

  .app-package-price-tests-section {
    margin-top: 4px;
  }

  .app-package-price-table-wrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e3eaf1;
    border-radius: 10px;
  }

  .app-package-price-table {
    min-width: 850px;
    margin: 0;
    vertical-align: middle;
    font-family: 'Inter', sans-serif;
  }

  .app-package-price-table thead th {
    padding: 13px 12px;
    border-bottom: 1px solid #dfe7ef;
    color: #53657a;
    background: #f3f6f9;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .55px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .app-package-price-table tbody td {
    padding: 11px 12px;
    border-color: #edf1f5;
    color: #46556a;
    font-size: 12px;
  }

  .app-package-price-table tbody tr:hover {
    background: #f9fbfd;
  }

  .app-package-price-test-name {
    min-width: 155px;
    color: #1d3550 !important;
    font-weight: 600;
  }

  .app-package-price-number {
    min-width: 125px;
  }

  .app-package-price-numeric {
    color: #53657a !important;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .app-package-price-inr {
    color: #0e684b !important;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .app-package-price-empty {
    padding: 28px !important;
    color: #7b8798 !important;
    text-align: center;
  }

  .app-package-price-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 2px;
  }

  .app-package-price-actions .btn {
    min-height: 40px;
    padding: 9px 17px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  .app-package-price-save {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    border: 1px solid #0d3a60;
    background: #0d3a60;
  }

  .app-package-price-save:hover {
    color: #fff;
    border-color: #092b48;
    background: #092b48;
  }

  .app-package-price-save svg {
    width: 15px;
    height: 15px;
  }

  .app-package-price-dashboard {
    color: #fff;
    border: 1px solid #657386;
    background: #657386;
  }

  .app-package-price-dashboard:hover {
    color: #fff;
    border-color: #4d5c6e;
    background: #4d5c6e;
  }

  .app-package-price-state {
    padding: 48px 20px;
    border: 1px solid #e7edf4;
    border-radius: 14px;
    background: #fff;
    color: #53657a;
    text-align: center;
    font-family: 'Inter', sans-serif;
  }

  .app-package-price-state-icon {
    margin-bottom: 12px;
    font-size: 28px;
  }

  .app-package-price-state h5 {
    margin: 0 0 6px;
    color: #18243a;
    font-size: 15px;
    font-weight: 700;
  }

  .app-package-price-state p {
    margin: 0;
    font-size: 12px;
  }

  @media (max-width: 767.98px) {
    .app-package-price-body {
      padding: 17px 14px;
    }

    .app-package-price-header {
      padding: 15px 17px;
    }

    .app-package-price-heading h4 {
      font-size: 17px;
    }

    .app-package-price-section-heading {
      align-items: flex-start;
    }
  }
`;

export default AddPackagePrice;

// import React, { useState, useEffect } from "react";
// import "../../styles/allPatients.css";
// import { useParams, useNavigate } from "react-router-dom";

// import { getPatientById } from "../../services/patientService";
// import {
//   getPackagePrices,
//   savePackagePrices,
// } from "../../services/packageService";
// import { getCurrencies } from "../../services/currencyService";

// const AddPackagePrice = () => {
//   const { id } = useParams();

//   const [patient, setPatient] = useState(null);
//   const [packages, setPackages] = useState([]);
//   const [currencies, setCurrencies] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const patientRes = await getPatientById(id);
//       const currencyRes = await getCurrencies(0, 100, "");

//       setPatient(patientRes.data.data);
//       setCurrencies(currencyRes.data.content);

//       // 🔥 tests from patient
//       const packageRes = await getPackagePrices(id);

// if (packageRes.data.data.length > 0) {
//   setPackages(packageRes.data.data);
// } else {
//   // fallback (new)
//   const testList = patientRes.data.data.tests || [];

//   setPackages(
//     testList.map((t) => ({
//   testId: t.testId,
//   testName: t.testName,
//   testType: t.testType,      // ✅ ADD
//   sampleType: t.sampleType,  // ✅ ADD
//   price: "",
//   currencyId: "",
//   conversionRate: 0,
//   inrPrice: 0,
// }))
//   );
// }
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const handleCurrencyChange = (index, currencyId) => {
//     const updated = [...packages];

//     const currency = currencies.find((c) => c.id === Number(currencyId));

//     updated[index].currencyId = currencyId;
//     updated[index].conversionRate = currency?.rateToInr || 0;

//     // recalc INR
//     updated[index].inrPrice =
//   Number(updated[index].price) * updated[index].conversionRate;

//     setPackages(updated);
//   };
//   const handlePriceChange = (index, value) => {
//     const updated = [...packages];

//     updated[index].price = value;

//     updated[index].inrPrice =
//   Number(value) * updated[index].conversionRate;

//     setPackages(updated);
//   };
//   // const handleSubmit = async () => {
//   //   try {
//   //     const payload = packages.map((p) => ({
//   //       patientId: id,
//   //       testId: p.testId,
//   //       currencyId: p.currencyId,
//   //       price: Number(p.price),
//   //     }));

//   //     await savePackagePrices(payload);

//   //     alert("Saved Successfully");
//   //     navigate("/");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Error saving");
//   //   }
//   // };
//   const handleSubmit = async () => {
//   try {
//     const payload = packages.map((p) => ({
//       patientId: id,
//       testId: p.testId,
//       currencyId: p.currencyId,
//       price: Number(p.price),
//     }));

//     const res = await savePackagePrices(payload);

//     // ✅ Backend message use
//     alert(res.data.message);

//     navigate("/");

//   } catch (err) {
//     console.error(err);

//     alert(
//       err.response?.data?.message ||
//       "Failed to save package price ❌"
//     );
//   }
// };

//   if (!patient) return <div>Patient not found</div>;

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div
//           className="card-header"
//           style={{
//             background: "linear-gradient(90deg,#6a5acd,#7b68ee)",
//             color: "white",
//           }}
//         >
//           <h5>Add Package Price</h5>
//         </div>

//         <div className="card-body">
//           {/* Patient Info */}

//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label>Patient Name</label>
//               <input
//                 className="form-control"
//                 value={`${patient.title}. ${patient.patientName}`}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Gender</label>
//               <input className="form-control" value={patient.gender} readOnly />
//             </div>

//             <div className="col-md-2">
//               <label>DOB</label>
//               <input className="form-control" value={patient.dob} readOnly />
//             </div>

//             <div className="col-md-2">
//               <label>Age</label>
//               <input
//                 className="form-control"
//                 value={`${patient.age} ${patient.ageType}`}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Mobile No.</label>
//               <input className="form-control" value={patient.mobileNumber} readOnly />
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-6">
//               <label>Address</label>
//               <input
//                 className="form-control"
//                 value={patient.address}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Country</label>
//               <input
//                 className="form-control"
//                 value={patient.country}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label>State</label>
//               <input className="form-control" value={patient.state} readOnly />
//             </div>
//           </div>

//           <div className="row mb-4">
//             <div className="col-md-3">
//               <label>City</label>
//               <input className="form-control" value={patient.city} readOnly />
//             </div>

//             <div className="col-md-3">
//               <label>Proposal Id</label>
//               <input
//                 className="form-control"
//                 value={patient.proposalId}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Organization</label>
//               <input
//                 className="form-control"
//                 value={patient.organizationName}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Insurance Company</label>
//               <input
//                 className="form-control"
//                 value={patient.insuranceName}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Test List */}

//           <h6 className="mb-3">Test List</h6>

//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>TEST NAME</th>
// <th>TEST TYPE</th>
// <th>SAMPLE TYPE</th>
// <th>PRICE</th>
// <th>CURRENCY</th>
// <th>RATE</th>
// <th>INR PRICE</th>
//               </tr>
//             </thead>

//             <tbody>
//               {packages.map((p, index) => (
//                 <tr key={index}>
//                   <td>{p.testName}</td>
//                   <td>{p.testType}</td>
//                   <td>{p.sampleType}</td>

//                   {/* PRICE */}
//                   <td>
//                     <input
//                       className="form-control"
//                       value={p.price}
//                       onChange={(e) => handlePriceChange(index, e.target.value)}
//                     />
//                   </td>

//                   {/* CURRENCY */}
//                   <td>
//                     <select
//                       className="form-control"
//                       value={p.currencyId}
//                       onChange={(e) =>
//                         handleCurrencyChange(index, e.target.value)
//                       }
//                     >
//                       <option value="">Select</option>
//                       {currencies.map((c) => (
//                         <option key={c.id} value={c.id}>
//                           {c.currencyCode}
//                         </option>
//                       ))}
//                     </select>
//                   </td>

//                   {/* RATE */}
//                   <td>{p.conversionRate}</td>

//                   {/* INR */}
//                   <td>{p.inrPrice}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="mt-4">
//             <button className="btn btn-primary me-2" onClick={handleSubmit}>
//   Save
// </button>

//             <button className="btn btn-danger" onClick={() => navigate("/")}>
//               Goto Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPackagePrice;
