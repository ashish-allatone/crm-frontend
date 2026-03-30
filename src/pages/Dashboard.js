import React from "react";
import "../styles/dashboard.css";

import {
FaUserInjured,
FaFlask,
FaFileAlt,
FaClock
} from "react-icons/fa";

const Dashboard = () => {

return (

<div className="container-fluid mt-4">

{/* FIRST ROW */}

<div className="row g-4">

<div className="col-md-6">

<div className="dashboard-card teal">

<div>

<h6>Total Patient Registered</h6>
<h3>48</h3>

</div>

<FaUserInjured className="card-icon"/>

</div>

</div>


<div className="col-md-6">

<div className="dashboard-card red">

<div>

<h6>Total Samples Collected</h6>
<h3>15</h3>

</div>

<FaFlask className="card-icon"/>

</div>

</div>

</div>


{/* SECOND ROW */}

<div className="row g-4 mt-1">

<div className="col-md-6">

<div className="dashboard-card green">

<div>

<h6>Total Reports Done</h6>
<h3>42</h3>

</div>

<FaFileAlt className="card-icon"/>

</div>

</div>


<div className="col-md-6">

<div className="dashboard-card orange">

<div>

<h6>Average Turn Around Time</h6>
<h4>Days, Hours, Minutes</h4>

</div>

<FaClock className="card-icon"/>

</div>

</div>

</div>


{/* THIRD ROW */}

<div className="row g-4 mt-1">

<div className="col-md-4">

<div className="dashboard-card cyan">

<div>

<h6>Today Turn Around Time</h6>
<h5>Hours, Minutes</h5>

</div>

<FaClock className="card-icon"/>

</div>

</div>


<div className="col-md-4">

<div className="dashboard-card purple">

<div>

<h6>This Week Turn Around Time</h6>
<h5>Days, Hours, Minutes</h5>

</div>

<FaClock className="card-icon"/>

</div>

</div>


<div className="col-md-4">

<div className="dashboard-card green2">

<div>

<h6>This Month Turn Around Time</h6>
<h5>Days, Hours, Minutes</h5>

</div>

<FaClock className="card-icon"/>

</div>

</div>

</div>

</div>

);

};

export default Dashboard;