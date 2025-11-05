import { useState } from 'react';
import { useAuth } from "../../context/AuthContext.jsx";


const RecruiterRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    login({ name, role: "recruiter", email });
    navigate("/recruiter/dashboard");
  };

  return (
    <form onSubmit={handleRegister} style={{ margin: "2rem" }}>
      <h2>Student Register</h2>
      <input type="text" placeholder="Name" value={name} required onChange={e => setName(e.target.value)} />
      <br />
      <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default RecruiterRegister;
