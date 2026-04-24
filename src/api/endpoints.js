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
};
