import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    const data = response?.data || response;
    if (data?.success === false) {
      return Promise.reject(data);
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest.url?.endsWith(API_ENDPOINTS.AUTH.LOGIN) ||
      originalRequest.url?.endsWith(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
          refreshToken,
        });
        const { access_token, refresh_token } = res.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default apiClient;
