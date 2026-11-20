import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrganizationById,
  updateOrganization,
} from "../../../services/organizationService";
import { hasPermission } from "../../permissionUtil";
import { getAllCurrencies } from "../../../services/currencyService";
import { useLocation } from "../../../hooks/useLocation";

const EditOrganization = () => {
  const { countries, states, cities, loadStates, loadCities } = useLocation();
  const canViewCurrency = hasPermission("Currency", "VIEW");
  const { id } = useParams();
  const navigate = useNavigate();

  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    creditLimit: "",
    code: "",
    address: "",
    country: "",
    state: "",
    city: "",
    paymentMode: "",
    currency: "",
    source: "",
    marketingPerson: "",
    tat: "",
  });

  useEffect(() => {
    if (!canViewCurrency) {
      setCurrencies([]);
      return;
    }

    const loadCurrencies = async () => {
      try {
        const res = await getAllCurrencies();
        setCurrencies(res.data.data || []);
      } catch {
        setCurrencies([]);
      }
    };

    loadCurrencies();
  }, [canViewCurrency]);

  useEffect(() => {
    const loadOrg = async () => {
      try {
        setLoading(true);
        const res = await getOrganizationById(id);
        const data = res.data.data;

        setForm({
          name: data.organizationName || "",
          contact: data.contact || "",
          creditLimit: data.creditLimit ?? "",
          code: data.code || "",
          address: data.address || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          paymentMode: data.paymentMode || "",
          currency: data.currency || "",
          source: data.source || "",
          marketingPerson: data.marketingPerson || "",
          tat: data.turnAroundTime ?? "",
        });

        if (data.country) {
          await loadStates(data.country);
        }

        if (data.country && data.state) {
          await loadCities(data.country, data.state);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to load organization");
      } finally {
        setLoading(false);
      }
    };

    loadOrg();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        organizationName: form.name,
        contact: form.contact,
        creditLimit: form.creditLimit,
        code: form.code,
        address: form.address,
        country: form.country,
        state: form.state,
        city: form.city,
        paymentMode: form.paymentMode,
        currency: form.currency,
        source: form.source,
        marketingPerson: form.marketingPerson,
        turnAroundTime: form.tat,
      };

      const res = await updateOrganization(id, payload);
      alert(res.data.message);
      navigate("/organization");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update organization");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setForm((prev) => ({
      ...prev,
      country: countryCode,
      state: "",
      city: "",
    }));
    loadStates(countryCode);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setForm((prev) => ({ ...prev, state: stateCode, city: "" }));
    loadCities(form.country, stateCode);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .eo-page {
      font-family: 'Inter', sans-serif;
      padding: 22px 20px;
      color: #26364a;
    }
    .eo-shell {
      
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e5eaf1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(24, 45, 75, 0.07);
    }
    .eo-header {
      min-height: 76px;
      padding: 20px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      color: #fff;
      background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
    }
    .eo-heading {
      margin: 0;
      font-size: 20px;
      font-weight: 750;
      letter-spacing: -.3px;
    }
    .eo-subtitle {
      margin: 5px 0 0;
      color: rgba(255,255,255,.74);
      font-size: 11px;
    }
    .eo-header-icon {
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
    .eo-body { padding: 28px 30px 30px; }
    .eo-section { margin-bottom: 26px; }
    .eo-section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 18px;
      color: #1d3553;
      font-size: 14px;
      font-weight: 750;
    }
    .eo-section-title:before {
      content: '';
      width: 4px;
      height: 18px;
      border-radius: 4px;
      background: #31577f;
    }
    .eo-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 22px;
    }
    .eo-field { min-width: 0; }
    .eo-field.eo-full { grid-column: 1 / -1; }
    .eo-label {
      display: block;
      margin: 0 0 7px;
      color: #46566b;
      font-size: 12px;
      font-weight: 650;
    }
    .eo-control {
      width: 100%;
      min-height: 43px;
      padding: 10px 12px;
      border: 1px solid #d9e1eb;
      border-radius: 8px;
      background: #fff;
      color: #27384d;
      font: 400 13px 'Inter', sans-serif;
      outline: none;
      transition: border-color .18s ease, box-shadow .18s ease;
      box-sizing: border-box;
    }
    .eo-control:focus {
      border-color: #426b96;
      box-shadow: 0 0 0 3px rgba(49, 87, 127, .12);
    }
    .eo-control:disabled {
      background: #f2f5f8;
      color: #8793a2;
      cursor: not-allowed;
    }
    .eo-actions {
      display: flex;
      justify-content: flex-end;
      gap: 11px;
      border-top: 1px solid #edf0f4;
      padding-top: 22px;
      margin-top: 28px;
    }
    .eo-btn {
      min-width: 112px;
      min-height: 41px;
      border-radius: 8px;
      padding: 10px 18px;
      font: 650 12px 'Inter', sans-serif;
      cursor: pointer;
      transition: .18s ease;
    }
    .eo-btn:disabled { opacity: .65; cursor: not-allowed; }
    .eo-btn-primary {
      color: #fff;
      border: 1px solid #203e63;
      background: linear-gradient(110deg, #142b4a 0%, #284c73 100%);
      box-shadow: 0 4px 10px rgba(26, 55, 88, .15);
    }
    .eo-btn-primary:hover:not(:disabled) {
      box-shadow: 0 6px 14px rgba(26, 55, 88, .22);
      transform: translateY(-1px);
    }
    .eo-btn-secondary {
      color: #526174;
      border: 1px solid #d7dee8;
      background: #fff;
    }
    .eo-btn-secondary:hover { background: #f5f7fa; }
    .eo-loading {
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #66758a;
      font-size: 13px;
    }
    .eo-spinner {
      width: 27px;
      height: 27px;
      border: 3px solid #e1e8f0;
      border-top-color: #294d73;
      border-radius: 50%;
      animation: eo-spin .8s linear infinite;
    }
    @keyframes eo-spin { to { transform: rotate(360deg); } }
    @media (max-width: 700px) {
      .eo-page { padding: 12px 8px; }
      .eo-header { padding: 18px 20px; }
      .eo-body { padding: 22px 18px; }
      .eo-grid { grid-template-columns: 1fr; gap: 15px; }
      .eo-field.eo-full { grid-column: auto; }
    }
    @media (max-width: 420px) {
      .eo-actions { flex-direction: column-reverse; }
      .eo-btn { width: 100%; }
    }
  `;

  return (
    <div className="eo-page">
      <style>{styles}</style>
      <div className="eo-shell">
        <div className="eo-header">
          <div>
            <h2 className="eo-heading">Edit Organization</h2>
            <p className="eo-subtitle">Update organization details and configuration</p>
          </div>
          <div className="eo-header-icon" aria-hidden="true">✎</div>
        </div>

        {loading ? (
          <div className="eo-loading">
            <span className="eo-spinner" />
            Loading organization details...
          </div>
        ) : (
          <div className="eo-body">
            <section className="eo-section">
              <h3 className="eo-section-title">Organization Information</h3>
              <div className="eo-grid">
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-name">Organization Name</label>
                  <input id="eo-name" className="eo-control" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-contact">Contact</label>
                  <input id="eo-contact" className="eo-control" name="contact" value={form.contact} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-credit">Credit Limit</label>
                  <input id="eo-credit" className="eo-control" name="creditLimit" value={form.creditLimit} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-code">Code</label>
                  <input id="eo-code" className="eo-control" name="code" value={form.code} onChange={handleChange} />
                </div>
                <div className="eo-field eo-full">
                  <label className="eo-label" htmlFor="eo-address">Address</label>
                  <input id="eo-address" className="eo-control" name="address" value={form.address} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-country">Country</label>
                  <select id="eo-country" className="eo-control" name="country" value={form.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.iso2} value={country.iso2}>{country.name}</option>
                    ))}
                  </select>
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-state">State</label>
                  <select id="eo-state" className="eo-control" name="state" value={form.state} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.iso2} value={state.iso2}>{state.name}</option>
                    ))}
                  </select>
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-city">City</label>
                  <select id="eo-city" className="eo-control" name="city" value={form.city} onChange={handleChange}>
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-currency">Currency</label>
                  {!canViewCurrency ? (
                    <input id="eo-currency" className="eo-control" value="No Currency Access" disabled readOnly />
                  ) : (
                    <select id="eo-currency" className="eo-control" name="currency" value={form.currency} onChange={handleChange}>
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.id} value={currency.currencyCode}>{currency.currencyCode}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </section>

            <section className="eo-section">
              <h3 className="eo-section-title">Business Configuration</h3>
              <div className="eo-grid">
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-payment">Payment Mode</label>
                  <input id="eo-payment" className="eo-control" name="paymentMode" value={form.paymentMode} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-source">Source</label>
                  <input id="eo-source" className="eo-control" name="source" value={form.source} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-marketing">Marketing Person</label>
                  <input id="eo-marketing" className="eo-control" name="marketingPerson" value={form.marketingPerson} onChange={handleChange} />
                </div>
                <div className="eo-field">
                  <label className="eo-label" htmlFor="eo-tat">Turn Around Time</label>
                  <input id="eo-tat" className="eo-control" name="tat" value={form.tat} onChange={handleChange} />
                </div>
              </div>
            </section>

            <div className="eo-actions">
              <button className="eo-btn eo-btn-secondary" onClick={() => navigate("/organization")} disabled={saving}>
                Cancel
              </button>
              <button className="eo-btn eo-btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Updating..." : "Update Organization"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditOrganization;

// import React, { useState,useEffect } from "react";
// import "../../../styles/addPatient.css";
// import { useNavigate, useParams } from "react-router-dom";
// // import { organizations } from "../../../data/organizations";
// import {
//   getOrganizationById,
//   updateOrganization,
// } from "../../../services/organizationService";
// import { hasPermission } from "../../permissionUtil";
// import { getAllCurrencies } from "../../../services/currencyService";
// import { useLocation } from "../../../hooks/useLocation";


// const EditOrganization = () => {

//   const { countries, states, cities, loadStates, loadCities } = useLocation();
//   const canViewCurrency = hasPermission("Currency", "VIEW");
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [currencies, setCurrencies] = useState([]);

//   useEffect(() => {
//   if (!canViewCurrency) {
//     setCurrencies([]);
//     return;
//   }

//   const loadCurrencies = async () => {
//     try {
//       const res = await getAllCurrencies();
//       setCurrencies(res.data.data || []);
//     } catch {
//       setCurrencies([]);
//     }
//   };

//   loadCurrencies();
// }, [canViewCurrency]);

  


//   const [form, setForm] = useState({});
//   useEffect(() => {
//   const loadOrg = async () => {
//     const res = await getOrganizationById(id);

//     const data = res.data.data;

//     setForm({
//       name: data.organizationName,
//       contact: data.contact,
//       creditLimit: data.creditLimit,
//       code: data.code,
//       address: data.address,
//       country: data.country,
//       state: data.state,
//       city: data.city,
//       paymentMode: data.paymentMode,
//       currency: data.currency,
//       source: data.source,
//       marketingPerson: data.marketingPerson,
//       tat: data.turnAroundTime,
//     });

//      if (data.country) {
//       await loadStates(data.country);
//     }

//     if (data.country && data.state) {
//       await loadCities(data.country, data.state);
//     }
//   };

//   loadOrg();
// }, [id]);

// // const handleSubmit = async () => {
// //   const payload = {
// //     organizationName: form.name,
// //     contact: form.contact,
// //     creditLimit: form.creditLimit,
// //     code: form.code,
// //     address: form.address,
// //     country: form.country,
// //     state: form.state,
// //     city: form.city,
// //     paymentMode: form.paymentMode,
// //     currency: form.currency,
// //     source: form.source,
// //     marketingPerson: form.marketingPerson,
// //     turnAroundTime: form.tat,
// //   };

// //   await updateOrganization(id, payload);

// //   navigate("/organization");
// // };
// const handleSubmit = async () => {
//   try {
//     const payload = {
//       organizationName: form.name,
//       contact: form.contact,
//       creditLimit: form.creditLimit,
//       code: form.code,
//       address: form.address,
//       country: form.country,
//       state: form.state,
//       city: form.city,
//       paymentMode: form.paymentMode,
//       currency: form.currency,
//       source: form.source,
//       marketingPerson: form.marketingPerson,
//       turnAroundTime: form.tat,
//     };

//     const res = await updateOrganization(id, payload);

//     // ✅ Backend message
//     alert(res.data.message);

//     navigate("/organization");

//   } catch (error) {
//     console.error(error);

//     // ❌ Error message
//     alert(error.response?.data?.message || "Failed to update organization ❌");
//   }
// };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

// //   if (!org) {
// //     return <h3 className="text-center mt-5">Organization not found</h3>;
// //   }

// const handleCountryChange = (e) => {
//   const countryCode = e.target.value;

//   setForm({ ...form, country: countryCode, state: "", city: "" });

//   loadStates(countryCode);
// };

// const handleStateChange = (e) => {
//   const stateCode = e.target.value;

//   setForm({ ...form, state: stateCode, city: "" });

//   loadCities(form.country, stateCode);
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Edit Organization</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label>Organization Name</label>
//               <input
//                 className="form-control"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Contact</label>
//               <input
//                 className="form-control"
//                 name="contact"
//                 value={form.contact}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Credit Limit</label>
//               <input
//                 className="form-control"
//                 name="creditLimit"
//                 value={form.creditLimit}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Code</label>
//               <input
//                 className="form-control"
//                 name="code"
//                 value={form.code}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* <div className="col-md-6">
//               <label>Email</label>
//               <input
//                 className="form-control"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//             </div> */}

//             <div className="col-md-6">
//               <label>Address</label>
//               <input
//                 className="form-control"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Country</label>
//               {/* <input
//                 className="form-control"
//                 name="country"
//                 value={form.country}
//                 onChange={handleChange}
//               /> */}
//               <select
//   className="form-control"
//   name="country"
//   value={form.country || ""}
//   onChange={handleCountryChange}
// >
//   <option value="">Select Country</option>
//   {countries.map((c) => (
//     <option key={c.iso2} value={c.iso2}>
//       {c.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-6">
//               <label>State</label>
//               {/* <input
//                 className="form-control"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//               /> */}
//               <select
//   className="form-control"
//   name="state"
//   value={form.state || ""}
//   onChange={handleStateChange}
// >
//   <option value="">Select State</option>
//   {states.map((s) => (
//     <option key={s.iso2} value={s.iso2}>
//       {s.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-6">
//               <label>City</label>
//               {/* <input
//                 className="form-control"
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//               /> */}
//               <select
//   className="form-control"
//   name="city"
//   value={form.city || ""}
//   onChange={handleChange}
// >
//   <option value="">Select City</option>
//   {cities.map((c) => (
//     <option key={c.id} value={c.name}>
//       {c.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-6">
//               <label>Currency</label>
//              {!canViewCurrency ? (
//   <input
//     className="form-control"
//     value={"No Currency Access"}
//     disabled
//   />
// ) : (
//   <select
//     className="form-control"
//     name="currency"
//     value={form.currency || ""}
//     onChange={handleChange}
//   >
//     <option value="">Select Currency</option>

//     {currencies.map((c) => (
//       <option key={c.id} value={c.currencyCode}>
//         {c.currencyCode}
//       </option>
//     ))}
//   </select>
// )}
//             </div>

//             <div className="col-md-6">
//               <label>Payment Mode</label>
//               <input
//                 className="form-control"
//                 name="paymentMode"
//                 value={form.paymentMode}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Source</label>
//               <input
//                 className="form-control"
//                 name="source"
//                 value={form.source}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Marketing Person</label>
//               <input
//                 className="form-control"
//                 name="marketingPerson"
//                 value={form.marketingPerson}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Turn Around Time</label>
//               <input
//                 className="form-control"
//                 name="tat"
//                 value={form.tat}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mt-3">
//             <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
//   Update
// </button>

//             <button
//               className="btn btn-danger ms-2"
//               onClick={() => navigate("/organization")}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditOrganization;
