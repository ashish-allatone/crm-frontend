import React, { useState } from "react";
import "../../../styles/addPatient.css";

const Configuration = () => {

const [form, setForm] = useState({
centerName: "EXAMPLE",
centerEmail: "abc@labs.in",
phone: "+91 8877887766",
address: "Mumbai",
country: "India",
state: "",
city: "",
headerSize: "5.2",
footerSize: "2.5",
logo: null
});

const handleChange = (e) => {
const { name, value } = e.target;
setForm({ ...form, [name]: value });
};

const handleFile = (e) => {
setForm({ ...form, logo: e.target.files[0] });
};

const handleSubmit = () => {
console.log(form);
};

return (

<div className="container-fluid mt-3">

<div className="card">

<div
className="card-header"
style={{ background: "#3fb4b6", color: "white" }}
>
Center Details
</div>

<div className="card-body">

<div className="row g-3">

{/* Center Name */}

<div className="col-md-6">
<label>Center Name</label>
<input
className="form-control"
name="centerName"
value={form.centerName}
onChange={handleChange}
/>
</div>

{/* Header Size */}

<div className="col-md-6">
<label>Printed Letter Head Size</label>
<div className="d-flex">
<input
className="form-control"
name="headerSize"
value={form.headerSize}
onChange={handleChange}
/>
<span className="ms-2 mt-2">cm</span>
</div>
</div>

{/* Email */}

<div className="col-md-6">
<label>Center Email</label>
<input
className="form-control"
name="centerEmail"
value={form.centerEmail}
onChange={handleChange}
/>
</div>

{/* Footer */}

<div className="col-md-6">
<label>Printed Letter Footer Size</label>
<div className="d-flex">
<input
className="form-control"
name="footerSize"
value={form.footerSize}
onChange={handleChange}
/>
<span className="ms-2 mt-2">cm</span>
</div>
</div>

{/* Phone */}

<div className="col-md-6">
<label>Center Phone No.</label>
<input
className="form-control"
name="phone"
value={form.phone}
onChange={handleChange}
/>
</div>

{/* Address */}

<div className="col-md-6">
<label>Center Address</label>
<input
className="form-control"
name="address"
value={form.address}
onChange={handleChange}
/>
</div>

{/* Country */}

<div className="col-md-6">
<label>By Default Country</label>
<select
className="form-control"
name="country"
value={form.country}
onChange={handleChange}
>
<option>India</option>
<option>UAE</option>
</select>
</div>

{/* State */}

<div className="col-md-6">
<label>By Default State</label>
<select
className="form-control"
name="state"
value={form.state}
onChange={handleChange}
>
<option value="">State</option>
<option>Maharashtra</option>
<option>Delhi</option>
</select>
</div>

{/* City */}

<div className="col-md-6">
<label>By Default City</label>
<select
className="form-control"
name="city"
value={form.city}
onChange={handleChange}
>
<option value="">City</option>
<option>Mumbai</option>
<option>Delhi</option>
</select>
</div>

</div>

{/* Logo Section */}

<div className="row mt-4">

<div className="col-md-3">

<img
src="https://dummyimage.com/200x80/00a9a9/ffffff&text= EXAMPLE"
alt="logo"
style={{ width: "200px" }}
/>

</div>

<div className="col-md-6">

<label>Choose Logo</label>

<input
type="file"
className="form-control"
onChange={handleFile}
/>

</div>

</div>

<div className="mt-4">

<button
className="btn submit-btn"
onClick={handleSubmit}
>
Update
</button>

</div>

</div>

</div>

</div>

);

};

export default Configuration;