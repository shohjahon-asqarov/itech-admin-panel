import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error(
            "Access denied. You do not have permission to perform this action."
          );
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 422:
          if (data && typeof data === "object" && "errors" in data) {
            const errors = (data as any).errors;
            Object.values(errors).forEach((error: any) => {
              toast.error(Array.isArray(error) ? error[0] : error);
            });
          } else {
            toast.error("Validation failed. Please check your input.");
          }
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error("An error occurred. Please try again.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(url: string, params?: any) => api.get(url, { params }),
  post: <T>(url: string, data?: any) => api.post(url, data),
  put: <T>(url: string, data?: any) => api.put(url, data),
  patch: <T>(url: string, data?: any) => api.patch(url, data),
  delete: <T>(url: string) => api.delete(url),
  upload: <T>(url: string, formData: FormData) =>
    api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getBaseUrl: () => API_BASE_URL,
};
