import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const paymentService = {
  createPayment: (bookingId) => {
    return apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_PAYMENT(bookingId));
  },

  payCash: (bookingId) => {
    return apiClient.post(API_ENDPOINTS.PAYMENT.PAY_CASH(bookingId));
  },
};
