// src/Usersidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/avertechlogo.png";
import {
  ChevronsLeft,
  ChevronsRight,
  Layout as LayoutIcon,
  List,
  Grid,
  LogOut,
} from "react-feather";
import { motion } from "framer-motion";

const Usersidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const navItems = [
    { title: "Dashboard", href: "/user/userdashboard", icon: <LayoutIcon /> },
    { title: "My Tasks", href: "/user/mytask", icon: <List /> },
    { title: "Workgroup", href: "/user/userworksp", icon: <Grid /> }, // ✅ added
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      style={{
        width: isCollapsed ? "80px" : "250px",
        minWidth: isCollapsed ? "80px" : "250px",
        height: "100vh",
        backgroundColor: "#16202dff",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowY: "auto",
      }}
      initial={{ width: isCollapsed ? "80px" : "250px" }}
      animate={{ width: isCollapsed ? "80px" : "250px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: "10px 16px",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "white",
          }}
        >
          <motion.img
            src={logo}
            alt="Logo"
            style={{
              width: isCollapsed ? "40px" : "50px",
              transition: "width 0.3s",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          {!isCollapsed && <span style={{ fontWeight: "bold" }}>TaskHub</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </button>
      </div>

      {/* Navigation */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            {item.icon}
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <LogOut />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Usersidebar;
