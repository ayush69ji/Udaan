import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data && res.data.token) {
        const token = res.data.token;
        localStorage.setItem("token", token);

        // ✅ Trigger storage event so AuthContext picks up the new token
        window.dispatchEvent(new Event("storage"));

        // Decode the token to get user info
        const decoded = jwtDecode(token);
        const role = decoded.role;

        // Redirect based on role
        if (role === "student") {
          navigate("/student-dashboard");
        } else if (role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          alert("Invalid role.");
        }
      } else {
        alert("Login failed: No token received");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
