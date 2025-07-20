import { Course } from "@/types";
import { apiService } from "./api";

export class CourseService {
  static async getAll(filters?: any) {
    const response = await apiService.get<Course[]>("/courses", filters);
    return response.data.data;
  }
  static async getById(id: string) {
    const response = await apiService.get<Course>(`/courses/${id}`);
    return response.data.data;
  }
  static async create(data: Partial<Course>) {
    const response = await apiService.post<Course>("/courses", data);
    return response.data.data;
  }
  static async update(id: string, data: Partial<Course>) {
    const response = await apiService.put<Course>(`/courses/${id}`, data);
    return response.data.data;
  }
  static async delete(id: string) {
    await apiService.delete(`/courses/${id}`);
  }
  static async getActiveCourses() {
    const response = await apiService.get<Course[]>("/courses", {
      isActive: true,
    });
    return response.data.data;
  }
}
