import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomHoldService = {
 hold: (data) => {
 return apiClient.post(API_ENDPOINTS.ROOM_HOLD.HOLD, data);
 },

 release: (sessionId) => {
 return apiClient.delete(API_ENDPOINTS.ROOM_HOLD.RELEASE(sessionId));
 },
};
