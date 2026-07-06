import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const housekeepingService = {
 getTasks: () => {
 return apiClient.get(API_ENDPOINTS.HOUSEKEEPING.HOUSEKEEPINGS);
 },
 claimTask: (taskId) => {
 return apiClient.post(
 API_ENDPOINTS.HOUSEKEEPING.HOUSEKEEPING_CLAIM(taskId),
 );
 },
 completeTask: (taskId) => {
 return apiClient.patch(
 API_ENDPOINTS.HOUSEKEEPING.HOUSEKEEPING_COMPLETE(taskId),
 );
 },
};
