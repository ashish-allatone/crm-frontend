import React, { useState, useEffect } from "react";
import "../../styles/allPatients.css";
import { useParams, useNavigate } from "react-router-dom";

import { getPatientById } from "../../services/patientService";
import {
  getPackagePrices,
  savePackagePrices,
} from "../../services/packageService";
import { getCurrencies } from "../../services/currencyService";

const AddPackagePrice = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientRes = await getPatientById(id);
      const currencyRes = await getCurrencies(0, 100, "");

      setPatient(patientRes.data.data);
      setCurrencies(currencyRes.data.content);

      // 🔥 tests from patient
      const packageRes = await getPackagePrices(id);

if (packageRes.data.data.length > 0) {
  setPackages(packageRes.data.data);
} else {
  // fallback (new)
  const testList = patientRes.data.data.tests || [];

  setPackages(
    testList.map((t) => ({
  testId: t.testId,
  testName: t.testName,
  testType: t.testType,      // ✅ ADD
  sampleType: t.sampleType,  // ✅ ADD
  price: "",
  currencyId: "",
  conversionRate: 0,
  inrPrice: 0,
}))
  );
}
    } catch (err) {
      console.error(err);
    }
  };
  const handleCurrencyChange = (index, currencyId) => {
    const updated = [...packages];

    const currency = currencies.find((c) => c.id === Number(currencyId));

    updated[index].currencyId = currencyId;
    updated[index].conversionRate = currency?.rateToInr || 0;

    // recalc INR
    updated[index].inrPrice =
  Number(updated[index].price) * updated[index].conversionRate;

    setPackages(updated);
  };
  const handlePriceChange = (index, value) => {
    const updated = [...packages];

    updated[index].price = value;

    updated[index].inrPrice =
  Number(value) * updated[index].conversionRate;

    setPackages(updated);
  };
  // const handleSubmit = async () => {
  //   try {
  //     const payload = packages.map((p) => ({
  //       patientId: id,
  //       testId: p.testId,
  //       currencyId: p.currencyId,
  //       price: Number(p.price),
  //     }));

  //     await savePackagePrices(payload);

  //     alert("Saved Successfully");
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error saving");
  //   }
  // };
  const handleSubmit = async () => {
  try {
    const payload = packages.map((p) => ({
      patientId: id,
      testId: p.testId,
      currencyId: p.currencyId,
      price: Number(p.price),
    }));

    const res = await savePackagePrices(payload);

    // ✅ Backend message use
    alert(res.data.message);

    navigate("/");

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to save package price ❌"
    );
  }
};

  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div
          className="card-header"
          style={{
            background: "linear-gradient(90deg,#6a5acd,#7b68ee)",
            color: "white",
          }}
        >
          <h5>Add Package Price</h5>
        </div>

        <div className="card-body">
          {/* Patient Info */}

          <div className="row mb-3">
            <div className="col-md-4">
              <label>Patient Name</label>
              <input
                className="form-control"
                value={`${patient.title}. ${patient.patientName}`}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label>Gender</label>
              <input className="form-control" value={patient.gender} readOnly />
            </div>

            <div className="col-md-2">
              <label>DOB</label>
              <input className="form-control" value={patient.dob} readOnly />
            </div>

            <div className="col-md-2">
              <label>Age</label>
              <input
                className="form-control"
                value={`${patient.age} ${patient.ageType}`}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label>Mobile No.</label>
              <input className="form-control" value={patient.mobileNumber} readOnly />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>Address</label>
              <input
                className="form-control"
                value={patient.address}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>Country</label>
              <input
                className="form-control"
                value={patient.country}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>State</label>
              <input className="form-control" value={patient.state} readOnly />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <label>City</label>
              <input className="form-control" value={patient.city} readOnly />
            </div>

            <div className="col-md-3">
              <label>Proposal Id</label>
              <input
                className="form-control"
                value={patient.proposalId}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>Organization</label>
              <input
                className="form-control"
                value={patient.organizationName}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>Insurance Company</label>
              <input
                className="form-control"
                value={patient.insuranceName}
                readOnly
              />
            </div>
          </div>

          {/* Test List */}

          <h6 className="mb-3">Test List</h6>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>TEST NAME</th>
<th>TEST TYPE</th>
<th>SAMPLE TYPE</th>
<th>PRICE</th>
<th>CURRENCY</th>
<th>RATE</th>
<th>INR PRICE</th>
              </tr>
            </thead>

            <tbody>
              {packages.map((p, index) => (
                <tr key={index}>
                  <td>{p.testName}</td>
                  <td>{p.testType}</td>
                  <td>{p.sampleType}</td>

                  {/* PRICE */}
                  <td>
                    <input
                      className="form-control"
                      value={p.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </td>

                  {/* CURRENCY */}
                  <td>
                    <select
                      className="form-control"
                      value={p.currencyId}
                      onChange={(e) =>
                        handleCurrencyChange(index, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {currencies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.currencyCode}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* RATE */}
                  <td>{p.conversionRate}</td>

                  {/* INR */}
                  <td>{p.inrPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button className="btn btn-primary me-2" onClick={handleSubmit}>
  Save
</button>

            <button className="btn btn-danger" onClick={() => navigate("/")}>
              Goto Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackagePrice;
