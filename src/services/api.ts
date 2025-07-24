import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { showToast } from "../components/ui/toast";

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
          break;
        case 403:
          showToast.error(
            "Ruxsat yo‘q. Ushbu amalni bajarish uchun sizda huquq yetarli emas."
          );
          break;
        case 404:
          // showToast.error("Resource not found."); // OLIB TASHLANDI
          break;
        case 422:
          if (data && typeof data === "object" && "errors" in data) {
            const errors = (data as any).errors;
            Object.values(errors).forEach((error: any) => {
              showToast.error(Array.isArray(error) ? error[0] : error);
            });
          } else {
            showToast.error(
              "Ma’lumotlarni tekshiring. To‘ldirishda xatolik bor."
            );
          }
          break;
        case 500:
          showToast.error(
            "Serverda xatolik. Iltimos, keyinroq urinib ko‘ring."
          );
          break;
        default:
          showToast.error("Xatolik yuz berdi. Qaytadan urinib ko‘ring.");
      }
    } else if (error.request) {
      showToast.error("Internetda muammo. Ulanishni tekshiring.");
    } else {
      showToast.error("Noma’lum xatolik yuz berdi.");
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url: string, params?: any) => api.get(url, { params }),
  post: (url: string, data?: any) => api.post(url, data),
  put: (url: string, data?: any) => api.put(url, data),
  patch: (url: string, data?: any) => api.patch(url, data),
  delete: (url: string) => api.delete(url),
  upload: (url: string, formData: FormData) =>
    api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getBaseUrl: () => API_BASE_URL,
};
