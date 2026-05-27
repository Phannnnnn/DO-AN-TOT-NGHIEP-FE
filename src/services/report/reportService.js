import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const reportService = {
  summary: (params) => {
    return apiClient.get(API_ENDPOINTS.REPORT.SUMMARY, {
      params: params,
    });
  },
};
