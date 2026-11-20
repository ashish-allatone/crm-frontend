import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../../services/patientService";
import { getOrganizationsAll } from "../../services/organizationService";
import { getAllInsurances } from "../../services/insuranceService";
import { getAllTests } from "../../services/testService";
import { getAllCurrencies } from "../../services/currencyService";
import { hasPermission } from "../permissionUtil";
import { useLocation } from "../../hooks/useLocation";
import { getCurrentUser } from "../../services/userService";
import { getLatestPrivacyNotice } from "../../services/dpdpService";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";


const addPatientStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.add-patient-page {
  --ap-navy: #0e3d66;
  --ap-ink: #18243a;
  --ap-muted: #718096;
  --ap-border: #dfe6ee;
  font-family: 'Inter', sans-serif;
  color: var(--ap-ink);
  width: 100%;
}
.add-patient-page .card {
  width: 100%;
  border: 1px solid #e5eaf0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 5px 22px rgba(18, 42, 66, .07);
}
.add-patient-page .add-header {
  min-height: 76px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
  border: 0;
  background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -.25px;
}
.add-patient-page .add-header-icon {
  width: 42px; height: 42px; flex: 0 0 42px;
  display: grid; place-items: center;
  border-radius: 11px;
  background: rgba(255,255,255,.13);
  font-size: 20px;
}
.add-patient-page .add-header-copy { display: flex; flex-direction: column; gap: 4px; }
.add-patient-page .add-header-subtitle { color: #c5d7e7; font-size: 12px; font-weight: 400; letter-spacing: 0; }
.add-patient-page .card-body { padding: 24px; }
.add-patient-page label {
  display: block;
  margin-bottom: 7px;
  color: #35445a;
  font-size: 12px;
  font-weight: 600;
}
.add-patient-page .form-control {
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #d9e1ea;
  border-radius: 8px;
  color: #243247;
  background-color: #fff;
  font-family: inherit;
  font-size: 13px;
  box-shadow: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.add-patient-page .form-control:focus {
  border-color: #3979aa;
  box-shadow: 0 0 0 3px rgba(28, 104, 157, .11);
}
.add-patient-page .form-control:disabled,
.add-patient-page .form-control[readonly] { background: #f3f6f9; color: #748196; }
.add-patient-page .code { max-width: 145px; margin-right: 8px; }
.add-patient-page .section-heading {
  display: flex; align-items: center; gap: 10px;
  margin: 4px 0 15px;
  color: #173b5d; font-size: 14px; font-weight: 700;
}
.add-patient-page .section-heading:before {
  content: ''; width: 4px; height: 18px; border-radius: 4px; background: #1d6b9e;
}
.add-patient-page hr { margin: 25px 0 22px; border-color: #e5ebf1; opacity: 1; }
.add-patient-page .table-responsive { width: 100%; }
.add-patient-page .table {
  margin: 0; border-color: #e1e7ee; vertical-align: middle;
  font-size: 13px;
}
.add-patient-page .table thead th {
  padding: 12px 13px;
  color: #53647a;
  background: #f3f6f9;
  border-bottom: 1px solid #dfe6ee;
  font-size: 11px; font-weight: 700; letter-spacing: .5px;
  text-transform: uppercase; white-space: nowrap;
}
.add-patient-page .table tbody td { padding: 10px 12px; color: #35445a; }
.add-patient-page .table tbody tr:hover { background: #f8fafc; }
.add-patient-page .table .form-control { min-width: 130px; }
.add-patient-page .btn {
  min-height: 38px; padding: 8px 15px; border-radius: 8px;
  font-family: inherit; font-size: 12px; font-weight: 600;
  box-shadow: none; transition: .15s ease;
}
.add-patient-page .submit-btn,
.add-patient-page .btn-primary {
  color: #fff; border-color: #0e3d66; background: #0e3d66;
}
.add-patient-page .submit-btn:hover,
.add-patient-page .btn-primary:hover { background: #092d4b; border-color: #092d4b; }
.add-patient-page .btn-success { background: #e8f4ee; border-color: #c7e6d5; color: #20734b; }
.add-patient-page .btn-success:hover { background: #d8eee2; color: #155d3a; }
.add-patient-page .btn-danger { background: #fff0f0; border-color: #f3cccc; color: #b33b3b; }
.add-patient-page .btn-danger:hover { background: #ffe2e2; color: #982c2c; }
.add-patient-page .btn-secondary { background: #eef2f6; border-color: #dce3ea; color: #405168; }
.add-patient-page .modal { z-index: 1060; }
.add-patient-page .modal-backdrop { z-index: 1055; }
.add-patient-page .modal-content {
  border: 0; border-radius: 14px; overflow: hidden;
  box-shadow: 0 18px 55px rgba(5, 24, 43, .22);
}
.add-patient-page .modal-header {
  padding: 17px 22px; color: #fff;
  background: linear-gradient(120deg, #0e3d66, #061d30);
  border-bottom: 0;
}
.add-patient-page .modal-title { font-size: 16px; font-weight: 700; }
.add-patient-page .modal-header .btn-close { filter: invert(1); opacity: .85; }
.add-patient-page .modal-body { padding: 22px; font-size: 13px; color: #35445a; }
.add-patient-page .modal-body .alert-info {
  color: #244a69; background: #eef5fa; border: 1px solid #d8e7f2; border-radius: 9px;
}
.add-patient-page .modal-body .alert-info h6 { font-size: 13px; }
.add-patient-page .modal-body .alert-info p { font-size: 12px; }
.add-patient-page .privacy-content {
  max-height: 350px; overflow-y: auto; padding: 15px;
  border: 1px solid #dfe6ee; border-radius: 9px; background: #fbfcfd;
  line-height: 1.65; white-space: pre-wrap;
}
.add-patient-page .form-check { display: flex; align-items: flex-start; gap: 9px; }
.add-patient-page .form-check-input { margin-top: 3px; flex: 0 0 auto; }
.add-patient-page .form-check-label { line-height: 1.55; }
.add-patient-page .modal-footer { padding: 14px 22px; border-top: 1px solid #e8edf2; }
.add-patient-page .action-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
@media (max-width: 767.98px) {
  .add-patient-page .card-body { padding: 16px; }
  .add-patient-page .add-header { padding: 15px 17px; }
  .add-patient-page .add-header { font-size: 17px; }
  .add-patient-page .code { max-width: 115px; }
  .add-patient-page .action-row .btn { flex: 1 1 auto; }
}
`;

const AddPatient = () => {
  const canViewOrg = hasPermission("Organization", "VIEW");
  const canViewCurrency = hasPermission("Currency", "VIEW");
  const canViewTest = hasPermission("Test Master", "VIEW");
  const canViewInsurance = hasPermission("Insurance", "VIEW");
  const navigate = useNavigate();
  const { countries, states, cities, loadStates, loadCities } = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [privacyNotice, setPrivacyNotice] = useState(null);

  const [consentChecked, setConsentChecked] = useState(false);

  const [loadingConsent, setLoadingConsent] = useState(false);

  const [savingPatient, setSavingPatient] = useState(false);

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
  // useEffect(() => {
  //   const loadOrgs = async () => {
  //     const res = await getOrganizationsAll();
  //     setOrganizations(res.data.data);
  //   };
  //   loadOrgs();
  // }, []);
  useEffect(() => {
    if (!canViewOrg) {
      setOrganizations([]);
      return;
    }
    const loadOrgs = async () => {
      try {
        const res = await getOrganizationsAll();
        setOrganizations(res.data.data || []);
      } catch (err) {
        console.warn("Organization access denied");
        setOrganizations([]); // fallback
      }
    };
    loadOrgs();
  }, [canViewOrg]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const res = await getCurrentUser();

        setCurrentUser(res.data.data);

        const admin = res.data.data.roles?.some(
          (r) => r.name?.toLowerCase() === "admin",
        );

        setIsAdmin(admin);

        // Non-admin => organization auto select
        if (!admin && res.data.data.organization) {
          setForm((prev) => ({
            ...prev,
            organizationId: res.data.data.organization.id,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadCurrentUser();
  }, []);

  const [insurances, setInsurances] = useState([]);
  // useEffect(() => {
  //   const loadInsurance = async () => {
  //     const res = await getAllInsurances();
  //     setInsurances(res.data.data);
  //   };
  //   loadInsurance();
  // }, []);
  useEffect(() => {
    if (!canViewInsurance) {
      setInsurances([]);
      return;
    }
    // const loadInsurance = async () => {
    //   try {
    //     const res = await getAllInsurances();
    //     setInsurances(res.data.data || []);
    //   } catch (err) {
    //     console.warn("Insurance access denied");
    //     setInsurances([]);
    //   }
    // };
    const loadInsurance = async () => {
      try {
        const res = await getAllInsurances();
        console.log("Insurance API Response => ", res.data);

        let insuranceList = res.data.data || [];

        // Non Admin => only own organization insurances
        if (currentUser && !isAdmin && currentUser.organization) {
          insuranceList = insuranceList.filter(
            (i) => i.organizationId === currentUser.organization.id,
          );
        }

        setInsurances(insuranceList);
      } catch (err) {
        console.warn("Insurance access denied");
        setInsurances([]);
      }
    };
    loadInsurance();
  }, [canViewInsurance, currentUser, isAdmin]);

  const [allTests, setAllTests] = useState([]);
  // useEffect(() => {
  //   const loadTests = async () => {
  //     const res = await getAllTests();
  //     setAllTests(res.data.data);
  //   };
  //   loadTests();
  // }, []);
  useEffect(() => {
    if (!canViewTest) {
      setAllTests([]);
      return;
    }
    const loadTests = async () => {
      try {
        const res = await getAllTests();
        setAllTests(res.data.data || []);
      } catch (err) {
        console.warn("Test access denied");
        setAllTests([]);
      }
    };
    loadTests();
  }, [canViewTest]);

  const [currencies, setCurrencies] = useState([]);
  // useEffect(() => {
  //   const loadCurrencies = async () => {
  //     const res = await getAllCurrencies();
  //     setCurrencies(res.data.data); // assuming {data: {data: [...]}}
  //   };

  //   loadCurrencies();
  // }, []);
  useEffect(() => {
    if (!canViewCurrency) {
      setCurrencies([]);
      return;
    }
    const loadCurrencies = async () => {
      try {
        const res = await getAllCurrencies();
        setCurrencies(res.data.data || []);
      } catch (err) {
        console.warn("Currency access denied");
        setCurrencies([]);
      }
    };
    loadCurrencies();
  }, [canViewCurrency]);

  const [tests, setTests] = useState([
    {
      testId: "",
      testType: "",
      sampleType: "",
    },
  ]);

  const calculateAge = (dob, ageType) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      years--;
      months--;
    }

    return ageType === "MONTH" ? months : years;
  };

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = {
      ...form,
      [name]: value,
    };

    if (name === "dob" || name === "ageType") {
      updatedForm.age = calculateAge(
        name === "dob" ? value : form.dob,
        name === "ageType" ? value : form.ageType,
      );
    }

    setForm(updatedForm);
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

  // const addTestRow = () => {
  //   setTests([...tests, { testId: "", testType: "", sampleType: "" }]);
  // };
  const addTestRow = () => {
    const lastRow = tests[tests.length - 1];

    if (!lastRow.testId) {
      alert("Please select a test before adding another test.");

      return;
    }

    setTests([
      ...tests,
      {
        testId: "",
        testType: "",
        sampleType: "",
      },
    ]);
  };

  const removeTestRow = (index) => {
    const updated = [...tests];

    updated.splice(index, 1);

    setTests(updated);
  };

  // const handleSubmit = async () => {
  //   const payload = {
  //     ...form,
  //     organizationId: form.organizationId ? Number(form.organizationId) : null,
  //     insuranceId: form.insuranceId ? Number(form.insuranceId) : null,
  //     tests: tests,
  //   };

  //   await createPatient(payload);

  //   navigate("/patients");
  // };
  // const savePatient = async () => {
  //   try {
  //     const payload = {
  //       ...form,
  //       organizationId: form.organizationId
  //         ? Number(form.organizationId)
  //         : null,
  //       insuranceId: form.insuranceId ? Number(form.insuranceId) : null,
  //       tests: tests,
  //     };

  //     const res = await createPatient(payload);

  //     setShowPrivacyModal(false);

  //     // ✅ Backend message
  //     alert(res.data.message); // "Patient created successfully"

  //     navigate("/patients");
  //   } catch (error) {
  //     console.error(error);

  //     alert(error.response?.data?.message || "Failed to create patient ❌");
  //   }
  // };

  const savePatient = async () => {

  if (savingPatient) return;

   if (!form.proposalId.trim()) {
        alert("Proposal number is required.");
        return;
    }

  try {

    setSavingPatient(true);

    const payload = {
      ...form,

      proposalId: form.proposalId.trim(),

      organizationId: form.organizationId
        ? Number(form.organizationId)
        : null,

      insuranceId: form.insuranceId
        ? Number(form.insuranceId)
        : null,

      tests: tests.filter( (t) => t.testId && t.testId !== "" ),
    };

    const res = await createPatient(payload);

    setShowPrivacyModal(false);

    alert(res.data.message);

    navigate("/patients");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to create patient ❌"
    );

  } finally {

    setSavingPatient(false);
  }
};

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;

    setForm({ ...form, country: countryCode, state: "", city: "" });

    loadStates(countryCode);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;

    setForm({ ...form, state: stateCode, city: "" });

    loadCities(form.country, stateCode);
  };

  const handleSubmit = async () => {
    try {
      setLoadingConsent(true);

      const res = await getLatestPrivacyNotice();

      setPrivacyNotice(res.data.data);

      setConsentChecked(false);

      setShowPrivacyModal(true);
    } catch (e) {
      alert("Unable to fetch latest Privacy Notice.");
    } finally {
      setLoadingConsent(false);
    }
  };

  return (
    <div className="container-fluid mt-3 add-patient-page">
      <style>{addPatientStyles}</style>
      <div className="card">
        <div className="card-header add-header">
          <div className="add-header-icon"><FaPlusCircle /></div>
          <div className="add-header-copy">
            <span>New Patient Registration</span>
            <span className="add-header-subtitle">Enter patient information, organization details and package tests</span>
          </div>
        </div>

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
                {/* <select
                  className="form-control code"
                  name="mobileCountryCode"
                  value={form.mobileCountryCode}
                  onChange={handleChange}
                >
                  <option>+0055</option>
                  <option>+91</option>
                </select> */}
                <select
                  className="form-control code"
                  name="mobileCountryCode"
                  value={form.mobileCountryCode}
                  onChange={handleChange}
                >
                  <option value="">Code</option>

                  {countries.map((country) => (
                    <option key={country.iso2} value={`+${country.phonecode}`}>
                      {country.name} (+{country.phonecode})
                    </option>
                  ))}
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
                  readOnly
                />

                <select
                  className="form-control"
                  name="ageType"
                  value={form.ageType}
                  onChange={handleChange}
                >
                  <option value="YEAR">Years</option>
                  <option value="MONTH">Months</option>
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

              {/* <select
                className="form-control"
                name="country"
                value={form.country}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="England">England</option>
              </select> */}
              <select
                className="form-control"
                value={form.country}
                onChange={handleCountryChange}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>State</label>

              {/* <select
                className="form-control"
                name="state"
                value={form.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
              </select> */}
              <select
                className="form-control"
                value={form.state}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.iso2} value={s.iso2}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>City</label>

              {/* <select
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select> */}
              <select
                className="form-control"
                value={form.city}
                name="city"
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
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
              {!canViewCurrency ? (
                <input
                  className="form-control"
                  value="No Currency Access"
                  disabled
                />
              ) : (
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
              )}
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

            {/* <div className="col-md-6">
              <label>Select Organization</label>
              {!canViewOrg ? (
                <input
                  className="form-control"
                  value="No Organization Access"
                  disabled
                />
              ) : (
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
              )}
            </div> */}
            <div className="col-md-6">
              <label>Select Organization</label>

              {!canViewOrg ? (
                <input
                  className="form-control"
                  value="No Organization Access"
                  disabled
                />
              ) : isAdmin ? (
                <select
                  className="form-control"
                  name="organizationId"
                  value={form.organizationId}
                  onChange={handleChange}
                >
                  <option value="">Select Organization</option>

                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.organizationName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-control"
                  value={currentUser?.organization?.organizationName || ""}
                  disabled
                />
              )}
            </div>

            <div className="col-md-6">
              <label>Insurance Company</label>
              {!canViewInsurance ? (
                <input
                  className="form-control"
                  value="No Insurance Access"
                  disabled
                />
              ) : (
                <select
                  className="form-control"
                  name="insuranceId"
                  value={form.insuranceId}
                  onChange={handleChange}
                >
                  <option value="">Select Insurance</option>

                  {insurances.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.insuranceName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <hr />

          <h6 className="section-heading">Package Details</h6>

          <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S NO.</th>
                <th>SELECT TEST</th>
                <th>TEST TYPE</th>
                <th>SAMPLE TYPE</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>
                    {!canViewTest ? (
                      <input
                        className="form-control"
                        value="No Test Access"
                        disabled
                      />
                    ) : (
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
                    )}
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

                  {/* <td>
                    <button className="btn btn-success" onClick={addTestRow}>
                      +
                    </button>
                  </td> */}
                  <td>
                    {index === tests.length - 1 && (
                      <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={addTestRow}
                        title="Add Test"
                      >
                        <FaPlusCircle />
                      </button>
                    )}

                    {tests.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeTestRow(index)}
                        title="Remove Test"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="action-row">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={loadingConsent}
            >
              {loadingConsent ? "Loading..." : "Submit"}
            </button>

            <button
              className="btn btn-danger ms-3"
              onClick={() => navigate("/")}
            >
              Goto Dashboard
            </button>

            {/* Privacy Notice Modal */}

            {showPrivacyModal && (
              <>
                <div
                  className="modal fade show"
                  style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.6)",
                  }}
                >
                  <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Privacy Notice</h5>

                        <button
                          className="btn-close"
                          onClick={() => {
                            setConsentChecked(false);

                            setShowPrivacyModal(false);
                          }}
                        />
                      </div>

                      <div className="modal-body">
                        <div className="alert alert-info">
                          <h6>
                            Purpose :<strong> Patient Registration</strong>
                          </h6>

                          <p className="mb-1">
                            <strong>Title :</strong> {privacyNotice?.title}
                          </p>

                          <p className="mb-1">
                            <strong>Version :</strong> {privacyNotice?.version}
                          </p>
                        </div>

                        <div className="privacy-content">
                          {privacyNotice?.content}
                        </div>

                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="privacyConsent"
                            checked={consentChecked}
                            onChange={(e) =>
                              setConsentChecked(e.target.checked)
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="privacyConsent"
                          >
                            I have read and understood the Privacy Notice and I
                            agree to the processing of my personal data for
                            Patient Registration.
                          </label>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setConsentChecked(false);

                            setShowPrivacyModal(false);
                          }}
                        >
                          Cancel
                        </button>

                        {/* <button
                          className="btn btn-primary"
                          disabled={!consentChecked}
                          onClick={async () => {
                            await savePatient();

                            setConsentChecked(false);
                          }}
                        >
                          Accept & Continue
                        </button> */}

                        <button
    className="btn btn-primary"
    disabled={!consentChecked || savingPatient}
    onClick={savePatient}
>
    {savingPatient
        ? "Registering..."
        : "Accept & Continue"}
</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-backdrop fade show"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;

// import React, { useState, useEffect } from "react";
// import "../../styles/addPatient.css";
// import { useNavigate } from "react-router-dom";
// import { createPatient } from "../../services/patientService";
// import { getOrganizationsAll } from "../../services/organizationService";
// import { getAllInsurances } from "../../services/insuranceService";
// import { getAllTests } from "../../services/testService";
// import { getAllCurrencies } from "../../services/currencyService";
// import { hasPermission } from "../permissionUtil";
// import { useLocation } from "../../hooks/useLocation";
// import { getCurrentUser } from "../../services/userService";
// import { getLatestPrivacyNotice } from "../../services/dpdpService";
// import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

// const AddPatient = () => {
//   const canViewOrg = hasPermission("Organization", "VIEW");
//   const canViewCurrency = hasPermission("Currency", "VIEW");
//   const canViewTest = hasPermission("Test Master", "VIEW");
//   const canViewInsurance = hasPermission("Insurance", "VIEW");
//   const navigate = useNavigate();
//   const { countries, states, cities, loadStates, loadCities } = useLocation();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);

//   const [privacyNotice, setPrivacyNotice] = useState(null);

//   const [consentChecked, setConsentChecked] = useState(false);

//   const [loadingConsent, setLoadingConsent] = useState(false);

//   const [savingPatient, setSavingPatient] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     patientName: "",
//     gender: "",
//     mobileCountryCode: "",
//     mobileNumber: "",
//     dob: "",
//     age: "",
//     ageType: "YEAR",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     email: "",
//     nationalIdNumber: "",
//     passportNumber: "",
//     currency: "",
//     proposalId: "",
//     organizationId: "",
//     insuranceId: "",
//   });

//   const [organizations, setOrganizations] = useState([]);
//   // useEffect(() => {
//   //   const loadOrgs = async () => {
//   //     const res = await getOrganizationsAll();
//   //     setOrganizations(res.data.data);
//   //   };
//   //   loadOrgs();
//   // }, []);
//   useEffect(() => {
//     if (!canViewOrg) {
//       setOrganizations([]);
//       return;
//     }
//     const loadOrgs = async () => {
//       try {
//         const res = await getOrganizationsAll();
//         setOrganizations(res.data.data || []);
//       } catch (err) {
//         console.warn("Organization access denied");
//         setOrganizations([]); // fallback
//       }
//     };
//     loadOrgs();
//   }, [canViewOrg]);

//   useEffect(() => {
//     const loadCurrentUser = async () => {
//       try {
//         const res = await getCurrentUser();

//         setCurrentUser(res.data.data);

//         const admin = res.data.data.roles?.some(
//           (r) => r.name?.toLowerCase() === "admin",
//         );

//         setIsAdmin(admin);

//         // Non-admin => organization auto select
//         if (!admin && res.data.data.organization) {
//           setForm((prev) => ({
//             ...prev,
//             organizationId: res.data.data.organization.id,
//           }));
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadCurrentUser();
//   }, []);

//   const [insurances, setInsurances] = useState([]);
//   // useEffect(() => {
//   //   const loadInsurance = async () => {
//   //     const res = await getAllInsurances();
//   //     setInsurances(res.data.data);
//   //   };
//   //   loadInsurance();
//   // }, []);
//   useEffect(() => {
//     if (!canViewInsurance) {
//       setInsurances([]);
//       return;
//     }
//     // const loadInsurance = async () => {
//     //   try {
//     //     const res = await getAllInsurances();
//     //     setInsurances(res.data.data || []);
//     //   } catch (err) {
//     //     console.warn("Insurance access denied");
//     //     setInsurances([]);
//     //   }
//     // };
//     const loadInsurance = async () => {
//       try {
//         const res = await getAllInsurances();
//         console.log("Insurance API Response => ", res.data);

//         let insuranceList = res.data.data || [];

//         // Non Admin => only own organization insurances
//         if (currentUser && !isAdmin && currentUser.organization) {
//           insuranceList = insuranceList.filter(
//             (i) => i.organizationId === currentUser.organization.id,
//           );
//         }

//         setInsurances(insuranceList);
//       } catch (err) {
//         console.warn("Insurance access denied");
//         setInsurances([]);
//       }
//     };
//     loadInsurance();
//   }, [canViewInsurance, currentUser, isAdmin]);

//   const [allTests, setAllTests] = useState([]);
//   // useEffect(() => {
//   //   const loadTests = async () => {
//   //     const res = await getAllTests();
//   //     setAllTests(res.data.data);
//   //   };
//   //   loadTests();
//   // }, []);
//   useEffect(() => {
//     if (!canViewTest) {
//       setAllTests([]);
//       return;
//     }
//     const loadTests = async () => {
//       try {
//         const res = await getAllTests();
//         setAllTests(res.data.data || []);
//       } catch (err) {
//         console.warn("Test access denied");
//         setAllTests([]);
//       }
//     };
//     loadTests();
//   }, [canViewTest]);

//   const [currencies, setCurrencies] = useState([]);
//   // useEffect(() => {
//   //   const loadCurrencies = async () => {
//   //     const res = await getAllCurrencies();
//   //     setCurrencies(res.data.data); // assuming {data: {data: [...]}}
//   //   };

//   //   loadCurrencies();
//   // }, []);
//   useEffect(() => {
//     if (!canViewCurrency) {
//       setCurrencies([]);
//       return;
//     }
//     const loadCurrencies = async () => {
//       try {
//         const res = await getAllCurrencies();
//         setCurrencies(res.data.data || []);
//       } catch (err) {
//         console.warn("Currency access denied");
//         setCurrencies([]);
//       }
//     };
//     loadCurrencies();
//   }, [canViewCurrency]);

//   const [tests, setTests] = useState([
//     {
//       testId: "",
//       testType: "",
//       sampleType: "",
//     },
//   ]);

//   const calculateAge = (dob, ageType) => {
//     if (!dob) return "";

//     const birthDate = new Date(dob);
//     const today = new Date();

//     let years = today.getFullYear() - birthDate.getFullYear();
//     let months =
//       (today.getFullYear() - birthDate.getFullYear()) * 12 +
//       (today.getMonth() - birthDate.getMonth());

//     if (
//       today.getMonth() < birthDate.getMonth() ||
//       (today.getMonth() === birthDate.getMonth() &&
//         today.getDate() < birthDate.getDate())
//     ) {
//       years--;
//       months--;
//     }

//     return ageType === "MONTH" ? months : years;
//   };

//   // const handleChange = (e) => {
//   //   setForm({ ...form, [e.target.name]: e.target.value });
//   // };
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let updatedForm = {
//       ...form,
//       [name]: value,
//     };

//     if (name === "dob" || name === "ageType") {
//       updatedForm.age = calculateAge(
//         name === "dob" ? value : form.dob,
//         name === "ageType" ? value : form.ageType,
//       );
//     }

//     setForm(updatedForm);
//   };

//   const handleTestChange = (index, field, value) => {
//     const updated = [...tests];

//     updated[index][field] = value;

//     // 🔥 AUTO FILL
//     if (field === "testId") {
//       const selectedTest = allTests.find((t) => t.id === Number(value));

//       if (selectedTest) {
//         updated[index].testType = selectedTest.testType;
//         updated[index].sampleType = selectedTest.sampleType;
//       }
//     }

//     setTests(updated);
//   };

//   // const addTestRow = () => {
//   //   setTests([...tests, { testId: "", testType: "", sampleType: "" }]);
//   // };
//   const addTestRow = () => {
//     const lastRow = tests[tests.length - 1];

//     if (!lastRow.testId) {
//       alert("Please select a test before adding another test.");

//       return;
//     }

//     setTests([
//       ...tests,
//       {
//         testId: "",
//         testType: "",
//         sampleType: "",
//       },
//     ]);
//   };

//   const removeTestRow = (index) => {
//     const updated = [...tests];

//     updated.splice(index, 1);

//     setTests(updated);
//   };

//   // const handleSubmit = async () => {
//   //   const payload = {
//   //     ...form,
//   //     organizationId: form.organizationId ? Number(form.organizationId) : null,
//   //     insuranceId: form.insuranceId ? Number(form.insuranceId) : null,
//   //     tests: tests,
//   //   };

//   //   await createPatient(payload);

//   //   navigate("/patients");
//   // };
//   // const savePatient = async () => {
//   //   try {
//   //     const payload = {
//   //       ...form,
//   //       organizationId: form.organizationId
//   //         ? Number(form.organizationId)
//   //         : null,
//   //       insuranceId: form.insuranceId ? Number(form.insuranceId) : null,
//   //       tests: tests,
//   //     };

//   //     const res = await createPatient(payload);

//   //     setShowPrivacyModal(false);

//   //     // ✅ Backend message
//   //     alert(res.data.message); // "Patient created successfully"

//   //     navigate("/patients");
//   //   } catch (error) {
//   //     console.error(error);

//   //     alert(error.response?.data?.message || "Failed to create patient ❌");
//   //   }
//   // };

//   const savePatient = async () => {

//   if (savingPatient) return;

//    if (!form.proposalId.trim()) {
//         alert("Proposal number is required.");
//         return;
//     }

//   try {

//     setSavingPatient(true);

//     const payload = {
//       ...form,

//       proposalId: form.proposalId.trim(),

//       organizationId: form.organizationId
//         ? Number(form.organizationId)
//         : null,

//       insuranceId: form.insuranceId
//         ? Number(form.insuranceId)
//         : null,

//       tests: tests.filter( (t) => t.testId && t.testId !== "" ),
//     };

//     const res = await createPatient(payload);

//     setShowPrivacyModal(false);

//     alert(res.data.message);

//     navigate("/patients");

//   } catch (error) {

//     console.error(error);

//     alert(
//       error.response?.data?.message ||
//       "Failed to create patient ❌"
//     );

//   } finally {

//     setSavingPatient(false);
//   }
// };

//   const handleCountryChange = (e) => {
//     const countryCode = e.target.value;

//     setForm({ ...form, country: countryCode, state: "", city: "" });

//     loadStates(countryCode);
//   };

//   const handleStateChange = (e) => {
//     const stateCode = e.target.value;

//     setForm({ ...form, state: stateCode, city: "" });

//     loadCities(form.country, stateCode);
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoadingConsent(true);

//       const res = await getLatestPrivacyNotice();

//       setPrivacyNotice(res.data.data);

//       setConsentChecked(false);

//       setShowPrivacyModal(true);
//     } catch (e) {
//       alert("Unable to fetch latest Privacy Notice.");
//     } finally {
//       setLoadingConsent(false);
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">New Patient Registration</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-2">
//               <label>Title</label>

//               <select
//                 className="form-control"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//               >
//                 <option>Select</option>
//                 <option>Mr</option>
//                 <option>Mrs</option>
//                 <option>Ms</option>
//               </select>
//             </div>

//             <div className="col-md-5">
//               <label>Patient Name</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="patientName"
//                 value={form.patientName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Gender</label>

//               <select
//                 className="form-control"
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//               >
//                 <option>Select</option>
//                 <option>Male</option>
//                 <option>Female</option>
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>Mobile No.</label>

//               <div className="d-flex">
//                 {/* <select
//                   className="form-control code"
//                   name="mobileCountryCode"
//                   value={form.mobileCountryCode}
//                   onChange={handleChange}
//                 >
//                   <option>+0055</option>
//                   <option>+91</option>
//                 </select> */}
//                 <select
//                   className="form-control code"
//                   name="mobileCountryCode"
//                   value={form.mobileCountryCode}
//                   onChange={handleChange}
//                 >
//                   <option value="">Code</option>

//                   {countries.map((country) => (
//                     <option key={country.iso2} value={`+${country.phonecode}`}>
//                       {country.name} (+{country.phonecode})
//                     </option>
//                   ))}
//                 </select>

//                 <input
//                   type="text"
//                   className="form-control"
//                   name="mobileNumber"
//                   value={form.mobileNumber}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-md-3">
//               <label>DOB</label>

//               <input
//                 type="date"
//                 className="form-control"
//                 name="dob"
//                 value={form.dob}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Age</label>

//               <div className="d-flex">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="age"
//                   value={form.age}
//                   readOnly
//                 />

//                 <select
//                   className="form-control"
//                   name="ageType"
//                   value={form.ageType}
//                   onChange={handleChange}
//                 >
//                   <option value="YEAR">Years</option>
//                   <option value="MONTH">Months</option>
//                 </select>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <label>Address</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Country</label>

//               {/* <select
//                 className="form-control"
//                 name="country"
//                 value={form.country}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//                 <option value="UAE">UAE</option>
//                 <option value="England">England</option>
//               </select> */}
//               <select
//                 className="form-control"
//                 value={form.country}
//                 onChange={handleCountryChange}
//               >
//                 <option value="">Select Country</option>
//                 {countries.map((c) => (
//                   <option key={c.iso2} value={c.iso2}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>State</label>

//               {/* <select
//                 className="form-control"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//               >
//                 <option value="">Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Gujarat">Gujarat</option>
//               </select> */}
//               <select
//                 className="form-control"
//                 value={form.state}
//                 onChange={handleStateChange}
//               >
//                 <option value="">Select State</option>
//                 {states.map((s) => (
//                   <option key={s.iso2} value={s.iso2}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>City</label>

//               {/* <select
//                 className="form-control"
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//               >
//                 <option value="">Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Ahmedabad">Ahmedabad</option>
//               </select> */}
//               <select
//                 className="form-control"
//                 value={form.city}
//                 name="city"
//                 onChange={handleChange}
//               >
//                 <option value="">Select City</option>
//                 {cities.map((c) => (
//                   <option key={c.id} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>Email</label>

//               <input
//                 type="email"
//                 className="form-control"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>National ID Number</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="nationalIdNumber"
//                 value={form.nationalIdNumber}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Passport No.</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="passportNumber"
//                 value={form.passportNumber}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Currency</label>
//               {!canViewCurrency ? (
//                 <input
//                   className="form-control"
//                   value="No Currency Access"
//                   disabled
//                 />
//               ) : (
//                 <select
//                   className="form-control"
//                   name="currency"
//                   value={form.currency}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Currency</option>

//                   {currencies.map((c) => (
//                     <option key={c.id} value={c.currencyCode}>
//                       {c.currencyCode}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             <div className="col-md-6">
//               <label>Proposal Id</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 name="proposalId"
//                 value={form.proposalId}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* <div className="col-md-6">
//               <label>Select Organization</label>
//               {!canViewOrg ? (
//                 <input
//                   className="form-control"
//                   value="No Organization Access"
//                   disabled
//                 />
//               ) : (
//                 <select
//                   className="form-control"
//                   name="organizationId"
//                   value={form.organizationId}
//                   onChange={handleChange}
//                 >
//                   <option value="">All</option>

//                   {organizations.map((o) => (
//                     <option key={o.id} value={o.id}>
//                       {o.organizationName}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div> */}
//             <div className="col-md-6">
//               <label>Select Organization</label>

//               {!canViewOrg ? (
//                 <input
//                   className="form-control"
//                   value="No Organization Access"
//                   disabled
//                 />
//               ) : isAdmin ? (
//                 <select
//                   className="form-control"
//                   name="organizationId"
//                   value={form.organizationId}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Organization</option>

//                   {organizations.map((o) => (
//                     <option key={o.id} value={o.id}>
//                       {o.organizationName}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   className="form-control"
//                   value={currentUser?.organization?.organizationName || ""}
//                   disabled
//                 />
//               )}
//             </div>

//             <div className="col-md-6">
//               <label>Insurance Company</label>
//               {!canViewInsurance ? (
//                 <input
//                   className="form-control"
//                   value="No Insurance Access"
//                   disabled
//                 />
//               ) : (
//                 <select
//                   className="form-control"
//                   name="insuranceId"
//                   value={form.insuranceId}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Insurance</option>

//                   {insurances.map((i) => (
//                     <option key={i.id} value={i.id}>
//                       {i.insuranceName}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           </div>

//           <hr />

//           <h6>Package Details</h6>

//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>S NO.</th>
//                 <th>SELECT TEST</th>
//                 <th>TEST TYPE</th>
//                 <th>SAMPLE TYPE</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {tests.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>

//                   <td>
//                     {!canViewTest ? (
//                       <input
//                         className="form-control"
//                         value="No Test Access"
//                         disabled
//                       />
//                     ) : (
//                       <select
//                         className="form-control"
//                         value={item.testId}
//                         onChange={(e) =>
//                           handleTestChange(index, "testId", e.target.value)
//                         }
//                       >
//                         <option>--Select--</option>
//                         {allTests.map((t) => (
//                           <option key={t.id} value={t.id}>
//                             {t.testName}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </td>

//                   <td>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={item.testType}
//                       onChange={(e) =>
//                         handleTestChange(index, "testType", e.target.value)
//                       }
//                     />
//                   </td>

//                   <td>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={item.sampleType}
//                       onChange={(e) =>
//                         handleTestChange(index, "sampleType", e.target.value)
//                       }
//                     />
//                   </td>

//                   {/* <td>
//                     <button className="btn btn-success" onClick={addTestRow}>
//                       +
//                     </button>
//                   </td> */}
//                   <td>
//                     {index === tests.length - 1 && (
//                       <button
//                         type="button"
//                         className="btn btn-success me-2"
//                         onClick={addTestRow}
//                         title="Add Test"
//                       >
//                         <FaPlusCircle />
//                       </button>
//                     )}

//                     {tests.length > 1 && (
//                       <button
//                         type="button"
//                         className="btn btn-danger"
//                         onClick={() => removeTestRow(index)}
//                         title="Remove Test"
//                       >
//                         <FaTrashAlt />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="mt-3">
//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleSubmit}
//               disabled={loadingConsent}
//             >
//               {loadingConsent ? "Loading..." : "Submit"}
//             </button>

//             <button
//               className="btn btn-danger ms-3"
//               onClick={() => navigate("/")}
//             >
//               Goto Dashboard
//             </button>

//             {/* Privacy Notice Modal */}

//             {showPrivacyModal && (
//               <>
//                 <div
//                   className="modal fade show"
//                   style={{
//                     display: "block",
//                     backgroundColor: "rgba(0,0,0,0.6)",
//                   }}
//                 >
//                   <div className="modal-dialog modal-lg modal-dialog-scrollable">
//                     <div className="modal-content">
//                       <div className="modal-header">
//                         <h5 className="modal-title">Privacy Notice</h5>

//                         <button
//                           className="btn-close"
//                           onClick={() => {
//                             setConsentChecked(false);

//                             setShowPrivacyModal(false);
//                           }}
//                         />
//                       </div>

//                       <div className="modal-body">
//                         <div className="alert alert-info">
//                           <h6>
//                             Purpose :<strong> Patient Registration</strong>
//                           </h6>

//                           <p className="mb-1">
//                             <strong>Title :</strong> {privacyNotice?.title}
//                           </p>

//                           <p className="mb-1">
//                             <strong>Version :</strong> {privacyNotice?.version}
//                           </p>
//                         </div>

//                         <div
//                           style={{
//                             maxHeight: "350px",
//                             overflowY: "auto",
//                             border: "1px solid #ddd",
//                             padding: "15px",
//                             borderRadius: "5px",
//                           }}
//                         >
//                           {privacyNotice?.content}
//                         </div>

//                         <div className="form-check mt-4">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id="privacyConsent"
//                             checked={consentChecked}
//                             onChange={(e) =>
//                               setConsentChecked(e.target.checked)
//                             }
//                           />

//                           <label
//                             className="form-check-label"
//                             htmlFor="privacyConsent"
//                           >
//                             I have read and understood the Privacy Notice and I
//                             agree to the processing of my personal data for
//                             Patient Registration.
//                           </label>
//                         </div>
//                       </div>

//                       <div className="modal-footer">
//                         <button
//                           className="btn btn-secondary"
//                           onClick={() => {
//                             setConsentChecked(false);

//                             setShowPrivacyModal(false);
//                           }}
//                         >
//                           Cancel
//                         </button>

//                         {/* <button
//                           className="btn btn-primary"
//                           disabled={!consentChecked}
//                           onClick={async () => {
//                             await savePatient();

//                             setConsentChecked(false);
//                           }}
//                         >
//                           Accept & Continue
//                         </button> */}

//                         <button
//     className="btn btn-primary"
//     disabled={!consentChecked || savingPatient}
//     onClick={savePatient}
// >
//     {savingPatient
//         ? "Registering..."
//         : "Accept & Continue"}
// </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-backdrop fade show"></div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPatient;
