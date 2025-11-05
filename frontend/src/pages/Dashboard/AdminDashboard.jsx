import { useAuth } from "../../context/AuthContext.jsx";


const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default AdminDashboard;
