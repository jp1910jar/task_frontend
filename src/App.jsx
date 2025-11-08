// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔐 Auth pages
import Signup from "./Signup";
import Login from "./Login";

// 🧩 Admin pages (used for everyone now)
import Dashboard from "./Dashboard";
import ProjectTask from "./ProjectTask";
import MyTask from "./MyTask";
import Setting from "./Setting";
import Member from "./Member";
import Achieved from "./Achieved";
import Workgroup from "./Workgroup";
import Workspace from "./Workspace";

// 🧱 Layout
import Layout from "./Layout"; // ✅ Single layout used for all

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🧩 All routes use Layout now */}
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
              <Workgroup />
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

        {/* 👤 Former user routes — still here but using same layout */}
        <Route
          path="/user/userdashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/user/mytask"
          element={
            <Layout>
              <MyTask />
            </Layout>
          }
        />
        <Route
          path="/user/projecttask/:workspaceId"
          element={
            <Layout>
              <ProjectTask />
            </Layout>
          }
        />
        <Route
          path="/user/workgroup"
          element={
            <Layout>
              <Workgroup />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
