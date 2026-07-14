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
import DiagnosticCenter from "./pages/master/diagnosticCenter/DiagnosticCenter";
import AllAppointment from "./pages/appointment/AllAppointment";
import AddDiagnosticCenter from "./pages/master/diagnosticCenter/AddDiagnosticCenter";
import EditDiagnosticCenter from "./pages/master/diagnosticCenter/EditDiagnosticCenter";

import IdleTimeout from "./components/IdleTimeout";

import AppContent from "./AppContent";


export default function App() {

    return (

        <Router basename="/crm">

            <AppContent/>

        </Router>

    );

}