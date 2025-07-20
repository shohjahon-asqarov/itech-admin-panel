import { apiService } from "./api";

export const DashboardService = {
  async getStatistics() {
    const response = await apiService.get("/dashboard/statistics");
    return response.data.data;
  },
};
