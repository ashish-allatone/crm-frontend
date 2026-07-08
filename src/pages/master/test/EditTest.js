import React, { useState ,useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/addPatient.css";
// import { tests } from "../../../data/tests";
import { getTestById, updateTest } from "../../../services/testService";
import { getOrganizationsAll } from "../../../services/organizationService";
import { getCurrentUser } from "../../../services/userService";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const test = tests.find((t) => t.id === Number(id));

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

 const [form, setForm] = useState({});
 const [organizations, setOrganizations] = useState([]);
   useEffect(() => {
   const loadOrgs = async () => {
     const res = await getOrganizationsAll();
     setOrganizations(res.data.data);
   };
   loadOrgs();
 }, []);

 useEffect(() => {
  const loadCurrentUser = async () => {
    try {

      const res = await getCurrentUser();

      const user = res.data.data;

      setCurrentUser(user);

      const admin = user.roles?.some(
        (r) => r.name.toLowerCase() === "admin"
      );

      setIsAdmin(admin);

    } catch (err) {
      console.error(err);
    }
  };

  loadCurrentUser();

}, []);

useEffect(() => {
  const loadTest = async () => {
    const res = await getTestById(id);

    const data = res.data.data;

    setForm({
      organization: data.organizationId || "",
      testName: data.testName || "",
      shortName: data.shortName || "",
      testCode: data.testCode || "",
      profileTest: data.profileTest ? "Yes" : "No",
      testType: data.testType || "",
      sampleType: data.sampleType || "",
      testCategory: data.testCategory || "",
      description: data.description || "",
    });
  };

  loadTest();
}, [id]);

const handleSubmit = async () => {
  try {
    const payload = {
      organizationId: form.organization
        ? Number(form.organization)
        : null,
      testName: form.testName,
      shortName: form.shortName,
      testCode: form.testCode,
      profileTest: form.profileTest === "Yes",
      testType: form.testType,
      sampleType: form.sampleType,
      testCategory: form.testCategory,
      description: form.description,
    };

    const res = await updateTest(id, payload);

    // ✅ Backend message show
    alert(res.data.message);

    navigate("/test-master");

  } catch (error) {
    console.error(error);

    // ❌ Backend error show
    alert(error.response?.data?.message || "Failed to update test ❌");
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Edit Test</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label>Test For Organization</label>

              {/* <select
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
</select> */}
<select
  className="form-control"
  name="organization"
  value={form.organization}
  onChange={handleChange}
  disabled={!isAdmin}
>
  {isAdmin ? (
    <>
      <option value="">Select Organization</option>

      {organizations.map((o) => (
        <option key={o.id} value={o.id}>
          {o.organizationName}
        </option>
      ))}
    </>
  ) : (
    <option value={currentUser?.organization?.id}>
      {currentUser?.organization?.organizationName}
    </option>
  )}
</select>
            </div>

            <div className="col-md-6">
              <label>Test Name</label>

              <input
                className="form-control"
                name="testName"
                value={form.testName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Short Name</label>

              <input
                className="form-control"
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Test Code</label>

              <input
                className="form-control"
                name="testCode"
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
                <option>Blood</option>
                <option>Not Required</option>
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
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr />

          <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
  Update
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
  );
};

export default EditTest;
