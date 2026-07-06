import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const booking_Service_Service = {
 add: (bookingDetailId, data) => {
 return apiClient.post(
 API_ENDPOINTS.BOOKING_SERVICE.BOOKING_SERVICE(bookingDetailId),
 data,
 );
 },

 bookingServiceByBookingDetailId: (bookingDetailId) => {
 return apiClient.get(
 API_ENDPOINTS.BOOKING_SERVICE.BOOKING_SERVICE(bookingDetailId),
 );
 },

 remove: (bookingDetailId) => {
 return apiClient.delete(
 API_ENDPOINTS.BOOKING_SERVICE.BOOKING_SERVICE(bookingDetailId),
 );
 },
};
