import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats } from "./api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
        console.log("Dashboard stats:", data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };
    fetchData();
  }, []);

  if (!stats)
    return (
      <motion.div
        className="loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
      >
        Loading Dashboard...
      </motion.div>
    );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">
      <h2 className="title">📊 Project Management Dashboard</h2>

      {/* Summary Cards */}
      <div className="card-grid">
        {[
          { label: "Members", value: stats.members.length },
          { label: "Tasks", value: stats.tasks.length },
          { label: "Workgroups", value: stats.workgroups },
          { label: "Project Tasks", value: stats.projectTasks },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="card"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
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
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                paddingAngle={3}
              >
                {stats.taskStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, "Tasks"]} />
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
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                paddingAngle={3}
              >
                {stats.projectTaskStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, "Project Tasks"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Hours Table */}
      <div className="user-hours-table">
        <h3>👥 Member Work Hours</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {stats.members.length > 0 ? (
              stats.members.map((member) => (
                <tr key={member.memberId}>
                  <td>{member.name}</td>
                  <td>{member.designation || member.role || "-"}</td>
                  <td>
                    {Math.floor(member.totalActualHours / 60)}h{" "}
                    {member.totalActualHours % 60}m
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
