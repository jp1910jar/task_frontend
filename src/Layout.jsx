import React, { useState } from "react";
import SidebarComponent from "./SidebarComponent";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
   <div style={{ display: "flex", minHeight: "100vh" }}>
  <SidebarComponent
    isCollapsed={isCollapsed}
    setIsCollapsed={setIsCollapsed}
  />
  <div
    style={{
      flexGrow: 1,
      padding: "20px",
      overflowY: "auto",   // ✅ page content scrolls here
      height: "100vh",     // ✅ match viewport height
    }}
  >
    {children}
  </div>
</div>

  );
};

export default Layout;
