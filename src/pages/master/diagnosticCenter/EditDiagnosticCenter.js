import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDiagnosticCenterById,
  updateDiagnosticCenter,
} from "../../../services/diagnosticCenterService";

const EditDiagnosticCenter = () => {
  const { id } = useParams();
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
    isCentreVisitAvailable: true,
    isHomeVisitAvailable: false,
    isPaidHomeVisit: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDc();
  }, [id]);

  const loadDc = async () => {
    try {
      setLoading(true);
      const res = await getDiagnosticCenterById(id);
      const data = res.data;

      setForm({
        dcCode: data.dcCode || "",
        name: data.name || "",
        countryCode: data.countryCode || "",
        locationName: data.locationName || "",
        stateName: data.stateName || "",
        districtName: data.districtName || "",
        cityName: data.cityName || "",
        pincode: data.pincode || "",
        primaryAddress: data.primaryAddress || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        isCentreVisitAvailable: data.isCentreVisitAvailable ?? true,
        isHomeVisitAvailable: data.isHomeVisitAvailable ?? false,
        isPaidHomeVisit: data.isPaidHomeVisit ?? false,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load DC ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isHomeVisitAvailable" && !checked
        ? { isPaidHomeVisit: false }
        : {}),
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await updateDiagnosticCenter(id, form);

      alert(
        res.data.message || "Diagnostic Center updated successfully"
      );

      navigate("/diagnostic-center");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Update failed ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  const styles = `
     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


    .edc-page {
      min-height: calc(100vh - 70px);
      padding: 24px;
      background: #f4f7fb;
      color: #26364a;
      font-family: 'Inter', sans-serif;
    }
    .edc-card {
      width: 100%;
      margin: 0 auto;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e5eaf1;
      border-radius: 15px;
      box-shadow: 0 8px 28px rgba(24, 45, 75, .07);
    }
    .edc-header {
      min-height: 76px;
      padding: 20px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .edc-heading {
      margin: 0;
      font-size: 20px;
      font-weight: 750;
      letter-spacing: -.3px;
    }
    .edc-subtitle {
      margin: 5px 0 0;
      color: rgba(255,255,255,.74);
      font-size: 11px;
    }
    .edc-header-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: #fff;
      background: rgba(255,255,255,.13);
      font-size: 19px;
    }
    .edc-body { padding: 28px 30px 30px; }
    .edc-section { margin-bottom: 28px; }
    .edc-section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 18px;
      color: #1d3553;
      font-size: 14px;
      font-weight: 750;
    }
    .edc-section-title:before {
      content: '';
      width: 4px;
      height: 18px;
      border-radius: 4px;
      background: #31577f;
    }
    .edc-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 22px;
    }
    .edc-field { min-width: 0; }
    .edc-field-full { grid-column: 1 / -1; }
    .edc-label {
      display: block;
      margin: 0 0 7px;
      color: #46566b;
      font-size: 12px;
      font-weight: 650;
    }
    .edc-control {
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
    .edc-control:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49, 87, 127, .12);
    }
    .edc-control::placeholder { color: #a1acba; }
    .edc-textarea { min-height: 94px; resize: vertical; }
    .edc-visit-panel {
      padding: 17px 18px;
      border: 1px solid #e2e9f1;
      border-radius: 10px;
      background: #f8fafd;
    }
    .edc-visit-options {
      display: flex;
      flex-wrap: wrap;
      gap: 13px 28px;
    }
    .edc-check {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: #42536a;
      font-size: 12px;
      font-weight: 550;
      cursor: pointer;
    }
    .edc-check input {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: #24496e;
      cursor: pointer;
    }
    .edc-paid-option {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid #e3eaf2;
    }
    .edc-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 11px;
      margin-top: 28px;
      padding-top: 22px;
      border-top: 1px solid #edf0f4;
    }
    .edc-btn {
      min-width: 130px;
      min-height: 41px;
      border-radius: 8px;
      padding: 10px 17px;
      font: 650 12px 'Inter', sans-serif;
      cursor: pointer;
      transition: .18s ease;
    }
    .edc-btn:disabled { opacity: .65; cursor: not-allowed; }
    .edc-btn-primary {
      color: #fff;
      border: 1px solid #203e63;
      background: linear-gradient(110deg, #142b4a 0%, #284c73 100%);
      box-shadow: 0 4px 10px rgba(26, 55, 88, .15);
    }
    .edc-btn-primary:hover:not(:disabled) {
      box-shadow: 0 6px 14px rgba(26, 55, 88, .22);
      transform: translateY(-1px);
    }
    .edc-btn-secondary {
      color: #526174;
      border: 1px solid #d7dee8;
      background: #fff;
    }
    .edc-btn-secondary:hover:not(:disabled) { background: #f5f7fa; }
    .edc-loading {
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #66758a;
      font-size: 13px;
    }
    .edc-spinner {
      width: 27px;
      height: 27px;
      border: 3px solid #e1e8f0;
      border-top-color: #294d73;
      border-radius: 50%;
      animation: edc-spin .8s linear infinite;
    }
    @keyframes edc-spin { to { transform: rotate(360deg); } }
    @media (max-width: 700px) {
      .edc-page { padding: 14px; }
      .edc-header { padding: 18px 20px; }
      .edc-body { padding: 22px 18px; }
      .edc-grid { grid-template-columns: 1fr; gap: 15px; }
      .edc-field-full { grid-column: auto; }
      .edc-actions { justify-content: stretch; }
      .edc-btn { flex: 1 1 100%; }
    }
  `;

  return (
    <div className="edc-page">
      <style>{styles}</style>

      <div className="edc-card">
        <div className="edc-header">
          <div>
            <h2 className="edc-heading">Edit Diagnostic Center</h2>
            <p className="edc-subtitle">
              Update diagnostic center details and visit availability
            </p>
          </div>
          <div className="edc-header-icon" aria-hidden="true">✎</div>
        </div>

        {loading ? (
          <div className="edc-loading">
            <span className="edc-spinner" />
            Loading diagnostic center details...
          </div>
        ) : (
          <div className="edc-body">
            <section className="edc-section">
              <h3 className="edc-section-title">Diagnostic Center Information</h3>

              <div className="edc-grid">
                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-code">DC Code</label>
                  <input
                    id="edc-code"
                    type="text"
                    className="edc-control"
                    name="dcCode"
                    value={form.dcCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-name">DC Name</label>
                  <input
                    id="edc-name"
                    type="text"
                    className="edc-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-country">Country Code</label>
                  <input
                    id="edc-country"
                    type="text"
                    className="edc-control"
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-location">Location</label>
                  <input
                    id="edc-location"
                    type="text"
                    className="edc-control"
                    name="locationName"
                    value={form.locationName}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-state">State</label>
                  <input
                    id="edc-state"
                    type="text"
                    className="edc-control"
                    name="stateName"
                    value={form.stateName}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-district">District</label>
                  <input
                    id="edc-district"
                    type="text"
                    className="edc-control"
                    name="districtName"
                    value={form.districtName}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-city">City</label>
                  <input
                    id="edc-city"
                    type="text"
                    className="edc-control"
                    name="cityName"
                    value={form.cityName}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-pincode">Pincode</label>
                  <input
                    id="edc-pincode"
                    type="text"
                    className="edc-control"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field edc-field-full">
                  <label className="edc-label" htmlFor="edc-address">Primary Address</label>
                  <textarea
                    id="edc-address"
                    className="edc-control edc-textarea"
                    rows="3"
                    name="primaryAddress"
                    value={form.primaryAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section className="edc-section">
              <h3 className="edc-section-title">Geographical Coordinates</h3>
              <div className="edc-grid">
                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-latitude">Latitude</label>
                  <input
                    id="edc-latitude"
                    type="text"
                    className="edc-control"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                  />
                </div>

                <div className="edc-field">
                  <label className="edc-label" htmlFor="edc-longitude">Longitude</label>
                  <input
                    id="edc-longitude"
                    type="text"
                    className="edc-control"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section className="edc-section">
              <h3 className="edc-section-title">Visit Type Availability</h3>
              <div className="edc-visit-panel">
                <div className="edc-visit-options">
                  <label className="edc-check" htmlFor="edc-centre-visit">
                    <input
                      type="checkbox"
                      id="edc-centre-visit"
                      name="isCentreVisitAvailable"
                      checked={form.isCentreVisitAvailable}
                      onChange={handleChange}
                    />
                    Centre Visit Available
                  </label>

                  <label className="edc-check" htmlFor="edc-home-visit">
                    <input
                      type="checkbox"
                      id="edc-home-visit"
                      name="isHomeVisitAvailable"
                      checked={form.isHomeVisitAvailable}
                      onChange={handleChange}
                    />
                    Home Visit Available
                  </label>
                </div>

                {form.isHomeVisitAvailable && (
                  <div className="edc-paid-option">
                    <label className="edc-check" htmlFor="edc-paid-home-visit">
                      <input
                        type="checkbox"
                        id="edc-paid-home-visit"
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

            <div className="edc-actions">
              <button
                className="edc-btn edc-btn-secondary"
                onClick={() => navigate("/diagnostic-center")}
                disabled={saving}
              >
                Goto All DC List
              </button>

              <button
                className="edc-btn edc-btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDiagnosticCenter;

// import React, {
//   useEffect,
//   useState
// } from "react";

// import "../../../styles/addPatient.css";

// import {
//   useNavigate,
//   useParams
// } from "react-router-dom";

// import {

//   getDiagnosticCenterById,

//   updateDiagnosticCenter

// } from "../../../services/diagnosticCenterService";

// const EditDiagnosticCenter = () => {

//   const { id } = useParams();

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

//     isCentreVisitAvailable: true,

//     isHomeVisitAvailable: false,

//     isPaidHomeVisit: false,
//   });

//   useEffect(() => {

//     loadDc();

//   }, [id]);

//   const loadDc = async () => {

//     try {

//       const res =
//         await getDiagnosticCenterById(id);

//       const data = res.data;

//       setForm({

//         dcCode:
//           data.dcCode || "",

//         name:
//           data.name || "",

//         countryCode:
//           data.countryCode || "",

//         locationName:
//           data.locationName || "",

//         stateName:
//           data.stateName || "",

//         districtName:
//           data.districtName || "",

//         cityName:
//           data.cityName || "",

//         pincode:
//           data.pincode || "",

//         primaryAddress:
//           data.primaryAddress || "",

//         latitude:
//           data.latitude || "",

//         longitude:
//           data.longitude || "",

//         isCentreVisitAvailable:
//   data.isCentreVisitAvailable ?? true,

// isHomeVisitAvailable:
//   data.isHomeVisitAvailable ?? false,

// isPaidHomeVisit:
//   data.isPaidHomeVisit ?? false,
//       });

//     } catch (error) {

//       console.error(error);

//       alert("Failed to load DC ❌");
//     }
//   };

//   // const handleChange = (e) => {

//   //   const { name, value, type, checked } = e.target;

//   //   setForm({
//   //     ...form,
//   //     [name]:
//   //       type === "checkbox"
//   //         ? checked
//   //         : value,
//   //   });
//   // };

//   const handleChange = (e) => {

//   const { name, value, type, checked } = e.target;

//   setForm((prev) => ({
//     ...prev,

//     [name]: type === "checkbox" ? checked : value,

//     ...(name === "isHomeVisitAvailable" && !checked
//       ? { isPaidHomeVisit: false }
//       : {}),
//   }));

// };

//   const handleSubmit = async () => {

//     try {

//       const res =
//         await updateDiagnosticCenter(
//           id,
//           form
//         );

//       alert(
//         res.data.message ||
//         "Diagnostic Center updated successfully"
//       );

//       navigate("/diagnostic-center");

//     } catch (error) {

//       console.error(error);

//       alert(
//         error.response?.data?.message ||
//         "Update failed ❌"
//       );
//     }
//   };

//   return (

//     <div className="container-fluid mt-3">

//       <div className="card">

//         <div className="card-header add-header">
//           Edit Diagnostic Center
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

//               </div> */}

//             {/* </div> */}

//             {/* VISIT AVAILABILITY */}

// <div className="col-md-4">

//   <div className="form-check mt-4">

//     <input
//       type="checkbox"
//       className="form-check-input"
//       name="isCentreVisitAvailable"
//       checked={form.isCentreVisitAvailable}
//       onChange={handleChange}
//     />

//     <label className="form-check-label">
//       Centre Visit Available
//     </label>

//   </div>

// </div>

// <div className="col-md-4">

//   <div className="form-check mt-4">

//     <input
//       type="checkbox"
//       className="form-check-input"
//       name="isHomeVisitAvailable"
//       checked={form.isHomeVisitAvailable}
//       onChange={handleChange}
//     />

//     <label className="form-check-label">
//       Home Visit Available
//     </label>

//   </div>

// </div>

// {form.isHomeVisitAvailable && (

//   <div className="col-md-4">

//     <div className="form-check mt-4">

//       <input
//         type="checkbox"
//         className="form-check-input"
//         name="isPaidHomeVisit"
//         checked={form.isPaidHomeVisit}
//         onChange={handleChange}
//       />

//       <label className="form-check-label">
//         Paid Home Visit
//       </label>

//     </div>

//   </div>

// )}

//           </div>

//           <hr />

//           <button
//             className="btn btn-primary submit-btn"
//             onClick={handleSubmit}
//           >
//             Update
//           </button>

//           <button
//             className="btn btn-secondary ms-3"
//             onClick={() =>
//               navigate("/diagnostic-center")
//             }
//           >
//             Goto all DC List
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default EditDiagnosticCenter;