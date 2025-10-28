// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔐 Auth pages
import Signup from "./Signup";
import Login from "./Login";

// 🧩 Admin pages
import Dashboard from "./Dashboard";
import ProjectTask from "./ProjectTask";
import MyTask from "./MyTask";
import Setting from "./Setting";
import Member from "./Member";
import Achieved from "./Achieved";
import Workgroup from "./Workgroup"; // ✅ Workgroup page
import Workspace from "./Workspace"; // ✅ Newly added import

// 🧱 Layouts
import Layout from "./Layout";          // Admin layout
import Userlayout from "./Userlayout";  // User layout


function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🧩 Admin Panel Routes */}
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
        {/* ✅ New Route for Workgroup → Workspaces */}
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

        {/* 👤 User Panel Routes */}
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
          path="/user/projecttask/:workspaceId"
          element={
            <Userlayout>
              <ProjectTask />
            </Userlayout>
          }
        />
        <Route
          path="/user/workgroup"
          element={
            <Userlayout>
              <Workgroup />
            </Userlayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
