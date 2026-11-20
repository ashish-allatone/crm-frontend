import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getPatientById, updatePatient } from "../../services/patientService";
import { getOrganizationsAll } from "../../services/organizationService";
import { getAllInsurances } from "../../services/insuranceService";
import { getAllTests } from "../../services/testService";
import { getAllCurrencies } from "../../services/currencyService";
import { hasPermission } from "../permissionUtil";
import { useLocation } from "../../hooks/useLocation";
import { getCurrentUser } from "../../services/userService";


import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const EditPatient = () => {
  const { countries, states, cities, loadStates, loadCities } = useLocation();
  const canViewOrg = hasPermission("Organization", "VIEW");
  const canViewInsurance = hasPermission("Insurance", "VIEW");
  const canViewTest = hasPermission("Test Master", "VIEW");
  const canViewCurrency = hasPermission("Currency", "VIEW");
  const navigate = useNavigate();

  const { id } = useParams();
  const [organizations, setOrganizations] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [testMaster, setTestMaster] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const orgRes = await getOrganizationsAll();
  //     const insRes = await getAllInsurances();

  //     setOrganizations(orgRes.data.data);
  //     setInsurances(insRes.data.data);
  //   };

  //   loadData();
  // }, []);
  // useEffect(() => {
  //   const loadData = async () => {
  //     // 🔥 ORGANIZATION
  //     if (canViewOrg) {
  //       try {
  //         const orgRes = await getOrganizationsAll();
  //         setOrganizations(orgRes.data.data || []);
  //       } catch {
  //         setOrganizations([]);
  //       }
  //     } else {
  //       setOrganizations([]);
  //     }

  //     // 🔥 INSURANCE
  //     if (canViewInsurance) {
  //       try {
  //         const insRes = await getAllInsurances();
  //         setInsurances(insRes.data.data || []);
  //       } catch {
  //         setInsurances([]);
  //       }
  //     } else {
  //       setInsurances([]);
  //     }
  //   };

  //   loadData();
  // }, [canViewOrg, canViewInsurance]);

  useEffect(() => {
  const loadData = async () => {

    // ORGANIZATION
    if (canViewOrg) {
      try {
        const orgRes = await getOrganizationsAll();
        setOrganizations(orgRes.data.data || []);
      } catch {
        setOrganizations([]);
      }
    } else {
      setOrganizations([]);
    }

    // INSURANCE
    if (canViewInsurance) {
      try {
        const insRes = await getAllInsurances();

        let insuranceList = insRes.data.data || [];

        // Non Admin -> only own org insurances
        if (
          currentUser &&
          !isAdmin &&
          currentUser.organization
        ) {
          insuranceList = insuranceList.filter(
            (i) =>
              i.organizationId ===
              currentUser.organization.id
          );
        }

        setInsurances(insuranceList);

      } catch {
        setInsurances([]);
      }
    } else {
      setInsurances([]);
    }
  };

  loadData();

}, [
  canViewOrg,
  canViewInsurance,
  currentUser,
  isAdmin
]);

  // useEffect(() => {
  //   const loadTests = async () => {
  //     const res = await getAllTests();
  //     setTestMaster(res.data.data);
  //   };

  //   loadTests();
  // }, []);
  useEffect(() => {
    if (!canViewTest) {
      setTestMaster([]);
      return;
    }

    const loadTests = async () => {
      try {
        const res = await getAllTests();
        setTestMaster(res.data.data || []);
      } catch {
        setTestMaster([]);
      }
    };

    loadTests();
  }, [canViewTest]);

  const [currencies, setCurrencies] = useState([]);
  // useEffect(() => {
  //   const loadCurrencies = async () => {
  //     const res = await getAllCurrencies();
  //     console.log("Currencies API 👉", res.data.data);  // ✅ YAHAN LAGAO
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
      } catch {
        setCurrencies([]);
      }
    };

    loadCurrencies();
  }, [canViewCurrency]);

  useEffect(() => {
  const loadCurrentUser = async () => {
    try {
      const res = await getCurrentUser();

      setCurrentUser(res.data.data);

      const admin = res.data.data.roles?.some(
        (r) => r.name?.toLowerCase() === "admin"
      );

      setIsAdmin(admin);

    } catch (err) {
      console.error(err);
    }
  };

  loadCurrentUser();
}, []);

  const [patient, setPatient] = useState({
    title: "",
    patientName: "", // ✅ FIX
    gender: "",
    mobileCountryCode: "",
    mobileNumber: "", // ✅ FIX
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
    organizationId: "", // ✅ FIX
    insuranceId: "", // ✅ FIX
  });
  useEffect(() => {
    const loadPatient = async () => {
      const res = await getPatientById(id);
      const data = res.data.data;

      // ✅ FIX HERE
      // setPatient({
      //   ...data,
      //   currency: data.currency ? data.currency.trim() : "",
      // });
      setPatient({
  ...data,
  currency: data.currency ? data.currency.trim() : "",
  age: calculateAge(
    data.dob,
    data.ageType
  ),
});

       if (data.country) {
      await loadStates(data.country);
    }

    if (data.country && data.state) {
      await loadCities(data.country, data.state);
    }

      setPackageTests(
        data.tests.map((t) => ({
          testId: t.testId,
          testType: t.testType,
          sampleType: t.sampleType,
        })),
      );
    };

    loadPatient();
  }, [id]);

  // const handleUpdate = async () => {
  //   const payload = {
  //     ...patient,
  //     organizationId: patient.organizationId
  //       ? Number(patient.organizationId)
  //       : null,
  //     insuranceId: patient.insuranceId ? Number(patient.insuranceId) : null,

  //     // ✅ IMPORTANT FIX
  //     tests: packageTests.map((t) => ({
  //       testId: t.testId,
  //       testType: t.testType,
  //       sampleType: t.sampleType,
  //     })),
  //   };

  //   await updatePatient(id, payload);

  //   navigate("/patients");
  // };

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

  return ageType === "MONTH"
    ? months
    : years;
};
  // const handleUpdate = async () => {
  //   try {
  //     const payload = {
  //       ...patient,
  //       organizationId: patient.organizationId
  //         ? Number(patient.organizationId)
  //         : null,
  //       insuranceId: patient.insuranceId ? Number(patient.insuranceId) : null,
  //       tests: packageTests.map((t) => ({
  //         testId: t.testId,
  //         testType: t.testType,
  //         sampleType: t.sampleType,
  //       })),
  //     };

  //     const res = await updatePatient(id, payload);

  //     // ✅ Backend message
  //     alert(res.data.message); // "Patient updated successfully"

  //     navigate("/patients");
  //   } catch (error) {
  //     console.error(error);

  //     alert(error.response?.data?.message || "Failed to update patient ❌");
  //   }
  // };

  const handleUpdate = async () => {
  try {

    // ✅ Only selected tests
    const validTests = packageTests.filter(
      (t) => t.testId && t.testId !== ""
    );

    // ❌ No test selected
    if (validTests.length === 0) {
      alert("At least one test is required.");
      return;
    }

    const payload = {
      ...patient,

      organizationId: patient.organizationId
        ? Number(patient.organizationId)
        : null,

      insuranceId: patient.insuranceId
        ? Number(patient.insuranceId)
        : null,

      proposalId: patient.proposalId?.trim(),

      tests: validTests.map((t) => ({
        testId: Number(t.testId),
        testType: t.testType,
        sampleType: t.sampleType,
      })),
    };

    // console.log("UPDATE PATIENT PAYLOAD:", payload);

    const res = await updatePatient(id, payload);

    alert(res.data.message || "Patient updated successfully");

    navigate("/patients");

  } catch (error) {
    console.error("Update patient error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to update patient ❌"
    );
  }
};

  const [packageTests, setPackageTests] = useState([
    {
      testId: "",
      testType: "",
      sampleType: "",
    },
  ]);

  // const addTestRow = () => {
  //   setPackageTests([
  //     ...packageTests,
  //     {
  //       test: "",
  //       type: "",
  //       sample: "",
  //     },
  //   ]);
  // };

  const addTestRow = () => {
  const lastRow = packageTests[packageTests.length - 1];

  if (!lastRow.testId) {
    alert("Please select a test before adding another test.");
    return;
  }

  setPackageTests([
    ...packageTests,
    {
      testId: "",
      testType: "",
      sampleType: "",
    },
  ]);
};

