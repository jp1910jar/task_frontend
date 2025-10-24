import React from "react";
import "./Dashboard.css";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Card Components
const Card = ({ children, className }) => (
  <motion.div
    className={`card ${className || ""}`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ children }) => (
  <div className="card-header">{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`card-content ${className || ""}`}>{children}</div>
);

const CardTitle = ({ children }) => <h3 className="card-title">{children}</h3>;

const CardDescription = ({ children }) => (
  <p className="card-description">{children}</p>
);

// Dummy Data
const statsData = {
  totalProjects: 12,
  totalProjectInProgress: 5,
  totalTasks: 120,
  totalTaskCompleted: 80,
  totalTaskToDo: 30,
  totalTaskInProgress: 10,
};

const projectStatusData = [
  { name: "Completed", value: 6, color: "#4CAF50" },
  { name: "In Progress", value: 4, color: "#FF9800" },
  { name: "Planning", value: 2, color: "#2196F3" },
];

const taskPriorityData = [
  { name: "High", value: 5, color: "#f44336" },
  { name: "Medium", value: 3, color: "#ffc107" },
  { name: "Low", value: 2, color: "#8bc34a" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          {
            title: "Total Projects",
            value: statsData.totalProjects,
            desc: `${statsData.totalProjectInProgress} in progress`,
          },
          {
            title: "Total Tasks",
            value: statsData.totalTasks,
            desc: `${statsData.totalTaskCompleted} completed`,
          },
          {
            title: "To Do",
            value: statsData.totalTaskToDo,
            desc: "Tasks waiting to be done",
          },
          {
            title: "In Progress",
            value: statsData.totalTaskInProgress,
            desc: "Tasks currently in progress",
          },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="stat-value"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                {stat.value}
              </motion.div>
              <div className="stat-description">{stat.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Project Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Breakdown of all projects</CardDescription>
          </CardHeader>
          <CardContent className="chart-content">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {projectStatusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Priority - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
            <CardDescription>Task priority distribution</CardDescription>
          </CardHeader>
          <CardContent className="chart-content">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskPriorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {taskPriorityData.map((entry, idx) => (
                    <Cell key={`bar-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}