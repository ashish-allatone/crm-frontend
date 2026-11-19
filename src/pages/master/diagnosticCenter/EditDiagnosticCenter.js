import React, {
  useEffect,
  useState
} from "react";

import "../../../styles/addPatient.css";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {

  getDiagnosticCenterById,

  updateDiagnosticCenter

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

  useEffect(() => {

    loadDc();

  }, [id]);

  const loadDc = async () => {

    try {

      const res =
        await getDiagnosticCenterById(id);

      const data = res.data;

      setForm({

        dcCode:
          data.dcCode || "",

        name:
          data.name || "",

        countryCode:
          data.countryCode || "",

        locationName:
          data.locationName || "",

        stateName:
          data.stateName || "",

        districtName:
          data.districtName || "",

        cityName:
          data.cityName || "",

        pincode:
          data.pincode || "",

        primaryAddress:
          data.primaryAddress || "",

        latitude:
          data.latitude || "",

        longitude:
          data.longitude || "",

        isCentreVisitAvailable:
  data.isCentreVisitAvailable ?? true,

isHomeVisitAvailable:
  data.isHomeVisitAvailable ?? false,

isPaidHomeVisit:
  data.isPaidHomeVisit ?? false,
      });

    } catch (error) {

      console.error(error);

      alert("Failed to load DC ❌");
    }
  };

  // const handleChange = (e) => {

  //   const { name, value, type, checked } = e.target;

  //   setForm({
  //     ...form,
  //     [name]:
  //       type === "checkbox"
  //         ? checked
  //         : value,
  //   });
  // };

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

      const res =
        await updateDiagnosticCenter(
          id,
          form
        );

      alert(
        res.data.message ||
        "Diagnostic Center updated successfully"
      );

      navigate("/diagnostic-center");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Update failed ❌"
      );
    }
  };

  return (

    <div className="container-fluid mt-3">

      <div className="card">

        <div className="card-header add-header">
          Edit Diagnostic Center
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

              </div> */}

            {/* </div> */}

            {/* VISIT AVAILABILITY */}

<div className="col-md-4">

  <div className="form-check mt-4">

    <input
      type="checkbox"
      className="form-check-input"
      name="isCentreVisitAvailable"
      checked={form.isCentreVisitAvailable}
      onChange={handleChange}
    />

    <label className="form-check-label">
      Centre Visit Available
    </label>

  </div>

</div>

<div className="col-md-4">

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

{form.isHomeVisitAvailable && (

  <div className="col-md-4">

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

  </div>

)}

          </div>

          <hr />

          <button
            className="btn btn-primary submit-btn"
            onClick={handleSubmit}
          >
            Update
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
  );
};

export default EditDiagnosticCenter;