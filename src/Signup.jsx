import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Signup.css";
import logo from "./assets/avertechlogo.png";
import { signupUser } from "./api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
      await signupUser(formData);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <motion.div className="bg-shape shape1" animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} />
      <motion.div className="bg-shape shape2" animate={{ x: [0, -50, 50, 0], y: [0, 30, -30, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} />

      <motion.form className="signup-form" onSubmit={handleSubmit}>
        <motion.div className="logo-container">
          <img src={logo} alt="Logo" className="logo-simple" />
        </motion.div>

        <h2>Create Account</h2>

        <motion.input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <motion.input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <motion.input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <motion.select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </motion.select>

        <motion.button type="submit">Sign Up</motion.button>
        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
      </motion.form>
    </div>
  );
}

export default Signup;
