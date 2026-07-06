import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const paymentService = {
  createRoomPayment: (bookingId) => {
    return apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_PAYMENT(bookingId));
  },

  payRoomCash: (bookingId) => {
    return apiClient.post(API_ENDPOINTS.PAYMENT.PAY_CASH(bookingId));
  },

  payServiceCash: (bookingId) => {
    return apiClient.post(API_ENDPOINTS.PAYMENT.PAY_SERVICE_CASH(bookingId));
  },

  createServicePayment: (bookingId) => {
    return apiClient.post(
      API_ENDPOINTS.PAYMENT.CREATE_SERVICE_PAYMENT(bookingId),
    );
  },
};
