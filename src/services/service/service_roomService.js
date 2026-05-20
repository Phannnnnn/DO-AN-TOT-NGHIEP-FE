import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const service_roomService = {
  create: (data) => {
    return apiClient.post(API_ENDPOINTS.SERVICE.SERVICES, data);
  },

  services: () => {
    return apiClient.get(API_ENDPOINTS.SERVICE.SERVICES);
  },

  serviceById: (serviceId) => {
    return apiClient.get(API_ENDPOINTS.SERVICE.SERVICE_BY_ID(serviceId));
  },

  update: (serviceId, data) => {
    return apiClient.patch(
      API_ENDPOINTS.SERVICE.SERVICE_BY_ID(serviceId),
      data,
    );
  },

  remove: (serviceId) => {
    return apiClient.delete(API_ENDPOINTS.SERVICE.SERVICE_BY_ID(serviceId));
  },
};
