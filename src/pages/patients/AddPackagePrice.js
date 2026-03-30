import React from "react";
import "../../styles/allPatients.css";
import {useParams,useNavigate} from "react-router-dom";
import {patients} from "../../data/patients";

const AddPackagePrice = () => {

const {id} = useParams();
const navigate = useNavigate();

const patient = patients.find(p => p.id === parseInt(id));

if(!patient) return <div>Patient not found</div>;

return(

<div className="container-fluid mt-3">

<div className="card">

<div
className="card-header"
style={{background:"linear-gradient(90deg,#6a5acd,#7b68ee)",color:"white"}}
>
<h5>Add Package Price</h5>
</div>


<div className="card-body">

{/* Patient Info */}

<div className="row mb-3">

<div className="col-md-4">
<label>Patient Name</label>
<input className="form-control" value={`${patient.title}. ${patient.name}`} readOnly/>
</div>

<div className="col-md-2">
<label>Gender</label>
<input className="form-control" value={patient.gender} readOnly/>
</div>

<div className="col-md-2">
<label>DOB</label>
<input className="form-control" value={patient.dob} readOnly/>
</div>

<div className="col-md-2">
<label>Age</label>
<input className="form-control" value={`${patient.age} ${patient.ageType}`} readOnly/>
</div>

<div className="col-md-2">
<label>Mobile No.</label>
<input className="form-control" value={patient.mobile} readOnly/>
</div>

</div>


<div className="row mb-3">

<div className="col-md-6">
<label>Address</label>
<input className="form-control" value={patient.address} readOnly/>
</div>

<div className="col-md-3">
<label>Country</label>
<input className="form-control" value={patient.country} readOnly/>
</div>

<div className="col-md-3">
<label>State</label>
<input className="form-control" value={patient.state} readOnly/>
</div>

</div>


<div className="row mb-4">

<div className="col-md-3">
<label>City</label>
<input className="form-control" value={patient.city} readOnly/>
</div>

<div className="col-md-3">
<label>Proposal Id</label>
<input className="form-control" value={patient.proposalId} readOnly/>
</div>

<div className="col-md-3">
<label>Organization</label>
<input className="form-control" value={patient.organization} readOnly/>
</div>

<div className="col-md-3">
<label>Insurance Company</label>
<input className="form-control" value={patient.insurance} readOnly/>
</div>

</div>


{/* Test List */}

<h6 className="mb-3">Test List</h6>

<table className="table table-bordered">

<thead>

<tr>
<th>TEST NAME</th>
<th>TEST TYPE</th>
<th>SAMPLE TYPE</th>
</tr>

</thead>

<tbody>

{patient.tests.map((t,index)=>(

<tr key={index}>
<td>{t.test}</td>
<td>{t.type}</td>
<td>{t.sample}</td>
</tr>

))}

</tbody>

</table>


{/* Price Section */}

<div className="row mt-3">

<div className="col-md-3">
<label>Price</label>
<input className="form-control"/>
</div>

<div className="col-md-3">
<label>Currency</label>
<select className="form-control">
<option>INR</option>
<option>USD</option>
</select>
</div>

<div className="col-md-3">
<label>INR Conversion Rate</label>
<input className="form-control" defaultValue="1.00"/>
</div>

<div className="col-md-3">
<label>INR Price</label>
<input className="form-control"/>
</div>

</div>


<div className="mt-4">

<button className="btn btn-primary me-2">
Update
</button>

<button
className="btn btn-danger"
onClick={()=>navigate("/")}
>
Goto Dashboard
</button>

</div>

</div>

</div>

</div>

);

};

export default AddPackagePrice;