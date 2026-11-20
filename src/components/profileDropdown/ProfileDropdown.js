
import React from "react";
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/crm/login";
  };

  return (
    <div className="dropdown-menu-modern">
      <div className="profile-dropdown-header">
        <div className="profile-avatar">
          <FaUser />
        </div>

        <div className="profile-header-info">
          <h6>{user?.firstName} {user?.lastName}</h6>
          <span>{user?.roles?.[0]?.name || "User"}</span>
        </div>

        <button
          type="button"
          className="profile-edit-btn"
          title="Edit Profile"
          onClick={() => navigate("/profile")}
        >
          <FaEdit />
        </button>
      </div>

      <div className="profile-details">
        <div className="profile-detail-item">
          <span className="profile-detail-icon"><FaUser /></span>
          <div>
            <small>Username</small>
            <p>{user?.username || "-"}</p>
          </div>
        </div>

        <div className="profile-detail-item">
          <span className="profile-detail-icon"><FaEnvelope /></span>
          <div>
            <small>Email Address</small>
            <p>{user?.email || "-"}</p>
          </div>
        </div>

        <div className="profile-detail-item">
          <span className="profile-detail-icon"><FaPhone /></span>
          <div>
            <small>Contact Number</small>
            <p>{user?.mobile || "-"}</p>
          </div>
        </div>

        <div className="profile-detail-item">
          <span className="profile-detail-icon"><FaUserShield /></span>
          <div>
            <small>Role</small>
            <p>{user?.roles?.[0]?.name || "-"}</p>
          </div>
        </div>
      </div>

      <div className="profile-dropdown-footer">
        <button
          type="button"
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;


// import React from "react";
// import { FaEdit } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const ProfileDropdown = ({ user }) => {

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/crm/login";
//   };

//   return (
//     <div className="dropdown-menu-modern">

//       <FaEdit
//         className="dropdown-edit-icon"
//         title="Edit Profile"
//         onClick={() => navigate(`/profile`)}
//       />

//       <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
//       <p><strong>Username:</strong> {user?.username}</p>
//       <p><strong>Email:</strong> {user?.email}</p>
//       <p><strong>Contact:</strong> {user?.mobile}</p>
//       <p><strong>Role:</strong> {user?.roles?.[0]?.name}</p>

//       <hr />

//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   );
// };

// export default ProfileDropdown;