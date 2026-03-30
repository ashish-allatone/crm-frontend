import React, { useState } from "react";
import "../../../styles/addPatient.css";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../../../services/organizationService";

const AddOrganization = () => {
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
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

  await createOrganization(payload);

  navigate("/organization");
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
              <select
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              >
                <option>Select Country</option>
                <option>India</option>
                <option>United Arab Emirates</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>State</label>
              <select
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              >
                <option>Select State</option>
                <option>Maharashtra</option>
                <option>Dubai</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>City</label>
              <select
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              >
                <option>Select City</option>
                <option>Mumbai</option>
                <option>Dubai</option>
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
              <select
                className="form-control"
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                <option>INR</option>
                <option>AED</option>
              </select>
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
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
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
