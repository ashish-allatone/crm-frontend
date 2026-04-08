import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

/* PAGES */
import Dashboard from "./pages/Dashboard";
import AllPatients from "./pages/patients/AllPatients";
import AddPatient from "./pages/patients/AddPatient";

/* MASTER */
import Organization from "./pages/master/organization/Organization";
import InsuranceCompany from "./pages/master/insurance/InsuranceCompany";
import ServiceProvider from "./pages/master/serviceProvider/ServiceProvider";
import Currency from "./pages/master/currency/Currency";
import Configuration from "./pages/master/configuration/Configuration";
import Users from "./pages/master/users/Users";
import RolesPermissions from "./pages/master/roles/RolesPermissions";
import TestMaster from "./pages/master/test/TestMaster";

/* APPOINTMENT */
import TodayAppointment from "./pages/appointment/TodayAppointment";
import UpcomingAppointment from "./pages/appointment/UpcomingAppointment";

/* REPORT */
import PatientsReport from "./pages/report/PatientsReport";
import CallingReport from "./pages/report/CallingReport";
import CollectionReport from "./pages/report/CollectionReport";
import PaymentReport from "./pages/report/PaymentReport";
import PatientDetails from "./pages/patients/PatientDetails";
import EditPatient from "./pages/patients/EditPatient";
import AddTest from "./pages/master/test/AddTest";
import EditTest from "./pages/master/test/EditTest";
import AddOrganization from "./pages/master/organization/AddOrganization";
import EditOrganization from "./pages/master/organization/EditOrganization";
import AddServiceProvider from "./pages/master/serviceProvider/AddServiceProvider";
import EditServiceProvider from "./pages/master/serviceProvider/EditServiceProvider";
import SetPermission from "./pages/master/roles/SetPermission";
import AddPackagePrice from "./pages/patients/AddPackagePrice";
import TestResult from "./pages/testResult/TestResult";
import TestReport from "./pages/testReport/TestReport";
import Invoice from "./pages/invoice/Invoice";
import TestReportUpload from "./pages/testReport/TestReportUpload";
import Profile from "./components/profileDropdown/Profile";
import CreateAppointment from "./pages/patients/CreateAppointment";
import EditAppointment from "./pages/appointment/EditAppointment";
import AddTestResult from "./pages/testResult/AddTestResult";
import AddInvoice from "./pages/invoice/AddInvoice";


function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {/* Navbar only after login */}
      {token && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><AllPatients /></ProtectedRoute>} />
        <Route path="/add-patient" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
        <Route path="/patient-details/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
        <Route path="/edit-patient/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
        <Route path="/create-appointment/:id" element={<ProtectedRoute><CreateAppointment/></ProtectedRoute>} />
        <Route 
  path="/edit-appointment/:id" 
  element={<ProtectedRoute><EditAppointment /></ProtectedRoute>} 
/>

        <Route path="/add-test" element={<ProtectedRoute><AddTest /></ProtectedRoute>} />
        <Route path="/edit-test/:id" element={<ProtectedRoute><EditTest /></ProtectedRoute>} />

        <Route path="/add-organization" element={<ProtectedRoute><AddOrganization /></ProtectedRoute>} />
        <Route path="/edit-organization/:id" element={<ProtectedRoute><EditOrganization /></ProtectedRoute>} />

        <Route path="/add-service-provider" element={<ProtectedRoute><AddServiceProvider /></ProtectedRoute>} />
        <Route path="/edit-service-provider/:id" element={<ProtectedRoute><EditServiceProvider /></ProtectedRoute>} />

        <Route path="/set-permission/:roleId" element={<ProtectedRoute><SetPermission /></ProtectedRoute>} />
        <Route path="/add-package-price/:id" element={<ProtectedRoute><AddPackagePrice /></ProtectedRoute>} />

        {/* MASTER */}
        <Route path="/test-master" element={<ProtectedRoute><TestMaster /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><Organization /></ProtectedRoute>} />
        <Route path="/insurance-company" element={<ProtectedRoute><InsuranceCompany /></ProtectedRoute>} />
        <Route path="/service-provider" element={<ProtectedRoute><ServiceProvider /></ProtectedRoute>} />
        <Route path="/currency" element={<ProtectedRoute><Currency /></ProtectedRoute>} />
        <Route path="/configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/roles-permissions" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />

        {/* APPOINTMENT */}
        <Route path="/appointment/today" element={<ProtectedRoute><TodayAppointment /></ProtectedRoute>} />
        <Route path="/appointment/upcoming" element={<ProtectedRoute><UpcomingAppointment /></ProtectedRoute>} />

        {/* REPORT */}
        <Route path="/report/patients" element={<ProtectedRoute><PatientsReport /></ProtectedRoute>} />
        <Route path="/report/calling" element={<ProtectedRoute><CallingReport /></ProtectedRoute>} />
        <Route path="/report/collection" element={<ProtectedRoute><CollectionReport /></ProtectedRoute>} />
        <Route path="/report/payment" element={<ProtectedRoute><PaymentReport /></ProtectedRoute>} />

        <Route path="/test-result" element={<ProtectedRoute><TestResult /></ProtectedRoute>} />
        <Route path="/add-test-result/:id" element={<ProtectedRoute><AddTestResult/></ProtectedRoute>} />
        <Route path="/test-report" element={<ProtectedRoute><TestReport /></ProtectedRoute>} />
        <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        <Route path="/test-report-upload/:id" element={<ProtectedRoute><TestReportUpload /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-invoice/:id" element={<ProtectedRoute><AddInvoice /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;