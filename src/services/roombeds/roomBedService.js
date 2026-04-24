import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomBedService = {
  getByRoomTypeId: async (roomTypeId) => {
    return apiClient.get(
      API_ENDPOINTS.ROOM_BED.ROOM_BEDS_BY_ROOM_TYPE_ID(roomTypeId),
    );
  },
};
