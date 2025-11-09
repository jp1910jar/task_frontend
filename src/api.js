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

// ===== WORKGROUP & WORKSPACE APIS ===== ✅
// Get all workgroups visible to logged-in user (creator or assigned)
export const getWorkgroups = () => API.get("/workgroups");

// Create a new workgroup with selected members (User _id array)
export const createWorkgroup = (data) => API.post("/workgroups", data);

// Get single workgroup by id (only accessible if creator or assigned member)
export const getWorkgroupById = (id) => API.get(`/workgroups/${id}`);

// Create workspace inside a workgroup with selected members
export const createWorkspace = (workgroupId, data) =>
  API.post(`/workgroups/${workgroupId}/workspaces`, data);

// ===== TASK APIS =====
export const getTasks = () => API.get("/tasks");
export const createTask = (task) => API.post("/tasks", task);
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ===== PROJECT TASK APIS =====
export const getProjectTasks = (workspaceId, status) =>
  API.get(`/project-tasks/${workspaceId}`, { params: { status } });
export const createProjectTask = (taskData) => API.post("/project-tasks", taskData);
export const updateProjectTask = (id, updatedData) =>
  API.put(`/project-tasks/${id}`, updatedData);
export const deleteProjectTask = (id) => API.delete(`/project-tasks/${id}`);

// ===== DASHBOARD API =====
export const getDashboardStats = () => API.get("/dashboard/stats");

