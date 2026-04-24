import apiClient from "../../api/axios.custom";
import { API_ENDPOINTS } from "../../api/endpoints";

export const roomTypeService = {
  roomTypes: async () => {
    const res = await apiClient.get(API_ENDPOINTS.ROOM_TYPE.ROOM_TYPES);

    return res;
  },

  roomTypeById: async (roomTypeId) => {
    const res = await apiClient.get(
      API_ENDPOINTS.ROOM_TYPE.ROOM_TYPE_BY_ID(roomTypeId),
    );

    return res;
  },
};
