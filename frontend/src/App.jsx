import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

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
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route
          path="/student/dashboard"
          element={user ? <StudentDashboard /> : <Navigate to="/student/login" replace />}
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
        />

        {/* Recruiter */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route
          path="/recruiter/dashboard"
          element={user ? <RecruiterDashboard /> : <Navigate to="/recruiter/login" replace />}
        />

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
