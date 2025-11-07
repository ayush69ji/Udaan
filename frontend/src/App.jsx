import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Home
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

// Student
import StudentLogin from "./pages/Login/StudentLogin.jsx";
import StudentRegister from "./pages/Register/StudentRegister.jsx";
import StudentDashboard from "./pages/Dashboard/StudentDashboard.jsx";

// Admin
import AdminLogin from "./pages/Login/AdminLogin.jsx";
import AdminRegister from "./pages/Register/AdminRegister.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";

// Recruiter
import RecruiterLogin from "./pages/Login/RecruiterLogin.jsx";
import RecruiterRegister from "./pages/Register/RecruiterRegister.jsx";
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Recruiter */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
