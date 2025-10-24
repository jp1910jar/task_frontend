import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Signup.css";
import logo from "./assets/avertechlogo.png";
import { loginUser } from "./api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const { token, role } = response.data;

      // ✅ Check if token is received
      if (!token) {
        alert("Login failed: No token received from server");
        return;
      }

      // Save token and role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/userdashboard");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signup-container">
      <motion.div
        className="bg-shape shape1"
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-shape shape2"
        animate={{ x: [0, -50, 50, 0], y: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />

      <motion.form className="signup-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-simple" />
        </div>

        <h2>Login</h2>

        <motion.input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <motion.input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <motion.select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </motion.select>

        <motion.button type="submit">Login</motion.button>

        <p className="login-link">
          Don’t have an account? <Link to="/">Sign Up</Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
