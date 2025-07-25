import { Lead } from "../types";
import { apiService } from "./api";

export class LeadService {
  static async getAll(filters?: any) {
    const response = await apiService.get("/leads", filters);
    return response.data.data;
  }
  static async getById(id: string) {
    const response = await apiService.get(`/leads/${id}`);
    return response.data.data;
  }
  static async create(data: Partial<Lead>) {
    const response = await apiService.post("/leads", data);
    return response.data.data;
  }
  static async update(id: string, data: Partial<Lead>) {
    const response = await apiService.put(`/leads/${id}`, data);
    return response.data.data;
  }
  static async delete(id: string) {
    await apiService.delete(`/leads/${id}`);
  }
}
