// src/Userlayout.js
import React, { useState } from "react";
import Usersidebar from "./Usersidebar";

const Userlayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Usersidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Page content */}
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Userlayout;
