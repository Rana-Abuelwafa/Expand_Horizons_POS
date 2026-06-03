import axios from "axios";
const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEyNmQ3ZTY2MDc3NDRkMjY5NDhlYWJmODU0MzMwNDIyIiwiaCI6Im11cm11cjY0In0=";
export const searchPlaces = async (query) => {
  if (!query) return [];

  // const response = await axios.get(
  //   "https://nominatim.openstreetmap.org/search",
  //   {
  //     params: {
  //       q: query,
  //       format: "json",
  //       limit: 10,
  //       // ✅ restrict to Egypt
  //       countrycodes: "eg",
  //     },
  //   },
  // );
  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key: API_KEY,
        text: query,
        size: 10,
        "boundary.country": "EGY",
      },
    },
  );
  // console.log(response.data);
  // return response.data;
  return response.data.features;
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
