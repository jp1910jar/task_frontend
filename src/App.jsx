import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth pages
import Signup from "./Signup";
import Login from "./Login";

// Admin pages
import Dashboard from "./Dashboard";
import ProjectTask from "./ProjectTask";
import MyTask from "./MyTask";
import Setting from "./Setting";
import Member from "./Member";
import Achieved from "./Achieved";
import Workgroup from "./Workgroup";
import Workspace from "./Workspace";

// Layouts
import Layout from "./Layout";        // ADMIN layout
import Userlayout from "./Userlayout"; // USER layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ============================
             👤 USER ROUTES – MUST COME FIRST
         ============================ */}
        <Route
          path="/user/userdashboard"
          element={
            <Userlayout>
              <Dashboard />
            </Userlayout>
          }
        />
        <Route
          path="/user/mytask"
          element={
            <Userlayout>
              <MyTask />
            </Userlayout>
          }
        />
        <Route
          path="/user/workgroup"
          element={
            <Userlayout>
              <Workgroup isUser={true} />
            </Userlayout>
          }
        />
        <Route
          path="/user/workgroup/:id/workspaces"
          element={
            <Userlayout>
              <Workspace />
            </Userlayout>
          }
        />
        <Route
          path="/user/projecttask/:workspaceId"
          element={
            <Userlayout>
              <ProjectTask />
            </Userlayout>
          }
        />

        {/* ============================
             📌 ADMIN ROUTES
         ============================ */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/workgroup"
          element={
            <Layout>
              <Workgroup isUser={false} />
            </Layout>
          }
        />
        <Route
          path="/workgroup/:id/workspaces"
          element={
            <Layout>
              <Workspace />
            </Layout>
          }
        />
        <Route
          path="/projecttask/:workspaceId"
          element={
            <Layout>
              <ProjectTask />
            </Layout>
          }
        />
        <Route
          path="/mytask"
          element={
            <Layout>
              <MyTask />
            </Layout>
          }
        />
        <Route
          path="/setting"
          element={
            <Layout>
              <Setting />
            </Layout>
          }
        />
        <Route
          path="/member"
          element={
            <Layout>
              <Member />
            </Layout>
          }
        />
        <Route
          path="/achieved"
          element={
            <Layout>
              <Achieved />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
