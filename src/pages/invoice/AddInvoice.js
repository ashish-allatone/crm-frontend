import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/addPatient.css";

import { getOrganizationById } from "../../services/organizationService";
import { getAppointments } from "../../services/appointmentService";
import { getAllCurrencies } from "../../services/currencyService";
import { createInvoice } from "../../services/invoiceService";

const AddInvoice = () => {
  const { id } = useParams(); // organizationId
  const navigate = useNavigate();

  const [organization, setOrganization] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [selected, setSelected] = useState([]);

  const [form, setForm] = useState({
    organizationId: id,
    currencyId: null,
    invoiceDate: "",
    dueDate: "",
    remark: "",
  });

  // 🔥 LOAD DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const orgRes = await getOrganizationById(id);
      const appRes = await getAppointments(0, 100, "", null, id);
      const currRes = await getAllCurrencies();

      const orgData = orgRes.data.data;

      setOrganization(orgData);
      setAppointments(appRes.data.content || []);
      setCurrencies(currRes.data.data || []);

      // 🔥 default currency
      if (orgData.currencyId) {
        setForm((prev) => ({
          ...prev,
          currencyId: orgData.currencyId,
        }));
      }
      const inr = currRes.data.data.find(c => c.currencyCode === "INR");

if (inr) {
  setForm(prev => ({
    ...prev,
    currencyId: inr.id   // ✅ IMPORTANT
  }));
}

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SELECT CHECKBOX
  const handleSelect = (appointment, checked) => {
    if (checked) {
      setSelected([...selected, appointment]);
    } else {
      setSelected(selected.filter((a) => a.appointmentId !== appointment.appointmentId));
    }
  };

  // 🔥 TOTAL CALCULATION
  const totalAmount = selected.reduce(
    (sum, a) => sum + (a.packageAmount || 0),
    0
  );

  // 🔥 SUBMIT
  // const handleSubmit = async () => {
  //   try {
  //     const payload = {
  //       organizationId: form.organizationId,
  //       currencyId: form.currencyId,
  //       invoiceDate: form.invoiceDate,
  //       dueDate: form.dueDate,
  //       remark: form.remark,
  //       items: selected.map((a) => ({
  //         appointmentId: a.appointmentId,
  //         packageAmount: a.packageAmount || 0,
  //       })),
  //     };

  //     console.log("🔥 INVOICE PAYLOAD:", payload);

  //     await createInvoice(payload);

  //     alert("Invoice Created Successfully");

  //     navigate("/invoice");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error creating invoice");
  //   }
  // };
  const handleSubmit = async () => {
  try {
    const payload = {
       organizationId: Number(form.organizationId), // ✅ FIX
  currencyId: Number(form.currencyId),         // ✅ FIX
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      remark: form.remark,
      items: selected.map((a) => ({
        appointmentId: a.appointmentId,
        packageAmount: a.packageAmount || 0,
      })),
    };

    console.log("🔥 INVOICE PAYLOAD:", payload);

    const res = await createInvoice(payload);

    // ✅ Backend message
    alert(res.data.message); // "Invoice created"

    navigate("/invoice");

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to create invoice ❌"
    );
  }
};

  return (
    <div className="container-fluid mt-3">
      <div className="card">

        <div className="card-header add-header">
          Add Invoice
        </div>

        <div className="card-body">

          {/* HEADER FIELDS */}
          <div className="row mb-3">

            <div className="col-md-4">
              <label>Organization</label>
              <input
                className="form-control"
                value={organization.organizationName || ""}
                readOnly
              />
            </div>

            <div className="col-md-4">
              <label>Currency</label>
              {/* <select
  className="form-control"
  value={form.currencyId}
  onChange={(e) =>
    setForm({ ...form, currencyId: e.target.value })
  }
>
  <option value="">Select</option>

  {currencies.map((c) => (
    <option key={c.id} value={c.id}>
      {c.currencyCode}
    </option>
  ))}
</select> */}
<input
  className="form-control"
  value="INR"
  readOnly
/>
            </div>

            <div className="col-md-4">
              <label>Country</label>
              <input
                className="form-control"
                value={organization.country || ""}
                readOnly
              />
            </div>

          </div>

          <div className="row mb-3">

            <div className="col-md-4">
              <label>Invoice Date</label>
              <input
                type="date"
                className="form-control"
                value={form.invoiceDate}
                onChange={(e) =>
                  setForm({ ...form, invoiceDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label>Payment Due Date</label>
              <input
                type="date"
                className="form-control"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label>Invoice No</label>
              <input
                className="form-control"
                value="Auto Generated"
                readOnly
              />
            </div>

          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Patient Name</th>
                  <th>Visit Date</th>
                  <th>Package Amount</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.appointmentId}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleSelect(a, e.target.checked)
                          }
                        />
                      </td>

                      <td>{a.patientName}</td>
                      <td>{a.visitDate}</td>
                      <td>₹ {a.packageAmount || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="mt-3">
            <b>Total Amount (INR): ₹ {totalAmount}</b>
          </div>

          {/* REMARK */}
          <div className="mt-3">
            <label>Remark</label>
            <textarea
              className="form-control"
              value={form.remark}
              onChange={(e) =>
                setForm({ ...form, remark: e.target.value })
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>

            <button
              className="btn btn-danger ms-2"
              onClick={() => navigate("/invoice")}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddInvoice;