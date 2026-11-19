import React, { useEffect, useState } from "react";
import "../../styles/addPatient.css";
import {
  getTestReports,
  uploadTestReport,
  updateQc,
  getTestReportFile,
  updateTestReport,
} from "../../services/testReportService";
import { getAppointmentById } from "../../services/appointmentService";
import { useParams } from "react-router-dom";
import { getPatientById } from "../../services/patientService";
import { hasPermission } from "../permissionUtil";

const TestReportUpload = () => {
  const canAdd = hasPermission("Test Report", "ADD");
  const canEdit = hasPermission("Test Report", "EDIT");
  const canView = hasPermission("Test Report", "VIEW");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isAdmin = currentUser?.roles?.some((r) => r.name === "Admin");

  const allOrganizations = currentUser?.allOrganizations === true;

  const canUpdateQc = isAdmin || allOrganizations;
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

const isaAdmin = user?.roles?.some(
  (role) => role.name?.toLowerCase() === "admin"
);

  const [patient, setPatient] = useState({});
  const [tests, setTests] = useState([]);
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  const [form, setForm] = useState({
    reportName: "",
    file: null,
    qcStatus: "PENDING", // ✅ default
    myLabsTeam: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const appointmentRes = await getAppointmentById(id);
      const appointmentData = appointmentRes.data.data;
      const patientId = appointmentRes.data.data.patientId;
      const patientRes = await getPatientById(patientId);
      const reportRes = await getTestReports(id);
      const patientData = patientRes.data.data;

      const data = appointmentRes.data.data;
      const testList = Array.isArray(data.tests) ? data.tests : [];

      setAppointment(appointmentData);
      setPatient(patientData);
      setTests(testList);
      setReports(reportRes.data.data.reports || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    try {
      if (!form.reportName || !form.file || !form.qcStatus) {
        alert("Fill all required fields");
        return;
      }

      const formData = new FormData();

      formData.append("appointmentId", id);
      formData.append("reportName", form.reportName);
      formData.append("file", form.file);
      formData.append("qcStatus", form.qcStatus);
      formData.append("uploadedBy", form.myLabsTeam);

      const res = await uploadTestReport(formData);

      // ✅ Backend message
      alert(res.data.message);

      setShowModal(false);
      setForm({
        reportName: "",
        file: null,
        qcStatus: "",
        myLabsTeam: "",
      });

      loadData();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Upload failed ❌");
    }
  };

  const openEditModal = (report) => {
    setEditingReport(report);

    setForm({
      reportName: report.reportName,
      file: null,
      qcStatus: report.qcStatus,
      myLabsTeam: report.uploadedBy || "",
    });

    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("reportName", form.reportName);

      if (form.file) {
        formData.append("file", form.file);
      }

      formData.append("qcStatus", form.qcStatus);
      formData.append("uploadedBy", form.myLabsTeam);

      const res = await updateTestReport(editingReport.reportId, formData);

      alert(res.data.message);

      setEditingReport(null);

      setShowModal(false);

      setForm({
        reportName: "",
        file: null,
        qcStatus: "",
        myLabsTeam: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };
  // const handleQc = async (reportId, status) => {
  //   try {
  //     await updateQc(reportId, status);
  //     alert("QC Updated");
  //     loadData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleQc = async (reportId, status) => {
    try {
      const res = await updateQc(reportId, status);

      alert(res.data.message);

      loadData();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "QC update failed ❌");
    }
  };

  const handleUpdateQcRemark = async (report) => {
    try {
      const formData = new FormData();

      formData.append("reportName", report.reportName);

      formData.append("qcStatus", report.qcStatus);

      formData.append("uploadedBy", report.uploadedBy);

      await updateTestReport(report.reportId, formData);

      alert("Updated Successfully");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
    }
  };

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
                value={`${patient.title}. ${patient.patientName}`}
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
                value={`${patient.age} ${patient.ageType}`}
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label>Mobile No.</label>

              <input
                className="form-control"
                value={patient.mobileNumber || ""}
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

            {/* <div className="col-md-3">
              <label>Aadhar No.</label>

              <input
                className="form-control"
                placeholder="Aadhar Card Number"
                readOnly
              />
            </div> */}

            <div className="col-md-3">
              <label>Appointment Time</label>

              <input
                className="form-control"
                value={appointment?.visitTime || ""}
                readOnly
              />
            </div>
          </div>

          <hr />
          {/* <button
            className="btn btn-primary mb-3"
            onClick={() => setShowModal(true)}
          >
            Upload Report
          </button> */}
          {/* {canAdd && !allOrganizations && (
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowModal(true)}
            >
              Upload Report
            </button>
          )} */}

          {isaAdmin && (
  <button
    className="btn btn-primary mb-3"
    onClick={() => setShowModal(true)}
  >
    Upload Report
  </button>
)}

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
                  <td>{t.testName}</td>
                  <td>{t.testType}</td>
                  <td>{t.sampleType}</td>
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
                <th>Action</th>
                <th>S No.</th>
                <th>Report Name</th>
                <th>Report Show</th>
                <th>Upload Date</th>
                <th>Remarks</th>
                <th>QC by Organization</th>
                <th>Save</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r, index) => (
                <tr key={r.reportId}>
                  <td>
                    {isAdmin && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => openEditModal(r)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  <td>{index + 1}</td>
                  <td>{r.reportName}</td>

                  <td>
                    {/* <button
                      className="btn btn-info btn-sm"
                      onClick={async () => {
                        try {
                          const res = await getTestReportFile(r.reportId);
                          const fileURL = URL.createObjectURL(res.data);
                          setPdfPreview(fileURL);
                        } catch (err) {
                          console.error(err);
                          alert("Preview failed");
                        }
                      }}
                    >
                      View Report
                    </button> */}
                    {canView && (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={async () => {
                          try {
                            const res = await getTestReportFile(r.reportId);
                            const fileURL = URL.createObjectURL(res.data);
                            setPdfPreview(fileURL);
                          } catch (err) {
                            alert("Preview failed");
                          }
                        }}
                      >
                        View Report
                      </button>
                    )}
                  </td>

                  <td>{r.uploadDate}</td>

                  <td>
                    {canUpdateQc && !isAdmin ? (
                      <input
                        className="form-control"
                        value={r.uploadedBy || ""}
                        onChange={(e) => {
                          const updatedReports = reports.map((report) =>
                            report.reportId === r.reportId
                              ? { ...report, uploadedBy: e.target.value }
                              : report,
                          );

                          setReports(updatedReports);
                        }}
                      />
                    ) : (
                      r.uploadedBy
                    )}
                  </td>

                  <td>
                    {/* <select
                      className="form-control"
                      value={r.qcStatus}
                      onChange={(e) => handleQc(r.reportId, e.target.value)}
                    > */}
                    <select
                      className="form-control"
                      value={r.qcStatus}
                      disabled={!canUpdateQc}
                      onChange={async (e) => {

  const status = e.target.value;

  if (isAdmin) {

    await handleQc(r.reportId, status);

  } else {

    const updatedReports = reports.map((report) =>
      report.reportId === r.reportId
        ? {
            ...report,
            qcStatus: status,
          }
        : report
    );

    setReports(updatedReports);
  }
}}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="RECHECK">QC Recheck</option>
                      <option value="APPROVED">QC Approved</option>
                      <option value="REJECTED">QC Rejected</option>
                    </select>
                  </td>
                  <td>
                    {allOrganizations && !isAdmin && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdateQcRemark(r)}
                      >
                        Save
                      </button>
                    )}
                  </td>
                  {/* <td>
  <span
    className={
      r.qcStatus === "APPROVED"
        ? "badge bg-success"
        : r.qcStatus === "RECHECK"
        ? "badge bg-warning"
        : "badge bg-secondary"
    }
  >
    {r.qcStatus}
  </span>
</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* ✅ HEADER SAME AS INSURANCE */}
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">
                  {editingReport ? "Edit Test Report" : "Upload Test Report"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* ✅ BODY WITH LABELS */}
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Report Name</label>
                  <input
                    className="form-control"
                    value={form.reportName}
                    onChange={(e) =>
                      setForm({ ...form, reportName: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setForm({ ...form, file: e.target.files[0] })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <input
                    className="form-control"
                    value={form.myLabsTeam}
                    onChange={(e) =>
                      setForm({ ...form, myLabsTeam: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">QC Status</label>
                  <select
                    className="form-control"
                    value={form.qcStatus}
                    onChange={(e) =>
                      setForm({ ...form, qcStatus: e.target.value })
                    }
                  >
                    <option value="">Select QC</option>
                    <option value="RECHECK">QC Recheck</option>
                    <option value="APPROVED">QC Approved</option>
                    <option value="REJECTED">QC Rejected</option>
                  </select>
                </div>
              </div>

              {/* ✅ FOOTER SAME STYLE */}
              <div className="modal-footer">
                {/* <button
                  className="btn btn-primary submit-btn"
                  onClick={handleUpload}
                >
                  Upload
                </button> */}
                {canAdd && !allOrganizations && (
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={editingReport ? handleUpdate : handleUpload}
                  >
                    {editingReport ? "Update" : "Upload"}
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowModal(false);

                    setEditingReport(null);

                    setForm({
                      reportName: "",
                      file: null,
                      qcStatus: "",
                      myLabsTeam: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {pdfPreview && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">Report Preview</h5>

                <button
                  className="btn-close"
                  onClick={() => setPdfPreview(null)}
                ></button>
              </div>

              <div className="modal-body">
                <iframe
                  src={pdfPreview}
                  width="100%"
                  height="600px"
                  title="Report Preview"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => window.open(pdfPreview, "_blank")}
                >
                  Open in New Tab
                </button>

                <a href={pdfPreview} download className="btn btn-success">
                  Download
                </a>

                <button
                  className="btn btn-danger"
                  onClick={() => setPdfPreview(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReportUpload;
