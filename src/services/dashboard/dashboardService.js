import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const dashboardService = {
  summary: () => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
  },
};
