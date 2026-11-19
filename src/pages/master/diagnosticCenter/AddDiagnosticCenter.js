import React, { useState } from "react";

import "../../../styles/addPatient.css";

import { useNavigate } from "react-router-dom";

import {
  createDiagnosticCenter
} from "../../../services/diagnosticCenterService";

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
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async () => {

    try {

      const res =
        await createDiagnosticCenter(form);

      alert(
        res.data.message ||
        "Diagnostic Center created successfully"
      );

      navigate("/diagnostic-center");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong ❌"
      );
    }
  };

  return (

    <div className="container-fluid mt-3">

      <div className="card">

        <div className="card-header add-header">
          Add Diagnostic Center
        </div>

        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-6">
              <label>DC Code</label>

              <input
                type="text"
                className="form-control"
                name="dcCode"
                value={form.dcCode}
                onChange={handleChange}
                placeholder="DC Code"
              />
            </div>

            <div className="col-md-6">
              <label>DC Name</label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="DC Name"
              />
            </div>

            <div className="col-md-6">
              <label>Country Code</label>

              <input
                type="text"
                className="form-control"
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                placeholder="Country Code"
              />
            </div>

            <div className="col-md-6">
              <label>Location</label>

              <input
                type="text"
                className="form-control"
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>

            <div className="col-md-6">
              <label>State</label>

              <input
                type="text"
                className="form-control"
                name="stateName"
                value={form.stateName}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="col-md-6">
              <label>District</label>

              <input
                type="text"
                className="form-control"
                name="districtName"
                value={form.districtName}
                onChange={handleChange}
                placeholder="District"
              />
            </div>

            <div className="col-md-6">
              <label>City</label>

              <input
                type="text"
                className="form-control"
                name="cityName"
                value={form.cityName}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="col-md-6">
              <label>Pincode</label>

              <input
                type="text"
                className="form-control"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>

            <div className="col-md-12">
              <label>Primary Address</label>

              <textarea
                className="form-control"
                rows="3"
                name="primaryAddress"
                value={form.primaryAddress}
                onChange={handleChange}
                placeholder="Primary Address"
              />
            </div>

            <div className="col-md-6">
              <label>Latitude</label>

              <input
                type="text"
                className="form-control"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude"
              />
            </div>

            <div className="col-md-6">
              <label>Longitude</label>

              <input
                type="text"
                className="form-control"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude"
              />
            </div>

            {/* <div className="col-md-6">

              <div className="form-check mt-4">

                <input
                  type="checkbox"
                  className="form-check-input"
                  name="isHomeVisitAvailable"
                  checked={form.isHomeVisitAvailable}
                  onChange={handleChange}
                />

                <label className="form-check-label">
                  Home Visit Available
                </label>

              </div>

            </div>

            <div className="col-md-6">

              <div className="form-check mt-4">

                <input
                  type="checkbox"
                  className="form-check-input"
                  name="isPaidHomeVisit"
                  checked={form.isPaidHomeVisit}
                  onChange={handleChange}
                />

                <label className="form-check-label">
                  Paid Home Visit
                </label>

              </div>

            </div> */}

            {/* Visit Type */}
<div className="col-md-12">
  <label className="form-label fw-semibold">
    Visit Type Availability
  </label>

  <div className="d-flex flex-wrap gap-4 mt-2">

    {/* Centre Visit */}
    <div className="form-check">
      <input
        type="checkbox"
        className="form-check-input"
        id="isCentreVisitAvailable"
        name="isCentreVisitAvailable"
        checked={form.isCentreVisitAvailable}
        onChange={handleChange}
      />

      <label
        className="form-check-label"
        htmlFor="isCentreVisitAvailable"
      >
        Centre Visit Available
      </label>
    </div>

    {/* Home Visit */}
    <div className="form-check">
      <input
        type="checkbox"
        className="form-check-input"
        id="isHomeVisitAvailable"
        name="isHomeVisitAvailable"
        checked={form.isHomeVisitAvailable}
        onChange={handleChange}
      />

      <label
        className="form-check-label"
        htmlFor="isHomeVisitAvailable"
      >
        Home Visit Available
      </label>
    </div>

  </div>
</div>

{/* Paid Home Visit */}
{form.isHomeVisitAvailable && (
  <div className="col-md-6">
    <div className="form-check mt-3">
      <input
        type="checkbox"
        className="form-check-input"
        id="isPaidHomeVisit"
        name="isPaidHomeVisit"
        checked={form.isPaidHomeVisit}
        onChange={handleChange}
      />

      <label
        className="form-check-label"
        htmlFor="isPaidHomeVisit"
      >
        Paid Home Visit
      </label>
    </div>
  </div>
)}

          </div>

          <hr />

          <div className="mt-3">

            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>

            <button
              className="btn btn-secondary ms-3"
              onClick={() =>
                navigate("/diagnostic-center")
              }
            >
              Goto all DC List
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddDiagnosticCenter;