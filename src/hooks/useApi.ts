import { useState, useEffect, useCallback, useRef } from "react";
import { showToast } from "@/components/ui/toast";

// Generic API hook with loading and error states
export const useApi = <T, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
    autoExecute?: boolean;
    initialParams?: P;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const execute = useCallback(
    async (params: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(params);
        setData(result);

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        if (options?.showToast !== false) {
          showToast.success("Ma'lumotlar muvaffaqiyatli yuklandi");
        }

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.onError) {
          options.onError(error);
        }

        if (options?.showToast !== false) {
          showToast.error("Xatolik yuz berdi: " + error.message);
        }

        return null;
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    },
    [apiFunction, options]
  );

  // Auto execute on mount if enabled
  useEffect(() => {
    if (options?.autoExecute && options?.initialParams) {
      execute(options.initialParams);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    isInitialized,
    refetch: () =>
      options?.initialParams ? execute(options.initialParams) : null,
  };
};

// Hook for CRUD operations
export const useCrud = <T>(
  service: {
    getAll: (params?: any) => Promise<{ data: T[] }>;
    getById: (id: string) => Promise<{ data: T }>;
    create: (data: Partial<T>) => Promise<{ data: T }>;
    update: (id: string, data: Partial<T>) => Promise<{ data: T }>;
    delete: (id: string) => Promise<{ data: void }>;
  },
  options?: {
    showToast?: boolean;
    autoLoad?: boolean;
  }
) => {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load all items
  const loadItems = useCallback(
    async (params?: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.getAll(params);
        setItems((prev) => {
          const newItems = response.data || [];
          if (JSON.stringify(prev) !== JSON.stringify(newItems)) {
            return newItems;
          }
          return prev;
        });

        if (options?.showToast !== false) {
          showToast.success("Ma'lumotlar yuklandi");
        }
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.showToast !== false) {
          showToast.error("Ma'lumotlarni yuklashda xatolik");
        }
      } finally {
        setLoading(false);
      }
    },
    [service, options]
  );

  // Load single item
  const loadItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.getById(id);
        setSelectedItem(response.data);

        return response.data;
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.showToast !== false) {
          showToast.error("Ma'lumotni yuklashda xatolik");
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [service, options]
  );

  // Create item
  const createItem = useCallback(
    async (data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.create(data);
        const newItem = response.data;

        setItems((prev) => [...prev, newItem]);

        if (options?.showToast !== false) {
          showToast.success("Ma'lumot muvaffaqiyatli qo'shildi");
        }

        return newItem;
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.showToast !== false) {
          showToast.error("Ma'lumotni qo'shishda xatolik");
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [service, options]
  );

  // Update item
  const updateItem = useCallback(
    async (id: string, data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.update(id, data);
        const updatedItem = response.data;

        setItems((prev) =>
          prev.map((item) => ((item as any).id === id ? updatedItem : item))
        );

        if (selectedItem && (selectedItem as any).id === id) {
          setSelectedItem(updatedItem);
        }

        if (options?.showToast !== false) {
          showToast.success("Ma'lumot muvaffaqiyatli yangilandi");
        }

        return updatedItem;
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.showToast !== false) {
          showToast.error("Ma'lumotni yangilashda xatolik");
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [service, options, selectedItem]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await service.delete(id);

        setItems((prev) => prev.filter((item) => (item as any).id !== id));

        if (selectedItem && (selectedItem as any).id === id) {
          setSelectedItem(null);
        }

        if (options?.showToast !== false) {
          showToast.success("Ma'lumot muvaffaqiyatli o'chirildi");
        }

        return true;
      } catch (err) {
        const error = err as Error;
        setError(error);

        if (options?.showToast !== false) {
          showToast.error("Ma'lumotni o'chirishda xatolik");
        }

        return false;
      } finally {
        setLoading(false);
      }
    },
    [service, options, selectedItem]
  );

  // Auto load on mount
  useEffect(() => {
    if (options?.autoLoad !== false) {
      loadItems();
    }
  }, [loadItems, options?.autoLoad]);

  return {
    items,
    selectedItem,
    loading,
    error,
    loadItems,
    loadItem,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
  };
};

// Hook for infinite scrolling
export const useInfiniteScroll = <T>(
  loadFunction: (
    page: number,
    limit: number
  ) => Promise<{ data: T[]; pagination?: any }>,
  options?: {
    limit?: number;
    threshold?: number;
  }
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const limit = options?.limit || 10;
  const threshold = options?.threshold || 100;

  const loadMore = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;
        const response = await loadFunction(currentPage, limit);
        const newItems = response.data || [];

        if (reset) {
          setItems(newItems);
          setPage(2);
        } else {
          setItems((prev) => [...prev, ...newItems]);
          setPage((prev) => prev + 1);
        }

        // Check if there are more items
        if (response.pagination) {
          setHasMore(currentPage < response.pagination.totalPages);
        } else {
          setHasMore(newItems.length === limit);
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        showToast.error("Ma'lumotlarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    },
    [loadFunction, loading, hasMore, page, limit]
  );

  // Reset and reload
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    loadMore(true);
  }, [loadMore]);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
  };
};

// Hook for real-time updates (WebSocket simulation)
export const useRealtime = <T>(
  initialData: T[],
  options?: {
    interval?: number;
    enabled?: boolean;
  }
) => {
  const [data, setData] = useState<T[]>(initialData);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const interval = options?.interval || 30000; // 30 seconds default
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      // Simulate real-time updates
      setData((prev) => [...prev]);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  return {
    data,
    setData,
  };
};

export default useApi;
