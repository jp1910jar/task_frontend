import axios from "axios";

// ✅ Axios instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// ✅ Attach JWT token automatically
API.interceptors.request.use(
  req => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  err => Promise.reject(err)
);

// ===== AUTH =====
export const signupUser = data => API.post("/auth/signup", data);
export const loginUser = data => API.post("/auth/login", data);

// ===== MEMBERS =====
export const getMembers = () => API.get("/members");
export const createMember = data => API.post("/members", data);
export const updateMember = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember = id => API.delete(`/members/${id}`);

// ===== WORKGROUPS & WORKSPACES =====
export const getWorkgroups = () => API.get("/workgroups");
export const getWorkgroupById = id => API.get(`/workgroups/${id}`);
export const createWorkgroup = data => API.post("/workgroups", data);
export const updateWorkgroupMembers = data => API.put("/workgroups/update-members", data);
export const createWorkspace = (workgroupId, data) => API.post(`/workgroups/${workgroupId}/workspaces`, data);

// ===== TASKS =====
export const getTasks = () => API.get("/tasks");
export const createTask = data => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = id => API.delete(`/tasks/${id}`);

// ===== PROJECT TASKS =====
export const getProjectTasks = (workspaceId, status) =>
  API.get(`/project-tasks/${workspaceId}`, { params: { status } });
export const createProjectTask = data => API.post("/project-tasks", data);
export const updateProjectTask = (id, data) => API.put(`/project-tasks/${id}`, data);
export const deleteProjectTask = id => API.delete(`/project-tasks/${id}`);

// ===== DASHBOARD =====
export const getDashboardStats = () => API.get("/dashboard/stats");
