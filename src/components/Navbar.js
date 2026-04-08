import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaUserCircle } from "react-icons/fa";

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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setUser(res.data.data);
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark crm-navbar">
      <div className="container-fluid">

        {/* LOGO */}
        <div className="navbar-brand">
          CRM
        </div>

        {/* LEFT MENU */}
        <ul className="navbar-nav">

          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FaHome className="nav-icon" /> Dashboard
            </Link>
          </li>

          <li className="nav-item dropdown-menu-wrapper">
            <span className="nav-link">
              <FaUsers className="nav-icon" /> Master ▼
            </span>
            <MasterDropdown />
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/patients">
              <FaUserInjured className="nav-icon" /> All Patients
            </Link>
          </li>

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

          {/* <li className="nav-item dropdown-menu-wrapper">
            <span className="nav-link">
              <FaChartBar className="nav-icon" /> Reports ▼
            </span>
            <ReportsDropdown />
          </li> */}

        </ul>

        {/* RIGHT PROFILE */}
        <div className="ms-auto profile-container">

          <div className="profile-box">
            <img
              src={
                user?.profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="profile-icon"
              alt="profile"
            />

            <div className="profile-text">
              <span className="username">
                {user?.firstName} {user?.lastName}
              </span>

              <span className="role">
                {user?.roles?.[0]?.name}
              </span>
            </div>
          </div>

          {/* HOVER DROPDOWN */}
          {user && <ProfileDropdown user={user} />}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;