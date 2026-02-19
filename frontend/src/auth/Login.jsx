import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8003/login/",
        {
          username,
          password
        }
      );

      login(response.data); 
      const role = response.data.role; 

      if (role === "manager" || role==="Manager") {
        navigate("/dashboard");
      } else if (role === "employee" || role==="Employee") {
        navigate("/components");  
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Aircraft Maintenance System</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;



/*import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from '../services/api';

function Login() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login/", null, {
        params: {
          username,
          role,
        },
      });

      console.log("LOGIN RESPONSE:", response.data);

      //localStorage.setItem("token", response.data.access_token);
      //localStorage.setItem("role", response.data.role);

      //navigate("/dashboard");
      //login(response.data.access_token, response.data.role);
      //navigate("/dashboard");

      login(response.data.access_token, response.data.role, username);

      if (response.data.role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/components");
      }

    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Aircraft Maintenance System</h2>
        <p className="subtitle">Login to continue</p>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;*/
