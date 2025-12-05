import axios from "axios";

// Axios instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach JWT token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (err) => Promise.reject(err)
);

// ===== AUTH =====
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ===== MEMBERS =====
export const getMembers = () => API.get("/members");
export const createMember = (data) => API.post("/members", data);
export const updateMember = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember = (id) => API.delete(`/members/${id}`);

// ===== WORKGROUPS =====
export const getWorkgroups = () => API.get("/workgroups");
export const getWorkgroupById = (id) => API.get(`/workgroups/${id}`);
export const createWorkgroup = (data) => API.post("/workgroups", data);

// update name + description
export const updateWorkgroup = (id, data) =>
  API.put(`/workgroups/${id}`, data);

// update members array (bulk)
// update members array (bulk)
export const updateWorkgroupMembers = (data) =>
  API.put("/workgroups/members", data);


// delete workgroup
export const deleteWorkgroup = (id) => API.delete(`/workgroups/${id}`);

// ===== WORKSPACES =====
export const createWorkspace = (workgroupId, data) =>
  API.post(`/workgroups/${workgroupId}/workspaces`, data);

export const deleteWorkspace = (workgroupId, workspaceId) =>
  API.delete(`/workgroups/${workgroupId}/workspaces/${workspaceId}`);

// ===== TASKS =====
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ===== PROJECT TASKS (OLD FLAT APIs - KEEPING THEM) =====
export const getProjectTasks = (workspaceId, status) =>
  API.get(`/project-tasks/${workspaceId}`, { params: { status } });

export const createProjectTask = (data) =>
  API.post("/project-tasks", data);

export const updateProjectTask = (id, data) =>
  API.put(`/project-tasks/${id}`, data);

export const deleteProjectTask = (id) =>
  API.delete(`/project-tasks/${id}`);

// ===== DASHBOARD =====
export const getDashboardStats = () => API.get("/dashboard");

// ======================================================
// ===== NEW NESTED PROJECT TASK APIs (OPTION-B) ========
// ======================================================

// Get tasks inside a specific workspace of a workgroup
export const getNestedProjectTasks = (workgroupId, workspaceId, status) =>
  API.get(
    `/workgroups/${workgroupId}/workspaces/${workspaceId}/project-tasks`,
    { params: { status } }
  );

// Create task inside workspace
export const createNestedProjectTask = (workgroupId, workspaceId, data) =>
  API.post(
    `/workgroups/${workgroupId}/workspaces/${workspaceId}/project-tasks`,
    data
  );

// Update specific task inside workspace
export const updateNestedProjectTask = (
  workgroupId,
  workspaceId,
  taskId,
  data
) =>
  API.put(
    `/workgroups/${workgroupId}/workspaces/${workspaceId}/project-tasks/${taskId}`,
    data
  );

// Delete specific task inside workspace
export const deleteNestedProjectTask = (workgroupId, workspaceId, taskId) =>
  API.delete(
    `/workgroups/${workgroupId}/workspaces/${workspaceId}/project-tasks/${taskId}`
  );
