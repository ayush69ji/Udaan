import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";


export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login/student" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
}
