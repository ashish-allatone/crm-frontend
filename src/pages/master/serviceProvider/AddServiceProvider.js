import React, { useState } from "react";
import "../../../styles/addPatient.css";
import { useNavigate } from "react-router-dom";
import { createServiceProvider } from "../../../services/serviceProviderService";

const AddServiceProvider = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
  const payload = {
    providerType: form.providerType,
    network: form.network,
    effectiveDate: form.effectiveDate,
    terminationDate: form.terminationDate,
    licenseNumber: form.licenseNo,
    name: form.name,
    landlineNo: form.landline,
    address: form.address,
    country: form.country,
    state: form.state,
    city: form.city,
    postalCode: form.postalCode,
    aboutUs: form.about,
    specialties: form.teams,
    contactPersonName: form.contactPerson,
    contactMobile: form.mobile,
    contactEmail: form.contactEmail,
    username: form.username,
    password: form.password,
  };

  await createServiceProvider(payload);
  navigate("/service-provider");
};

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Add New Service Provider</div>

        <div className="card-body">
          <h6>Provider Type</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Provider Type</label>

              <select
  className="form-control"
  name="providerType"
  value={form.providerType || ""}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Hospital">Hospital</option>
  <option value="Centers">Centers</option>
</select>
            </div>

            <div className="col-md-4">
              <label>Effective Date</label>

              <input
                type="date"
                className="form-control"
                name="effectiveDate"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Termination Date</label>

              <input
                type="date"
                className="form-control"
                name="terminationDate"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Network</label>

              {/* <select
                className="form-control"
                name="network"
                onChange={handleChange}
              >
                <option>All Cover Network</option>
              </select> */}
               <select
  className="form-control"
  name="network"
  value={form.network || ""}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="All Cover Network">All Cover Network</option>
  
</select>
              
            </div>

            <div className="col-md-4">
              <label>License Registration No.</label>

              <input
                className="form-control"
                name="licenseNo"
                placeholder="License Registration Number"
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          <h6>Provider Info</h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label>Name</label>

              <input
                className="form-control"
                name="name"
                placeholder="Service Provider's Name"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Landline No</label>

              <input
                className="form-control"
                name="landline"
                placeholder="Provider's Landline No"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label>Address</label>

              <textarea
                className="form-control"
                name="address"
                placeholder="Provider Address"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Country</label>

              <select
  className="form-control"
  name="country"
  value={form.country || ""}
  onChange={handleChange}
>
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="United Arab Emirates">United Arab Emirates</option>
</select>
            </div>

            <div className="col-md-3">
              <label>State</label>

              <input
                className="form-control"
                name="state"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>City</label>

              <input
                className="form-control"
                name="city"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Postal Code</label>

              <input
                className="form-control"
                name="postalCode"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>About Us</label>

              <textarea
                className="form-control"
                name="about"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Teams And Specialities</label>

              <textarea
                className="form-control"
                name="teams"
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          <h6>Contact Details</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Contact Person Name</label>

              <input
                className="form-control"
                name="contactPerson"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Mobile Number</label>

              <input
                className="form-control"
                name="mobile"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Contact Person Email</label>

              <input
                className="form-control"
                name="contactEmail"
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
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Password</label>

              <input
                type="password"
                className="form-control"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Confirm Password</label>

              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
  Submit
</button>

            <button
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/service-provider")}
            >
              Goto Service Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceProvider;
