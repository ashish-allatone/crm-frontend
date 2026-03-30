import React, { useState,useEffect } from "react";
import "../../../styles/addPatient.css";
import { useNavigate, useParams } from "react-router-dom";
// import { organizations } from "../../../data/organizations";
import {
  getOrganizationById,
  updateOrganization,
} from "../../../services/organizationService";

const EditOrganization = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  


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
  };

  loadOrg();
}, [id]);

const handleSubmit = async () => {
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

  await updateOrganization(id, payload);

  navigate("/organization");
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   if (!org) {
//     return <h3 className="text-center mt-5">Organization not found</h3>;
//   }

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

            <div className="col-md-6">
              <label>Email</label>
              <input
                className="form-control"
                name="email"
                value={form.email}
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
              <input
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>State</label>
              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>City</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Currency</label>
              <input
                className="form-control"
                name="currency"
                value={form.currency}
                onChange={handleChange}
              />
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
