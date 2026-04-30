import axios from "axios";

export const searchPlaces = async (query) => {
  if (!query) return [];

  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query,
      format: "json",
      limit: 5,
      // ✅ restrict to Egypt
      countrycodes: "eg",
    },
  });

  return res.data;
};

// 📍 NEW: reverse geocoding
//to get address of current location
export const reverseGeocode = async (lat, lon) => {
  const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: {
      lat,
      lon,
      format: "json",
    },
  });

  return res.data;
};
