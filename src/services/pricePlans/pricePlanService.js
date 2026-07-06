import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const pricePlanService = {
 pricePlansByRoomTypeId: (roomTypeId) => {
 return apiClient.get(
 API_ENDPOINTS.PRICEPLANS.PRICEPLANS_BY_ROOM_TYPE_ID(roomTypeId),
 );
 },

 pricePlanById: (pricePlanId) => {
 return apiClient.get(API_ENDPOINTS.PRICEPLANS.PRICEPLAN_BY_ID(pricePlanId));
 },
};
