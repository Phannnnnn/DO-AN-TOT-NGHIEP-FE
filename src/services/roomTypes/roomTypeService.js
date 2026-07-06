import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomTypeService = {
 create: async (data) => {
 const res = await apiClient.post(API_ENDPOINTS.ROOM_TYPE.ROOM_TYPES, data);
 return res;
 },

 roomTypes: async () => {
 const res = await apiClient.get(API_ENDPOINTS.ROOM_TYPE.ROOM_TYPES);
 return res;
 },

 update: async (roomTypeId, data) => {
 const res = await apiClient.patch(
 API_ENDPOINTS.ROOM_TYPE.ROOM_TYPE_BY_ID(roomTypeId),
 data,
 );
 return res;
 },

 remove: async (roomTypeId) => {
 const res = await apiClient.delete(
 API_ENDPOINTS.ROOM_TYPE.ROOM_TYPE_BY_ID(roomTypeId),
 );

 return res;
 },
};
