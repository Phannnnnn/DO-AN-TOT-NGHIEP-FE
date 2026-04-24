import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomTypeAmenityService = {
  roomTypeAmenities: () => {
    return apiClient.get(API_ENDPOINTS.ROOM_TYPE_AMENITY.ROOM_TYPE_AMENITIES);
  },

  roomTypeAmenityByRoomTypeId: (roomTypeId) => {
    return apiClient.get(
      API_ENDPOINTS.ROOM_TYPE_AMENITY.ROOM_TYPE_AMENITY_BY_ROOM_TYPE_ID(
        roomTypeId,
      ),
    );
  },
};
