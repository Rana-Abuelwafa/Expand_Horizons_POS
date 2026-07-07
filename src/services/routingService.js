import axios from "axios";

const API_KEY = process.env.REACT_APP_ORS_API_KEY;

// Fetches car route geometry, distance (km), and duration (minutes) between two points.
export const getRouteData = async (start, end) => {
  if (!API_KEY) {
    throw new Error("Missing REACT_APP_ORS_API_KEY");
  }

  try {
    const res = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [start[1], start[0]],
          [end[1], end[0]],
        ],
        radiuses: [1000, 1000],
      },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    const data = res.data.features[0];

    return {
      // Leaflet expects [lat, lon], API returns [lon, lat].
      coordinates: data.geometry.coordinates.map((c) => [c[1], c[0]]),
      distance: data.properties.summary.distance / 1000,
      duration: data.properties.summary.duration / 60,
    };
  } catch (error) {

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        switch (error.response.status) {
          case 404:
            throw new Error("Route not found");
          case 401:
            throw new Error("Invalid API key");
          case 429:
            throw new Error("Too many requests");
          default:
            throw new Error("Failed to fetch route");
        }
      } else if (error.request) {
        throw new Error("Network error. Please check internet connection.");
      }
    }

    throw new Error("Unexpected error occurred");
  }
};
