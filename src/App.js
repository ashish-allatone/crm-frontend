import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppContent from "./AppContent";


export default function App() {

    return (

        <Router basename="/crm">

            <AppContent/>

        </Router>

    );

}