// src/ProjectTask.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from "./api";
import "./ProjectTask.css";

const ProjectTask = ({ selectedWorkspace }) => {
  // If parent passes selectedWorkspace prop use it, otherwise read from URL params
  const params = useParams();
  const workspaceIdFromUrl = params?.workspaceId;
  const workspaceId = selectedWorkspace || workspaceIdFromUrl;

  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    taskName: "",
    priority: "Medium",
    status: "Not Started",
    createdBy: "",
    startDate: "",
    endDate: "",
    estimate: "",
  });

  useEffect(() => {
    if (workspaceId) fetchTasks();
    else setTasks([]); // clear if no workspace
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, statusFilter]);

  const fetchTasks = async () => {
    if (!workspaceId) {
      console.warn("ProjectTask: workspaceId not available, skipping fetchTasks");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      const { data } = await getProjectTasks(workspaceId, statusFilter);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch project tasks:", err);
      setErrorMsg("Failed to load tasks. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const normalizeEstimate = (estimate) => {
    if (!estimate) return "";
    const lower = estimate.toLowerCase().trim();
    // if user typed a number (e.g. "5") append " hours"
    if (/^\d+$/.test(lower)) return `${lower} hours`;
    // if user typed number + h or hr/hrs, convert to "x hours"
    if (/^\d+\s*h(ours?)?$/.test(lower) || /^\d+\s*hrs?$/.test(lower)) {
      // convert "5h" or "5 hr" -> "5 hours"
      const num = lower.match(/^\d+/)[0];
      return `${num} hours`;
    }
    return estimate; // leave as-is if user wrote "5 days" etc.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workspaceId) {
      setErrorMsg("No workspace selected. Open a workspace page first.");
      return;
    }

    // Basic client-side required validation
    if (!formData.projectName?.trim() || !formData.taskName?.trim()) {
      setErrorMsg("Project name and task name are required.");
      return;
    }

    // Normalize estimate if needed
    const normalizedEstimate = normalizeEstimate(formData.estimate);

    try {
      setErrorMsg("");
      if (editingTask) {
        await updateProjectTask(editingTask._id, {
          ...formData,
          estimate: normalizedEstimate,
        });
        setEditingTask(null);
      } else {
        await createProjectTask({
          ...formData,
          estimate: normalizedEstimate,
          workspaceId,
        });
      }
      resetForm();
      await fetchTasks();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save project task:", err);
      // show server error message if available
      const serverMsg = err?.response?.data?.message;
      setErrorMsg(serverMsg || "Failed to save task. See console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      taskName: "",
      priority: "Medium",
      status: "Not Started",
      createdBy: "",
      startDate: "",
      endDate: "",
      estimate: "",
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      projectName: task.projectName || "",
      taskName: task.taskName || "",
      priority: task.priority || "Medium",
      status: task.status || "Not Started",
      createdBy: task.createdBy || "",
      startDate: task.startDate ? task.startDate.slice(0, 10) : "",
      endDate: task.endDate ? task.endDate.slice(0, 10) : "",
      estimate: task.estimate || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteProjectTask(id);
      // remove locally for snappy UI
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setErrorMsg("Failed to delete task. See console for details.");
    }
  };

  return (
    <div className="project-task-page">
      <div className="project-task-header">
        <h2>Project Tasks</h2>
        <div className="header-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>On Hold</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </select>

          <button
            className="create-btn"
            onClick={() => {
              resetForm();
              setEditingTask(null);
              setShowModal(true);
            }}
          >
            + Create Task
          </button>
        </div>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      {/* Task Table */}
      <table className="project-task-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Start</th>
            <th>End</th>
            <th>Estimate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="no-task">
                Loading...
              </td>
            </tr>
          ) : tasks.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-task">
                No project tasks yet
              </td>
            </tr>
          ) : (
            tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.projectName}</td>
                <td>{t.taskName}</td>
                <td>
                  <span className={`priority-badge ${String(t.priority || "medium").toLowerCase()}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${String(t.status || "not-started")
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>{t.createdBy}</td>
                <td>{t.startDate?.slice(0, 10)}</td>
                <td>{t.endDate?.slice(0, 10)}</td>
                <td>{t.estimate || "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(t)}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editingTask ? "Edit Task" : "Create New Task"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Task Name"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                required
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
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
                placeholder="Estimate (e.g. 5 hours)"
                value={formData.estimate}
                onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingTask ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setErrorMsg("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTask;
