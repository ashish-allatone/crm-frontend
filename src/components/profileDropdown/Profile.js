import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );
  const [tempPhoto, setTempPhoto] = useState(profilePhoto);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
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

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/users/roles", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setRoles(res.data))
      .catch((error) => console.error("Unable to load roles:", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const data = res.data.data;
        setForm({
          id: data.id ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          employeeNo: data.employeeNo ?? "",
          mobile: data.mobile ?? "",
          gender: data.gender ?? "",
          dob: data.dob ?? "",
          role: data.roles?.[0]?.name ?? "",
          address: data.address ?? ""
        });
      })
      .catch((error) => console.error("Unable to load profile:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("password") === "true") {
      setShowPasswordModal(true);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempPhoto(imageUrl);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    setSavingProfile(true);
    try {
      await api.put("/users/me", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfilePhoto(tempPhoto);
      setShowModal(false);
    } catch (error) {
      console.error("Unable to update profile:", error);
      alert(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      alert("Please enter and confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    setSavingPassword(true);
    try {
      await api.put("/users/me/change-password", {
        password,
        confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPasswordModal(false);
      setPassword("");
      setConfirmPassword("");
      alert("Password changed successfully");
    } catch (error) {
      console.error("Unable to change password:", error);
      alert(error.response?.data?.message || "Unable to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="profile-page">
      <style>{`
        .profile-page {
          --profile-navy: #0e3d66;
          --profile-deep: #061d30;
          --profile-text: #18243a;
          --profile-muted: #718096;
          color: var(--profile-text);
          width: 100%;
          padding: 22px 24px 30px;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .profile-page * { box-sizing: border-box; }
        .profile-page .profile-page-heading {
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; margin-bottom: 20px;
        }
        .profile-page .profile-page-heading h2 {
          margin: 0; font-size: 21px; line-height: 1.3; font-weight: 750; color: #18243a;
        }
        .profile-page .profile-page-heading p {
          margin: 5px 0 0; color: #7b8798; font-size: 12.5px;
        }
        .profile-page .profile-header-card {
          background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
          overflow: hidden; box-shadow: 0 3px 14px rgba(20, 43, 70, .06);
          margin-bottom: 18px;
        }
        .profile-page .profile-cover {
          height: 142px;
          background:
            linear-gradient(110deg, rgba(6,29,48,.78), rgba(14,61,102,.30)),
            url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80");
          background-size: cover; background-position: center 48%;
          position: relative;
        }
        .profile-page .profile-cover::after {
          content: ""; position: absolute; inset: auto 0 0; height: 42px;
          background: linear-gradient(transparent, rgba(5,24,41,.18));
        }
        .profile-page .profile-info {
          min-height: 104px; padding: 0 24px 18px; display: flex;
          align-items: flex-end; justify-content: space-between; gap: 18px;
          background: #fff;
        }
        .profile-page .profile-identity {
          display: flex; align-items: flex-end; gap: 16px; min-width: 0;
          margin-top: -42px; position: relative; z-index: 1;
        }
        .profile-page .profile-avatar-wrap {
          position: relative; flex: 0 0 auto; width: 88px; height: 88px;
          border-radius: 50%; background: #eaf1f7; border: 5px solid #fff;
          box-shadow: 0 3px 12px rgba(16, 42, 67, .15); overflow: visible;
        }
        .profile-page .profile-avatar {
          width: 100%; height: 100%; display: block; object-fit: cover;
          border-radius: 50%;
        }
        .profile-page .profile-avatar-fallback {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; border-radius: 50%; color: #fff;
          background: linear-gradient(135deg, #0e3d66, #3479a8);
          font-size: 25px; font-weight: 700;
        }
        .profile-page .profile-verified {
          position: absolute; right: -2px; bottom: 1px; width: 23px; height: 23px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; background: #159b78; border: 2px solid #fff;
          border-radius: 50%; font-size: 11px; font-weight: 800;
        }
        .profile-page .profile-name-block { padding-bottom: 8px; min-width: 0; }
        .profile-page .profile-name {
          margin: 0; font-size: 19px; font-weight: 750; color: #18243a;
          overflow-wrap: anywhere;
        }
        .profile-page .profile-username {
          margin: 4px 0 0; color: #78879a; font-size: 12px;
        }
        .profile-page .profile-actions {
          display: flex; align-items: center; gap: 9px; padding-bottom: 5px;
        }
        .profile-page .profile-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 7px; min-height: 37px; padding: 8px 13px; border-radius: 8px;
          border: 1px solid transparent; font-size: 12px; font-weight: 650;
          cursor: pointer; transition: .18s ease;
        }
        .profile-page .profile-btn-primary {
          background: #0e3d66; color: #fff;
        }
        .profile-page .profile-btn-primary:hover { background: #092d4b; }
        .profile-page .profile-btn-outline {
          background: #fff; color: #0e3d66; border-color: #d6e0e9;
        }
        .profile-page .profile-btn-outline:hover { background: #f3f7fa; }
        .profile-page .profile-details-card {
          background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
          box-shadow: 0 3px 14px rgba(20, 43, 70, .05); overflow: hidden;
        }
        .profile-page .profile-card-heading {
          padding: 17px 21px; display: flex; align-items: center;
          justify-content: space-between; border-bottom: 1px solid #edf1f5;
        }
        .profile-page .profile-card-heading h3 {
          margin: 0; font-size: 14px; font-weight: 750; color: #18243a;
        }
        .profile-page .profile-card-heading span {
          color: #8491a2; font-size: 11px;
        }
        .profile-page .profile-details-grid {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 32px; padding: 8px 22px 18px;
        }
        .profile-page .profile-detail {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 15px 0; border-bottom: 1px solid #f0f3f6; min-width: 0;
        }
        .profile-page .profile-detail-icon {
          width: 34px; height: 34px; flex: 0 0 34px; display: flex;
          align-items: center; justify-content: center; border-radius: 9px;
          background: #edf4f9; color: #0e3d66; font-size: 14px;
        }
        .profile-page .profile-detail-copy { min-width: 0; }
        .profile-page .profile-detail-label {
          display: block; margin-bottom: 4px; color: #8793a3;
          font-size: 10.5px; font-weight: 700; letter-spacing: .45px;
          text-transform: uppercase;
        }
        .profile-page .profile-detail-value {
          display: block; color: #26364b; font-size: 13px;
          font-weight: 600; overflow-wrap: anywhere;
        }
        .profile-page .profile-loading {
          min-height: 220px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          color: #718096; font-size: 13px;
        }
        .profile-page .profile-spinner {
          width: 28px; height: 28px; border: 3px solid #dce6ef;
          border-top-color: #0e3d66; border-radius: 50%;
          animation: profile-spin .8s linear infinite;
        }
        @keyframes profile-spin { to { transform: rotate(360deg); } }
        .profile-page .profile-modal-backdrop {
          position: fixed; inset: 0; z-index: 1050; display: flex;
          align-items: center; justify-content: center; padding: 18px;
          background: rgba(8, 23, 39, .55); overflow-y: auto;
        }
        .profile-page .profile-modal {
          width: 100%; max-width: 720px; margin: auto; background: #fff;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 18px 55px rgba(0,0,0,.22);
        }
        .profile-page .profile-modal-small { max-width: 470px; }
        .profile-page .profile-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 17px 21px; color: #fff;
          background: linear-gradient(120deg, #0e3d66 0%, #0a2d4a 60%, #061d30 100%);
        }
        .profile-page .profile-modal-header h3 {
          margin: 0; font-size: 16px; font-weight: 700;
        }
        .profile-page .profile-modal-close {
          border: 0; background: transparent; color: #fff;
          font-size: 25px; line-height: 1; cursor: pointer; opacity: .9;
        }
        .profile-page .profile-modal-body { padding: 21px; }
        .profile-page .profile-photo-picker {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; margin-bottom: 22px;
        }
        .profile-page .profile-photo-preview {
          width: 88px; height: 88px; object-fit: cover; border-radius: 50%;
          border: 4px solid #edf3f8;
        }
        .profile-page .profile-file-label {
          color: #0e3d66; border: 1px solid #cbd9e5; border-radius: 7px;
          padding: 7px 12px; font-size: 12px; font-weight: 650; cursor: pointer;
        }
        .profile-page .profile-form-grid {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px;
        }
        .profile-page .profile-form-group { min-width: 0; }
        .profile-page .profile-form-group.full { grid-column: 1 / -1; }
        .profile-page .profile-form-group label {
          display: block; margin-bottom: 6px; color: #425168;
          font-size: 11.5px; font-weight: 650;
        }
        .profile-page .profile-form-control {
          width: 100%; min-height: 40px; padding: 9px 11px;
          border: 1px solid #d9e1e9; border-radius: 8px;
          color: #26364b; background: #fff; font-size: 12.5px;
          outline: none; transition: .15s ease;
        }
        .profile-page .profile-form-control:focus {
          border-color: #6d94b4; box-shadow: 0 0 0 3px rgba(14,61,102,.09);
        }
        .profile-page .profile-modal-footer {
          display: flex; justify-content: flex-end; gap: 9px;
          padding: 14px 21px; border-top: 1px solid #edf1f5;
          background: #fbfcfd;
        }
        .profile-page .profile-btn-danger {
          background: #fff; color: #bd3e48; border-color: #efcbd0;
        }
        .profile-page .profile-btn-danger:hover { background: #fff5f5; }
        .profile-page .profile-btn:disabled { opacity: .6; cursor: not-allowed; }
        @media (max-width: 700px) {
          .profile-page { padding: 16px 12px 24px; }
          .profile-page .profile-info {
            align-items: flex-start; flex-direction: column; padding: 0 16px 16px;
          }
          .profile-page .profile-identity { margin-top: -39px; }
          .profile-page .profile-actions { width: 100%; padding: 0; }
          .profile-page .profile-actions .profile-btn { flex: 1; }
          .profile-page .profile-details-grid { grid-template-columns: 1fr; padding: 5px 17px 15px; }
          .profile-page .profile-form-grid { grid-template-columns: 1fr; }
          .profile-page .profile-form-group.full { grid-column: auto; }
          .profile-page .profile-cover { height: 120px; }
        }
        @media (max-width: 420px) {
          .profile-page .profile-page-heading h2 { font-size: 19px; }
          .profile-page .profile-name { font-size: 17px; }
          .profile-page .profile-avatar-wrap { width: 78px; height: 78px; }
          .profile-page .profile-modal-backdrop { padding: 9px; }
          .profile-page .profile-modal-body { padding: 16px; }
        }
      `}</style>

      <div className="profile-page-heading">
        <div>
          <h2>My Profile</h2>
          <p>View and manage your personal account information</p>
        </div>
      </div>

      {loading ? (
        <div className="profile-details-card profile-loading">
          <div className="profile-spinner" />
          Loading profile details...
        </div>
      ) : (
        <>
          <section className="profile-header-card">
            <div className="profile-cover" />
            <div className="profile-info">
              <div className="profile-identity">
                <div className="profile-avatar-wrap">
                  {profilePhoto ? (
                    <img src={profilePhoto} className="profile-avatar" alt="Profile" />
                  ) : (
                    <div className="profile-avatar-fallback">{initials || "U"}</div>
                  )}
                  <span className="profile-verified" title="Profile">✓</span>
                </div>
                <div className="profile-name-block">
                  <h3 className="profile-name">
                    {[form.firstName, form.lastName].filter(Boolean).join(" ") || "User Profile"}
                  </h3>
                  <p className="profile-username">
                    {form.username ? `@${form.username}` : "Account details"}
                  </p>
                </div>
              </div>
              {/* <div className="profile-actions">
                <button
                  type="button"
                  className="profile-btn profile-btn-outline"
                  onClick={() => {
                    setTempPhoto(profilePhoto);
                    setShowModal(true);
                  }}
                >
                  <span>✎</span> Edit Profile
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn-primary"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <span>♙</span> Change Password
                </button>
              </div> */}
            </div>
          </section>

          <section className="profile-details-card">
            <div className="profile-card-heading">
              <h3>Personal Information</h3>
              <span>Account overview</span>
            </div>
            <div className="profile-details-grid">
              <div className="profile-detail">
                <div className="profile-detail-icon">♙</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Username</span>
                  <span className="profile-detail-value">{form.username || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">✉</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Email Address</span>
                  <span className="profile-detail-value">{form.email || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">▤</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Employee Number</span>
                  <span className="profile-detail-value">{form.employeeNo || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">▣</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Role</span>
                  <span className="profile-detail-value">{form.role || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">⚥</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Gender</span>
                  <span className="profile-detail-value">{form.gender || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">▦</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Date of Birth</span>
                  <span className="profile-detail-value">{form.dob || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">☎</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Mobile Number</span>
                  <span className="profile-detail-value">{form.mobile || "—"}</span>
                </div>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-icon">⌖</div>
                <div className="profile-detail-copy">
                  <span className="profile-detail-label">Address</span>
                  <span className="profile-detail-value">{form.address || "—"}</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {showModal && (
        <div className="profile-modal-backdrop" role="presentation" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
            <div className="profile-modal-header">
              <h3 id="profile-edit-title">Update Profile</h3>
              <button type="button" className="profile-modal-close" onClick={() => setShowModal(false)} aria-label="Close">×</button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-photo-picker">
                <img src={tempPhoto} className="profile-photo-preview" alt="Profile preview" />
                <label className="profile-file-label">
                  📷 Select Photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                </label>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>First Name</label>
                  <input className="profile-form-control" name="firstName" value={form.firstName} onChange={handleChange} />
                </div>
                <div className="profile-form-group">
                  <label>Last Name</label>
                  <input className="profile-form-control" name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
                <div className="profile-form-group">
                  <label>Gender</label>
                  <select className="profile-form-control" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="profile-form-group">
                  <label>Date of Birth</label>
                  <input type="date" className="profile-form-control" name="dob" value={form.dob || ""} onChange={handleChange} />
                </div>
                <div className="profile-form-group">
                  <label>Email</label>
                  <input type="email" className="profile-form-control" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="profile-form-group">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="profile-form-control">
                    <option value="">--Select Role--</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="profile-form-group full">
                  <label>Address</label>
                  <input className="profile-form-control" name="address" value={form.address} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="profile-modal-footer">
              <button type="button" className="profile-btn profile-btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="profile-btn profile-btn-primary" onClick={handleUpdateProfile} disabled={savingProfile}>
                {savingProfile ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="profile-modal-backdrop" role="presentation" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowPasswordModal(false);
        }}>
          <div className="profile-modal profile-modal-small" role="dialog" aria-modal="true" aria-labelledby="profile-password-title">
            <div className="profile-modal-header">
              <h3 id="profile-password-title">Change Password</h3>
              <button type="button" className="profile-modal-close" onClick={() => setShowPasswordModal(false)} aria-label="Close">×</button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-form-group" style={{ marginBottom: 16 }}>
                <label>New Password</label>
                <input type="password" className="profile-form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <div className="profile-form-group">
                <label>Confirm Password</label>
                <input type="password" className="profile-form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              </div>
            </div>
            <div className="profile-modal-footer">
              <button type="button" className="profile-btn profile-btn-danger" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button type="button" className="profile-btn profile-btn-primary" onClick={handleChangePassword} disabled={savingPassword}>
                {savingPassword ? "Submitting..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from "react";
// import "../../styles/patientDetails.css";
// import { useLocation } from "react-router-dom";
// import api from "../../services/api";
// const Profile = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(
//     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//   );

//   const [tempPhoto, setTempPhoto] = useState(profilePhoto);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [form, setForm] = useState({
//   id: "",
//   firstName: "",
//   lastName: "",
//   username: "",
//   email: "",
//   employeeNo: "",
//   mobile: "",
//   gender: "",
//   dob: "",
//   role: "",
//   address: ""
// });
// useEffect(() => {
//   const token = localStorage.getItem("token");

//   api.get("/users/roles", {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   .then(res => setRoles(res.data));
// }, []);

// useEffect(() => {

//   const token = localStorage.getItem("token");

//   api.get("/users/me", {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   .then(res => {
//     const data = res.data.data;

//     setForm({
//       id: data.id,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       username: data.username,
//       email: data.email,
//       employeeNo: data.employeeNo,
//       mobile: data.mobile,
//       gender: data.gender,
//       dob: data.dob,
//       role: data.roles?.[0]?.name,
//       address: data.address
//     });
//   });

// }, []);
//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     if (params.get("password") === "true") {
//       setShowPasswordModal(true);
//     }
//   }, [location]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       const imageUrl = URL.createObjectURL(file);

//       setTempPhoto(imageUrl);
//     }
//   };

//   const handleUpdateProfile = async () => {

//   const token = localStorage.getItem("token");

//   await api.put("/users/me", form, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   setProfilePhoto(tempPhoto);
//   setShowModal(false);
// };

// const handleChangePassword = async () => {

//   if (password !== confirmPassword) {
//     alert("Passwords do not match");
//     return;
//   }

//   const token = localStorage.getItem("token");

//   await api.put("/users/me/change-password", {
//     password,
//     confirmPassword
//   }, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   setShowPasswordModal(false);
// };

//   return (
//     <div className="container mt-3">
//       {/* Profile Header */}

//       <div className="patient-profile-card">
//         <div className="cover-photo"></div>

//         <div className="profile-info d-flex align-items-center justify-content-between">
//           <div className="d-flex align-items-center">
//             <div className="profile-img-wrapper">
//               <img src={profilePhoto} className="profile-img" alt="profile" />

//               <span className="verify-badge">✔</span>
//             </div>

//             <div className="ms-3 patient-name">{form.firstName} {form.lastName}</div>
//           </div>

//           {/* <button
//             className="btn edit-btn"
//             onClick={() => {
//               setTempPhoto(profilePhoto);
//               setShowModal(true);
//             }}
//           >
//             ✏ Edit Profile
//           </button> */}
//         </div>
//       </div>

//       {/* Profile Details */}

//       <div className="card mb-3">
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6">

//                 <p>
//                 <b>Username :</b> {form.username}
//               </p>

//               <p>
//                 <b>Email :</b> {form.email}
//               </p>

//               <p>
//                 <b>Employee No :</b> {form.employeeNo}
//               </p>
//               <p>
//                 <b>Role :</b> {form.role}
//               </p>
             

              

//               {/* <button
//                 className="btn btn-primary mt-2"
//                 onClick={() => setShowPasswordModal(true)}
//               >
//                 🔑 Change Password
//               </button> */}
//             </div>

//             <div className="col-md-6">
              

//               <p>
//                 <b>Gender :</b> {form.gender}
//               </p>

//               <p>
//                 <b>DOB :</b> {form.dob}
//               </p>

//               <p>
//                 <b>Mobile Number :</b> {form.mobile}
//               </p>

//               <p>
//                 <b>Address :</b> {form.address}
//               </p>


//             </div>
//           </div>
//         </div>
//       </div>
//       {showModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Update Profile</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 {/* Profile Photo */}

//                 <div className="text-center mb-3">
//                   <img
//                     src={tempPhoto}
//                     width="100"
//                     style={{ borderRadius: "50%" }}
//                     alt="profile"
//                   />

//                   <br />

//                   <label className="btn btn-outline-primary mt-2">
//                     📷 Select Photo
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handlePhotoChange}
//                       hidden
//                     />
//                   </label>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label>First Name</label>

//                     <input
//                       className="form-control"
//                       name="firstName"
//                       value={form.firstName}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Last Name</label>

//                     <input
//                       className="form-control"
//                       name="lastName"
//                       value={form.lastName}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>Gender</label>

//                     <select
//                       className="form-control"
//                       name="gender"
//                       value={form.gender}
//                       onChange={handleChange}
//                     >
//                       <option>Male</option>
//                       <option>Female</option>
//                     </select>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label>DOB</label>

//                     <input
//                       type="date"
//                       className="form-control"
//                       name="dob"
//                       value={form.dob}
//                       onChange={handleChange}
//                     />
//                   </div>

                 

//                   <div className="col-md-6 mb-3">
//                     <label>Email</label>

//                     <input
//                       className="form-control"
//                       name="email"
//                       value={form.email}
//                       onChange={handleChange}
//                     />
//                   </div>

//                    <div className="col-md-6 mb-3">
//                     <label>Role</label>

//                     <select
//   name="role"
//   value={form.role}
//   onChange={handleChange}
//   className="form-control"
// >
//   <option value="">--Select Role--</option>
//   {roles.map((r) => (
//     <option key={r.id} value={r.name}>
//       {r.name}
//     </option>
//   ))}
// </select>
//                   </div>

//                   <div className="col-md-12 mb-3">
//                     <label>Address</label>

//                     <input
//                       className="form-control"
//                       name="address"
//                       value={form.address}
//                       onChange={handleChange}
//                     />
//                   </div>
                 

                 


                  

                  
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="btn btn-primary submit-btn"
//                   onClick={handleUpdateProfile}
//                 >
//                   Update
//                 </button>

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPasswordModal && (
//         <div className="modal fade show d-block">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div
//                 className="modal-header"
//                 style={{ background: "#3fb4b6", color: "white" }}
//               >
//                 <h5 className="modal-title">Change Password</h5>

//                 <button
//                   className="btn-close"
//                   onClick={() => setShowPasswordModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label>Password</label>

//                   <input
//                     type="password"
//                     className="form-control"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label>Confirm Password</label>

//                   <input
//                     type="password"
//                     className="form-control"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button className="btn btn-primary submit-btn" onClick={handleChangePassword}>
//   Submit
// </button>

//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setShowPasswordModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;
