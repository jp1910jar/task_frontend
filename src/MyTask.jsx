import React, { useState, useEffect } from "react";
import "./MyTask.css";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

const MyTask = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    priority: "Medium",
    status: "Not Started",
    assignedTo: "",
    startDate: "",
    endDate: "",
    estimate: "",
  });

  const statusOptions = ["All","Not Started","In Progress","Review","On Hold","Closed","Cancelled"];
  const priorityOptions = ["High","Medium","Low"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const filteredTasks = statusFilter === "All"
    ? tasks
    : tasks.filter(task => task.status === statusFilter);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const normalizeTask = (task) => {
    const allowedStatus = ["Not Started","In Progress","Review","On Hold","Closed","Cancelled"];
    const allowedPriority = ["High","Medium","Low"];
    return {
      ...task,
      status: allowedStatus.includes(task.status) ? task.status : "Not Started",
      priority: allowedPriority.includes(task.priority) ? task.priority : "Medium"
    };
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const taskToSend = normalizeTask(newTask);

    if (!taskToSend.name.trim() || !taskToSend.assignedTo.trim()) {
      alert("Task Name and Assigned To are required");
      return;
    }

    try {
      let response;
      if (editingTask) {
        response = await updateTask(editingTask._id, taskToSend);
        setTasks(tasks.map(t => t._id === editingTask._id ? response.data : t));
        setEditingTask(null);
      } else {
        response = await createTask(taskToSend);
        if (response && response.data) {
          setTasks([...tasks, response.data]);
        } else {
          alert("Task created but server returned no data");
        }
      }

      setNewTask({ name: "", priority: "Medium", status: "Not Started", assignedTo: "", startDate: "", endDate: "", estimate: "" });
      setShowPopup(false);
    } catch (error) {
      console.error("Save Error:", error);
      if (error.response) {
        alert(error.response.data?.message || "Failed to save task");
      } else if (error.request) {
        alert("Network Error: Could not reach backend");
      } else {
        alert("Error: " + error.message);
      }
    }
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

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask(normalizeTask(task));
    setShowPopup(true);
  };

  return (
    <div className="task-container">
      <h2 className="title">My Tasks</h2>

      <div className="toolbar">
        <div className="filter-container">
          <label>Status Filter: </label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statusOptions.map((s, idx) => <option key={idx}>{s}</option>)}
          </select>
        </div>
        <button className="add-btn" onClick={() => setShowPopup(true)}>+ Add Task</button>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length ? filteredTasks.map(task => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
              <td><span className={`status ${task.status.replace(" ","-")}`}>{task.status}</span></td>
              <td>{task.assignedTo}</td>
              <td>{task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"}</td>
              <td>{task.endDate ? new Date(task.endDate).toLocaleDateString() : "-"}</td>
              <td>{task.estimate}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => handleEdit(task)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
              </td>
            </tr>
          )) : <tr><td colSpan="8" className="no-data">No tasks found</td></tr>}
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
              <input type="text" name="estimate" placeholder="Estimate Time" value={newTask.estimate} onChange={handleChange} />
              <div className="popup-actions">
                <button type="submit" className="save-btn">{editingTask ? "Update" : "Save"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowPopup(false); setEditingTask(null); setNewTask({ name:"",priority:"Medium",status:"Not Started",assignedTo:"",startDate:"",endDate:"",estimate:"" }); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyTask;
