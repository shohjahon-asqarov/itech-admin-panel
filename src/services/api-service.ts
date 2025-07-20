import { apiService, ApiResponse } from "./api";
import { showToast } from "@/components/ui/toast";

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
      const response = await apiService.get<T[]>(this.endpoint, params);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}larni olishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Get single item by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.get<T>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      showToast.error(`${this.entityName}ni olishda xatolik yuz berdi`);
      throw error;
    }
  }

  // Create new item
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiService.post<T>(this.endpoint, data);
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
      const response = await apiService.put<T>(`${this.endpoint}/${id}`, data);
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
      const response = await apiService.delete<void>(`${this.endpoint}/${id}`);
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
      const response = await apiService.upload<T>(
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
      const response = await apiService.post<void>(
        `${this.endpoint}/bulk-delete`,
        { ids }
      );
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
      const response = await apiService.put<T[]>(
        `${this.endpoint}/bulk-update`,
        { ids, data }
      );
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

// Enhanced hooks for API operations
export const useApiOperation = <T, P = any>(
  operation: (params: P) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
  }
) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const execute = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await operation(params);

      if (options?.onSuccess) {
        options.onSuccess(response.data!);
      }

      return response.data!;
    } catch (err) {
      const error = err as Error;
      setError(error);

      if (options?.onError) {
        options.onError(error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

// Retry mechanism for failed requests
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};

// Cache mechanism for API responses
export class ApiCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Global cache instance
export const apiCache = new ApiCache();

// Cached API service
export class CachedApiService<T> extends ApiService<T> {
  private cache: ApiCache;
  private cacheKey: string;

  constructor(
    endpoint: string,
    entityName: string,
    cache: ApiCache = apiCache
  ) {
    super(endpoint, entityName);
    this.cache = cache;
    this.cacheKey = `${endpoint}_cache`;
  }

  async getAll(params?: any): Promise<ApiResponse<T[]>> {
    const cacheKey = `${this.cacheKey}_all_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await super.getAll(params);
    this.cache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes cache
    return result;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const cacheKey = `${this.cacheKey}_${id}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await super.getById(id);
    this.cache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes cache
    return result;
  }

  // Invalidate cache on create/update/delete
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const result = await super.create(data);
    this.cache.delete(`${this.cacheKey}_all`);
    return result;
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const result = await super.update(id, data);
    this.cache.delete(`${this.cacheKey}_all`);
    this.cache.delete(`${this.cacheKey}_${id}`);
    return result;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const result = await super.delete(id);
    this.cache.delete(`${this.cacheKey}_all`);
    this.cache.delete(`${this.cacheKey}_${id}`);
    return result;
  }
}
