// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import ReportBug from './Components/ReportBug';
import ViewBugs from "./Components/ViewBugs";
import UpdateBug from "./Components/UpdateBug";
import ViewComments from "./Components/ViewComments";
import Profile from './Components/Profile';
import AdminUsers from './Components/AdminUsers';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report-bug" element={<ReportBug />} />
                <Route path="/view-comments" element={<ViewComments/>} />
                <Route path="/view-bugs" element={<ViewBugs />} />
                <Route path="/bug/update/:bugId" element={<UpdateBug />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin-users" element={<AdminUsers />} />


            </Routes>
        </Router>
    );
}

export default App;
