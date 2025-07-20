import { Teacher } from "@/types";
import { apiService } from "./api";

export class TeacherService {
  static async getAll(filters?: any) {
    const response = await apiService.get<Teacher[]>("/teachers", filters);
    return response.data.data;
  }
  static async getById(id: string) {
    const response = await apiService.get<Teacher>(`/teachers/${id}`);
    return response.data.data;
  }
  static async create(data: Partial<Teacher>) {
    const response = await apiService.post<Teacher>("/teachers", data);
    return response.data.data;
  }
  static async update(id: string, data: Partial<Teacher>) {
    const response = await apiService.put<Teacher>(`/teachers/${id}`, data);
    return response.data.data;
  }
  static async delete(id: string) {
    await apiService.delete(`/teachers/${id}`);
  }
}
