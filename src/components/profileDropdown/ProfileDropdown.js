import React from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ user }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dropdown-menu-modern">

      <FaEdit
        className="dropdown-edit-icon"
        title="Edit Profile"
        onClick={() => navigate(`/profile`)}
      />

      <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Contact:</strong> {user?.mobile}</p>
      <p><strong>Role:</strong> {user?.roles?.[0]?.name}</p>

      <hr />

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;