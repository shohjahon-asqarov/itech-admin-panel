import { apiService } from "./api";
import { showToast } from "../components/ui/toast";

// Local ApiResponse type
type ApiResponse<T> = {
  data: T;
  [key: string]: any;
};

// Generic API service with enhanced error handling and loading states
export class ApiService<T> {
  private endpoint: string;
  private entityName: string;

  constructor(endpoint: string, entityName: string) {
    this.endpoint = endpoint;
    this.entityName = entityName;
  }

  // Get all items with pagination
  async getAll(params?: any): Promise<ApiResponse<T[]>> {
    try {
      const response = await apiService.get(this.endpoint, params);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}larni olishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Get single item by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}ni olishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Create new item
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.post(this.endpoint, data);
      showToast.success(`${this.entityName} muvaffaqiyatli qo'shildi`);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}ni qo'shishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Update item by ID
  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.put(`${this.endpoint}/${id}`, data);
      showToast.success(`${this.entityName} muvaffaqiyatli yangilandi`);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}ni yangilashda xatolik yuz berdi`);
      throw error;
    }
  }

  // Delete item by ID
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`${this.endpoint}/${id}`);
      showToast.success(`${this.entityName} muvaffaqiyatli o'chirildi`);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}ni o'chirishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Upload file
  async upload(formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.upload(
        `${this.endpoint}/upload`,
        formData
      );
      showToast.success(`Fayl muvaffaqiyatli yuklandi`);
      return response.data;
    } catch (error) {
      showToast.error(`Faylni yuklashda xatolik yuz berdi`);
      throw error;
    }
  }

  // Bulk operations
  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.post(`${this.endpoint}/bulk-delete`, {
        ids,
      });
      showToast.success(
        `${ids.length} ta ${this.entityName} muvaffaqiyatli o'chirildi`
      );
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}larni o'chirishda xatolik yuz berdi`);
      throw error;
    }
  }

  async bulkUpdate(ids: string[], data: Partial<T>): Promise<ApiResponse<T[]>> {
    try {
      const response = await apiService.put(`${this.endpoint}/bulk-update`, {
        ids,
        data,
      });
      showToast.success(
        `${ids.length} ta ${this.entityName} muvaffaqiyatli yangilandi`
      );
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}larni yangilashda xatolik yuz berdi`);
      throw error;
    }
  }
}
