import React, { useEffect, useState } from "react";
import "../styles/addPatient.css";
import { patients } from "../data/patients";
import { useParams } from "react-router-dom";

const TestReportUpload = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState({});
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const selected = patients.find((p) => p.id === parseInt(id));

    if (selected) {
      setPatient(selected);
      setTests(selected.tests);
    }
  }, [id]);

  return (
    <div className="container-fluid mt-3">
      {/* Employee Details */}

      <div className="card">
        <div className="card-header add-header">Employee Details</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label>Employee Name</label>

              <input
                className="form-control"
                value={`${patient.title || ""} ${patient.name || ""}`}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label>Gender</label>

              <input
                className="form-control"
                value={patient.gender || ""}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label>Age</label>

              <input
                className="form-control"
                value={patient.age || ""}
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label>Mobile No.</label>

              <input
                className="form-control"
                value={patient.mobile || ""}
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label>Address</label>

              <input
                className="form-control"
                value={patient.address || ""}
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>Aadhar No.</label>

              <input
                className="form-control"
                placeholder="Aadhar Card Number"
                readOnly
              />
            </div>

            <div className="col-md-3">
              <label>Appointment Time</label>

              <input className="form-control" value="08:00:00" readOnly />
            </div>
          </div>

          <hr />

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>TEST NAME</th>
                <th>TEST TYPE</th>
                <th>SAMPLE TYPE</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((t, index) => (
                <tr key={index}>
                  <td>{t.test}</td>
                  <td>{t.type}</td>
                  <td>{t.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Report List */}

      <div className="card mt-4">
        <div className="card-header add-header">All test report list</div>

        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Report Name</th>
                <th>Report Show</th>
                <th>Upload Date</th>
                <th>MyLabs Team</th>
                <th>QC by Organization</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Complete Report</td>

                <td>
                  <button className="btn btn-info btn-sm">View Report</button>
                </td>

                <td>2026-01-09 18:45:08</td>

                <td>QC Approved</td>

                <td>
                  <button className="btn btn-primary btn-sm">Update QC</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestReportUpload;
