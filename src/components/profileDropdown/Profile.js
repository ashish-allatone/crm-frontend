import React , {useState,useEffect} from "react";
import "../../styles/patientDetails.css";
import { useLocation } from "react-router-dom";
const Profile = () => {

    const [showModal,setShowModal] = useState(false);
    const [profilePhoto,setProfilePhoto] = useState(
"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
);

const [tempPhoto,setTempPhoto] = useState(profilePhoto);
const [showPasswordModal,setShowPasswordModal] = useState(false);

const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
    const [form,setForm] = useState({
firstname:"CRM",
lastname:"Admin",
gender:"Male",
dob:"",
age:"",
email:"himanshurai@healncare.in",
address:"",
city:"",
state:""
});

const admin = {
name:"CRM Admin",
gender:"Male",
mobile:"9988998899",
email:"abc@hmail.com",
dob:"",
address:"",
city:"",
state:""
};
const location = useLocation();

useEffect(()=>{

const params = new URLSearchParams(location.search);

if(params.get("password") === "true"){

setShowPasswordModal(true);

}

},[location]);



const handleChange = (e) => {

setForm({
...form,
[e.target.name]:e.target.value
});

};

const handlePhotoChange = (e) => {

const file = e.target.files[0];

if(file){

const imageUrl = URL.createObjectURL(file);

setTempPhoto(imageUrl);

}

};

return (

<div className="container mt-3">

{/* Profile Header */}

<div className="patient-profile-card">

<div className="cover-photo"></div>

<div className="profile-info d-flex align-items-center justify-content-between">

<div className="d-flex align-items-center">

<div className="profile-img-wrapper">

<img
src={profilePhoto}
className="profile-img" alt="profile"
/>

<span className="verify-badge">✔</span>

</div>

<div className="ms-3 patient-name">

{admin.name}

</div>

</div>

<button
className="btn edit-btn"
onClick={()=>{
setTempPhoto(profilePhoto);
setShowModal(true);
}}
>
✏ Edit Profile
</button>

</div>

</div>

{/* Profile Details */}

<div className="card mb-3">

<div className="card-body">

<div className="row">

<div className="col-md-6">

<p>
<b>Gender :</b> {admin.gender}
</p>

<p>
<b>Mobile Number :</b> {admin.mobile}
</p>

<p>
<b>Address :</b> {admin.address}
</p>

<p>
<b>City :</b> {admin.city}
</p>


<button
className="btn btn-primary mt-2"
onClick={()=>setShowPasswordModal(true)}
>
🔑 Change Password
</button>

</div>


<div className="col-md-6">

<p>
<b>Date Of Birth :</b> {admin.dob}
</p>

<p>
<b>Email :</b> {admin.email}
</p>

<p>
<b>State :</b> {admin.state}
</p>

</div>

</div>

</div>

</div>
{showModal && (

<div className="modal fade show d-block">

<div className="modal-dialog modal-lg">

<div className="modal-content">

<div
className="modal-header"
style={{background:"#3fb4b6",color:"white"}}
>

<h5 className="modal-title">
Update Profile
</h5>

<button
className="btn-close"
onClick={()=>setShowModal(false)}
></button>

</div>

<div className="modal-body">

{/* Profile Photo */}

<div className="text-center mb-3">

<img
src={tempPhoto}
width="100"
style={{borderRadius:"50%"}} alt="profile"
/>

<br/>

<label className="btn btn-outline-primary mt-2">

📷 Select Photo

<input
type="file"
accept="image/*"
onChange={handlePhotoChange}
hidden
/>

</label>
</div>


<div className="row">

<div className="col-md-6 mb-3">

<label>First Name</label>

<input
className="form-control"
name="firstname"
value={form.firstname}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>Last Name</label>

<input
className="form-control"
name="lastname"
value={form.lastname}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>Gender</label>

<select
className="form-control"
name="gender"
value={form.gender}
onChange={handleChange}
>

<option>Male</option>
<option>Female</option>

</select>

</div>


<div className="col-md-6 mb-3">

<label>DOB</label>

<input
type="date"
className="form-control"
name="dob"
value={form.dob}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>Age</label>

<input
className="form-control"
name="age"
value={form.age}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>Email</label>

<input
className="form-control"
name="email"
value={form.email}
onChange={handleChange}
/>

</div>


<div className="col-md-12 mb-3">

<label>Address</label>

<input
className="form-control"
name="address"
value={form.address}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>City</label>

<input
className="form-control"
name="city"
value={form.city}
onChange={handleChange}
/>

</div>


<div className="col-md-6 mb-3">

<label>State</label>

<input
className="form-control"
name="state"
value={form.state}
onChange={handleChange}
/>

</div>

</div>

</div>


<div className="modal-footer">

<button
className="btn btn-primary submit-btn"
onClick={()=>{
setProfilePhoto(tempPhoto);
setShowModal(false);
}}
>
Update
</button>

<button
className="btn btn-danger"
onClick={()=>setShowModal(false)}
>
Close
</button>

</div>

</div>

</div>

</div>

)}

{showPasswordModal && (

<div className="modal fade show d-block">

<div className="modal-dialog">

<div className="modal-content">

<div
className="modal-header"
style={{ background: "#3fb4b6", color: "white" }}
>

<h5 className="modal-title">Change Password</h5>

<button
className="btn-close"
onClick={()=>setShowPasswordModal(false)}
></button>

</div>


<div className="modal-body">

<div className="mb-3">

<label>Password</label>

<input
type="password"
className="form-control"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

</div>

<div className="mb-3">

<label>Confirm Password</label>

<input
type="password"
className="form-control"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

</div>

</div>


<div className="modal-footer">

<button className="btn btn-primary submit-btn">
Submit
</button>

<button
className="btn btn-danger"
onClick={()=>setShowPasswordModal(false)}
>
Cancel
</button>

</div>

</div>

</div>

</div>

)}

</div>

);

};

export default Profile;