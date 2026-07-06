import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const customerService = {
  create: (data) => {
    return apiClient.post(API_ENDPOINTS.CUSTOMER.CUSTOMERS, data);
  },

  customers: (params) => {
    return apiClient.get(API_ENDPOINTS.CUSTOMER.CUSTOMERS, { params });
  },

  update: (customerId, data) => {
    return apiClient.patch(
      API_ENDPOINTS.CUSTOMER.CUSTOMER_BY_ID(customerId),
      data,
    );
  },

  remove: (customerId) => {
    return apiClient.delete(API_ENDPOINTS.CUSTOMER.CUSTOMER_BY_ID(customerId));
  },
};
