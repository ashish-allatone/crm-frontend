import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../../../services/organizationService";
import { getAllCurrencies } from "../../../services/currencyService";
import { hasPermission } from "../../permissionUtil";
import { useLocation } from "../../../hooks/useLocation";

const AddOrganization = () => {
  const { countries, states, cities, loadStates, loadCities } = useLocation();
  const canViewCurrency = hasPermission("Currency", "VIEW");
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    creditLimit: "",
    code: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    paymentMode: "",
    currency: "INR",
    source: "",
    marketingPerson: "",
    tat: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!canViewCurrency) {
      setCurrencies([]);
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewCurrency]);

  const loadData = async () => {
    try {
      const res = await getAllCurrencies();
      setCurrencies(res.data.data || []);
    } catch (err) {
      console.warn("Currency access denied");
      setCurrencies([]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

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
        username: form.username,
        password: form.password,
      };

      const res = await createOrganization(payload);
      alert(res.data.message);
      navigate("/organization");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create organization ❌");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setForm({ ...form, country: countryCode, state: "", city: "" });
    loadStates(countryCode);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setForm({ ...form, state: stateCode, city: "" });
    loadCities(form.country, stateCode);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .ao-page{padding:22px 20px;color:#18243a;font-family:'Inter',sans-serif}
    .ao-card{overflow:hidden;background:#fff;border:1px solid #e7ebf2;border-radius:14px;box-shadow:0 5px 22px rgba(22,36,58,.06)}
    .ao-header{display:flex;align-items:center;gap:13px;min-height:78px;padding:18px 24px;color:#fff;background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);}
    .ao-header-icon{display:grid;width:43px;height:43px;flex:0 0 43px;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(255,255,255,.11)}
    .ao-header-icon svg{width:22px;height:22px}
    .ao-title{margin:0;font-size:19px;font-weight:700}
    .ao-subtitle{margin:4px 0 0;color:#c4d2e3;font-size:12px}
    .ao-body{padding:25px 26px 23px}
    .ao-section{display:flex;align-items:center;gap:9px;margin:0 0 19px;color:#263e5b;font-size:14px;font-weight:700}
    .ao-section svg{width:17px;height:17px;color:#607b99}
    .ao-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:22px;row-gap:18px}
    .ao-field{min-width:0}
    .ao-full{grid-column:1/-1}
    .ao-label{display:block;margin:0 0 7px;color:#40536c;font-size:12px;font-weight:600}
    .ao-control{display:block;width:100%;min-height:42px;padding:9px 12px;border:1px solid #dce3ec;border-radius:8px;background:#fff;color:#26374d;font-family:inherit;font-size:13px;outline:none;transition:border-color .2s ease,box-shadow .2s ease}
    .ao-control::placeholder{color:#a0aaba}
    .ao-control:focus{border-color:#52769d;box-shadow:0 0 0 3px rgba(58,94,132,.11)}
    .ao-control:disabled{color:#61738a;background:#f3f6f9;cursor:not-allowed}
    .ao-select{appearance:none;padding-right:36px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2367798e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
    .ao-section-divider{margin:26px 0 21px;border:0;border-top:1px solid #e9edf2}
    .ao-login-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
    .ao-help{margin:6px 0 0;color:#8794a5;font-size:11px}
    .ao-no-access{color:#7b8797}
    .ao-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:25px;padding-top:19px;border-top:1px solid #e9edf2}
    .ao-btn{display:inline-flex;min-height:39px;align-items:center;justify-content:center;gap:8px;padding:8px 17px;border:1px solid transparent;border-radius:8px;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:.2s ease}
    .ao-btn svg{width:15px;height:15px}
    .ao-btn-primary{color:#fff;background:#1d3c60;border-color:#1d3c60}
    .ao-btn-primary:hover{background:#142e4d;border-color:#142e4d;transform:translateY(-1px)}
    .ao-btn-secondary{color:#43566e;background:#f4f6f9;border-color:#dfe5ec}
    .ao-btn-secondary:hover{background:#e9eef4;border-color:#cbd6e2}
    @media(max-width:760px){.ao-page{padding:12px 8px}.ao-body{padding:19px 15px}.ao-form-grid{grid-template-columns:1fr;row-gap:16px}.ao-full{grid-column:auto}.ao-login-grid{grid-template-columns:1fr;gap:16px}.ao-header{padding:15px}.ao-title{font-size:17px}.ao-actions{align-items:stretch;flex-direction:column-reverse}.ao-btn{width:100%}}
  `;

  return (
    <div className="ao-page container-fluid">
      <style>{styles}</style>
      <div className="ao-card">
        <div className="ao-header">
          <div className="ao-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 12h.01M15 12h.01" />
              <path d="M17 15v5M14.5 17.5h5" />
            </svg>
          </div>
          <div>
            <h5 className="ao-title">Add New Organization</h5>
            <p className="ao-subtitle">Register an organization and configure its account details</p>
          </div>
        </div>

        <div className="ao-body">
          <h6 className="ao-section">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16M4 12h16M4 19h16" /><circle cx="8" cy="5" r="1.5" fill="currentColor" /><circle cx="15" cy="12" r="1.5" fill="currentColor" /><circle cx="10" cy="19" r="1.5" fill="currentColor" /></svg>
            Organization Information
          </h6>

          <div className="ao-form-grid">
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-name">Organization Name</label>
              <input id="ao-name" className="ao-control" name="name" placeholder="Enter organization name" value={form.name} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-contact">Contact</label>
              <input id="ao-contact" className="ao-control" name="contact" placeholder="Enter contact number" value={form.contact} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-credit-limit">Credit Limit</label>
              <input id="ao-credit-limit" className="ao-control" name="creditLimit" placeholder="Enter credit limit" value={form.creditLimit} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-code">Code</label>
              <input id="ao-code" className="ao-control" name="code" placeholder="Enter organization code" value={form.code} onChange={handleChange} />
            </div>
            <div className="ao-field ao-full">
              <label className="ao-label" htmlFor="ao-address">Address</label>
              <input id="ao-address" className="ao-control" name="address" placeholder="Enter complete address" value={form.address} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-country">Country</label>
              <select id="ao-country" className="ao-control ao-select" name="country" value={form.country} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.map((c) => <option key={c.iso2} value={c.iso2}>{c.name}</option>)}
              </select>
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-state">State</label>
              <select id="ao-state" className="ao-control ao-select" name="state" value={form.state} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.map((s) => <option key={s.iso2} value={s.iso2}>{s.name}</option>)}
              </select>
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-city">City</label>
              <select id="ao-city" className="ao-control ao-select" name="city" value={form.city} onChange={handleChange}>
                <option value="">Select City</option>
                {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-payment-mode">Payment Mode</label>
              <input id="ao-payment-mode" className="ao-control" name="paymentMode" placeholder="Enter payment mode" value={form.paymentMode} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-currency">Currency</label>
              {!canViewCurrency ? (
                <>
                  <input id="ao-currency" className="ao-control ao-no-access" value="No Currency Access" disabled />
                  <p className="ao-help">You do not have permission to view currencies.</p>
                </>
              ) : (
                <select id="ao-currency" className="ao-control ao-select" name="currency" value={form.currency} onChange={handleChange}>
                  <option value="">Select Currency</option>
                  {currencies.map((c) => <option key={c.id} value={c.currencyCode}>{c.currencyCode}</option>)}
                </select>
              )}
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-source">Source</label>
              <input id="ao-source" className="ao-control" name="source" placeholder="Enter source" value={form.source} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-marketing-person">Marketing Person</label>
              <input id="ao-marketing-person" className="ao-control" name="marketingPerson" placeholder="Enter marketing person" value={form.marketingPerson} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-tat">Turn Around Time</label>
              <input id="ao-tat" className="ao-control" name="tat" placeholder="Enter turnaround time" value={form.tat} onChange={handleChange} />
            </div>
          </div>

          <hr className="ao-section-divider" />

          <h6 className="ao-section">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
            Login Details
          </h6>

          <div className="ao-login-grid">
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-username">Username (Email)</label>
              <input id="ao-username" type="text" className="ao-control" name="username" placeholder="Enter username / email" value={form.username} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-password">Password</label>
              <input id="ao-password" type="password" className="ao-control" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} />
            </div>
            <div className="ao-field">
              <label className="ao-label" htmlFor="ao-confirm-password">Confirm Password</label>
              <input id="ao-confirm-password" type="password" className="ao-control" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="ao-actions">
            <button className="ao-btn ao-btn-secondary" onClick={() => navigate("/organization")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6M9 12h11" /></svg>
              Cancel
            </button>
            <button className="ao-btn ao-btn-primary" onClick={handleSubmit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
              Create Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrganization;

// import React, { useState, useEffect } from "react";
// import "../../../styles/addPatient.css";
// import { useNavigate } from "react-router-dom";
// import { createOrganization } from "../../../services/organizationService";
// import { getAllCurrencies } from "../../../services/currencyService";
// import { hasPermission } from "../../permissionUtil";
// import { useLocation } from "../../../hooks/useLocation";

// const AddOrganization = () => {
//   const { countries, states, cities, loadStates, loadCities } = useLocation();
//   const canViewCurrency = hasPermission("Currency", "VIEW");
//   const navigate = useNavigate();
//   const [currencies, setCurrencies] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     contact: "",
//     creditLimit: "",
//     code: "",
//     email: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     paymentMode: "",
//     currency: "INR",
//     source: "",
//     marketingPerson: "",
//     tat: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });
//   // useEffect(() => {
//   //   loadData();
//   // }, []);
//   useEffect(() => {
//   if (!canViewCurrency) {
//     setCurrencies([]);
//     return;
//   }

//   loadData();
// }, [canViewCurrency]);

//   // const loadData = async () => {
//   //   try {
//   //     const res = await getAllCurrencies();
//   //     setCurrencies(res.data.data); // assuming {data: {data: [...]}}
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };
//   const loadData = async () => {
//   try {
//     const res = await getAllCurrencies();
//     setCurrencies(res.data.data || []);
//   } catch (err) {
//     console.warn("Currency access denied");
//     setCurrencies([]);
//   }
// };

//   // const handleSubmit = async () => {
//   //   if (form.password !== form.confirmPassword) {
//   //     alert("Passwords do not match");
//   //     return;
//   //   }

//   //   const payload = {
//   //     organizationName: form.name,
//   //     contact: form.contact,
//   //     creditLimit: form.creditLimit,
//   //     code: form.code,
//   //     address: form.address,
//   //     country: form.country,
//   //     state: form.state,
//   //     city: form.city,
//   //     paymentMode: form.paymentMode,
//   //     currency: form.currency,
//   //     source: form.source,
//   //     marketingPerson: form.marketingPerson,
//   //     turnAroundTime: form.tat,
//   //     username: form.username,
//   //     password: form.password,
//   //   };

//   //   await createOrganization(payload);

//   //   navigate("/organization");
//   // };
//   const handleSubmit = async () => {
//   try {
//     if (form.password !== form.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

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
//       username: form.username,
//       password: form.password,
//     };

//     const res = await createOrganization(payload);

//     // ✅ Backend message show
//     alert(res.data.message);

//     navigate("/organization");

//   } catch (error) {
//     console.error(error);

//     // ❌ Error alert
//     alert(error.response?.data?.message || "Failed to create organization ❌");
//   }
// };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCountryChange = (e) => {
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
//         <div className="card-header add-header">Add New Organization</div>

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
//               {/* <select
//                 className="form-control"
//                 name="country"
//                 value={form.country}
//                 onChange={handleChange}
//               >
//                 <option>Select Country</option>
//                 <option>India</option>
//                 <option>United Arab Emirates</option>
//               </select> */}
//               <select
//   className="form-control"
//   name="country"
//   value={form.country}
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
//               {/* <select
//                 className="form-control"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//               >
//                 <option>Select State</option>
//                 <option>Maharashtra</option>
//                 <option>Dubai</option>
//               </select> */}
//               <select
//   className="form-control"
//   name="state"
//   value={form.state}
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
//               {/* <select
//                 className="form-control"
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//               >
//                 <option>Select City</option>
//                 <option>Mumbai</option>
//                 <option>Dubai</option>
//               </select> */}
//               <select
//   className="form-control"
//   name="city"
//   value={form.city}
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
//               <label>Payment Mode</label>
//               <input
//                 className="form-control"
//                 name="paymentMode"
//                 value={form.paymentMode}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Currency</label>
//               {/* <select
//                 className="form-control"
//                 name="currency"
//                 value={form.currency}
//                 onChange={handleChange}
//               >
//                 <option value="">Select</option>

//                 {currencies.map((c) => (
//                   <option key={c.id} value={c.currencyCode}>
//                     {c.currencyCode}
//                   </option>
//                 ))}
//               </select> */}
//               {!canViewCurrency ? (
//   <input
//     className="form-control"
//     value="No Currency Access"
//     disabled
//   />
// ) : (
//   <select
//     className="form-control"
//     name="currency"
//     value={form.currency}
//     onChange={handleChange}
//   >
//     <option value="">Select</option>

//     {currencies.map((c) => (
//       <option key={c.id} value={c.currencyCode}>
//         {c.currencyCode}
//       </option>
//     ))}
//   </select>
// )}
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

//           <hr />

//           <h6>Login Details</h6>

//           <div className="row g-3">
//             <div className="col-md-4">
//               <label>Username (Email)</label>
//               <input
//                 className="form-control"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mt-3">
//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleSubmit}
//             >
//               Submit
//             </button>

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

// export default AddOrganization;
