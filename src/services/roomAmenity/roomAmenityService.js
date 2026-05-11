import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomAmenityService = {
  create: (data) => {
    return apiClient.post(API_ENDPOINTS.ROOM_AMENITY.ROOM_AMENITIES, data);
  },

  roomAmenities: () => {
    return apiClient.get(API_ENDPOINTS.ROOM_AMENITY.ROOM_AMENITIES);
  },

  update: (roomAmenityId, data) => {
    return apiClient.patch(
      API_ENDPOINTS.ROOM_AMENITY.ROOM_AMENITY_BY_ID(roomAmenityId),
      data,
    );
  },

  remove: (roomAmenityId) => {
    return apiClient.delete(
      API_ENDPOINTS.ROOM_AMENITY.ROOM_AMENITY_BY_ID(roomAmenityId),
    );
  },
};
