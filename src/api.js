// src/api.js
import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// ✅ Automatically attach JWT token to all requests
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (err) => Promise.reject(err)
);

// ===== AUTH APIS =====
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ===== MEMBER APIS =====
export const getMembers = () => API.get("/members");
export const createMember = (data) => API.post("/members", data);
export const updateMember = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember = (id) => API.delete(`/members/${id}`);

// ===== TASK APIS =====
export const getTasks = () => API.get("/tasks");
export const createTask = (task) => API.post("/tasks", task);
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ===== WORKGROUP & WORKSPACE APIS ===== ✅
export const getWorkgroups = () => API.get("/workgroups");
export const createWorkgroup = (data) => API.post("/workgroups", data);

// Fetch single workgroup by ID
export const getWorkgroupById = (id) => API.get(`/workgroups/${id}`);

// Create workspace inside a workgroup
export const createWorkspace = (id, data) =>
  API.post(`/workgroups/${id}/workspaces`, data);

// ---- Project Task APIs ----
export const getProjectTasks = (workspaceId, status) =>
  API.get(`/project-tasks/${workspaceId}`, { params: { status } });

export const createProjectTask = (taskData) => API.post("/project-tasks", taskData);

export const updateProjectTask = (id, updatedData) =>
  API.put(`/project-tasks/${id}`, updatedData);

export const deleteProjectTask = (id) => API.delete(`/project-tasks/${id}`);

// ===== 📊 DASHBOARD API ===== ✅ (NEW)
export const getDashboardStats = () => API.get("/dashboard/stats");
