import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const roomAmenityService = {
  roomAmenities: () => {
    return apiClient.get(API_ENDPOINTS.ROOM_AMENITY.ROOM_AMENITIES);
  },
};
