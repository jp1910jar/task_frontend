import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach token to requests if exists
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