const removeTestRow = (index) => {
  const updated = [...packageTests];

  updated.splice(index, 1);

  setPackageTests(updated);
};
  const handleTestChange = (index, field, value) => {
    const updated = [...packageTests];

    updated[index][field] = value;

    // ✅ AUTO FILL LOGIC (ADD THIS)
    if (field === "testId") {
      const selectedTest = testMaster.find((t) => t.id === Number(value));

      if (selectedTest) {
        updated[index].testType = selectedTest.testType;
        updated[index].sampleType = selectedTest.sampleType;
      }
    }

    setPackageTests(updated);
  };
  console.log("Selected Currency 👉", patient.currency);

  const handleCountryChange = (e) => {
  const countryCode = e.target.value;

  setPatient({ ...patient, country: countryCode, state: "", city: "" });

  loadStates(countryCode);
};

const handleStateChange = (e) => {
  const stateCode = e.target.value;

  setPatient({ ...patient, state: stateCode, city: "" });

  loadCities(patient.country, stateCode);
};

  return (
    <div className="container-fluid mt-3 ep-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ep-page { color:#18243a; font-family:Inter, sans-serif; padding-bottom:24px; }
        .ep-page .ep-card { border:1px solid #e7edf3; border-radius:14px; overflow:hidden; box-shadow:0 5px 22px rgba(15,39,66,.07); background:#fff; }
        .ep-page .ep-header { min-height:76px; padding:18px 24px; display:flex; align-items:center; gap:14px; color:#fff; background:linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%); font-size:19px; font-weight:700; letter-spacing:-.25px; }
        .ep-page .ep-header-icon { width:42px; height:42px; border-radius:11px; display:grid; place-items:center; flex:0 0 42px; background:rgba(255,255,255,.13); font-size:20px; }
        .ep-page .ep-header-copy { display:flex; flex-direction:column; gap:3px; }
        .ep-page .ep-subtitle { color:#c6d7e6; font-size:12px; font-weight:400; letter-spacing:0; }
        .ep-page .ep-body { padding:24px; }
        .ep-page label { display:block; margin:0 0 7px; color:#34445b; font-size:12px; font-weight:600; }
        .ep-page .form-control { min-height:42px; border:1px solid #dce4ec; border-radius:8px; color:#24354b; background-color:#fff; font-family:inherit; font-size:13px; box-shadow:none; transition:border-color .15s,box-shadow .15s; }
        .ep-page .form-control:focus { border-color:#3979a8; box-shadow:0 0 0 3px rgba(24,91,139,.11); }
        .ep-page .form-control:disabled,.ep-page .form-control[readonly] { background:#f4f7fa; color:#64748b; }
        .ep-page .code { max-width:145px; margin-right:8px; }
        .ep-page .ep-section-title { display:flex; align-items:center; gap:9px; margin:0 0 14px; color:#173c5d; font-size:15px; font-weight:700; }
        .ep-page .ep-section-title:before { content:""; width:4px; height:18px; border-radius:4px; background:#1d6799; }
        .ep-page .ep-divider { border:0; border-top:1px solid #e8edf2; margin:24px 0 20px; opacity:1; }
        .ep-page .table-responsive { width:100%; overflow-x:auto; }
        .ep-page .table { min-width:700px; margin:0; border-color:#e5ebf1; vertical-align:middle; }
        .ep-page .table thead th { padding:13px 12px; border-bottom:1px solid #dce5ed; background:#f3f6f9; color:#52647a; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; white-space:nowrap; }
        .ep-page .table tbody td { padding:10px 12px; color:#34445b; font-size:13px; }
        .ep-page .table tbody tr:hover { background:#f9fbfd; }
        .ep-page .btn { min-height:38px; border-radius:8px; padding:8px 15px; font-family:inherit; font-size:12px; font-weight:600; box-shadow:none; }
        .ep-page .btn-primary { border-color:#0e3d66; background:#0e3d66; }
        .ep-page .btn-primary:hover { border-color:#092d4c; background:#092d4c; }
        .ep-page .btn-success { border-color:#16845b; background:#16845b; }
        .ep-page .btn-danger { border-color:#c94b54; background:#c94b54; }
        .ep-page .ep-icon-btn { width:36px; min-height:34px; padding:6px; display:inline-grid; place-items:center; }
        .ep-page .ep-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }
        @media(max-width:767px) { .ep-page .ep-body{padding:17px 14px;} .ep-page .ep-header{padding:16px;} .ep-page .ep-header{font-size:17px;} .ep-page .code{max-width:115px;} }
      `}</style>
      <div className="card ep-card">
        <div className="card-header ep-header">
          <span className="ep-header-icon">✎</span>
          <span className="ep-header-copy">Edit Patient Registration
            <span className="ep-subtitle">Update patient information and package details</span>
          </span>
        </div>

        <div className="card-body ep-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label>Title</label>

              <select
                className="form-control"
                value={patient.title}
                onChange={(e) =>
                  setPatient({ ...patient, title: e.target.value })
                }
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
                value={patient.patientName}
                onChange={(e) =>
                  setPatient({ ...patient, patientName: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <label>Gender</label>

              <select
                className="form-control"
                value={patient.gender}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Mobile No.</label>

              <div className="d-flex">
                {/* <select
                  className="form-control code"
                  value={patient.mobileCountryCode}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      mobileCountryCode: e.target.value,
                    })
                  }
                >
                  <option>+0055</option>
                  <option>+91</option>
                </select> */}
                <select
  className="form-control code"
  value={patient.mobileCountryCode}
  onChange={(e) =>
    setPatient({
      ...patient,
      mobileCountryCode: e.target.value,
    })
  }
>
  <option value="">Code</option>

  {countries.map((country) => (
    <option
      key={country.iso2}
      value={`+${country.phonecode}`}
    >
      {country.name} (+{country.phonecode})
    </option>
  ))}
</select>

                <input
                  type="text"
                  className="form-control"
                  value={patient.mobileNumber}
                  onChange={(e) =>
                    setPatient({ ...patient, mobileNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-3">
              <label>DOB</label>

              <input
                type="date"
                className="form-control"
                value={patient.dob}
                // onChange={(e) =>
                //   setPatient({ ...patient, dob: e.target.value })
                // }
                onChange={(e) =>
  setPatient({
    ...patient,
    dob: e.target.value,
    age: calculateAge(
      e.target.value,
      patient.ageType
    ),
  })
}
              />
            </div>

            <div className="col-md-3">
              <label>Age</label>

              <div className="d-flex">
                {/* <input
                  type="text"
                  className="form-control"
                  value={patient.age}
                  onChange={(e) =>
                    setPatient({ ...patient, age: e.target.value })
                  }
                /> */}
                <input
  type="text"
  className="form-control"
  value={patient.age}
  readOnly
/>

                {/* <select
                  className="form-control"
                  value={patient.ageType}
                  onChange={(e) =>
                    setPatient({ ...patient, ageType: e.target.value })
                  }
                >
                  <option>Year</option>
                  <option>Month</option>
                </select> */}
                <select
  className="form-control"
  value={patient.ageType}
  onChange={(e) =>
    setPatient({
      ...patient,
      ageType: e.target.value,
      age: calculateAge(
        patient.dob,
        e.target.value
      ),
    })
  }
>
  <option value="YEAR">Years</option>
  <option value="MONTH">Months</option>
</select>
              </div>
            </div>

            <div className="col-md-6">
              <label>Address</label>

              <input
                value={patient.address}
                className="form-control"
                onChange={(e) =>
                  setPatient({ ...patient, address: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Country</label>

              {/* <select
                className="form-control"
                value={patient.country}
                onChange={(e) =>
                  setPatient({ ...patient, country: e.target.value })
                }
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="England">England</option>
              </select> */}
              <select
  className="form-control"
  value={patient.country}
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
                value={patient.state}
                onChange={(e) =>
                  setPatient({ ...patient, state: e.target.value })
                }
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
              </select> */}
              <select
  className="form-control"
  value={patient.state}
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
                value={patient.city}
                onChange={(e) =>
                  setPatient({ ...patient, city: e.target.value })
                }
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select> */}
              <select
  className="form-control"
  value={patient.city}
  onChange={(e) =>
    setPatient({ ...patient, city: e.target.value })
  }
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
                placeholder="Enter Email"
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label>National ID Number</label>

              <input
                type="text"
                className="form-control"
                placeholder="National ID Number"
                value={patient.nationalIdNumber || ""} 
                onChange={(e) =>
                  setPatient({ ...patient, nationalIdNumber: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label>Passport No.</label>

              <input
                type="text"
                className="form-control"
                placeholder="Passport Number"
                value={patient.passportNumber || ""}
                onChange={(e) =>
                  setPatient({ ...patient, passportNumber: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label>Currency</label>
              {/* <select
                className="form-control"
                value={patient.currency || ""}
                onChange={(e) =>
                  setPatient({ ...patient, currency: e.target.value })
                }
              >
                <option value="">Select Currency</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.currencyCode?.trim()}>
                    {c.currencyCode}
                  </option>
                ))}
              </select>{" "} */}
              {!canViewCurrency ? (
                <input
                  className="form-control"
                  value="No Currency Access"
                  disabled
                />
              ) : (
                <select
                  className="form-control"
                  value={patient.currency || ""}
                  onChange={(e) =>
                    setPatient({ ...patient, currency: e.target.value })
                  }
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
                value={patient.proposalId}
                onChange={(e) =>
                  setPatient({ ...patient, proposalId: e.target.value })
                }
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
                  value={patient.organizationId}
                  onChange={(e) =>
                    setPatient({ ...patient, organizationId: e.target.value })
                  }
                >
                  <option value="">Select Organization</option>
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
      value={patient.organizationId}
      onChange={(e) =>
        setPatient({
          ...patient,
          organizationId: e.target.value,
        })
      }
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
      value={
        currentUser?.organization?.organizationName || ""
      }
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
                  value={patient.insuranceId}
                  onChange={(e) =>
                    setPatient({ ...patient, insuranceId: e.target.value })
                  }
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

          <hr className="ep-divider" />

          <h6 className="ep-section-title">Package Details</h6>

          <div className="table-responsive"><table className="table table-bordered">
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
              {packageTests.map((item, index) => (
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
                        <option value="">--Select--</option>

                        {testMaster.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.testName}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td>
                    <input
                      className="form-control"
                      value={item.testType}
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      className="form-control"
                      value={item.sampleType}
                      readOnly
                    />
                  </td>

                  {/* <td>
                    <button className="btn btn-success" onClick={addTestRow}>
                      +
                    </button>
                  </td> */}

                 <td>
  {index === packageTests.length - 1 && (
    <button
      type="button"
      className="btn btn-success ep-icon-btn me-2"
      onClick={addTestRow}
      title="Add Test"
    >
      <FaPlusCircle />
    </button>
  )}

  {packageTests.length > 1 && (
    <button
      type="button"
      className="btn btn-danger ep-icon-btn"
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
          </table></div>

          <div className="ep-actions">
            <button
              className="btn btn-primary submit-btn"
              onClick={handleUpdate}
            >
              Update
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

export default EditPatient;

// import React, { useState, useEffect } from "react";
// import "../../styles/addPatient.css";

// import { useNavigate, useParams } from "react-router-dom";

// import { getPatientById, updatePatient } from "../../services/patientService";
// import { getOrganizationsAll } from "../../services/organizationService";
// import { getAllInsurances } from "../../services/insuranceService";
// import { getAllTests } from "../../services/testService";
// import { getAllCurrencies } from "../../services/currencyService";
// import { hasPermission } from "../permissionUtil";
// import { useLocation } from "../../hooks/useLocation";
// import { getCurrentUser } from "../../services/userService";


// import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

// const EditPatient = () => {
//   const { countries, states, cities, loadStates, loadCities } = useLocation();
//   const canViewOrg = hasPermission("Organization", "VIEW");
//   const canViewInsurance = hasPermission("Insurance", "VIEW");
//   const canViewTest = hasPermission("Test Master", "VIEW");
//   const canViewCurrency = hasPermission("Currency", "VIEW");
//   const navigate = useNavigate();

//   const { id } = useParams();
//   const [organizations, setOrganizations] = useState([]);
//   const [insurances, setInsurances] = useState([]);
//   const [testMaster, setTestMaster] = useState([]);

//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // useEffect(() => {
//   //   const loadData = async () => {
//   //     const orgRes = await getOrganizationsAll();
//   //     const insRes = await getAllInsurances();

//   //     setOrganizations(orgRes.data.data);
//   //     setInsurances(insRes.data.data);
//   //   };

//   //   loadData();
//   // }, []);
//   // useEffect(() => {
//   //   const loadData = async () => {
//   //     // 🔥 ORGANIZATION
//   //     if (canViewOrg) {
//   //       try {
//   //         const orgRes = await getOrganizationsAll();
//   //         setOrganizations(orgRes.data.data || []);
//   //       } catch {
//   //         setOrganizations([]);
//   //       }
//   //     } else {
//   //       setOrganizations([]);
//   //     }

//   //     // 🔥 INSURANCE
//   //     if (canViewInsurance) {
//   //       try {
//   //         const insRes = await getAllInsurances();
//   //         setInsurances(insRes.data.data || []);
//   //       } catch {
//   //         setInsurances([]);
//   //       }
//   //     } else {
//   //       setInsurances([]);
//   //     }
//   //   };

//   //   loadData();
//   // }, [canViewOrg, canViewInsurance]);

//   useEffect(() => {
//   const loadData = async () => {

//     // ORGANIZATION
//     if (canViewOrg) {
//       try {
//         const orgRes = await getOrganizationsAll();
//         setOrganizations(orgRes.data.data || []);
//       } catch {
//         setOrganizations([]);
//       }
//     } else {
//       setOrganizations([]);
//     }

//     // INSURANCE
//     if (canViewInsurance) {
//       try {
//         const insRes = await getAllInsurances();

//         let insuranceList = insRes.data.data || [];

//         // Non Admin -> only own org insurances
//         if (
//           currentUser &&
//           !isAdmin &&
//           currentUser.organization
//         ) {
//           insuranceList = insuranceList.filter(
//             (i) =>
//               i.organizationId ===
//               currentUser.organization.id
//           );
//         }

//         setInsurances(insuranceList);

//       } catch {
//         setInsurances([]);
//       }
//     } else {
//       setInsurances([]);
//     }
//   };

//   loadData();

// }, [
//   canViewOrg,
//   canViewInsurance,
//   currentUser,
//   isAdmin
// ]);

//   // useEffect(() => {
//   //   const loadTests = async () => {
//   //     const res = await getAllTests();
//   //     setTestMaster(res.data.data);
//   //   };

//   //   loadTests();
//   // }, []);
//   useEffect(() => {
//     if (!canViewTest) {
//       setTestMaster([]);
//       return;
//     }

//     const loadTests = async () => {
//       try {
//         const res = await getAllTests();
//         setTestMaster(res.data.data || []);
//       } catch {
//         setTestMaster([]);
//       }
//     };

//     loadTests();
//   }, [canViewTest]);

//   const [currencies, setCurrencies] = useState([]);
//   // useEffect(() => {
//   //   const loadCurrencies = async () => {
//   //     const res = await getAllCurrencies();
//   //     console.log("Currencies API 👉", res.data.data);  // ✅ YAHAN LAGAO
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
//       } catch {
//         setCurrencies([]);
//       }
//     };

//     loadCurrencies();
//   }, [canViewCurrency]);

//   useEffect(() => {
//   const loadCurrentUser = async () => {
//     try {
//       const res = await getCurrentUser();

//       setCurrentUser(res.data.data);

//       const admin = res.data.data.roles?.some(
//         (r) => r.name?.toLowerCase() === "admin"
//       );

//       setIsAdmin(admin);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   loadCurrentUser();
// }, []);

//   const [patient, setPatient] = useState({
//     title: "",
//     patientName: "", // ✅ FIX
//     gender: "",
//     mobileCountryCode: "",
//     mobileNumber: "", // ✅ FIX
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
//     organizationId: "", // ✅ FIX
//     insuranceId: "", // ✅ FIX
//   });
//   useEffect(() => {
//     const loadPatient = async () => {
//       const res = await getPatientById(id);
//       const data = res.data.data;

//       // ✅ FIX HERE
//       // setPatient({
//       //   ...data,
//       //   currency: data.currency ? data.currency.trim() : "",
//       // });
//       setPatient({
//   ...data,
//   currency: data.currency ? data.currency.trim() : "",
//   age: calculateAge(
//     data.dob,
//     data.ageType
//   ),
// });

//        if (data.country) {
//       await loadStates(data.country);
//     }

//     if (data.country && data.state) {
//       await loadCities(data.country, data.state);
//     }

//       setPackageTests(
//         data.tests.map((t) => ({
//           testId: t.testId,
//           testType: t.testType,
//           sampleType: t.sampleType,
//         })),
//       );
//     };

//     loadPatient();
//   }, [id]);

//   // const handleUpdate = async () => {
//   //   const payload = {
//   //     ...patient,
//   //     organizationId: patient.organizationId
//   //       ? Number(patient.organizationId)
//   //       : null,
//   //     insuranceId: patient.insuranceId ? Number(patient.insuranceId) : null,

//   //     // ✅ IMPORTANT FIX
//   //     tests: packageTests.map((t) => ({
//   //       testId: t.testId,
//   //       testType: t.testType,
//   //       sampleType: t.sampleType,
//   //     })),
//   //   };

//   //   await updatePatient(id, payload);

//   //   navigate("/patients");
//   // };

//   const calculateAge = (dob, ageType) => {
//   if (!dob) return "";

//   const birthDate = new Date(dob);
//   const today = new Date();

//   let years = today.getFullYear() - birthDate.getFullYear();
//   let months =
//     (today.getFullYear() - birthDate.getFullYear()) * 12 +
//     (today.getMonth() - birthDate.getMonth());

//   if (
//     today.getMonth() < birthDate.getMonth() ||
//     (today.getMonth() === birthDate.getMonth() &&
//       today.getDate() < birthDate.getDate())
//   ) {
//     years--;
//     months--;
//   }

//   return ageType === "MONTH"
//     ? months
//     : years;
// };
//   // const handleUpdate = async () => {
//   //   try {
//   //     const payload = {
//   //       ...patient,
//   //       organizationId: patient.organizationId
//   //         ? Number(patient.organizationId)
//   //         : null,
//   //       insuranceId: patient.insuranceId ? Number(patient.insuranceId) : null,
//   //       tests: packageTests.map((t) => ({
//   //         testId: t.testId,
//   //         testType: t.testType,
//   //         sampleType: t.sampleType,
//   //       })),
//   //     };

//   //     const res = await updatePatient(id, payload);

//   //     // ✅ Backend message
//   //     alert(res.data.message); // "Patient updated successfully"

//   //     navigate("/patients");
//   //   } catch (error) {
//   //     console.error(error);

//   //     alert(error.response?.data?.message || "Failed to update patient ❌");
//   //   }
//   // };

//   const handleUpdate = async () => {
//   try {

//     // ✅ Only selected tests
//     const validTests = packageTests.filter(
//       (t) => t.testId && t.testId !== ""
//     );

//     // ❌ No test selected
//     if (validTests.length === 0) {
//       alert("At least one test is required.");
//       return;
//     }

//     const payload = {
//       ...patient,

//       organizationId: patient.organizationId
//         ? Number(patient.organizationId)
//         : null,

//       insuranceId: patient.insuranceId
//         ? Number(patient.insuranceId)
//         : null,

//       proposalId: patient.proposalId?.trim(),

//       tests: validTests.map((t) => ({
//         testId: Number(t.testId),
//         testType: t.testType,
//         sampleType: t.sampleType,
//       })),
//     };

//     // console.log("UPDATE PATIENT PAYLOAD:", payload);

//     const res = await updatePatient(id, payload);

//     alert(res.data.message || "Patient updated successfully");

//     navigate("/patients");

//   } catch (error) {
//     console.error("Update patient error:", error);

//     alert(
//       error.response?.data?.message ||
//       "Failed to update patient ❌"
//     );
//   }
// };

//   const [packageTests, setPackageTests] = useState([
//     {
//       testId: "",
//       testType: "",
//       sampleType: "",
//     },
//   ]);

//   // const addTestRow = () => {
//   //   setPackageTests([
//   //     ...packageTests,
//   //     {
//   //       test: "",
//   //       type: "",
//   //       sample: "",
//   //     },
//   //   ]);
//   // };

//   const addTestRow = () => {
//   const lastRow = packageTests[packageTests.length - 1];

//   if (!lastRow.testId) {
//     alert("Please select a test before adding another test.");
//     return;
//   }

//   setPackageTests([
//     ...packageTests,
//     {
//       testId: "",
//       testType: "",
//       sampleType: "",
//     },
//   ]);
// };

// const removeTestRow = (index) => {
//   const updated = [...packageTests];

//   updated.splice(index, 1);

//   setPackageTests(updated);
// };
//   const handleTestChange = (index, field, value) => {
//     const updated = [...packageTests];

//     updated[index][field] = value;

//     // ✅ AUTO FILL LOGIC (ADD THIS)
//     if (field === "testId") {
//       const selectedTest = testMaster.find((t) => t.id === Number(value));

//       if (selectedTest) {
//         updated[index].testType = selectedTest.testType;
//         updated[index].sampleType = selectedTest.sampleType;
//       }
//     }

//     setPackageTests(updated);
//   };
//   console.log("Selected Currency 👉", patient.currency);

//   const handleCountryChange = (e) => {
//   const countryCode = e.target.value;

//   setPatient({ ...patient, country: countryCode, state: "", city: "" });

//   loadStates(countryCode);
// };

// const handleStateChange = (e) => {
//   const stateCode = e.target.value;

//   setPatient({ ...patient, state: stateCode, city: "" });

//   loadCities(patient.country, stateCode);
// };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Edit Patient Registration</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-2">
//               <label>Title</label>

//               <select
//                 className="form-control"
//                 value={patient.title}
//                 onChange={(e) =>
//                   setPatient({ ...patient, title: e.target.value })
//                 }
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
//                 value={patient.patientName}
//                 onChange={(e) =>
//                   setPatient({ ...patient, patientName: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Gender</label>

//               <select
//                 className="form-control"
//                 value={patient.gender}
//                 onChange={(e) =>
//                   setPatient({ ...patient, gender: e.target.value })
//                 }
//               >
//                 <option>Male</option>
//                 <option>Female</option>
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>Mobile No.</label>

//               <div className="d-flex">
//                 {/* <select
//                   className="form-control code"
//                   value={patient.mobileCountryCode}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       mobileCountryCode: e.target.value,
//                     })
//                   }
//                 >
//                   <option>+0055</option>
//                   <option>+91</option>
//                 </select> */}
//                 <select
//   className="form-control code"
//   value={patient.mobileCountryCode}
//   onChange={(e) =>
//     setPatient({
//       ...patient,
//       mobileCountryCode: e.target.value,
//     })
//   }
// >
//   <option value="">Code</option>

//   {countries.map((country) => (
//     <option
//       key={country.iso2}
//       value={`+${country.phonecode}`}
//     >
//       {country.name} (+{country.phonecode})
//     </option>
//   ))}
// </select>

//                 <input
//                   type="text"
//                   className="form-control"
//                   value={patient.mobileNumber}
//                   onChange={(e) =>
//                     setPatient({ ...patient, mobileNumber: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="col-md-3">
//               <label>DOB</label>

//               <input
//                 type="date"
//                 className="form-control"
//                 value={patient.dob}
//                 // onChange={(e) =>
//                 //   setPatient({ ...patient, dob: e.target.value })
//                 // }
//                 onChange={(e) =>
//   setPatient({
//     ...patient,
//     dob: e.target.value,
//     age: calculateAge(
//       e.target.value,
//       patient.ageType
//     ),
//   })
// }
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Age</label>

//               <div className="d-flex">
//                 {/* <input
//                   type="text"
//                   className="form-control"
//                   value={patient.age}
//                   onChange={(e) =>
//                     setPatient({ ...patient, age: e.target.value })
//                   }
//                 /> */}
//                 <input
//   type="text"
//   className="form-control"
//   value={patient.age}
//   readOnly
// />

//                 {/* <select
//                   className="form-control"
//                   value={patient.ageType}
//                   onChange={(e) =>
//                     setPatient({ ...patient, ageType: e.target.value })
//                   }
//                 >
//                   <option>Year</option>
//                   <option>Month</option>
//                 </select> */}
//                 <select
//   className="form-control"
//   value={patient.ageType}
//   onChange={(e) =>
//     setPatient({
//       ...patient,
//       ageType: e.target.value,
//       age: calculateAge(
//         patient.dob,
//         e.target.value
//       ),
//     })
//   }
// >
//   <option value="YEAR">Years</option>
//   <option value="MONTH">Months</option>
// </select>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <label>Address</label>

//               <input
//                 value={patient.address}
//                 className="form-control"
//                 onChange={(e) =>
//                   setPatient({ ...patient, address: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-3">
//               <label>Country</label>

//               {/* <select
//                 className="form-control"
//                 value={patient.country}
//                 onChange={(e) =>
//                   setPatient({ ...patient, country: e.target.value })
//                 }
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//                 <option value="UAE">UAE</option>
//                 <option value="England">England</option>
//               </select> */}
//               <select
//   className="form-control"
//   value={patient.country}
//   onChange={handleCountryChange}
// >
//   <option value="">Select Country</option>
//   {countries.map((c) => (
//     <option key={c.iso2} value={c.iso2}>
//       {c.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-3">
//               <label>State</label>

//               {/* <select
//                 className="form-control"
//                 value={patient.state}
//                 onChange={(e) =>
//                   setPatient({ ...patient, state: e.target.value })
//                 }
//               >
//                 <option value="">Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Gujarat">Gujarat</option>
//               </select> */}
//               <select
//   className="form-control"
//   value={patient.state}
//   onChange={handleStateChange}
// >
//   <option value="">Select State</option>
//   {states.map((s) => (
//     <option key={s.iso2} value={s.iso2}>
//       {s.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-3">
//               <label>City</label>

//               {/* <select
//                 className="form-control"
//                 value={patient.city}
//                 onChange={(e) =>
//                   setPatient({ ...patient, city: e.target.value })
//                 }
//               >
//                 <option value="">Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Ahmedabad">Ahmedabad</option>
//               </select> */}
//               <select
//   className="form-control"
//   value={patient.city}
//   onChange={(e) =>
//     setPatient({ ...patient, city: e.target.value })
//   }
// >
//   <option value="">Select City</option>
//   {cities.map((c) => (
//     <option key={c.id} value={c.name}>
//       {c.name}
//     </option>
//   ))}
// </select>
//             </div>

//             <div className="col-md-3">
//               <label>Email</label>

//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter Email"
//                 value={patient.email}
//                 onChange={(e) =>
//                   setPatient({ ...patient, email: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-4">
//               <label>National ID Number</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="National ID Number"
//                 value={patient.nationalIdNumber || ""} 
//                 onChange={(e) =>
//                   setPatient({ ...patient, nationalIdNumber: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Passport No.</label>

//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Passport Number"
//                 value={patient.passportNumber || ""}
//                 onChange={(e) =>
//                   setPatient({ ...patient, passportNumber: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Currency</label>
//               {/* <select
//                 className="form-control"
//                 value={patient.currency || ""}
//                 onChange={(e) =>
//                   setPatient({ ...patient, currency: e.target.value })
//                 }
//               >
//                 <option value="">Select Currency</option>
//                 {currencies.map((c) => (
//                   <option key={c.id} value={c.currencyCode?.trim()}>
//                     {c.currencyCode}
//                   </option>
//                 ))}
//               </select>{" "} */}
//               {!canViewCurrency ? (
//                 <input
//                   className="form-control"
//                   value="No Currency Access"
//                   disabled
//                 />
//               ) : (
//                 <select
//                   className="form-control"
//                   value={patient.currency || ""}
//                   onChange={(e) =>
//                     setPatient({ ...patient, currency: e.target.value })
//                   }
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
//                 value={patient.proposalId}
//                 onChange={(e) =>
//                   setPatient({ ...patient, proposalId: e.target.value })
//                 }
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
//                   value={patient.organizationId}
//                   onChange={(e) =>
//                     setPatient({ ...patient, organizationId: e.target.value })
//                   }
//                 >
//                   <option value="">Select Organization</option>
//                   {organizations.map((o) => (
//                     <option key={o.id} value={o.id}>
//                       {o.organizationName}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div> */}
//             <div className="col-md-6">
//   <label>Select Organization</label>

//   {!canViewOrg ? (
//     <input
//       className="form-control"
//       value="No Organization Access"
//       disabled
//     />
//   ) : isAdmin ? (

//     <select
//       className="form-control"
//       value={patient.organizationId}
//       onChange={(e) =>
//         setPatient({
//           ...patient,
//           organizationId: e.target.value,
//         })
//       }
//     >
//       <option value="">Select Organization</option>

//       {organizations.map((o) => (
//         <option key={o.id} value={o.id}>
//           {o.organizationName}
//         </option>
//       ))}
//     </select>

//   ) : (

//     <input
//       className="form-control"
//       value={
//         currentUser?.organization?.organizationName || ""
//       }
//       disabled
//     />

//   )}
// </div>

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
//                   value={patient.insuranceId}
//                   onChange={(e) =>
//                     setPatient({ ...patient, insuranceId: e.target.value })
//                   }
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
//                 <th>ADD</th>
//               </tr>
//             </thead>

//             <tbody>
//               {packageTests.map((item, index) => (
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
//                         <option value="">--Select--</option>

//                         {testMaster.map((t) => (
//                           <option key={t.id} value={t.id}>
//                             {t.testName}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </td>

//                   <td>
//                     <input
//                       className="form-control"
//                       value={item.testType}
//                       readOnly
//                     />
//                   </td>

//                   <td>
//                     <input
//                       className="form-control"
//                       value={item.sampleType}
//                       readOnly
//                     />
//                   </td>

//                   {/* <td>
//                     <button className="btn btn-success" onClick={addTestRow}>
//                       +
//                     </button>
//                   </td> */}

//                  <td>
//   {index === packageTests.length - 1 && (
//     <button
//       type="button"
//       className="btn btn-success me-2"
//       onClick={addTestRow}
//       title="Add Test"
//     >
//       <FaPlusCircle />
//     </button>
//   )}

//   {packageTests.length > 1 && (
//     <button
//       type="button"
//       className="btn btn-danger"
//       onClick={() => removeTestRow(index)}
//       title="Remove Test"
//     >
//       <FaTrashAlt />
//     </button>
//   )}
// </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="mt-3">
//             <button
//               className="btn btn-primary submit-btn"
//               onClick={handleUpdate}
//             >
//               Update
//             </button>

//             <button
//               className="btn btn-danger ms-3"
//               onClick={() => navigate("/")}
//             >
//               Goto Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPatient;
