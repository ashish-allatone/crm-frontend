import React, { useState, useEffect } from "react";
import "../../styles/addPatient.css";

import { useNavigate, useParams } from "react-router-dom";

import { getPatientById, updatePatient } from "../../services/patientService";
import { getOrganizationsAll } from "../../services/organizationService";
import { getAllInsurances } from "../../services/insuranceService";
import { getAllTests } from "../../services/testService";
import { getAllCurrencies } from "../../services/currencyService";
import { hasPermission } from "../permissionUtil";
import { useLocation } from "../../hooks/useLocation";
import { getCurrentUser } from "../../services/userService";

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
      setPatient({
        ...data,
        currency: data.currency ? data.currency.trim() : "",
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
  const handleUpdate = async () => {
    try {
      const payload = {
        ...patient,
        organizationId: patient.organizationId
          ? Number(patient.organizationId)
          : null,
        insuranceId: patient.insuranceId ? Number(patient.insuranceId) : null,
        tests: packageTests.map((t) => ({
          testId: t.testId,
          testType: t.testType,
          sampleType: t.sampleType,
        })),
      };

      const res = await updatePatient(id, payload);

      // ✅ Backend message
      alert(res.data.message); // "Patient updated successfully"

      navigate("/patients");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to update patient ❌");
    }
  };

  const [packageTests, setPackageTests] = useState([
    {
      testId: "",
      testType: "",
      sampleType: "",
    },
  ]);

  const addTestRow = () => {
    setPackageTests([
      ...packageTests,
      {
        test: "",
        type: "",
        sample: "",
      },
    ]);
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
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header add-header">Edit Patient Registration</div>

        <div className="card-body">
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
                  <option>+0055</option>
                  <option>+91</option>
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
                onChange={(e) =>
                  setPatient({ ...patient, dob: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Age</label>

              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  value={patient.age}
                  onChange={(e) =>
                    setPatient({ ...patient, age: e.target.value })
                  }
                />

                <select
                  className="form-control"
                  value={patient.ageType}
                  onChange={(e) =>
                    setPatient({ ...patient, ageType: e.target.value })
                  }
                >
                  <option>Year</option>
                  <option>Month</option>
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
