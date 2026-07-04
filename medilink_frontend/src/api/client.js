import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://medilink-backend-tb14.onrender.com";
  
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



// Request interceptor to add authorization token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like token expiration)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn("Unauthorized access detected. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      // Redirect if window object is available
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
