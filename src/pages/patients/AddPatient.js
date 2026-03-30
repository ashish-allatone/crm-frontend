import React, { useState, useEffect } from "react";
import "../../styles/addPatient.css";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../../services/patientService";
import { getOrganizationsAll } from "../../services/organizationService";
import { getAllInsurances } from "../../services/insuranceService";
import { getAllTests } from "../../services/testService";
import { getAllCurrencies } from "../../services/currencyService";

const AddPatient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    patientName: "",
    gender: "",
    mobileCountryCode: "",
    mobileNumber: "",
    dob: "",
    age: "",
    ageType: "YEAR",
    address: "",
    country: "",
    state: "",
    city: "",
    email: "",
    nationalIdNumber: "",
    passportNumber: "",
    currency: "",
    proposalId: "",
    organizationId: "",
    insuranceId: "",
  });

  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
    const loadOrgs = async () => {
      const res = await getOrganizationsAll();
      setOrganizations(res.data.data);
    };
    loadOrgs();
  }, []);
  const [insurances, setInsurances] = useState([]);
  useEffect(() => {
    const loadInsurance = async () => {
      const res = await getAllInsurances();
      setInsurances(res.data.data);
    };
    loadInsurance();
  }, []);

  const [allTests, setAllTests] = useState([]);
  useEffect(() => {
    const loadTests = async () => {
      const res = await getAllTests();
      setAllTests(res.data.data);
    };
    loadTests();
  }, []);

   const [currencies, setCurrencies] = useState([]);
   useEffect(() => {
  const loadCurrencies = async () => {
    const res = await getAllCurrencies();
    setCurrencies(res.data.data); // assuming {data: {data: [...]}}
  };

  loadCurrencies();
}, []);

  const [tests, setTests] = useState([
    {
      testId: "",
      testType: "",
      sampleType: "",
    },
  ]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestChange = (index, field, value) => {
    const updated = [...tests];

    updated[index][field] = value;

    // 🔥 AUTO FILL
    if (field === "testId") {
      const selectedTest = allTests.find((t) => t.id === Number(value));

      if (selectedTest) {
        updated[index].testType = selectedTest.testType;
        updated[index].sampleType = selectedTest.sampleType;
      }
    }

    setTests(updated);
  };

  const addTestRow = () => {
    setTests([...tests, { testId: "", testType: "", sampleType: "" }]);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      organizationId: form.organizationId ? Number(form.organizationId) : null,
      insuranceId: form.insuranceId ? Number(form.insuranceId) : null,
      tests: tests,
    };

    await createPatient(payload);

    navigate("/patients");
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">New Patient Registration</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label>Title</label>

              <select
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
              >
                <option>Select</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
              </select>
            </div>

            <div className="col-md-5">
              <label>Patient Name</label>

              <input
                type="text"
                className="form-control"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label>Gender</label>

              <select
                className="form-control"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Mobile No.</label>

              <div className="d-flex">
                <select
                  className="form-control code"
                  name="mobileCountryCode"
                  value={form.mobileCountryCode}
                  onChange={handleChange}
                >
                  <option>+0055</option>
                  <option>+91</option>
                </select>

                <input
                  type="text"
                  className="form-control"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label>DOB</label>

              <input
                type="date"
                className="form-control"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Age</label>

              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />

                <select
                  className="form-control"
                  name="ageType"
                  value={form.ageType}
                  onChange={handleChange}
                >
                  <option>Year</option>
                  <option>Month</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label>Address</label>

              <input
                type="text"
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label>Country</label>

              <select
  className="form-control"
  name="country"
  value={form.country}
  onChange={handleChange}
>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="England">England</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>State</label>

             <select
  className="form-control"
  name="state"
  value={form.state}
  onChange={handleChange}
>
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>City</label>

             <select
  className="form-control"
  name="city"
  value={form.city}
  onChange={handleChange}
>
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Email</label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>National ID Number</label>

             <input
  type="text"
  className="form-control"
  name="nationalIdNumber"
  value={form.nationalIdNumber}
  onChange={handleChange}
/>
            </div>

            <div className="col-md-4">
              <label>Passport No.</label>

             <input
  type="text"
  className="form-control"
  name="passportNumber"
  value={form.passportNumber}
  onChange={handleChange}
/>
            </div>

            <div className="col-md-4">
              <label>Currency</label>

              <select
  className="form-control"
  name="currency"
  value={form.currency}
  onChange={handleChange}
>
                
 <option value="">Select Currency</option>

  {currencies.map((c) => (
    <option key={c.id} value={c.currencyCode}>
      {c.currencyCode}
    </option>
  ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Proposal Id</label>

              <input
  type="text"
  className="form-control"
  name="proposalId"
  value={form.proposalId}
  onChange={handleChange}
/>
            </div>

            <div className="col-md-6">
              <label>Select Organization</label>

              <select
                className="form-control"
                name="organizationId"
                value={form.organizationId}
                onChange={handleChange}
              >
                <option value="">All</option>

                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.organizationName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Insurance Company</label>

              <select
                className="form-control"
                name="insuranceId"
                value={form.insuranceId}
                onChange={handleChange}
              >
                <option value="">All</option>

                {insurances.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.insuranceName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr />

          <h6>Package Details</h6>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S NO.</th>
                <th>SELECT TEST</th>
                <th>TEST TYPE</th>
                <th>SAMPLE TYPE</th>
                <th>ADD</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>
                    <select
                      className="form-control"
                      value={item.testId}
                      onChange={(e) =>
                        handleTestChange(index, "testId", e.target.value)
                      }
                    >
                      <option>--Select--</option>
                      {allTests.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.testName}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.testType}
                      onChange={(e) =>
                        handleTestChange(index, "testType", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.sampleType}
                      onChange={(e) =>
                        handleTestChange(index, "sampleType", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <button className="btn btn-success" onClick={addTestRow}>
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>

            <button
              className="btn btn-danger ms-3"
              onClick={() => navigate("/")}
            >
              Goto Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
