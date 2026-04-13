import React, { useState,useEffect } from "react";
import "../../../styles/addPatient.css";
import { useNavigate, useParams } from "react-router-dom";
// import { organizations } from "../../../data/organizations";
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

  


  const [form, setForm] = useState({});
  useEffect(() => {
  const loadOrg = async () => {
    const res = await getOrganizationById(id);

    const data = res.data.data;

    setForm({
      name: data.organizationName,
      contact: data.contact,
      creditLimit: data.creditLimit,
      code: data.code,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      paymentMode: data.paymentMode,
      currency: data.currency,
      source: data.source,
      marketingPerson: data.marketingPerson,
      tat: data.turnAroundTime,
    });

     if (data.country) {
      await loadStates(data.country);
    }

    if (data.country && data.state) {
      await loadCities(data.country, data.state);
    }
  };

  loadOrg();
}, [id]);

// const handleSubmit = async () => {
//   const payload = {
//     organizationName: form.name,
//     contact: form.contact,
//     creditLimit: form.creditLimit,
//     code: form.code,
//     address: form.address,
//     country: form.country,
//     state: form.state,
//     city: form.city,
//     paymentMode: form.paymentMode,
//     currency: form.currency,
//     source: form.source,
//     marketingPerson: form.marketingPerson,
//     turnAroundTime: form.tat,
//   };

//   await updateOrganization(id, payload);

//   navigate("/organization");
// };
const handleSubmit = async () => {
  try {
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

    // ✅ Backend message
    alert(res.data.message);

    navigate("/organization");

  } catch (error) {
    console.error(error);

    // ❌ Error message
    alert(error.response?.data?.message || "Failed to update organization ❌");
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   if (!org) {
//     return <h3 className="text-center mt-5">Organization not found</h3>;
//   }

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

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Edit Organization</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label>Organization Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Contact</label>
              <input
                className="form-control"
                name="contact"
                value={form.contact}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Credit Limit</label>
              <input
                className="form-control"
                name="creditLimit"
                value={form.creditLimit}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Code</label>
              <input
                className="form-control"
                name="code"
                value={form.code}
                onChange={handleChange}
              />
            </div>

            {/* <div className="col-md-6">
              <label>Email</label>
              <input
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div> */}

            <div className="col-md-6">
              <label>Address</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Country</label>
              {/* <input
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              /> */}
              <select
  className="form-control"
  name="country"
  value={form.country || ""}
  onChange={handleCountryChange}
>
  <option value="">Select Country</option>
  {countries.map((c) => (
    <option key={c.iso2} value={c.iso2}>
      {c.name}
    </option>
  ))}
</select>
            </div>

            <div className="col-md-6">
              <label>State</label>
              {/* <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              /> */}
              <select
  className="form-control"
  name="state"
  value={form.state || ""}
  onChange={handleStateChange}
>
  <option value="">Select State</option>
  {states.map((s) => (
    <option key={s.iso2} value={s.iso2}>
      {s.name}
    </option>
  ))}
</select>
            </div>

            <div className="col-md-6">
              <label>City</label>
              {/* <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              /> */}
              <select
  className="form-control"
  name="city"
  value={form.city || ""}
  onChange={handleChange}
>
  <option value="">Select City</option>
  {cities.map((c) => (
    <option key={c.id} value={c.name}>
      {c.name}
    </option>
  ))}
</select>
            </div>

            <div className="col-md-6">
              <label>Currency</label>
             {!canViewCurrency ? (
  <input
    className="form-control"
    value={"No Currency Access"}
    disabled
  />
) : (
  <select
    className="form-control"
    name="currency"
    value={form.currency || ""}
    onChange={handleChange}
  >
    <option value="">Select Currency</option>

    {currencies.map((c) => (
      <option key={c.id} value={c.currencyCode}>
        {c.currencyCode}
      </option>
    ))}
  </select>
)}
            </div>

            <div className="col-md-6">
              <label>Payment Mode</label>
              <input
                className="form-control"
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Source</label>
              <input
                className="form-control"
                name="source"
                value={form.source}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Marketing Person</label>
              <input
                className="form-control"
                name="marketingPerson"
                value={form.marketingPerson}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Turn Around Time</label>
              <input
                className="form-control"
                name="tat"
                value={form.tat}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
  Update
</button>

            <button
              className="btn btn-danger ms-2"
              onClick={() => navigate("/organization")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrganization;
