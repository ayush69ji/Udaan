import { useAuth } from "../../context/AuthContext.jsx";


const RecruiterDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== "recruiter") {
    return <Navigate to="/recruiter/login" />;
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default RecruiterDashboard;
