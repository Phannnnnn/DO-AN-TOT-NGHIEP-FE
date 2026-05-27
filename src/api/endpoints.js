export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login",
    REFRESH_TOKEN: "auth/refresh-token",
  },
  ROOM: {
    ROOMS: "rooms",
    ROOM_BY_ID: (id) => `rooms/${id}`,
  },

  ROOM_TYPE: {
    ROOM_TYPES: "room-type",
    ROOM_TYPE_BY_ID: (id) => `room-type/${id}`,
  },

  ROOM_BED: {
    ROOM_BEDS: "room-bed",
    ROOM_BEDS_BY_ROOM_TYPE_ID: (id) => `room-bed/${id}`,
    ROOM_BED_BY_ID: (id) => `room-bed/${id}`,
  },

  ROOM_AMENITY: {
    ROOM_AMENITIES: "amenity",
    ROOM_AMENITY_BY_ID: (id) => `amenity/${id}`,
  },

  ROOM_TYPE_AMENITY: {
    ROOM_TYPE_AMENITIES: "room-type-amenity",
    ROOM_TYPE_AMENITY_BY_ROOM_TYPE_ID: (id) => `room-type-amenity/${id}`,
  },

  PRICEPLANS: {
    PRICEPLANS_BY_ROOM_TYPE_ID: (id) => `price-plan/room-type/${id}`,
    PRICEPLAN_BY_ID: (id) => `price-plan/${id}`,
  },

  BOOKING: {
    BOOKINGS: "booking",
    BOOKINGS_BY_ID: (id) => `booking/${id}`,
    BOOKING_AVAILBLE_ROOMS: "booking/available-rooms",
    BOOKING_STATUS: (id) => `booking/${id}/status`,
    BOOKING_CHECK_IN: (id) => `booking/${id}/check-in`,
    BOOKING_CHECK_OUT: (id) => `booking/${id}/check-out`,
  },

  SERVICE: {
    SERVICES: "service",
    SERVICE_BY_ID: (id) => `service/${id}`,
  },

  SERVICE_TYPE: {
    SERVICE_TYPES: "service-type",
    SERVICE_TYPE_BY_ID: (id) => `service-type/${id}`,
  },

  CUSTOMER: {
    CUSTOMERS: "customer",
    CUSTOMER_BY_ID: (id) => `customer/${id}`,
  },

  PAYMENT: {
    CREATE_PAYMENT: (id) => `payment/create-payment/${id}`,
    PAY_CASH: (id) => `payment/pay-cash/${id}`,
  },

  DASHBOARD: {
    SUMMARY: "dashboard/summary",
  },

  REPORT: {
    SUMMARY: "report",
  },

  CLOUDINARY: {
    GENERATE_SIGNATURE: "cloudinary/sign",
    UPLOAD: (cloudName) =>
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  },
};
