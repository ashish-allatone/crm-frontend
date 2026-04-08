import React, { useState, useEffect } from "react";
import "../../styles/patientDetails.css";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  );

  const [tempPhoto, setTempPhoto] = useState(profilePhoto);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
  id: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  employeeNo: "",
  mobile: "",
  gender: "",
  dob: "",
  role: "",
  address: ""
});
useEffect(() => {
  const token = localStorage.getItem("token");

  api.get("/users/roles", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => setRoles(res.data));
}, []);

useEffect(() => {

  const token = localStorage.getItem("token");

  api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    const data = res.data.data;

    setForm({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      employeeNo: data.employeeNo,
      mobile: data.mobile,
      gender: data.gender,
      dob: data.dob,
      role: data.roles?.[0]?.name,
      address: data.address
    });
  });

}, []);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("password") === "true") {
      setShowPasswordModal(true);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setTempPhoto(imageUrl);
    }
  };

  const handleUpdateProfile = async () => {

  const token = localStorage.getItem("token");

  await api.put("/users/me", form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setProfilePhoto(tempPhoto);
  setShowModal(false);
};

const handleChangePassword = async () => {

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const token = localStorage.getItem("token");

  await api.put("/users/me/change-password", {
    password,
    confirmPassword
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setShowPasswordModal(false);
};

  return (
    <div className="container mt-3">
      {/* Profile Header */}

      <div className="patient-profile-card">
        <div className="cover-photo"></div>

        <div className="profile-info d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="profile-img-wrapper">
              <img src={profilePhoto} className="profile-img" alt="profile" />

              <span className="verify-badge">✔</span>
            </div>

            <div className="ms-3 patient-name">{form.firstName} {form.lastName}</div>
          </div>

          <button
            className="btn edit-btn"
            onClick={() => {
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
                <b>Username :</b> {form.username}
              </p>

              <p>
                <b>Email :</b> {form.email}
              </p>

              <p>
                <b>Employee No :</b> {form.employeeNo}
              </p>
              <p>
                <b>Role :</b> {form.role}
              </p>
             

              

              <button
                className="btn btn-primary mt-2"
                onClick={() => setShowPasswordModal(true)}
              >
                🔑 Change Password
              </button>
            </div>

            <div className="col-md-6">
              

              <p>
                <b>Gender :</b> {form.gender}
              </p>

              <p>
                <b>DOB :</b> {form.dob}
              </p>

              <p>
                <b>Mobile Number :</b> {form.mobile}
              </p>

              <p>
                <b>Address :</b> {form.address}
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
                style={{ background: "#3fb4b6", color: "white" }}
              >
                <h5 className="modal-title">Update Profile</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Profile Photo */}

                <div className="text-center mb-3">
                  <img
                    src={tempPhoto}
                    width="100"
                    style={{ borderRadius: "50%" }}
                    alt="profile"
                  />

                  <br />

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
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>

                    <input
                      className="form-control"
                      name="lastName"
                      value={form.lastName}
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
                    <label>Email</label>

                    <input
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                   <div className="col-md-6 mb-3">
                    <label>Role</label>

                    <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="form-control"
>
  <option value="">--Select Role--</option>
  {roles.map((r) => (
    <option key={r.id} value={r.name}>
      {r.name}
    </option>
  ))}
</select>
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
                 

                 


                  

                  
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary submit-btn"
                  onClick={handleUpdateProfile}
                >
                  Update
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
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
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>Password</label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>

                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-primary submit-btn" onClick={handleChangePassword}>
  Submit
</button>

                <button
                  className="btn btn-danger"
                  onClick={() => setShowPasswordModal(false)}
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
