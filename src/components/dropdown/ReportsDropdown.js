import React from "react";
import { Link } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";

const ReportsDropdown = () => {
  return (
    <div className="master-dropdown">

      <Link to="/report/patients" className="dropdown-item">
        <FaChartBar className="icon" /> Patients
      </Link>

      <Link to="/report/calling" className="dropdown-item">
        <FaChartBar className="icon" /> Calling
      </Link>

      <Link to="/report/collection" className="dropdown-item">
        <FaChartBar className="icon" /> Collection
      </Link>

      <Link to="/report/payment" className="dropdown-item">
        <FaChartBar className="icon" /> Payment
      </Link>

    </div>
  );
};

export default ReportsDropdown;