import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomBedService = {
 create: async (data) => {
 return apiClient.post(API_ENDPOINTS.ROOM_BED.ROOM_BEDS, data);
 },

 roomBeds: async () => {
 return apiClient.get(API_ENDPOINTS.ROOM_BED.ROOM_BEDS);
 },

 roomBedByRoomTypeId: async (roomTypeId) => {
 return apiClient.get(
 API_ENDPOINTS.ROOM_BED.ROOM_BEDS_BY_ROOM_TYPE_ID(roomTypeId),
 );
 },

 update: async (roomBedId, data) => {
 return apiClient.patch(
 API_ENDPOINTS.ROOM_BED.ROOM_BED_BY_ID(roomBedId),
 data,
 );
 },

 remove: (roomBedId) => {
 return apiClient.delete(API_ENDPOINTS.ROOM_BED.ROOM_BED_BY_ID(roomBedId));
 },
};
