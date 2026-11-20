import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/addPatient.css";

import { getOrganizationById } from "../../services/organizationService";
import { getInvoiceEligibleAppointments } from "../../services/appointmentService";
import { getAllCurrencies } from "../../services/currencyService";
import { createInvoice } from "../../services/invoiceService";
import { hasPermission } from "../permissionUtil";

const AddInvoice = () => {
  const canAdd = hasPermission("Invoice", "ADD");
  const { id } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    organizationId: id,
    currencyId: null,
    invoiceDate: "",
    dueDate: "",
    remark: "",
  });

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgRes, appRes, currRes] = await Promise.all([
        getOrganizationById(id),
        getInvoiceEligibleAppointments(0, 100, "", id),
        getAllCurrencies(),
      ]);

      const orgData = orgRes.data.data || {};
      const currencyList = currRes.data.data || [];

      setOrganization(orgData);
      setAppointments(appRes.data.data?.content || []);
      setCurrencies(currencyList);

      if (orgData.currencyId) {
        setForm((previous) => ({ ...previous, currencyId: orgData.currencyId }));
      }

      const inr = currencyList.find((currency) => currency.currencyCode === "INR");
      if (inr) {
        setForm((previous) => ({ ...previous, currencyId: inr.id }));
      }
    } catch (err) {
      console.error("Failed to load invoice data:", err);
      alert(err.response?.data?.message || "Failed to load invoice data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (appointment, checked) => {
    setSelected((previous) => {
      if (checked) {
        if (previous.some((item) => item.appointmentId === appointment.appointmentId)) {
          return previous;
        }
        return [...previous, appointment];
      }
      return previous.filter((item) => item.appointmentId !== appointment.appointmentId);
    });
  };

  const totalAmount = useMemo(
    () => selected.reduce((sum, appointment) => sum + (Number(appointment.packageAmount) || 0), 0),
    [selected]
  );

  const isSelected = (appointmentId) =>
    selected.some((appointment) => appointment.appointmentId === appointmentId);

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert("Please select at least one appointment");
      return;
    }
    if (!form.invoiceDate || !form.dueDate) {
      alert("Please select invoice date and payment due date");
      return;
    }
    if (!form.currencyId) {
      alert("INR currency could not be identified. Please check currency configuration.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        organizationId: Number(form.organizationId),
        currencyId: Number(form.currencyId),
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate,
        remark: form.remark,
        items: selected.map((appointment) => ({
          appointmentId: appointment.appointmentId,
          packageAmount: appointment.packageAmount || 0,
        })),
      };

      console.log("🔥 INVOICE PAYLOAD:", payload);
      const res = await createInvoice(payload);
      alert(res.data.message);
      navigate("/invoice");
    } catch (err) {
      console.error("Failed to create invoice:", err);
      alert(err.response?.data?.message || "Failed to create invoice ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canAdd) {
    return (
      <div className="add-invoice-page">
        <div className="add-invoice-access-denied">Access Denied ❌</div>
      </div>
    );
  }

  return (
    <div className="container-fluid add-invoice-page">
      <style>{`
        .add-invoice-page {
          --ai-navy: #0e3d66;
          --ai-text: #18243a;
          --ai-muted: #718096;
          --ai-border: #e4eaf1;
          padding: 18px 18px 28px;
          color: var(--ai-text);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .add-invoice-page .ai-card {
          overflow: hidden;
          border: 1px solid var(--ai-border);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(20, 43, 70, .06);
        }
        .add-invoice-page .ai-header {
          display: flex;
          align-items: center;
          gap: 13px;
          min-height: 76px;
          padding: 16px 24px;
          color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .add-invoice-page .ai-header-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          border-radius: 11px;
          background: rgba(255,255,255,.13);
        }
        .add-invoice-page .ai-header-icon svg { width: 22px; height: 22px; }
        .add-invoice-page .ai-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.3;
        }
        .add-invoice-page .ai-subtitle {
          margin: 3px 0 0;
          color: #c7d8e8;
          font-size: 12px;
        }
        .add-invoice-page .ai-body { padding: 23px; }
        .add-invoice-page .ai-section {
          margin-bottom: 22px;
          padding: 17px;
          border: 1px solid #e8edf3;
          border-radius: 11px;
          background: #fff;
        }
        .add-invoice-page .ai-section:last-child { margin-bottom: 0; }
        .add-invoice-page .ai-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 0 0 15px;
          color: #263a50;
          font-size: 13px;
          font-weight: 750;
        }
        .add-invoice-page .ai-section-hint {
          color: #8491a0;
          font-size: 11px;
          font-weight: 500;
        }
        .add-invoice-page .ai-field { margin-bottom: 15px; }
        .add-invoice-page .ai-field:last-child { margin-bottom: 0; }
        .add-invoice-page .ai-field label {
          display: block;
          margin-bottom: 6px;
          color: #4b5b70;
          font-size: 12px;
          font-weight: 650;
        }
        .add-invoice-page .ai-control {
          width: 100%;
          min-height: 41px;
          padding: 8px 11px;
          border: 1px solid #dce4ed;
          border-radius: 8px;
          outline: none;
          background: #fff;
          color: #26374b;
          font-size: 13px;
          box-shadow: none;
        }
        .add-invoice-page .ai-control:focus {
          border-color: #6b9abd;
          box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .add-invoice-page .ai-control[readonly] {
          background: #f6f8fb;
          color: #53647a;
        }
        .add-invoice-page textarea.ai-control {
          min-height: 90px;
          resize: vertical;
        }
        .add-invoice-page .ai-table-wrap {
          width: 100%;
          overflow: auto;
          border: 1px solid var(--ai-border);
          border-radius: 9px;
        }
        .add-invoice-page .ai-table {
          min-width: 760px;
          width: 100%;
          margin: 0;
          font-size: 12.5px;
        }
        .add-invoice-page .ai-table thead th {
          padding: 12px 13px;
          border: 0;
          border-bottom: 1px solid #dfe7ef;
          background: #f3f6fa;
          color: #526176;
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: .45px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .add-invoice-page .ai-table tbody td {
          padding: 12px 13px;
          border: 0;
          border-bottom: 1px solid #edf1f5;
          color: #344256;
          vertical-align: middle;
        }
        .add-invoice-page .ai-table tbody tr:last-child td { border-bottom: 0; }
        .add-invoice-page .ai-table tbody tr:hover { background: #f9fbfd; }
        .add-invoice-page .ai-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #0e3d66;
          cursor: pointer;
        }
        .add-invoice-page .ai-patient-name { color: #263a50; font-weight: 650; }
        .add-invoice-page .ai-amount { white-space: nowrap; font-weight: 650; }
        .add-invoice-page .ai-empty {
          padding: 30px 12px !important;
          color: #8995a4 !important;
          text-align: center;
        }
        .add-invoice-page .ai-total-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 15px;
          padding: 15px 17px;
          border: 1px solid #dce7f0;
          border-radius: 9px;
          background: #f5f9fc;
        }
        .add-invoice-page .ai-total-label {
          color: #526176;
          font-size: 12px;
          font-weight: 650;
        }
        .add-invoice-page .ai-total-value {
          color: #0e3d66;
          font-size: 19px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .add-invoice-page .ai-selected-count {
          color: #718096;
          font-size: 11px;
        }
        .add-invoice-page .ai-footer {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 21px;
        }
        .add-invoice-page .ai-btn {
          min-height: 39px;
          padding: 9px 17px;
          border: 0;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          transition: .18s ease;
        }
        .add-invoice-page .ai-btn:disabled { opacity: .6; cursor: not-allowed; }
        .add-invoice-page .ai-btn-primary { color: #fff; background: #0e3d66; }
        .add-invoice-page .ai-btn-primary:hover:not(:disabled) { background: #092d4b; }
        .add-invoice-page .ai-btn-secondary { color: #fff; background: #687789; }
        .add-invoice-page .ai-btn-secondary:hover:not(:disabled) { background: #536174; }
        .add-invoice-page .ai-loading,
        .add-invoice-page .add-invoice-access-denied {
          padding: 55px 20px;
          color: #66768a;
          text-align: center;
          font-size: 14px;
        }
        @media (max-width: 767px) {
          .add-invoice-page { padding: 12px 8px 22px; }
          .add-invoice-page .ai-header { padding: 15px; }
          .add-invoice-page .ai-body { padding: 13px; }
          .add-invoice-page .ai-section { padding: 13px; }
          .add-invoice-page .ai-total-panel { align-items: flex-start; flex-direction: column; }
          .add-invoice-page .ai-footer { flex-direction: column-reverse; }
          .add-invoice-page .ai-footer .ai-btn { width: 100%; }
        }
      `}</style>

      <div className="ai-card">
        <div className="ai-header">
          <div className="ai-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
              <path d="M14 3.8V8h4M9 12h6M9 15.5h6M9 19h3" />
            </svg>
          </div>
          <div>
            <h1 className="ai-title">Add Invoice</h1>
            <p className="ai-subtitle">Create an invoice from QC-approved appointments</p>
          </div>
        </div>

        <div className="ai-body">
          {loading ? (
            <div className="ai-loading">Loading invoice details...</div>
          ) : (
            <>
              <section className="ai-section">
                <h2 className="ai-section-heading">Invoice Information</h2>
                <div className="row">
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-organization">Organization</label>
                    <input
                      id="ai-organization"
                      className="ai-control"
                      value={organization.organizationName || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-currency">Currency</label>
                    <input id="ai-currency" className="ai-control" value="INR" readOnly />
                  </div>
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-country">Country</label>
                    <input
                      id="ai-country"
                      className="ai-control"
                      value={organization.country || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-invoice-date">Invoice Date</label>
                    <input
                      id="ai-invoice-date"
                      type="date"
                      className="ai-control"
                      value={form.invoiceDate}
                      onChange={(event) => setForm((previous) => ({ ...previous, invoiceDate: event.target.value }))}
                    />
                  </div>
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-due-date">Payment Due Date</label>
                    <input
                      id="ai-due-date"
                      type="date"
                      className="ai-control"
                      value={form.dueDate}
                      onChange={(event) => setForm((previous) => ({ ...previous, dueDate: event.target.value }))}
                    />
                  </div>
                  <div className="col-md-4 ai-field">
                    <label htmlFor="ai-invoice-number">Invoice No</label>
                    <input id="ai-invoice-number" className="ai-control" value="Auto Generated" readOnly />
                  </div>
                </div>
              </section>

              <section className="ai-section">
                <div className="ai-section-heading">
                  <span>Select Appointments</span>
                  <span className="ai-section-hint">Select one or more eligible appointments</span>
                </div>
                <div className="ai-table-wrap">
                  <table className="table ai-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Patient Name</th>
                        <th>Visit Date</th>
                        <th>QC Approved Date</th>
                        <th>Package Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="ai-empty">No Record Found</td>
                        </tr>
                      ) : (
                        appointments.map((appointment) => (
                          <tr key={appointment.appointmentId}>
                            <td>
                              <input
                                type="checkbox"
                                className="ai-checkbox"
                                checked={isSelected(appointment.appointmentId)}
                                onChange={(event) => handleSelect(appointment, event.target.checked)}
                                aria-label={`Select appointment for ${appointment.patientName || "patient"}`}
                              />
                            </td>
                            <td className="ai-patient-name">{appointment.patientName || "-"}</td>
                            <td>{appointment.visitDate || "-"}</td>
                            <td>{appointment.qcApprovedDate || "-"}</td>
                            <td className="ai-amount">₹ {appointment.packageAmount || 0}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="ai-total-panel">
                  <div>
                    <div className="ai-total-label">Total Invoice Amount (INR)</div>
                    <div className="ai-selected-count">{selected.length} appointment(s) selected</div>
                  </div>
                  <div className="ai-total-value">
                    ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </section>

              <section className="ai-section">
                <h2 className="ai-section-heading">Additional Information</h2>
                <div className="ai-field">
                  <label htmlFor="ai-remark">Remark</label>
                  <textarea
                    id="ai-remark"
                    className="ai-control"
                    placeholder="Enter any additional invoice remarks..."
                    value={form.remark}
                    onChange={(event) => setForm((previous) => ({ ...previous, remark: event.target.value }))}
                  />
                </div>
              </section>

              <div className="ai-footer">
                <button className="ai-btn ai-btn-secondary" onClick={() => navigate("/invoice")}>
                  Cancel
                </button>
                <button className="ai-btn ai-btn-primary" onClick={handleSubmit} disabled={submitting || loading}>
                  {submitting ? "Creating Invoice..." : "Create Invoice"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/addPatient.css";

// import { getOrganizationById } from "../../services/organizationService";
// import { getInvoiceEligibleAppointments } from "../../services/appointmentService";
// import { getAllCurrencies } from "../../services/currencyService";
// import { createInvoice } from "../../services/invoiceService";
// import { hasPermission } from "../permissionUtil";

// const AddInvoice = () => {
//   const canAdd = hasPermission("Invoice", "ADD");
//   const { id } = useParams(); // organizationId
//   const navigate = useNavigate();

//   const [organization, setOrganization] = useState({});
//   const [appointments, setAppointments] = useState([]);
//   const [currencies, setCurrencies] = useState([]);

//   const [selected, setSelected] = useState([]);

//   const [form, setForm] = useState({
//     organizationId: id,
//     currencyId: null,
//     invoiceDate: "",
//     dueDate: "",
//     remark: "",
//   });

//   // 🔥 LOAD DATA
//   useEffect(() => {
//   loadData();
// }, []);

// const loadData = async () => {
//   try {
//     const orgRes = await getOrganizationById(id);

//     const appRes = await getInvoiceEligibleAppointments(
//       0,
//       100,
//       "",
//       id
//     );

//     const currRes = await getAllCurrencies();

//     const orgData = orgRes.data.data;

//     setOrganization(orgData);

//     // Dedicated API already returns
//     // DONE + QC APPROVED appointments
//     setAppointments(appRes.data.data?.content || []);

//     setCurrencies(currRes.data.data || []);

//     // Default organization currency
//     if (orgData.currencyId) {
//       setForm((prev) => ({
//         ...prev,
//         currencyId: orgData.currencyId,
//       }));
//     }

//     // Default INR
//     const inr = (currRes.data.data || []).find(
//       (c) => c.currencyCode === "INR"
//     );

//     if (inr) {
//       setForm((prev) => ({
//         ...prev,
//         currencyId: inr.id,
//       }));
//     }
//   } catch (err) {
//     console.error("Failed to load invoice data:", err);
//   }
// };

//   // 🔥 SELECT CHECKBOX
//   const handleSelect = (appointment, checked) => {
//     if (checked) {
//       setSelected([...selected, appointment]);
//     } else {
//       setSelected(
//         selected.filter((a) => a.appointmentId !== appointment.appointmentId),
//       );
//     }
//   };

//   // 🔥 TOTAL CALCULATION
//   const totalAmount = selected.reduce(
//     (sum, a) => sum + (a.packageAmount || 0),
//     0,
//   );

//   // 🔥 SUBMIT
//   // const handleSubmit = async () => {
//   //   try {
//   //     const payload = {
//   //       organizationId: form.organizationId,
//   //       currencyId: form.currencyId,
//   //       invoiceDate: form.invoiceDate,
//   //       dueDate: form.dueDate,
//   //       remark: form.remark,
//   //       items: selected.map((a) => ({
//   //         appointmentId: a.appointmentId,
//   //         packageAmount: a.packageAmount || 0,
//   //       })),
//   //     };

//   //     console.log("🔥 INVOICE PAYLOAD:", payload);

//   //     await createInvoice(payload);

//   //     alert("Invoice Created Successfully");

//   //     navigate("/invoice");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Error creating invoice");
//   //   }
//   // };
//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         organizationId: Number(form.organizationId), // ✅ FIX
//         currencyId: Number(form.currencyId), // ✅ FIX
//         invoiceDate: form.invoiceDate,
//         dueDate: form.dueDate,
//         remark: form.remark,
//         items: selected.map((a) => ({
//           appointmentId: a.appointmentId,
//           packageAmount: a.packageAmount || 0,
//         })),
//       };

//       console.log("🔥 INVOICE PAYLOAD:", payload);

//       const res = await createInvoice(payload);

//       // ✅ Backend message
//       alert(res.data.message); // "Invoice created"

//       navigate("/invoice");
//     } catch (err) {
//       console.error(err);

//       alert(err.response?.data?.message || "Failed to create invoice ❌");
//     }
//   };
//   if (!canAdd) {
//   return <h3>Access Denied ❌</h3>;
// }

//   return (
//     <div className="container-fluid mt-3">
//       <div className="card">
//         <div className="card-header add-header">Add Invoice</div>

//         <div className="card-body">
//           {/* HEADER FIELDS */}
//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label>Organization</label>
//               <input
//                 className="form-control"
//                 value={organization.organizationName || ""}
//                 readOnly
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Currency</label>
//               {/* <select
//   className="form-control"
//   value={form.currencyId}
//   onChange={(e) =>
//     setForm({ ...form, currencyId: e.target.value })
//   }
// >
//   <option value="">Select</option>

//   {currencies.map((c) => (
//     <option key={c.id} value={c.id}>
//       {c.currencyCode}
//     </option>
//   ))}
// </select> */}
//               <input className="form-control" value="INR" readOnly />
//             </div>

//             <div className="col-md-4">
//               <label>Country</label>
//               <input
//                 className="form-control"
//                 value={organization.country || ""}
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label>Invoice Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.invoiceDate}
//                 onChange={(e) =>
//                   setForm({ ...form, invoiceDate: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Payment Due Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.dueDate}
//                 onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               />
//             </div>

//             <div className="col-md-4">
//               <label>Invoice No</label>
//               <input className="form-control" value="Auto Generated" readOnly />
//             </div>
//           </div>

//           {/* TABLE */}
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>Select</th>
//                   <th>Patient Name</th>
//                   <th>Visit Date</th>
//                   <th>QC Approved Date</th>
//                   <th>Package Amount</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-center">
//                       No Record Found
//                     </td>
//                   </tr>
//                 ) : (
//                   appointments.map((a) => (
//                     <tr key={a.appointmentId}>
//                       <td>
//                         <input
//                           type="checkbox"
//                           onChange={(e) => handleSelect(a, e.target.checked)}
//                         />
//                       </td>

//                       <td>{a.patientName}</td>
//                       <td>{a.visitDate}</td>
//                       <td>{a.qcApprovedDate || "-"}</td>
//                       <td>₹ {a.packageAmount || 0}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* TOTAL */}
//           <div className="mt-3">
//             <b>Total Amount (INR): ₹ {totalAmount}</b>
//           </div>

//           {/* REMARK */}
//           <div className="mt-3">
//             <label>Remark</label>
//             <textarea
//               className="form-control"
//               value={form.remark}
//               onChange={(e) => setForm({ ...form, remark: e.target.value })}
//             />
//           </div>

//           {/* BUTTONS */}
//           <div className="mt-3">
//             {/* <button className="btn btn-primary" onClick={handleSubmit}>
//               Submit
//             </button> */}
//             {canAdd && (
//   <button className="btn btn-primary" onClick={handleSubmit}>
//     Submit
//   </button>
// )}

//             <button
//               className="btn btn-danger ms-2"
//               onClick={() => navigate("/invoice")}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddInvoice;
