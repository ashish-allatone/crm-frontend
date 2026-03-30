import React, { useState } from "react";
import { Link } from "react-router-dom";


import {
  FaHome,
  FaUsers,
  FaUserInjured,
  FaCalendarCheck,
  FaFlask,
  FaFileMedical,
  FaFileInvoice,
  FaChartBar,
} from "react-icons/fa";

import "../styles/navbar.css";
import MasterDropdown from "./dropdown/MasterDropdown";
import AppointmentDropdown from "./dropdown/AppointmentDropdown";
import ReportsDropdown from "./dropdown/ReportsDropdown";
import ProfileDropdown from "./profileDropdown/ProfileDropdown";

const Navbar = () => {

  const [showProfile,setShowProfile] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark crm-navbar">
      <div className="container-fluid">

        <div
  className="navbar-brand profile-wrapper"
  onClick={()=>setShowProfile(!showProfile)}
>
  CRM
  {showProfile && <ProfileDropdown/>}
</div>

        <ul className="navbar-nav">

          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FaHome className="nav-icon" /> Dashboard
            </Link>
          </li>

          {/* MASTER */}
          <li className="nav-item dropdown-menu-wrapper">
            <span className="nav-link">
              <FaUsers className="nav-icon" /> Master ▼
            </span>
            <MasterDropdown/>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/patients">
              <FaUserInjured className="nav-icon" /> All Patients
            </Link>
          </li>

          {/* APPOINTMENT */}
          <li className="nav-item dropdown-menu-wrapper">
            <span className="nav-link">
              <FaCalendarCheck className="nav-icon" /> Appointment ▼
            </span>
            <AppointmentDropdown />
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/test-result">
              <FaFlask className="nav-icon" /> Test Result
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/test-report">
              <FaFileMedical className="nav-icon" /> Test Report
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/invoice">
              <FaFileInvoice className="nav-icon" /> Invoice
            </Link>
          </li>

          {/* REPORT */}
          <li className="nav-item dropdown-menu-wrapper">
            <span className="nav-link">
              <FaChartBar className="nav-icon" /> Reports ▼
            </span>
            <ReportsDropdown />
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;