import React from "react";
import { Link } from "react-router-dom";
import {
FaUserCog,
FaBuilding,
FaUserShield,
FaUsers,
FaCog,
FaDollarSign,
FaUserTie,
FaHospital
} from "react-icons/fa";

import { MdScience } from "react-icons/md";

import { hasPermission } from "../../pages/permissionUtil";

const MasterDropdown = () => {

return (

<div className="master-dropdown">

{/* <Link to="/test-master" className="dropdown-item">
<MdScience className="icon"/>
Test Master
</Link> */}
{hasPermission("Test Master", "VIEW") && (
  <Link to="/test-master" className="dropdown-item">
    <MdScience className="icon"/>
    Test Master
  </Link>
)}

{/* <Link to="/organization" className="dropdown-item">
<FaBuilding className="icon"/>
Organization
</Link> */}
{hasPermission("Organization", "VIEW") && (
  <Link to="/organization" className="dropdown-item">
    <FaBuilding className="icon"/>
    Organization
  </Link>
)}

{/* <Link to="/insurance-company" className="dropdown-item">
<FaUserShield className="icon"/>
Insurance Company
</Link> */}
{hasPermission("Insurance", "VIEW") && (
  <Link to="/insurance-company" className="dropdown-item">
    <FaUserShield className="icon"/>
    Insurance Company
  </Link>
)}

{hasPermission("Diagnostic Center", "VIEW") && (
  <Link to="/diagnostic-center" className="dropdown-item">
     <FaHospital className="icon"/>
    Diagnostic Center
  </Link>
)}

{/* <Link to="/service-provider" className="dropdown-item">
<FaUserTie className="icon"/>
Service Provider
</Link> */}
{/* {hasPermission("Service Provider", "VIEW") && (
  <Link to="/service-provider" className="dropdown-item">
    <FaUserTie className="icon"/>
    Service Provider
  </Link>
)} */}



{/* <Link to="/currency" className="dropdown-item">
<FaDollarSign className="icon"/>
Currency
</Link> */}
{hasPermission("Currency", "VIEW") && (
  <Link to="/currency" className="dropdown-item">
    <FaDollarSign className="icon"/>
    Currency
  </Link>
)}

{/* <Link to="/configuration" className="dropdown-item">
<FaCog className="icon"/>
Configuration
</Link> */}

{/* <Link to="/users" className="dropdown-item">
<FaUsers className="icon"/>
Users
</Link> */}
{hasPermission("Users", "VIEW") && (
  <Link to="/users" className="dropdown-item">
    <FaUsers className="icon"/>
    Users
  </Link>
)}

{/* <Link to="/roles-permissions" className="dropdown-item">
<FaUserCog className="icon"/>
Role & Permissions
</Link> */}
{hasPermission("Roles", "VIEW") && (
  <Link to="/roles-permissions" className="dropdown-item">
    <FaUserCog className="icon"/>
    Role & Permissions
  </Link>
)}

</div>

)

}

export default MasterDropdown