import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ================= REQUEST =================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 👇 IMPORTANT FIX
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/refresh");

        const newToken = res.data.access_token;

        // save new token
        localStorage.setItem("access_token", newToken);

        // update axios header
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
