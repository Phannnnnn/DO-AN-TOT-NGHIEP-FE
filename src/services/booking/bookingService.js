import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const bookingService = {
  create: (data) => {
    return apiClient.post(API_ENDPOINTS.BOOKING.BOOKINGS, data);
  },

  bookings: () => {
    return apiClient.get(API_ENDPOINTS.BOOKING.BOOKINGS);
  },

  bookingById: (bookingId) => {
    return apiClient.get(API_ENDPOINTS.BOOKING.BOOKINGS_BY_ID(bookingId));
  },

  getAvailableRooms: (query) => {
    return apiClient.get(API_ENDPOINTS.BOOKING.BOOKING_AVAILBLE_ROOMS, {
      params: query,
    });
  },

  updateStatus: (bookingId, status) => {
    return apiClient.patch(API_ENDPOINTS.BOOKING.BOOKING_STATUS(bookingId), {
      status,
    });
  },

  checkIn: (bookingId, checkInDto) => {
    return apiClient.patch(
      API_ENDPOINTS.BOOKING.BOOKING_CHECK_IN(bookingId),
      checkInDto,
    );
  },

  checkOut: (bookingId) => {
    return apiClient.patch(API_ENDPOINTS.BOOKING.BOOKING_CHECK_OUT(bookingId));
  },
};
