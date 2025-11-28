import React, { useState, useEffect } from "react";
import "./MyTask.css";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showPopup, setShowPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newTask, setNewTask] = useState({
    name: "",
    priority: "Medium",
    status: "Not Started",
    assignedTo: "",
    startDate: "",
    endDate: "",
    estimate: "",
    actualTime: "",
  });

  const statusOptions = ["All", "Not Started", "In Progress", "Review", "On Hold", "Closed", "Cancelled"];
  const priorityOptions = ["High", "Medium", "Low"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      const taskData = Array.isArray(response.data) ? response.data : response?.data?.tasks || [];
      setTasks(taskData);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const handleChange = (e) =>
    setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const minutesToHHMM = (minutes) => {
    if (!minutes) return "0:00";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.assignedTo.trim())
      return alert("Task Name and Assigned To are required");

    const taskData = { ...newTask };

    try {
      let response;
      if (editingTask) {
        response = await updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? response.data : t))
        );
      } else {
        response = await createTask(taskData);
        setTasks((prev) => [...prev, response.data]);
      }

      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save task");
    }
  };

  const resetForm = () => {
    setNewTask({
      name: "",
      priority: "Medium",
      status: "Not Started",
      assignedTo: "",
      startDate: "",
      endDate: "",
      estimate: "",
      actualTime: "",
    });

    setEditingTask(null);
    setShowPopup(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      startDate: task.startDate?.slice(0, 10),
      endDate: task.endDate?.slice(0, 10),
      estimate: minutesToHHMM(task.estimate),
      actualTime: minutesToHHMM(task.actualTime),
    });

    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task permanently?")) return;
    await deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const filteredTasks = tasks
    .filter((t) =>
      (t.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((t) => (statusFilter === "All" ? true : t.status === statusFilter));

  const totalActual = filteredTasks.reduce(
    (sum, t) => sum + (t.actualTime || 0),
    0
  );

  return (
    <div className="task-container">
      <h2 className="title">My Tasks</h2>

      <div className="task-header">
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="task-search"
          />
        </div>

        <div className="right-header">
          <span className="total-hours">⏱ Total: {minutesToHHMM(totalActual)} hrs</span>
          <button className="add-btn" onClick={() => setShowPopup(true)}>
            ➕ Add Task
          </button>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned</th>
            <th>Start</th>
            <th>End</th>
            <th>Estimate</th>
            <th>Actual</th>
            <th className="action-header">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{t.assignedTo}</td>
                <td>{t.startDate ? new Date(t.startDate).toLocaleDateString() : "-"}</td>
                <td>{t.endDate ? new Date(t.endDate).toLocaleDateString() : "-"}</td>
                <td>{t.estimate ? minutesToHHMM(t.estimate) : "-"}</td>
                <td>{t.actualTime ? minutesToHHMM(t.actualTime) : "-"}</td>

                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(t)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(t._id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-task">No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{editingTask ? "Edit Task" : "Add Task"}</h3>

            <form className="modal-form" onSubmit={handleAddTask}>
              <input name="name" placeholder="Task Name" value={newTask.name} onChange={handleChange} />

              <div className="row">
                <select name="priority" value={newTask.priority} onChange={handleChange}>
                  {priorityOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>

                <select name="status" value={newTask.status} onChange={handleChange}>
                  {statusOptions.slice(1).map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <input name="assignedTo" placeholder="Assigned To" value={newTask.assignedTo} onChange={handleChange} />

              <div className="row">
                <input type="date" name="startDate" value={newTask.startDate} onChange={handleChange} />
                <input type="date" name="endDate" value={newTask.endDate} onChange={handleChange} />
              </div>

              <div className="row">
                <input name="estimate" placeholder="Estimate (HH:MM)" value={newTask.estimate} onChange={handleChange} />
                <input name="actualTime" placeholder="Actual (HH:MM)" value={newTask.actualTime} onChange={handleChange} />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                <button className="save-btn">{editingTask ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTask;
