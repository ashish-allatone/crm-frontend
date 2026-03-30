import React from "react";
import { FaUserCircle, FaKey, FaSignOutAlt } from "react-icons/fa";
import "../../styles/profileDropdown.css";
import {useNavigate} from "react-router-dom";

const ProfileDropdown = () => {
    const navigate=useNavigate();

    const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
    

    
  return (
    <div className="profile-dropdown">

      <div className="profile-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="admin"
        />
        <div>
          <strong>CRM Admin</strong>
          <p>Admin</p>
        </div>
      </div>

      <div className="profile-menu">

        <div
className="profile-item"
onClick={()=>navigate("/profile")}
>
<FaUserCircle/> Profile
</div>

        <div
className="profile-item"
onClick={()=>navigate("/profile?password=true")}
>
<FaKey/> Change Password
</div>

        <div className="profile-item" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>

      </div>

    </div>
  );
};

export default ProfileDropdown;