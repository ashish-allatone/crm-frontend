import React, { useEffect, useState } from "react";
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
    qcStatus: "PENDING",
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

  const closeEditModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setForm({
      reportName: "",
      file: null,
      qcStatus: "",
      myLabsTeam: "",
    });
  };

  return (
    <div className="container-fluid test-report-upload-page mt-3">
      <style>{`
        .test-report-upload-page {
          font-family: "Inter", sans-serif;
          color: #18243a;
          padding-bottom: 26px;
        }
        .test-report-upload-page .tr-card {
          overflow: hidden;
          border: 1px solid #e6ebf1;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(18,39,63,.06);
        }
        .test-report-upload-page .tr-card + .tr-card { margin-top: 20px; }
        .test-report-upload-page .tr-card-header {
          min-height: 66px;
          padding: 15px 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          background: linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%);
          font-size: 16px;
          font-weight: 700;
        }
        .test-report-upload-page .tr-header-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255,255,255,.13);
          font-size: 17px;
        }
        .test-report-upload-page .tr-card-body { padding: 22px 24px; }
        .test-report-upload-page .tr-section-note {
          margin: -7px 0 18px;
          color: #8190a3;
          font-size: 12px;
        }
        .test-report-upload-page .tr-field-label {
          display: block;
          margin-bottom: 7px;
          color: #58677c;
          font-size: 12px;
          font-weight: 600;
        }
        .test-report-upload-page .form-control {
          min-height: 42px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          color: #26364c;
          font-size: 13px;
          box-shadow: none;
        }
        .test-report-upload-page .form-control:focus {
          border-color: #3b719b;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .test-report-upload-page .form-control[readonly] {
          background: #f7f9fb;
          color: #53647a;
        }
        .test-report-upload-page .tr-divider {
          margin: 22px 0 18px;
          border-color: #e8edf2;
          opacity: 1;
        }
        .test-report-upload-page .tr-primary-btn,
        .test-report-upload-page .tr-secondary-btn,
        .test-report-upload-page .tr-view-btn,
        .test-report-upload-page .tr-edit-btn,
        .test-report-upload-page .tr-save-btn {
          min-height: 35px;
          padding: 7px 13px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
        }
        .test-report-upload-page .tr-primary-btn {
          border: 1px solid #0e3d66;
          background: #0e3d66;
          color: #fff;
        }
        .test-report-upload-page .tr-primary-btn:hover { background: #0a2d4a; }
        .test-report-upload-page .tr-view-btn {
          border: 1px solid #c8d8e7;
          background: #edf4fa;
          color: #0e3d66;
        }
        .test-report-upload-page .tr-view-btn:hover {
          border-color: #0e3d66;
          background: #0e3d66;
          color: #fff;
        }
        .test-report-upload-page .tr-edit-btn {
          border: 1px solid #e7c778;
          background: #fff7e4;
          color: #8a5a00;
        }
        .test-report-upload-page .tr-edit-btn:hover { background: #ffedc2; }
        .test-report-upload-page .tr-save-btn {
          border: 1px solid #16804a;
          background: #e9f7ef;
          color: #167044;
        }
        .test-report-upload-page .tr-save-btn:hover {
          background: #16804a;
          color: #fff;
        }
        .test-report-upload-page .tr-secondary-btn {
          border: 1px solid #d7e0e9;
          background: #f5f7fa;
          color: #4e5e72;
        }
        .test-report-upload-page .tr-secondary-btn:hover { background: #e9eef4; }
        .test-report-upload-page .tr-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e5ebf1;
          border-radius: 10px;
        }
        .test-report-upload-page .tr-table {
          width: 100%;
          min-width: 700px;
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
        }
        .test-report-upload-page .tr-table thead th {
          padding: 13px 12px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #58677c;
          white-space: nowrap;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
        }
        .test-report-upload-page .tr-table tbody td {
          padding: 12px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #35445a;
          vertical-align: middle;
          font-size: 12.5px;
        }
        .test-report-upload-page .tr-table tbody tr:last-child td { border-bottom: 0; }
        .test-report-upload-page .tr-table tbody tr:hover { background: #f8fafc; }
        .test-report-upload-page .tr-empty {
          padding: 26px 14px !important;
          color: #8190a3 !important;
          text-align: center;
        }
        .test-report-upload-page .tr-status-select { min-width: 145px; }
        .test-report-upload-page .tr-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 42px 16px;
          background: rgba(8,24,40,.58);
        }
        .test-report-upload-page .tr-modal {
          width: 100%;
          max-width: 560px;
          margin: auto;
          overflow: hidden;
          border: 0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 18px 55px rgba(0,0,0,.22);
        }
        .test-report-upload-page .tr-modal-header {
          min-height: 64px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: linear-gradient(120deg,#0e3d66 0%,#0a2d4a 60%,#061d30 100%);
          color: #fff;
        }
        .test-report-upload-page .tr-modal-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }
        .test-report-upload-page .tr-modal-header .btn-close {
          filter: brightness(0) invert(1);
          opacity: .85;
        }
        .test-report-upload-page .tr-modal-body { padding: 22px 20px; }
        .test-report-upload-page .tr-modal-footer {
          padding: 14px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          border-top: 1px solid #edf1f5;
        }
        .test-report-upload-page .tr-preview-modal { max-width: 1100px; }
        .test-report-upload-page .tr-preview-frame {
          display: block;
          width: 100%;
          height: min(72vh, 680px);
          border: 0;
          background: #f5f7fa;
        }
        .test-report-upload-page .tr-preview-footer {
          padding: 14px 20px;
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 9px;
          border-top: 1px solid #edf1f5;
        }
        @media (max-width:767px) {
          .test-report-upload-page { padding-left: 8px; padding-right: 8px; }
          .test-report-upload-page .tr-card-header { padding: 14px 16px; }
          .test-report-upload-page .tr-card-body { padding: 16px 12px; }
          .test-report-upload-page .tr-modal-backdrop { padding: 18px 10px; }
          .test-report-upload-page .tr-modal-body { padding: 18px 15px; }
        }
      `}</style>

      <div className="tr-card">
        <div className="tr-card-header">
          <span className="tr-header-icon" aria-hidden="true">👤</span>
          <span>Patient Details</span>
        </div>

        <div className="tr-card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="tr-field-label">Patient Name</label>
              <input
                className="form-control"
                value={`${patient.title || ""}${patient.title ? ". " : ""}${patient.patientName || ""}`}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label className="tr-field-label">Gender</label>
              <input className="form-control" value={patient.gender || ""} readOnly />
            </div>

            <div className="col-md-2">
              <label className="tr-field-label">Age</label>
              <input
                className="form-control"
                value={`${patient.age ?? ""}${patient.ageType ? ` ${patient.ageType}` : ""}`}
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label className="tr-field-label">Mobile No.</label>
              <input className="form-control" value={patient.mobileNumber || ""} readOnly />
            </div>

            <div className="col-md-6">
              <label className="tr-field-label">Address</label>
              <input className="form-control" value={patient.address || ""} readOnly />
            </div>

            <div className="col-md-3">
              <label className="tr-field-label">Appointment Time</label>
              <input
                className="form-control"
                value={appointment?.visitTime || ""}
                readOnly
              />
            </div>
          </div>

          <hr className="tr-divider" />

          {isaAdmin && (
            <button
              type="button"
              className="btn tr-primary-btn mb-3"
              onClick={() => setShowModal(true)}
            >
              + Upload Report
            </button>
          )}

          <div className="tr-table-wrap">
            <table className="table tr-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Test Type</th>
                  <th>Sample Type</th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr><td colSpan="3" className="tr-empty">No tests found for this appointment</td></tr>
                ) : (
                  tests.map((t, index) => (
                    <tr key={index}>
                      <td>{t.testName}</td>
                      <td>{t.testType}</td>
                      <td>{t.sampleType}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="tr-card">
        <div className="tr-card-header">
          <span className="tr-header-icon" aria-hidden="true">📄</span>
          <span>All Test Reports</span>
        </div>

        <div className="tr-card-body">
          <div className="tr-table-wrap">
            <table className="table tr-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>S. No.</th>
                  <th>Report Name</th>
                  <th>Report Show</th>
                  <th>Upload Date</th>
                  <th>Remarks</th>
                  <th>QC by Organization</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr><td colSpan="8" className="tr-empty">No test reports uploaded yet</td></tr>
                ) : (
                  reports.map((r, index) => (
                    <tr key={r.reportId}>
                      <td>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn tr-edit-btn"
                            onClick={() => openEditModal(r)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td>{index + 1}</td>
                      <td>{r.reportName || "-"}</td>
                      <td>
                        {canView && (
                          <button
                            type="button"
                            className="btn tr-view-btn"
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
                      <td>{r.uploadDate || "-"}</td>
                      <td>
                        {canUpdateQc && !isAdmin ? (
                          <input
                            className="form-control"
                            value={r.uploadedBy || ""}
                            onChange={(e) => {
                              const updatedReports = reports.map((report) =>
                                report.reportId === r.reportId
                                  ? { ...report, uploadedBy: e.target.value }
                                  : report
                              );
                              setReports(updatedReports);
                            }}
                          />
                        ) : (
                          r.uploadedBy || "-"
                        )}
                      </td>
                      <td>
                        <select
                          className="form-control tr-status-select"
                          value={r.qcStatus}
                          disabled={!canUpdateQc}
                          onChange={async (e) => {
                            const status = e.target.value;
                            if (isAdmin) {
                              await handleQc(r.reportId, status);
                            } else {
                              const updatedReports = reports.map((report) =>
                                report.reportId === r.reportId
                                  ? { ...report, qcStatus: status }
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
                            type="button"
                            className="btn tr-save-btn"
                            onClick={() => handleUpdateQcRemark(r)}
                          >
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="tr-modal-backdrop" role="presentation">
          <div className="tr-modal" role="dialog" aria-modal="true" aria-labelledby="tr-upload-title">
            <div className="tr-modal-header">
              <h5 className="tr-modal-title" id="tr-upload-title">
                {editingReport ? "Edit Test Report" : "Upload Test Report"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeEditModal}
              />
            </div>

            <div className="tr-modal-body">
              <div className="mb-3">
                <label className="tr-field-label">Report Name</label>
                <input
                  className="form-control"
                  value={form.reportName}
                  onChange={(e) => setForm({ ...form, reportName: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="tr-field-label">Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                />
              </div>

              <div className="mb-3">
                <label className="tr-field-label">Remarks</label>
                <input
                  className="form-control"
                  value={form.myLabsTeam}
                  onChange={(e) => setForm({ ...form, myLabsTeam: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="tr-field-label">QC Status</label>
                <select
                  className="form-control"
                  value={form.qcStatus}
                  onChange={(e) => setForm({ ...form, qcStatus: e.target.value })}
                >
                  <option value="">Select QC</option>
                  <option value="RECHECK">QC Recheck</option>
                  <option value="APPROVED">QC Approved</option>
                  <option value="REJECTED">QC Rejected</option>
                </select>
              </div>
            </div>

            <div className="tr-modal-footer">
              {canAdd && !allOrganizations && (
                <button
                  type="button"
                  className="btn tr-primary-btn"
                  onClick={editingReport ? handleUpdate : handleUpload}
                >
                  {editingReport ? "Update" : "Upload"}
                </button>
              )}
              <button type="button" className="btn tr-secondary-btn" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {pdfPreview && (
        <div className="tr-modal-backdrop" role="presentation">
          <div className="tr-modal tr-preview-modal" role="dialog" aria-modal="true" aria-labelledby="tr-preview-title">
            <div className="tr-modal-header">
              <h5 className="tr-modal-title" id="tr-preview-title">Report Preview</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setPdfPreview(null)}
              />
            </div>

            <div className="tr-modal-body p-0">
              <iframe
                src={pdfPreview}
                className="tr-preview-frame"
                title="Report Preview"
              />
            </div>

            <div className="tr-preview-footer">
              <button
                type="button"
                className="btn tr-secondary-btn"
                onClick={() => window.open(pdfPreview, "_blank")}
              >
                Open in New Tab
              </button>
              <a href={pdfPreview} download className="btn tr-save-btn">
                Download
              </a>
              <button
                type="button"
                className="btn btn-danger tr-secondary-btn"
                onClick={() => setPdfPreview(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReportUpload;

// import React, { useEffect, useState } from "react";
// import "../../styles/addPatient.css";
// import {
//   getTestReports,
//   uploadTestReport,
//   updateQc,
//   getTestReportFile,
//   updateTestReport,
// } from "../../services/testReportService";
// import { getAppointmentById } from "../../services/appointmentService";
// import { useParams } from "react-router-dom";
// import { getPatientById } from "../../services/patientService";
// import { hasPermission } from "../permissionUtil";

// const TestReportUpload = () => {
//   const canAdd = hasPermission("Test Report", "ADD");
//   const canEdit = hasPermission("Test Report", "EDIT");
//   const canView = hasPermission("Test Report", "VIEW");

//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   const isAdmin = currentUser?.roles?.some((r) => r.name === "Admin");

//   const allOrganizations = currentUser?.allOrganizations === true;

//   const canUpdateQc = isAdmin || allOrganizations;
//   const { id } = useParams();

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

// const isaAdmin = user?.roles?.some(
//   (role) => role.name?.toLowerCase() === "admin"
// );

//   const [patient, setPatient] = useState({});
//   const [tests, setTests] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [file, setFile] = useState(null);
//   const [reportName, setReportName] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [appointment, setAppointment] = useState(null);
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [editingReport, setEditingReport] = useState(null);

//   const [form, setForm] = useState({
//     reportName: "",
//     file: null,
//     qcStatus: "PENDING", // ✅ default
//     myLabsTeam: "",
//   });

//   useEffect(() => {
//     loadData();
//   }, [id]);

//   const loadData = async () => {
//     try {
//       const appointmentRes = await getAppointmentById(id);
//       const appointmentData = appointmentRes.data.data;
//       const patientId = appointmentRes.data.data.patientId;
//       const patientRes = await getPatientById(patientId);
//       const reportRes = await getTestReports(id);
//       const patientData = patientRes.data.data;

//       const data = appointmentRes.data.data;
//       const testList = Array.isArray(data.tests) ? data.tests : [];

//       setAppointment(appointmentData);
//       setPatient(patientData);
//       setTests(testList);
//       setReports(reportRes.data.data.reports || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUpload = async () => {
//     try {
//       if (!form.reportName || !form.file || !form.qcStatus) {
//         alert("Fill all required fields");
//         return;
//       }

//       const formData = new FormData();

//       formData.append("appointmentId", id);
//       formData.append("reportName", form.reportName);
//       formData.append("file", form.file);
//       formData.append("qcStatus", form.qcStatus);
//       formData.append("uploadedBy", form.myLabsTeam);

//       const res = await uploadTestReport(formData);

//       // ✅ Backend message
//       alert(res.data.message);

//       setShowModal(false);
//       setForm({
//         reportName: "",
//         file: null,
//         qcStatus: "",
//         myLabsTeam: "",
//       });

//       loadData();
//     } catch (err) {
//       console.error(err);

//       alert(err.response?.data?.message || "Upload failed ❌");
//     }
//   };

//   const openEditModal = (report) => {
//     setEditingReport(report);

//     setForm({
//       reportName: report.reportName,
//       file: null,
//       qcStatus: report.qcStatus,
//       myLabsTeam: report.uploadedBy || "",
//     });

//     setShowModal(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();

//       formData.append("reportName", form.reportName);

//       if (form.file) {
//         formData.append("file", form.file);
//       }

//       formData.append("qcStatus", form.qcStatus);
//       formData.append("uploadedBy", form.myLabsTeam);

//       const res = await updateTestReport(editingReport.reportId, formData);

//       alert(res.data.message);

//       setEditingReport(null);

//       setShowModal(false);

//       setForm({
//         reportName: "",
//         file: null,
//         qcStatus: "",
//         myLabsTeam: "",
//       });

//       loadData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Update failed");
//     }
//   };
//   // const handleQc = async (reportId, status) => {
//   //   try {
//   //     await updateQc(reportId, status);
//   //     alert("QC Updated");
//   //     loadData();
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//   const handleQc = async (reportId, status) => {
//     try {
//       const res = await updateQc(reportId, status);

//       alert(res.data.message);

//       loadData();
//     } catch (err) {
//       console.error(err);

//       alert(err.response?.data?.message || "QC update failed ❌");
//     }
//   };

//   const handleUpdateQcRemark = async (report) => {
//     try {
//       const formData = new FormData();

//       formData.append("reportName", report.reportName);

//       formData.append("qcStatus", report.qcStatus);

//       formData.append("uploadedBy", report.uploadedBy);

//       await updateTestReport(report.reportId, formData);

//       alert("Updated Successfully");

//       loadData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Update Failed");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       {/* Employee Details */}

//       <div className="card">
//         <div className="card-header add-header">Employee Details</div>

//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <label>Employee Name</label>

//               <input
//                 className="form-control"
//                 value={`${patient.title}. ${patient.patientName}`}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Gender</label>

//               <input
//                 className="form-control"
//                 value={patient.gender || ""}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Age</label>

//               <input
//                 className="form-control"
//                 value={`${patient.age} ${patient.ageType}`}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Mobile No.</label>

//               <input
//                 className="form-control"
//                 value={patient.mobileNumber || ""}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-6">
//               <label>Address</label>

//               <input
//                 className="form-control"
//                 value={patient.address || ""}
//                 readOnly
//               />
//             </div>

//             {/* <div className="col-md-3">
//               <label>Aadhar No.</label>

//               <input
//                 className="form-control"
//                 placeholder="Aadhar Card Number"
//                 readOnly
//               />
//             </div> */}

//             <div className="col-md-3">
//               <label>Appointment Time</label>

//               <input
//                 className="form-control"
//                 value={appointment?.visitTime || ""}
//                 readOnly
//               />
//             </div>
//           </div>

//           <hr />
//           {/* <button
//             className="btn btn-primary mb-3"
//             onClick={() => setShowModal(true)}
//           >
//             Upload Report
//           </button> */}
//           {/* {canAdd && !allOrganizations && (
//             <button
//               className="btn btn-primary mb-3"
//               onClick={() => setShowModal(true)}
//             >
//               Upload Report
//             </button>
//           )} */}

//           {isaAdmin && (
//   <button
//     className="btn btn-primary mb-3"
//     onClick={() => setShowModal(true)}
//   >
//     Upload Report
//   </button>
// )}

//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>TEST NAME</th>
//                 <th>TEST TYPE</th>
//                 <th>SAMPLE TYPE</th>
//               </tr>
//             </thead>

//             <tbody>
//               {tests.map((t, index) => (
//                 <tr key={index}>
//                   <td>{t.testName}</td>
//                   <td>{t.testType}</td>
//                   <td>{t.sampleType}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Test Report List */}

//       <div className="card mt-4">
//         <div className="card-header add-header">All test report list</div>

//         <div className="card-body">
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Action</th>
//                 <th>S No.</th>
//                 <th>Report Name</th>
//                 <th>Report Show</th>
//                 <th>Upload Date</th>
//                 <th>Remarks</th>
//                 <th>QC by Organization</th>
//                 <th>Save</th>
//               </tr>
//             </thead>

//             <tbody>
//               {reports.map((r, index) => (
//                 <tr key={r.reportId}>
//                   <td>
//                     {isAdmin && (
//                       <button
//                         className="btn btn-warning btn-sm"
//                         onClick={() => openEditModal(r)}
//                       >
//                         Edit
//                       </button>
//                     )}
//                   </td>
//                   <td>{index + 1}</td>
//                   <td>{r.reportName}</td>

//                   <td>
//                     {/* <button
//                       className="btn btn-info btn-sm"
//                       onClick={async () => {
//                         try {
//                           const res = await getTestReportFile(r.reportId);
//                           const fileURL = URL.createObjectURL(res.data);
//                           setPdfPreview(fileURL);
//                         } catch (err) {
//                           console.error(err);
//                           alert("Preview failed");
//                         }
//                       }}
//                     >
//                       View Report
//                     </button> */}
//                     {canView && (
//                       <button
//                         className="btn btn-info btn-sm"
//                         onClick={async () => {
//                           try {
//                             const res = await getTestReportFile(r.reportId);
//                             const fileURL = URL.createObjectURL(res.data);
//                             setPdfPreview(fileURL);
//                           } catch (err) {
//                             alert("Preview failed");
//                           }
//                         }}
//                       >
//                         View Report
//                       </button>
//                     )}
//                   </td>

//                   <td>{r.uploadDate}</td>

//                   <td>
//                     {canUpdateQc && !isAdmin ? (
//                       <input
//                         className="form-control"
//                         value={r.uploadedBy || ""}
//                         onChange={(e) => {
//                           const updatedReports = reports.map((report) =>
//                             report.reportId === r.reportId
//                               ? { ...report, uploadedBy: e.target.value }
//                               : report,
//                           );

//                           setReports(updatedReports);
//                         }}
//                       />
//                     ) : (
//                       r.uploadedBy
//                     )}
//                   </td>

//                   <td>
//                     {/* <select
//                       className="form-control"
//                       value={r.qcStatus}
//                       onChange={(e) => handleQc(r.reportId, e.target.value)}
//                     > */}
//                     <select
//                       className="form-control"
//                       value={r.qcStatus}
//                       disabled={!canUpdateQc}
//                       onChange={async (e) => {

//   const status = e.target.value;

//   if (isAdmin) {

//     await handleQc(r.reportId, status);

//   } else {

//     const updatedReports = reports.map((report) =>
//       report.reportId === r.reportId
//         ? {
//             ...report,
//             qcStatus: status,
//           }
//         : report
//     );

//     setReports(updatedReports);
//   }
// }}
//                     >
//                       <option value="PENDING">Pending</option>
//                       <option value="RECHECK">QC Recheck</option>
//                       <option value="APPROVED">QC Approved</option>
//                       <option value="REJECTED">QC Rejected</option>
//                     </select>
//                   </td>
//                   <td>
//                     {allOrganizations && !isAdmin && (
//                       <button
//                         className="btn btn-success btn-sm"
//                         onClick={() => handleUpdateQcRemark(r)}
//                       >
//                         Save
//                       </button>
//                     )}
//                   </td>
//                   {/* <td>
//   <span
//     className={
//       r.qcStatus === "APPROVED"
//         ? "badge bg-success"
//         : r.qcStatus === "RECHECK"
//         ? "badge bg-warning"
//         : "badge bg-secondary"
//     }
//   >
//     {r.qcStatus}
//   </span>
// </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {showModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               {/* ✅ HEADER SAME AS INSURANCE */}
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">
//                   {editingReport ? "Edit Test Report" : "Upload Test Report"}
//                 </h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               {/* ✅ BODY WITH LABELS */}
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Report Name</label>
//                   <input
//                     className="form-control"
//                     value={form.reportName}
//                     onChange={(e) =>
//                       setForm({ ...form, reportName: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Upload File</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     onChange={(e) =>
//                       setForm({ ...form, file: e.target.files[0] })
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Remarks</label>
//                   <input
//                     className="form-control"
//                     value={form.myLabsTeam}
//                     onChange={(e) =>
//                       setForm({ ...form, myLabsTeam: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">QC Status</label>
//                   <select
//                     className="form-control"
//                     value={form.qcStatus}
//                     onChange={(e) =>
//                       setForm({ ...form, qcStatus: e.target.value })
//                     }
//                   >
//                     <option value="">Select QC</option>
//                     <option value="RECHECK">QC Recheck</option>
//                     <option value="APPROVED">QC Approved</option>
//                     <option value="REJECTED">QC Rejected</option>
//                   </select>
//                 </div>
//               </div>

//               {/* ✅ FOOTER SAME STYLE */}
//               <div className="modal-footer">
//                 {/* <button
//                   className="btn btn-primary submit-btn"
//                   onClick={handleUpload}
//                 >
//                   Upload
//                 </button> */}
//                 {canAdd && !allOrganizations && (
//                   <button
//                     className="btn btn-primary submit-btn"
//                     onClick={editingReport ? handleUpdate : handleUpload}
//                   >
//                     {editingReport ? "Update" : "Upload"}
//                   </button>
//                 )}

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => {
//                     setShowModal(false);

//                     setEditingReport(null);

//                     setForm({
//                       reportName: "",
//                       file: null,
//                       qcStatus: "",
//                       myLabsTeam: "",
//                     });
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {pdfPreview && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog modal-xl">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Report Preview</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setPdfPreview(null)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <iframe
//                   src={pdfPreview}
//                   width="100%"
//                   height="600px"
//                   title="Report Preview"
//                 />
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => window.open(pdfPreview, "_blank")}
//                 >
//                   Open in New Tab
//                 </button>

//                 <a href={pdfPreview} download className="btn btn-success">
//                   Download
//                 </a>

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setPdfPreview(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestReportUpload;
