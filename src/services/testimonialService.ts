import { Testimonial } from "@/types";
import { apiService } from "./api";

export class TestimonialService {
  static async getAll(filters?: any) {
    const response = await apiService.get<Testimonial[]>(
      "/testimonials",
      filters
    );
    return response.data.data;
  }
  static async getById(id: string) {
    const response = await apiService.get<Testimonial>(`/testimonials/${id}`);
    return response.data.data;
  }
  static async create(data: Partial<Testimonial>) {
    const response = await apiService.post<Testimonial>("/testimonials", data);
    return response.data.data;
  }
  static async update(id: string, data: Partial<Testimonial>) {
    const response = await apiService.put<Testimonial>(
      `/testimonials/${id}`,
      data
    );
    return response.data.data;
  }
  static async delete(id: string) {
    await apiService.delete(`/testimonials/${id}`);
  }
  static async getFeatured() {
    const response = await apiService.get<Testimonial[]>(
      "/testimonials/featured"
    );
    return response.data.data;
  }
}
