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

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const handleChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const minutesToHHMM = (minutes) => {
    if (!minutes || isNaN(minutes)) return "0:00";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.assignedTo.trim()) {
      alert("Task Name and Assigned To are required");
      return;
    }

    const taskToSend = { ...newTask };

    try {
      let response;
      if (editingTask) {
        response = await updateTask(editingTask._id, taskToSend);
        setTasks(tasks.map(t => t._id === editingTask._id ? response.data : t));
        setEditingTask(null);
      } else {
        response = await createTask(taskToSend);
        if (response?.data) setTasks([...tasks, response.data]);
      }

      setNewTask({ name:"", priority:"Medium", status:"Not Started", assignedTo:"", startDate:"", endDate:"", estimate:"", actualTime:"" });
      setShowPopup(false);
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      startDate: task.startDate?.slice(0,10) || "",
      endDate: task.endDate?.slice(0,10) || "",
      estimate: minutesToHHMM(task.estimate),
      actualTime: minutesToHHMM(task.actualTime),
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  const filteredTasks = tasks
    .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => statusFilter === "All" ? true : t.status === statusFilter);

  const totalActualMinutes = filteredTasks.reduce((sum, t) => sum + (t.actualTime || 0), 0);

  return (
    <div className="task-container">
      <h2 className="title">My Tasks</h2>

      <div className="toolbar">
        <div className="toolbar-left">
          <label>Status Filter: </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((s, idx) => <option key={idx}>{s}</option>)}
          </select>
          <input
            type="text"
            placeholder="Search by task or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="task-search"
          />
        </div>

        <div className="toolbar-right">
          <div className="total-hours"><strong>Total Actual Time:</strong> {minutesToHHMM(totalActualMinutes)} hrs</div>
          <button className="add-btn" onClick={() => setShowPopup(true)}>+ Add Task</button>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Estimate</th>
            <th>Actual Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length ? filteredTasks.map((task) => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>{task.assignedTo}</td>
              <td>{task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"}</td>
              <td>{task.endDate ? new Date(task.endDate).toLocaleDateString() : "-"}</td>
              <td>{task.estimate ? minutesToHHMM(task.estimate) + " hrs" : "-"}</td>
              <td>{task.actualTime ? minutesToHHMM(task.actualTime) + " hrs" : "-"}</td>
              <td>
                <button onClick={() => handleEdit(task)}>✏️</button>
                <button onClick={() => handleDelete(task._id)}>🗑️</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="9">No tasks found</td></tr>
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
            <form onSubmit={handleAddTask}>
              <input type="text" name="name" placeholder="Task Name" value={newTask.name} onChange={handleChange} required />
              <select name="priority" value={newTask.priority} onChange={handleChange}>
                {priorityOptions.map((p, idx) => <option key={idx}>{p}</option>)}
              </select>
              <select name="status" value={newTask.status} onChange={handleChange}>
                {statusOptions.slice(1).map((s, idx) => <option key={idx}>{s}</option>)}
              </select>
              <input type="text" name="assignedTo" placeholder="Assigned To" value={newTask.assignedTo} onChange={handleChange} required />
              <input type="date" name="startDate" value={newTask.startDate} onChange={handleChange} />
              <input type="date" name="endDate" value={newTask.endDate} onChange={handleChange} />
              <input type="text" name="estimate" placeholder="Estimate HH:MM" value={newTask.estimate} onChange={handleChange} pattern="^([0-9]{1,2}):([0-5][0-9])$" title="Format HH:MM" />
              <input type="text" name="actualTime" placeholder="Actual Time HH:MM" value={newTask.actualTime} onChange={handleChange} pattern="^([0-9]{1,2}):([0-5][0-9])$" title="Format HH:MM" />

              <div className="popup-actions">
                <button type="submit">{editingTask ? "Update" : "Save"}</button>
                <button type="button" onClick={() => { setShowPopup(false); setEditingTask(null); setNewTask({ name:"", priority:"Medium", status:"Not Started", assignedTo:"", startDate:"", endDate:"", estimate:"", actualTime:"" }); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTask;
