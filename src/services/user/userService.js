import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const userService = {
  users: (query) => {
    return apiClient.get(API_ENDPOINTS.USER.USERS, { params: query });
  },

  userById: (id) => {
    return apiClient.get(API_ENDPOINTS.USER.USER_BY_ID(id));
  },

  create: (data) => {
    return apiClient.post(API_ENDPOINTS.USER.REGISTER, data);
  },

  update: (id, data) => {
    return apiClient.patch(API_ENDPOINTS.USER.USER_BY_ID(id), data);
  },

  remove: (id) => {
    return apiClient.delete(API_ENDPOINTS.USER.USER_BY_ID(id));
  },

  resetPassword: (id, data) => {
    return apiClient.post(API_ENDPOINTS.USER.RESET_PASSWORD(id), data);
  },
};
