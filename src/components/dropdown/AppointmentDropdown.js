
import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaCalendarDay,
  FaCalendarAlt,
} from "react-icons/fa";
import { hasPermission } from "../../pages/permissionUtil";

const AppointmentDropdown = () => {
  const menuItems = [
    {
      label: "All Appointments",
      path: "/appointment/all",
      icon: FaCalendarCheck,
      color: "blue",
    },
    {
      label: "Today",
      path: "/appointment/today",
      icon: FaCalendarDay,
      color: "green",
    },
    {
      label: "Upcoming",
      path: "/appointment/upcoming",
      icon: FaCalendarAlt,
      color: "purple",
    },
  ];

  const visibleItems = menuItems.filter(() =>
    hasPermission("Appointment", "VIEW")
  );

  return (
    <div className="master-dropdown">
      <div className="master-dropdown-heading">
        <div>
          <h6>Appointment Management</h6>
          <span>Manage patient appointments</span>
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

export default AppointmentDropdown;


// import React from "react";
// import { Link } from "react-router-dom";
// import { FaCalendarCheck } from "react-icons/fa";
// import { hasPermission } from "../../pages/permissionUtil";

// const AppointmentDropdown = () => {
//   return (
//     <div className="master-dropdown">

//       {/* <Link to="/appointment/today" className="dropdown-item">
//         <FaCalendarCheck className="icon" /> Today
//       </Link> */}

//        {hasPermission("Appointment", "VIEW") && (
//         <Link to="/appointment/all" className="dropdown-item">
//           <FaCalendarCheck className="icon" /> All Appointments
//         </Link>
//       )}

//       {hasPermission("Appointment", "VIEW") && (
//   <Link to="/appointment/today" className="dropdown-item">
//     <FaCalendarCheck className="icon" /> Today
//   </Link>
// )}

//       {/* <Link to="/appointment/upcoming" className="dropdown-item">
//         <FaCalendarCheck className="icon" /> Upcoming
//       </Link> */}
//       {hasPermission("Appointment", "VIEW") && (
//   <Link to="/appointment/upcoming" className="dropdown-item">
//     <FaCalendarCheck className="icon" /> Upcoming
//   </Link>
// )}

//     </div>
//   );
// };

// export default AppointmentDropdown;