import apiClient from "../../api/axios.custom";
import { API_ENDPOINTS } from "../../api/endpoints";

export const roomService = {
 create: async (data) => {
 const res = await apiClient.post(API_ENDPOINTS.ROOM.ROOMS, data);
 return res;
 },

 rooms: async () => {
 const res = await apiClient.get(API_ENDPOINTS.ROOM.ROOMS);

 return res;
 },
 roomById: async (roomId) => {},

 update: async (roomId, data) => {
 const res = await apiClient.patch(
 API_ENDPOINTS.ROOM.ROOM_BY_ID(roomId),
 data,
 );
 return res;
 },

 remove: async (roomId) => {
 const res = await apiClient.delete(API_ENDPOINTS.ROOM.ROOM_BY_ID(roomId));
 return res;
 },
};
