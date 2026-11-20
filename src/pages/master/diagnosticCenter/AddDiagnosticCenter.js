import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDiagnosticCenter } from "../../../services/diagnosticCenterService";

const AddDiagnosticCenter = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dcCode: "",
    name: "",
    countryCode: "",
    locationName: "",
    stateName: "",
    districtName: "",
    cityName: "",
    pincode: "",
    primaryAddress: "",
    latitude: "",
    longitude: "",
    isHomeVisitAvailable: false,
    isCentreVisitAvailable: true,
    isPaidHomeVisit: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await createDiagnosticCenter(form);

      alert(
        res.data.message || "Diagnostic Center created successfully"
      );

      navigate("/diagnostic-center");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Something went wrong ❌"
      );
    }
  };

  const styles = `
     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


    .adc-page {
      min-height: calc(100vh - 70px);
      padding: 24px;
      background: #f4f7fb;
      color: #26364a;
      font-family: 'Inter', sans-serif;
    }
    .adc-card {
      width: 100%;
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e5eaf1;
      border-radius: 15px;
      box-shadow: 0 8px 28px rgba(24, 45, 75, .07);
    }
    .adc-header {
      min-height: 76px;
      padding: 20px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .adc-heading {
      margin: 0;
      font-size: 20px;
      font-weight: 750;
      letter-spacing: -.3px;
    }
    .adc-subtitle {
      margin: 5px 0 0;
      color: rgba(255,255,255,.74);
      font-size: 11px;
    }
   .adc-header-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 11px;
  color: #fff;
  background: rgba(255,255,255,.10);
}

.adc-header-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
    .adc-body { padding: 28px 30px 30px; }
    .adc-section { margin-bottom: 28px; }
    .adc-section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 18px;
      color: #1d3553;
      font-size: 14px;
      font-weight: 750;
    }
    .adc-section-title:before {
      content: '';
      width: 4px;
      height: 18px;
      border-radius: 4px;
      background: #31577f;
    }
    .adc-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 22px;
    }
    .adc-field { min-width: 0; }
    .adc-field-full { grid-column: 1 / -1; }
    .adc-label {
      display: block;
      margin: 0 0 7px;
      color: #46566b;
      font-size: 12px;
      font-weight: 650;
    }
    .adc-control {
      display: block;
      width: 100%;
      min-height: 43px;
      padding: 10px 12px;
      border: 1px solid #d9e1eb;
      border-radius: 8px;
      background: #fff;
      color: #27384d;
      font: 400 13px 'Inter', sans-serif;
      outline: none;
      box-sizing: border-box;
      transition: border-color .18s ease, box-shadow .18s ease;
    }
    .adc-control:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49, 87, 127, .12);
    }
    .adc-control::placeholder { color: #a1acba; }
    .adc-textarea { min-height: 94px; resize: vertical; }
    .adc-visit-panel {
      padding: 17px 18px;
      border: 1px solid #e2e9f1;
      border-radius: 10px;
      background: #f8fafd;
    }
    .adc-visit-options {
      display: flex;
      flex-wrap: wrap;
      gap: 13px 28px;
    }
    .adc-check {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: #42536a;
      font-size: 12px;
      font-weight: 550;
      cursor: pointer;
    }
    .adc-check input {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: #24496e;
      cursor: pointer;
    }
    .adc-paid-option {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid #e3eaf2;
    }
    .adc-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 11px;
      margin-top: 28px;
      padding-top: 22px;
      border-top: 1px solid #edf0f4;
    }
    .adc-btn {
      min-width: 130px;
      min-height: 41px;
      border-radius: 8px;
      padding: 10px 17px;
      font: 650 12px 'Inter', sans-serif;
      cursor: pointer;
      transition: .18s ease;
    }
    .adc-btn-primary {
      color: #fff;
      border: 1px solid #203e63;
      background: linear-gradient(110deg, #142b4a 0%, #284c73 100%);
      box-shadow: 0 4px 10px rgba(26, 55, 88, .15);
    }
    .adc-btn-primary:hover {
      box-shadow: 0 6px 14px rgba(26, 55, 88, .22);
      transform: translateY(-1px);
    }
    .adc-btn-secondary {
      color: #526174;
      border: 1px solid #d7dee8;
      background: #fff;
    }
    .adc-btn-secondary:hover { background: #f5f7fa; }
    @media (max-width: 700px) {
      .adc-page { padding: 14px; }
      .adc-header { padding: 18px 20px; }
      .adc-body { padding: 22px 18px; }
      .adc-grid { grid-template-columns: 1fr; gap: 15px; }
      .adc-field-full { grid-column: auto; }
      .adc-actions { justify-content: stretch; }
      .adc-btn { flex: 1 1 100%; }
    }
  `;

  return (
    <div className="adc-page">
      <style>{styles}</style>

      <div className="adc-card">
        <div className="adc-header">
          <div>
            <h2 className="adc-heading">Add Diagnostic Center</h2>
            <p className="adc-subtitle">
              Enter diagnostic center details and visit availability
            </p>
          </div>
          <div className="adc-header-icon" aria-hidden="true">
  <svg viewBox="0 0 24 24">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </svg>
</div>
        </div>

        <div className="adc-body">
          <section className="adc-section">
            <h3 className="adc-section-title">Diagnostic Center Information</h3>

            <div className="adc-grid">
              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-code">DC Code</label>
                <input
                  id="adc-code"
                  type="text"
                  className="adc-control"
                  name="dcCode"
                  value={form.dcCode}
                  onChange={handleChange}
                  placeholder="Enter DC code"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-name">DC Name</label>
                <input
                  id="adc-name"
                  type="text"
                  className="adc-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter diagnostic center name"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-country">Country Code</label>
                <input
                  id="adc-country"
                  type="text"
                  className="adc-control"
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  placeholder="Enter country code"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-location">Location</label>
                <input
                  id="adc-location"
                  type="text"
                  className="adc-control"
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-state">State</label>
                <input
                  id="adc-state"
                  type="text"
                  className="adc-control"
                  name="stateName"
                  value={form.stateName}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-district">District</label>
                <input
                  id="adc-district"
                  type="text"
                  className="adc-control"
                  name="districtName"
                  value={form.districtName}
                  onChange={handleChange}
                  placeholder="Enter district"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-city">City</label>
                <input
                  id="adc-city"
                  type="text"
                  className="adc-control"
                  name="cityName"
                  value={form.cityName}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-pincode">Pincode</label>
                <input
                  id="adc-pincode"
                  type="text"
                  className="adc-control"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>

              <div className="adc-field adc-field-full">
                <label className="adc-label" htmlFor="adc-address">Primary Address</label>
                <textarea
                  id="adc-address"
                  className="adc-control adc-textarea"
                  rows="3"
                  name="primaryAddress"
                  value={form.primaryAddress}
                  onChange={handleChange}
                  placeholder="Enter complete primary address"
                />
              </div>
            </div>
          </section>

          <section className="adc-section">
            <h3 className="adc-section-title">Geographical Coordinates</h3>
            <div className="adc-grid">
              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-latitude">Latitude</label>
                <input
                  id="adc-latitude"
                  type="text"
                  className="adc-control"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="Enter latitude"
                />
              </div>

              <div className="adc-field">
                <label className="adc-label" htmlFor="adc-longitude">Longitude</label>
                <input
                  id="adc-longitude"
                  type="text"
                  className="adc-control"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="Enter longitude"
                />
              </div>
            </div>
          </section>

          <section className="adc-section">
            <h3 className="adc-section-title">Visit Type Availability</h3>
            <div className="adc-visit-panel">
              <div className="adc-visit-options">
                <label className="adc-check" htmlFor="adc-centre-visit">
                  <input
                    type="checkbox"
                    id="adc-centre-visit"
                    name="isCentreVisitAvailable"
                    checked={form.isCentreVisitAvailable}
                    onChange={handleChange}
                  />
                  Centre Visit Available
                </label>

                <label className="adc-check" htmlFor="adc-home-visit">
                  <input
                    type="checkbox"
                    id="adc-home-visit"
                    name="isHomeVisitAvailable"
                    checked={form.isHomeVisitAvailable}
                    onChange={handleChange}
                  />
                  Home Visit Available
                </label>
              </div>

              {form.isHomeVisitAvailable && (
                <div className="adc-paid-option">
                  <label className="adc-check" htmlFor="adc-paid-home-visit">
                    <input
                      type="checkbox"
                      id="adc-paid-home-visit"
                      name="isPaidHomeVisit"
                      checked={form.isPaidHomeVisit}
                      onChange={handleChange}
                    />
                    Paid Home Visit
                  </label>
                </div>
              )}
            </div>
          </section>

          <div className="adc-actions">
            <button
              className="adc-btn adc-btn-secondary"
              onClick={() => navigate("/diagnostic-center")}
            >
              Goto All DC List
            </button>

            <button
              className="adc-btn adc-btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiagnosticCenter;

// import React, { useState } from "react";

// import "../../../styles/addPatient.css";

// import { useNavigate } from "react-router-dom";

// import {
//   createDiagnosticCenter
// } from "../../../services/diagnosticCenterService";

// const AddDiagnosticCenter = () => {

//   const navigate = useNavigate();

//   const [form, setForm] = useState({

//     dcCode: "",

//     name: "",

//     countryCode: "",

//     locationName: "",

//     stateName: "",

//     districtName: "",

//     cityName: "",

//     pincode: "",

//     primaryAddress: "",

//     latitude: "",

//     longitude: "",

//     isHomeVisitAvailable: false,

//     isCentreVisitAvailable: true,

//     isPaidHomeVisit: false,
//   });

//   const handleChange = (e) => {

//     const { name, value, type, checked } = e.target;

//     setForm({
//       ...form,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     });
//   };

//   const handleSubmit = async () => {

//     try {

//       const res =
//         await createDiagnosticCenter(form);

//       alert(
//         res.data.message ||
//         "Diagnostic Center created successfully"
//       );

//       navigate("/diagnostic-center");

//     } catch (error) {

//       console.error(error);

//       alert(
//         error.response?.data?.message ||
//         "Something went wrong ❌"
//       );
//     }
//   };

//   return (

//     <div className="container-fluid mt-3">

//       <div className="card">

//         <div className="card-header add-header">
//           Add Diagnostic Center
//         </div>

//         <div className="card-body">

//           <div className="row g-3">

//             <div className="col-md-6">
//               <label>DC Code</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="dcCode"
//                 value={form.dcCode}
//                 onChange={handleChange}
//                 placeholder="DC Code"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>DC Name</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="DC Name"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Country Code</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="countryCode"
//                 value={form.countryCode}
//                 onChange={handleChange}
//                 placeholder="Country Code"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Location</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="locationName"
//                 value={form.locationName}
//                 onChange={handleChange}
//                 placeholder="Location"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>State</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="stateName"
//                 value={form.stateName}
//                 onChange={handleChange}
//                 placeholder="State"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>District</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="districtName"
//                 value={form.districtName}
//                 onChange={handleChange}
//                 placeholder="District"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>City</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="cityName"
//                 value={form.cityName}
//                 onChange={handleChange}
//                 placeholder="City"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Pincode</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//                 placeholder="Pincode"
//               />
//             </div>

//             <div className="col-md-12">
//               <label>Primary Address</label>

//               <textarea
//                 className="form-control"
//                 rows="3"
//                 name="primaryAddress"
//                 value={form.primaryAddress}
//                 onChange={handleChange}
//                 placeholder="Primary Address"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Latitude</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="latitude"
//                 value={form.latitude}
//                 onChange={handleChange}
//                 placeholder="Latitude"
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Longitude</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="longitude"
//                 value={form.longitude}
//                 onChange={handleChange}
//                 placeholder="Longitude"
//               />
//             </div>

//             {/* <div className="col-md-6">

//               <div className="form-check mt-4">

//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   name="isHomeVisitAvailable"
//                   checked={form.isHomeVisitAvailable}
//                   onChange={handleChange}
//                 />

//                 <label className="form-check-label">
//                   Home Visit Available
//                 </label>

//               </div>

//             </div>

//             <div className="col-md-6">

//               <div className="form-check mt-4">

//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   name="isPaidHomeVisit"
//                   checked={form.isPaidHomeVisit}
//                   onChange={handleChange}
//                 />

//                 <label className="form-check-label">
//                   Paid Home Visit
//                 </label>

//               </div>

//             </div> */}

//             {/* Visit Type */}
// <div className="col-md-12">
//   <label className="form-label fw-semibold">
//     Visit Type Availability
//   </label>

//   <div className="d-flex flex-wrap gap-4 mt-2">

//     {/* Centre Visit */}
//     <div className="form-check">
//       <input
//         type="checkbox"
//         className="form-check-input"
//         id="isCentreVisitAvailable"
//         name="isCentreVisitAvailable"
//         checked={form.isCentreVisitAvailable}
//         onChange={handleChange}
//       />

//       <label
//         className="form-check-label"
//         htmlFor="isCentreVisitAvailable"
//       >
//         Centre Visit Available
//       </label>
//     </div>

//     {/* Home Visit */}
//     <div className="form-check">
//       <input
//         type="checkbox"
//         className="form-check-input"
//         id="isHomeVisitAvailable"
//         name="isHomeVisitAvailable"
//         checked={form.isHomeVisitAvailable}
//         onChange={handleChange}
//       />

//       <label
//         className="form-check-label"
//         htmlFor="isHomeVisitAvailable"
//       >
//         Home Visit Available
//       </label>
//     </div>

//   </div>
// </div>

// {/* Paid Home Visit */}
// {form.isHomeVisitAvailable && (
//   <div className="col-md-6">
//     <div className="form-check mt-3">
//       <input
//         type="checkbox"
//         className="form-check-input"
//         id="isPaidHomeVisit"
//         name="isPaidHomeVisit"
//         checked={form.isPaidHomeVisit}
//         onChange={handleChange}
//       />

//       <label
//         className="form-check-label"
//         htmlFor="isPaidHomeVisit"
//       >
//         Paid Home Visit
//       </label>
//     </div>
//   </div>
// )}

//           </div>

//           <hr />

//           <div className="mt-3">

//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleSubmit}
//             >
//               Submit
//             </button>

//             <button
//               className="btn btn-secondary ms-3"
//               onClick={() =>
//                 navigate("/diagnostic-center")
//               }
//             >
//               Goto all DC List
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default AddDiagnosticCenter;