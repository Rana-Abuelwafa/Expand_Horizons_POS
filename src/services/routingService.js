import axios from "axios";

const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEyNmQ3ZTY2MDc3NDRkMjY5NDhlYWJmODU0MzMwNDIyIiwiaCI6Im11cm11cjY0In0=";

export const getRouteData = async (start, end) => {
  const res = await axios.get(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      params: {
        api_key: API_KEY,
        start: `${start[1]},${start[0]}`,
        end: `${end[1]},${end[0]}`,
      },
    },
  );

  const data = res.data.features[0];
  console.log("data ", data);
  return {
    coordinates: data.geometry.coordinates.map((c) => [c[1], c[0]]),
    distance: data.properties.summary.distance / 1000,
    duration: data.properties.summary.duration / 60,
  };
};
