import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";
import { hasPermission } from "../../pages/permissionUtil";

const AppointmentDropdown = () => {
  return (
    <div className="master-dropdown">

      {/* <Link to="/appointment/today" className="dropdown-item">
        <FaCalendarCheck className="icon" /> Today
      </Link> */}
      {hasPermission("Appointment", "VIEW") && (
  <Link to="/appointment/today" className="dropdown-item">
    <FaCalendarCheck className="icon" /> Today
  </Link>
)}

      {/* <Link to="/appointment/upcoming" className="dropdown-item">
        <FaCalendarCheck className="icon" /> Upcoming
      </Link> */}
      {hasPermission("Appointment", "VIEW") && (
  <Link to="/appointment/upcoming" className="dropdown-item">
    <FaCalendarCheck className="icon" /> Upcoming
  </Link>
)}

    </div>
  );
};

export default AppointmentDropdown;