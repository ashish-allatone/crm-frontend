import React, { useState ,useEffect} from "react";
import "../../../styles/addPatient.css";
import { useParams, useNavigate } from "react-router-dom";
// import { serviceProviders } from "../../../data/serviceProviders";
import {
  getServiceProviderById,
  updateServiceProvider,
} from "../../../services/serviceProviderService";

const EditServiceProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  

  const [form, setForm] = useState({});

useEffect(() => {
  const loadProvider = async () => {
    const res = await getServiceProviderById(id);
    const data = res.data.data;

    setForm({
      providerType: data.providerType,
      network: data.network,
      effectiveDate: data.effectiveDate,
      terminationDate: data.terminationDate,
      licenseNo: data.licenseNumber,
      name: data.name,
      landline: data.landlineNo,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      postalCode: data.postalCode,
      about: data.aboutUs,
      teams: data.specialties,
      contactPerson: data.contactPersonName,
      mobile: data.contactMobile,
      contactEmail: data.contactEmail,
    });
  };

  loadProvider();
}, [id]);

// const handleSubmit = async () => {
//   const payload = {
//     providerType: form.providerType,
//     network: form.network,
//     effectiveDate: form.effectiveDate,
//     terminationDate: form.terminationDate,
//     licenseNumber: form.licenseNo,
//     name: form.name,
//     landlineNo: form.landline,
//     address: form.address,
//     country: form.country,
//     state: form.state,
//     city: form.city,
//     postalCode: form.postalCode,
//     aboutUs: form.about,
//     specialties: form.teams,
//     contactPersonName: form.contactPerson,
//     contactMobile: form.mobile,
//     contactEmail: form.contactEmail,
//   };

//   await updateServiceProvider(id, payload);
//   navigate("/service-provider");
// };
const handleSubmit = async () => {
  try {
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
    };

    const res = await updateServiceProvider(id, payload);

    // ✅ Backend message
    if (res.data.success) {
      alert(res.data.message); // "Service Provider updated successfully"
      navigate("/service-provider");
    } else {
      alert(res.data.message || "Something went wrong ❌");
    }

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to update service provider ❌"
    );
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Edit New Service Provider</div>

        <div className="card-body">
          {/* Provider Type */}

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
                value={form.effectiveDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Termination Date</label>

              <input
                type="date"
                className="form-control"
                name="terminationDate"
                value={form.terminationDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Network</label>

               <select
  className="form-control"
  name="network"
  value={form.network}
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
                value={form.licenseNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          {/* Provider Info */}

          <h6>Provider Info</h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label>Name</label>

              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Landline No</label>

              <input
                className="form-control"
                name="landline"
                value={form.landline}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label>Address</label>

              <textarea
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Country</label>

              <input
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>State</label>

              <input
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>City</label>

              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Postal Code</label>

              <input
                className="form-control"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>About Us</label>

              <textarea
                className="form-control"
                name="about"
                value={form.about}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Teams And Specialities</label>

              <textarea
                className="form-control"
                name="teams"
                value={form.teams}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          {/* Contact Details */}

          <h6>Contact Details</h6>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Contact Person Name</label>

              <input
                className="form-control"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Mobile Number</label>

              <input
                className="form-control"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Contact Person E-mail</label>

              <input
                className="form-control"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
  Update
</button>

            <button
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/service-provider")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceProvider;
