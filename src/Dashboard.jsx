import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getDashboardStats } from "./api";
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

  // 🚀 Function to Export to Excel
  const exportToExcel = () => {
    const excelData = stats.members.map((m, index) => ({
      "Sr No.": index + 1,
      Name: m.name,
      Designation: m.designation || m.role || "-",
      "Total Hours": `${Math.floor(m.totalActualHours / 60)}h ${
        m.totalActualHours % 60
      }m`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(fileData, `Task_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (!stats)
    return <div className="loader">Loading Dashboard...</div>;

  return (
    <motion.div className="dashboard" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
      <h2 className="title">📊 Dashboard Summary</h2>

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
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 140 }}
          >
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Export Button + Member Table */}
      <div className="user-hours-table">
        <div className="table-header">
          <h3>👥 Member Work Hours</h3>
          <button className="export-btn" onClick={exportToExcel}>
            📁 Export Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {stats.members.map((member) => (
              <tr key={member.memberId}>
                <td>{member.name}</td>
                <td>{member.designation || member.role || "-"}</td>
                <td>
                  {Math.floor(member.totalActualHours / 60)}h{" "}
                  {member.totalActualHours % 60}m
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="chart-section">
        <div className="chart-card">
          <h3>📌 Task Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.taskStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>📁 Project Task Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.projectTaskStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
