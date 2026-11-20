
import React from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
} from "react-icons/fa";
import { hasPermission } from "../../pages/permissionUtil";

const ReportsDropdown = () => {
  const menuItems = [
    {
      label: "Patients Report",
      path: "/report/patients",
      icon: FaUsers,
      color: "blue",
    },
  ];

  const visibleItems = menuItems.filter(() =>
    hasPermission("Patients", "VIEW")
  );

  return (
    <div className="master-dropdown">
      <div className="master-dropdown-heading">
        <div>
          <h6>Reports & Analytics</h6>
          <span>View CRM reports</span>
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
            No accessible reports
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDropdown;


// import React from "react";
// import { Link } from "react-router-dom";
// import { FaChartBar } from "react-icons/fa";
// import { hasPermission } from "../../pages/permissionUtil";
// const ReportsDropdown = () => {
//   return (
//     <div className="master-dropdown">
//       {hasPermission("Patients", "VIEW") && (
//       <Link to="/report/patients" className="dropdown-item">
//         <FaChartBar className="icon" /> Patients
//       </Link>
//       )}

//       {/* <Link to="/report/calling" className="dropdown-item">
//         <FaChartBar className="icon" /> Calling
//       </Link>

//       <Link to="/report/collection" className="dropdown-item">
//         <FaChartBar className="icon" /> Collection
//       </Link>

//       <Link to="/report/payment" className="dropdown-item">
//         <FaChartBar className="icon" /> Payment
//       </Link> */}

//     </div>
//   );
// };

// export default ReportsDropdown;