import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "./api"; // ✅ you already have this
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };
    fetchData();
  }, []);

  if (!stats) return <div className="loader">Loading Dashboard...</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">
      <h2 className="title">📊 Project Management Dashboard</h2>

      {/* Summary Cards */}
      <div className="card-grid">
        {[
          { label: "Members", value: stats.members },
          { label: "Tasks", value: stats.tasks },
          { label: "Workgroups", value: stats.workgroups },
          { label: "Project Tasks", value: stats.projectTasks },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" }}
          >
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="chart-section">
        <div className="chart-card">
          <h3>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.taskStatus}
                dataKey="count"
                nameKey="_id"
                label
                outerRadius={100}
              >
                {stats.taskStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Task Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.projectTaskStatus}
                dataKey="count"
                nameKey="_id"
                label
                outerRadius={100}
              >
                {stats.projectTaskStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
