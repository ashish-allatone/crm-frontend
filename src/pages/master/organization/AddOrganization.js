import React, { useState, useEffect } from "react";
import "../../../styles/addPatient.css";
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
  // useEffect(() => {
  //   loadData();
  // }, []);
  useEffect(() => {
  if (!canViewCurrency) {
    setCurrencies([]);
    return;
  }

  loadData();
}, [canViewCurrency]);

  // const loadData = async () => {
  //   try {
  //     const res = await getAllCurrencies();
  //     setCurrencies(res.data.data); // assuming {data: {data: [...]}}
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const loadData = async () => {
  try {
    const res = await getAllCurrencies();
    setCurrencies(res.data.data || []);
  } catch (err) {
    console.warn("Currency access denied");
    setCurrencies([]);
  }
};

  // const handleSubmit = async () => {
  //   if (form.password !== form.confirmPassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }

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
  //     username: form.username,
  //     password: form.password,
  //   };

  //   await createOrganization(payload);

  //   navigate("/organization");
  // };
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

    // ✅ Backend message show
    alert(res.data.message);

    navigate("/organization");

  } catch (error) {
    console.error(error);

    // ❌ Error alert
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

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Add New Organization</div>

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
              {/* <select
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              >
                <option>Select Country</option>
                <option>India</option>
                <option>United Arab Emirates</option>
              </select> */}
              <select
  className="form-control"
  name="country"
  value={form.country}
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
              {/* <select
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              >
                <option>Select State</option>
                <option>Maharashtra</option>
                <option>Dubai</option>
              </select> */}
              <select
  className="form-control"
  name="state"
  value={form.state}
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
              {/* <select
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              >
                <option>Select City</option>
                <option>Mumbai</option>
                <option>Dubai</option>
              </select> */}
              <select
  className="form-control"
  name="city"
  value={form.city}
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
              <label>Payment Mode</label>
              <input
                className="form-control"
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Currency</label>
              {/* <select
                className="form-control"
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="">Select</option>

                {currencies.map((c) => (
                  <option key={c.id} value={c.currencyCode}>
                    {c.currencyCode}
                  </option>
                ))}
              </select> */}
              {!canViewCurrency ? (
  <input
    className="form-control"
    value="No Currency Access"
    disabled
  />
) : (
  <select
    className="form-control"
    name="currency"
    value={form.currency}
    onChange={handleChange}
  >
    <option value="">Select</option>

    {currencies.map((c) => (
      <option key={c.id} value={c.currencyCode}>
        {c.currencyCode}
      </option>
    ))}
  </select>
)}
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

          <hr />

          <h6>Login Details</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Username (Email)</label>
              <input
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
            >
              Submit
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

export default AddOrganization;
