import React, { useState ,useEffect} from "react";
import "../../../styles/addPatient.css";
import { createTest } from "../../../services/testService";
import { getOrganizationsAll } from "../../../services/organizationService";

import { useNavigate } from "react-router-dom";

const AddTest = () => {
  const navigate = useNavigate();
  

  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
  const loadOrgs = async () => {
    const res = await getOrganizationsAll();
    setOrganizations(res.data.data);
  };
  loadOrgs();
}, []);

  const [form, setForm] = useState({
    organization: "All",
    testName: "",
    shortName: "",
    testCode: "",
    profileTest: "No",
    testType: "Pathology",
    sampleType: "Not Required",
    testCategory: "Normal",
    description: "",
  });
  const payload = {
  organizationId: form.organization ? Number(form.organization) : null,
  testName: form.testName,
  shortName: form.shortName,
  testCode: form.testCode,
  profileTest: form.profileTest === "Yes",
  testType: form.testType,
  sampleType: form.sampleType,
  testCategory: form.testCategory,
  description: form.description,
};
const handleSubmit = async () => {
  await createTest(payload);
  navigate("/test-master");
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Add New Test</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label>Test For Organization</label>

             <select
  className="form-control"
  name="organization"
  value={form.organization}
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
              <label>Test Name</label>

              <input
                type="text"
                className="form-control"
                name="testName"
                placeholder="Test Name"
                value={form.testName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Short Name</label>

              <input
                type="text"
                className="form-control"
                name="shortName"
                placeholder="Short Name"
                value={form.shortName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Test Code</label>

              <input
                type="text"
                className="form-control"
                name="testCode"
                placeholder="Test Code"
                value={form.testCode}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Profile Test</label>

              <select
                className="form-control"
                name="profileTest"
                value={form.profileTest}
                onChange={handleChange}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Test Type</label>

              <select
                className="form-control"
                name="testType"
                value={form.testType}
                onChange={handleChange}
              >
                <option>Pathology</option>
                <option>Radiology</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Sample Type</label>

              <select
                className="form-control"
                name="sampleType"
                value={form.sampleType}
                onChange={handleChange}
              >
                <option>Not Required</option>
                <option>Blood</option>
                <option>Urine</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Test Category</label>

              <select
                className="form-control"
                name="testCategory"
                value={form.testCategory}
                onChange={handleChange}
              >
                <option>Normal</option>
                <option>Immunology</option>
              </select>
            </div>

            <div className="col-md-12">
              <label>Test Description</label>

              <textarea
                className="form-control"
                rows="3"
                name="description"
                placeholder="Test Description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          <div className="mt-3">
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
  Submit
</button>

            <button
              className="btn btn-secondary ms-3"
              onClick={() => navigate("/test-master")}
            >
              Goto all Test List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTest;
