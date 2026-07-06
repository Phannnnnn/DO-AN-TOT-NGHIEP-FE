import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const service_room_typeService = {
 create: (data) => {
 return apiClient.post(API_ENDPOINTS.SERVICE_TYPE.SERVICE_TYPES, data);
 },

 serviceTypes: () => {
 return apiClient.get(API_ENDPOINTS.SERVICE_TYPE.SERVICE_TYPES);
 },

 update: (serviceTypeId, data) => {
 return apiClient.patch(
 API_ENDPOINTS.SERVICE_TYPE.SERVICE_TYPE_BY_ID(serviceTypeId),
 data,
 );
 },

 remove: (serviceTypeId) => {
 return apiClient.delete(
 API_ENDPOINTS.SERVICE_TYPE.SERVICE_TYPE_BY_ID(serviceTypeId),
 );
 },
};
