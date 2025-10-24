import React, { useEffect, useState } from "react";
import "./ProjectTask.css";

const ProjectTask = ({ selectedWorkspace }) => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    taskName: "",
    priority: "",
    status: "Not Started",
    createdBy: "",
    startDate: "",
    endDate: "",
    estimate: "",
  });

  useEffect(() => {
    if (selectedWorkspace) fetchTasks();
  }, [selectedWorkspace, statusFilter]);

  const fetchTasks = async () => {
    const { data } = await getTasks(selectedWorkspace, statusFilter);
    setTasks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ ...formData, workspaceId: selectedWorkspace });
    setFormData({
      taskName: "",
      priority: "",
      status: "Not Started",
      createdBy: "",
      startDate: "",
      endDate: "",
      estimate: "",
    });
    fetchTasks();
  };

  return (
    <div className="task-page">
      <div className="task-header">
        <h2>Tasks</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>On Hold</option>
          <option>Closed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Name"
          value={formData.taskName}
          onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Review</option>
          <option>On Hold</option>
          <option>Closed</option>
          <option>Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Created By"
          value={formData.createdBy}
          onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
        />
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Estimate"
          value={formData.estimate}
          onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Estimate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.taskName}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>{t.createdBy}</td>
              <td>{t.startDate?.slice(0, 10)}</td>
              <td>{t.endDate?.slice(0, 10)}</td>
              <td>{t.estimate}</td>
              <td>
                <button onClick={() => deleteTask(t._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTask;
