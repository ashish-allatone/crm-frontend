
import React from "react";
import { Link } from "react-router-dom";

import {
  FaBuilding,
  FaUserShield,
  FaUsers,
  FaDollarSign,
  FaUserCog,
  FaHospital,
} from "react-icons/fa";

import { MdScience } from "react-icons/md";
import { hasPermission } from "../../pages/permissionUtil";

const MasterDropdown = () => {
  const menuItems = [
    {
      label: "Test Master",
      path: "/test-master",
      icon: MdScience,
      permission: "Test Master",
      color: "blue",
    },
    {
      label: "Organization",
      path: "/organization",
      icon: FaBuilding,
      permission: "Organization",
      color: "purple",
    },
    {
      label: "Insurance Company",
      path: "/insurance-company",
      icon: FaUserShield,
      permission: "Insurance",
      color: "orange",
    },
    {
      label: "Diagnostic Center",
      path: "/diagnostic-center",
      icon: FaHospital,
      permission: "Diagnostic Center",
      color: "green",
    },
    {
      label: "Currency",
      path: "/currency",
      icon: FaDollarSign,
      permission: "Currency",
      color: "teal",
    },
    {
      label: "Users",
      path: "/users",
      icon: FaUsers,
      permission: "Users",
      color: "blue",
    },
    {
      label: "Role & Permissions",
      path: "/roles-permissions",
      icon: FaUserCog,
      permission: "Roles",
      color: "pink",
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    hasPermission(item.permission, "VIEW")
  );

  return (
    <div className="master-dropdown">
      <div className="master-dropdown-heading">
        <div>
          <h6>Master Management</h6>
          <span>Manage your CRM settings</span>
        </div>
        <span className="master-dropdown-count">
          {visibleItems.length}
        </span>
      </div>

      <div className="master-dropdown-list">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              to={item.path}
              key={item.path}
              className="master-dropdown-item"
            >
              <span className={`master-item-icon ${item.color}`}>
                <Icon />
              </span>

              <span className="master-item-label">
                {item.label}
              </span>

              <span className="master-item-arrow">›</span>
            </Link>
          );
        })}

        {visibleItems.length === 0 && (
          <div className="master-dropdown-empty">
            No accessible options
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDropdown;


// import React from "react";
// import { Link } from "react-router-dom";
// import {
// FaUserCog,
// FaBuilding,
// FaUserShield,
// FaUsers,
// FaCog,
// FaDollarSign,
// FaUserTie,
// FaHospital
// } from "react-icons/fa";

// import { MdScience } from "react-icons/md";

// import { hasPermission } from "../../pages/permissionUtil";

// const MasterDropdown = () => {

// return (

// <div className="master-dropdown">

// {/* <Link to="/test-master" className="dropdown-item">
// <MdScience className="icon"/>
// Test Master
// </Link> */}
// {hasPermission("Test Master", "VIEW") && (
//   <Link to="/test-master" className="dropdown-item">
//     <MdScience className="icon"/>
//     Test Master
//   </Link>
// )}

// {/* <Link to="/organization" className="dropdown-item">
// <FaBuilding className="icon"/>
// Organization
// </Link> */}
// {hasPermission("Organization", "VIEW") && (
//   <Link to="/organization" className="dropdown-item">
//     <FaBuilding className="icon"/>
//     Organization
//   </Link>
// )}

// {/* <Link to="/insurance-company" className="dropdown-item">
// <FaUserShield className="icon"/>
// Insurance Company
// </Link> */}
// {hasPermission("Insurance", "VIEW") && (
//   <Link to="/insurance-company" className="dropdown-item">
//     <FaUserShield className="icon"/>
//     Insurance Company
//   </Link>
// )}

// {hasPermission("Diagnostic Center", "VIEW") && (
//   <Link to="/diagnostic-center" className="dropdown-item">
//      <FaHospital className="icon"/>
//     Diagnostic Center
//   </Link>
// )}

// {/* <Link to="/service-provider" className="dropdown-item">
// <FaUserTie className="icon"/>
// Service Provider
// </Link> */}
// {/* {hasPermission("Service Provider", "VIEW") && (
//   <Link to="/service-provider" className="dropdown-item">
//     <FaUserTie className="icon"/>
//     Service Provider
//   </Link>
// )} */}



// {/* <Link to="/currency" className="dropdown-item">
// <FaDollarSign className="icon"/>
// Currency
// </Link> */}
// {hasPermission("Currency", "VIEW") && (
//   <Link to="/currency" className="dropdown-item">
//     <FaDollarSign className="icon"/>
//     Currency
//   </Link>
// )}

// {/* <Link to="/configuration" className="dropdown-item">
// <FaCog className="icon"/>
// Configuration
// </Link> */}

// {/* <Link to="/users" className="dropdown-item">
// <FaUsers className="icon"/>
// Users
// </Link> */}
// {hasPermission("Users", "VIEW") && (
//   <Link to="/users" className="dropdown-item">
//     <FaUsers className="icon"/>
//     Users
//   </Link>
// )}

// {/* <Link to="/roles-permissions" className="dropdown-item">
// <FaUserCog className="icon"/>
// Role & Permissions
// </Link> */}
// {hasPermission("Roles", "VIEW") && (
//   <Link to="/roles-permissions" className="dropdown-item">
//     <FaUserCog className="icon"/>
//     Role & Permissions
//   </Link>
// )}

// </div>

// )

// }

// export default MasterDropdown