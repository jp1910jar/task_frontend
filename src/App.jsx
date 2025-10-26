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
import Workgroup from "./Workgroup"; // ✅ Workspace renamed as Workgroup

// 🧱 Layouts
import Layout from "./Layout";          // Admin layout
import Userlayout from "./Userlayout";  // User layout

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public pages */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🧩 Admin panel routes */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* ✅ Workgroup route for Admin */}
        <Route
          path="/workgroup"
          element={
            <Layout>
              <Workgroup />
            </Layout>
          }
        />

        {/* ✅ Project Task route */}
        <Route
          path="/projecttask/:workspaceId"
          element={
            <Layout>
              <ProjectTask />
            </Layout>
          }
        />

        {/* 📋 Other admin routes */}
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

        {/* 👤 User panel routes */}
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

        {/* ✅ Workgroup route for User */}
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
