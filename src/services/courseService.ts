import { Course } from "../types";
import { apiService } from "./api";

export class CourseService {
  static async getAll(filters?: any) {
    const response = await apiService.get("/courses", filters);
    return response.data.data;
  }
  static async getById(id: string) {
    const response = await apiService.get(`/courses/${id}`);
    return response.data.data;
  }
  static async create(data: Partial<Course>) {
    const response = await apiService.post("/courses", data);
    return response.data.data;
  }
  static async update(id: string, data: Partial<Course>) {
    const response = await apiService.put(`/courses/${id}`, data);
    return response.data.data;
  }
  static async delete(id: string) {
    await apiService.delete(`/courses/${id}`);
  }
  static async getActiveCourses() {
    const response = await apiService.get("/courses", {
      isActive: true,
    });
    return response.data.data;
  }
}
