
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { hasPermission } from "../pages/permissionUtil";

import {
  FaHome,
  FaUsers,
  FaUserInjured,
  FaCalendarCheck,
  FaFlask,
  FaFileMedical,
  FaFileInvoice,
  FaChartBar,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

import "../styles/navbar.css";
import MasterDropdown from "./dropdown/MasterDropdown";
import AppointmentDropdown from "./dropdown/AppointmentDropdown";
import ReportsDropdown from "./dropdown/ReportsDropdown";
import ProfileDropdown from "./profileDropdown/ProfileDropdown";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Permissions — existing rules preserved
  const canViewDashboard = hasPermission("Dashboard", "VIEW");
  const canViewPatients = hasPermission("Patients", "VIEW");
  const canViewAppointment = hasPermission("Appointment", "VIEW");
  const canViewTestResult = hasPermission("Test Result", "VIEW");
  const canViewTestReport = hasPermission("Test Report", "VIEW");
  const canViewInvoice = hasPermission("Invoice", "VIEW");

  const canViewMaster =
    hasPermission("Organization", "VIEW") ||
    hasPermission("Users", "VIEW") ||
    hasPermission("Roles", "VIEW") ||
    hasPermission("Service Provider", "VIEW") ||
    hasPermission("Insurance", "VIEW") ||
    hasPermission("Currency", "VIEW");

  const canViewReports = hasPermission("Patients", "VIEW");

  // Fetch logged-in user — existing API preserved
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (active) setUser(res.data.data);
      })
      .catch((error) => {
        console.error("Unable to fetch navbar user:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  // Close mobile menu after navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path + "/"));

  const navLinkClass = (path) =>
    `crm-nav-link ${isActive(path) ? "active" : ""}`;

  return (
    <nav className="crm-navbar">
      <div className="crm-navbar-inner">

        {/* BRAND */}
        <Link to="/" className="crm-brand">
          <span className="crm-brand-icon">H</span>
          <span className="crm-brand-text">
            <strong>Heal N Care</strong>
            <small>Healthcare CRM</small>
          </span>
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="crm-mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* NAVIGATION */}
        <div className={`crm-nav-content ${mobileOpen ? "show" : ""}`}>

          <ul className="crm-nav-menu">

            {canViewDashboard && (
              <li className="crm-nav-item">
                <Link to="/" className={navLinkClass("/")}>
                  <FaHome />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}

            {canViewMaster && (
              <li className="crm-nav-item crm-dropdown-wrapper">
                <button
                  type="button"
                  className={`crm-nav-link crm-dropdown-trigger ${
                    location.pathname.includes("/master") ? "active" : ""
                  }`}
                  aria-haspopup="true"
                >
                  <FaUsers />
                  <span>Master</span>
                  <FaChevronDown className="crm-chevron" />
                </button>
                <div className="crm-dropdown-panel">
                  <MasterDropdown />
                </div>
              </li>
            )}

            {canViewPatients && (
              <li className="crm-nav-item">
                <Link to="/patients" className={navLinkClass("/patients")}>
                  <FaUserInjured />
                  <span>All Patients</span>
                </Link>
              </li>
            )}

            {canViewAppointment && (
              <li className="crm-nav-item crm-dropdown-wrapper">
                <button
                  type="button"
                  className="crm-nav-link crm-dropdown-trigger"
                  aria-haspopup="true"
                >
                  <FaCalendarCheck />
                  <span>Appointment</span>
                  <FaChevronDown className="crm-chevron" />
                </button>
                <div className="crm-dropdown-panel">
                  <AppointmentDropdown />
                </div>
              </li>
            )}

            {canViewTestResult && (
              <li className="crm-nav-item">
                <Link to="/test-result" className={navLinkClass("/test-result")}>
                  <FaFlask />
                  <span>Test Result</span>
                </Link>
              </li>
            )}

            {canViewTestReport && (
              <li className="crm-nav-item">
                <Link to="/test-report" className={navLinkClass("/test-report")}>
                  <FaFileMedical />
                  <span>Test Report</span>
                </Link>
              </li>
            )}

            {canViewInvoice && (
              <li className="crm-nav-item">
                <Link to="/invoice" className={navLinkClass("/invoice")}>
                  <FaFileInvoice />
                  <span>Invoice</span>
                </Link>
              </li>
            )}

            {canViewReports && (
              <li className="crm-nav-item crm-dropdown-wrapper">
                <button
                  type="button"
                  className="crm-nav-link crm-dropdown-trigger"
                  aria-haspopup="true"
                >
                  <FaChartBar />
                  <span>Reports</span>
                  <FaChevronDown className="crm-chevron" />
                </button>
                <div className="crm-dropdown-panel">
                  <ReportsDropdown />
                </div>
              </li>
            )}
          </ul>

          {/* PROFILE */}
          <div className="crm-profile-container">
            <div className="crm-profile-box" tabIndex={0}>
              <img
                src={
                  user?.profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="crm-profile-image"
                alt="User profile"
              />

              <div className="crm-profile-details">
                <span className="crm-profile-name">
                  {user
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "Loading..."}
                </span>
                <span className="crm-profile-role">
                  {user?.roles?.[0]?.name || "User"}
                </span>
              </div>

              <FaChevronDown className="crm-profile-chevron" />
            </div>

            {user && <ProfileDropdown user={user} />}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import { FaUserCircle } from "react-icons/fa";
// import { hasPermission } from "../pages/permissionUtil";

// import {
//   FaHome,
//   FaUsers,
//   FaUserInjured,
//   FaCalendarCheck,
//   FaFlask,
//   FaFileMedical,
//   FaFileInvoice,
//   FaChartBar,
// } from "react-icons/fa";

// import "../styles/navbar.css";
// import MasterDropdown from "./dropdown/MasterDropdown";
// import AppointmentDropdown from "./dropdown/AppointmentDropdown";
// import ReportsDropdown from "./dropdown/ReportsDropdown";
// import ProfileDropdown from "./profileDropdown/ProfileDropdown";

// const Navbar = () => {
//   const canViewDashboard = hasPermission("Dashboard", "VIEW");
//   const canViewPatients = hasPermission("Patients", "VIEW");
//   const canViewAppointment = hasPermission("Appointment", "VIEW");
//   const canViewTestResult = hasPermission("Test Result", "VIEW");
//   const canViewTestReport = hasPermission("Test Report", "VIEW");
//   const canViewInvoice = hasPermission("Invoice", "VIEW");
//   const canViewMaster =
//     hasPermission("Organization", "VIEW") ||
//     hasPermission("Users", "VIEW") ||
//     hasPermission("Roles", "VIEW") ||
//     hasPermission("Service Provider", "VIEW") ||
//     hasPermission("Insurance", "VIEW") ||
//     hasPermission("Currency", "VIEW");

//   const canViewReports = hasPermission("Patients", "VIEW");

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     api
//       .get("/users/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setUser(res.data.data);
//       });
//   }, []);

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark crm-navbar">
//       <div className="container-fluid">
//         {/* LOGO */}
//         <div className="navbar-brand">CRM</div>

//         {/* LEFT MENU */}
//         <ul className="navbar-nav">
//           {/* <li className="nav-item">
//             <Link className="nav-link" to="/">
//               <FaHome className="nav-icon" /> Dashboard
//             </Link>
//           </li> */}
//           {canViewDashboard && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/">
//                 <FaHome className="nav-icon" /> Dashboard
//               </Link>
//             </li>
//           )}

//           {/* <li className="nav-item dropdown-menu-wrapper">
//             <span className="nav-link">
//               <FaUsers className="nav-icon" /> Master ▼
//             </span>
//             <MasterDropdown />
//           </li> */}
//           {canViewMaster && (
//             <li className="nav-item dropdown-menu-wrapper">
//               <span className="nav-link">
//                 <FaUsers className="nav-icon" /> Master ▼
//               </span>
//               <MasterDropdown />
//             </li>
//           )}

//           {/* <li className="nav-item">
//             <Link className="nav-link" to="/patients">
//               <FaUserInjured className="nav-icon" /> All Patients
//             </Link>
//           </li> */}
//           {canViewPatients && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/patients">
//                 <FaUserInjured className="nav-icon" /> All Patients
//               </Link>
//             </li>
//           )}

//           {/* <li className="nav-item dropdown-menu-wrapper">
//             <span className="nav-link">
//               <FaCalendarCheck className="nav-icon" /> Appointment ▼
//             </span>
//             <AppointmentDropdown />
//           </li> */}
//           {canViewAppointment && (
//             <li className="nav-item dropdown-menu-wrapper">
//               <span className="nav-link">
//                 <FaCalendarCheck className="nav-icon" /> Appointment ▼
//               </span>
//               <AppointmentDropdown />
//             </li>
//           )}

//           {/* <li className="nav-item">
//             <Link className="nav-link" to="/test-result">
//               <FaFlask className="nav-icon" /> Test Result
//             </Link>
//           </li> */}
//           {canViewTestResult && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/test-result">
//                 <FaFlask className="nav-icon" /> Test Result
//               </Link>
//             </li>
//           )}

//           {/* <li className="nav-item">
//             <Link className="nav-link" to="/test-report">
//               <FaFileMedical className="nav-icon" /> Test Report
//             </Link>
//           </li> */}
//           {canViewTestReport && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/test-report">
//                 <FaFileMedical className="nav-icon" /> Test Report
//               </Link>
//             </li>
//           )}

//           {/* <li className="nav-item">
//             <Link className="nav-link" to="/invoice">
//               <FaFileInvoice className="nav-icon" /> Invoice
//             </Link>
//           </li> */}
//           {canViewInvoice && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/invoice">
//                 <FaFileInvoice className="nav-icon" /> Invoice
//               </Link>
//             </li>
//           )}
//           {canViewReports && (
//             <li className="nav-item dropdown-menu-wrapper">
//               <span className="nav-link">
//                 <FaChartBar className="nav-icon" /> Reports ▼
//               </span>
//               <ReportsDropdown />
//             </li>
//           )}
//         </ul>

//         {/* RIGHT PROFILE */}
//         <div className="ms-auto profile-container">
//           <div className="profile-box">
//             <img
//               src={
//                 user?.profilePhoto ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//               }
//               className="profile-icon"
//               alt="profile"
//             />

//             <div className="profile-text">
//               <span className="username">
//                 {user?.firstName} {user?.lastName}
//               </span>

//               <span className="role">{user?.roles?.[0]?.name}</span>
//             </div>
//           </div>

//           {/* HOVER DROPDOWN */}
//           {user && <ProfileDropdown user={user} />}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
