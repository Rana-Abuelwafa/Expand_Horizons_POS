import axios from "axios";
const popularHotels = [
  {
    id: "hotel-1",
    isPopular: true,
    name: "Jaz Soma Beach",
    address: "Soma Bay, Red Sea, Egypt",
    lat: 26.845,
    lng: 33.99,
  },
  {
    id: "hotel-2",
    isPopular: true,
    name: "Steigenberger ALDAU Beach Hotel",
    address: "Hurghada, Red Sea, Egypt",
    lat: 27.177,
    lng: 33.826,
  },
];
const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEyNmQ3ZTY2MDc3NDRkMjY5NDhlYWJmODU0MzMwNDIyIiwiaCI6Im11cm11cjY0In0=";
export const searchPlaces = async (query) => {
  if (!query) return [];

  const hurghadaBounds = {
    minLon: 33.5,
    minLat: 26.6,
    maxLon: 34.2,
    maxLat: 27.5,
  };

  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key: API_KEY,
        text: query,
        "boundary.country": "EGY",
        "boundary.rect": `${hurghadaBounds.minLon},${hurghadaBounds.minLat},${hurghadaBounds.maxLon},${hurghadaBounds.maxLat}`,
      },
    },
  );

  const apiResults = (response.data.features || []).filter((feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    return (
      lon >= hurghadaBounds.minLon &&
      lon <= hurghadaBounds.maxLon &&
      lat >= hurghadaBounds.minLat &&
      lat <= hurghadaBounds.maxLat
    );
  });

  const hotelResults = popularHotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(query.toLowerCase()) ||
      hotel.address.toLowerCase().includes(query.toLowerCase()),
  );

  return [...hotelResults, ...apiResults];
};
// 📍 NEW: reverse geocoding
//to get address of current location
// export const reverseGeocode = async (lat, lon) => {
//   const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
//     params: {
//       lat,
//       lon,
//       format: "json",
//       // optional: better results
//       addressdetails: 1,
//     },
//   });

//   return res.data;
// };
export const reverseGeocode = async (lat, lng) => {
  // console.log("lat  ", lat);
  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/reverse",
    {
      params: {
        api_key: API_KEY,
        "point.lat": lat,
        "point.lon": lng,
      },
    },
  );

  return response.data.features[0];
};
