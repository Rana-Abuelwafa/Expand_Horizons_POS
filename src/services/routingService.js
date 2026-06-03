import axios from "axios";

const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjEyNmQ3ZTY2MDc3NDRkMjY5NDhlYWJmODU0MzMwNDIyIiwiaCI6Im11cm11cjY0In0=";

// export const getRouteData = async (start, end) => {
//   //console.log("end", end);
//   const res = await axios.get(
//     "https://api.openrouteservice.org/v2/directions/driving-car",
//     {
//       params: {
//         api_key: API_KEY,
//         start: `${start[1]},${start[0]}`,
//         end: `${end[1]},${end[0]}`,
//       },
//     },
//   );

//   const data = res.data.features[0];
//   //console.log("data ", data);
//   return {
//     coordinates: data.geometry.coordinates.map((c) => [c[1], c[0]]),
//     distance: data.properties.summary.distance / 1000,
//     duration: data.properties.summary.duration / 60,
//   };
// };

export const getRouteData = async (start, end) => {
  try {
    // const res = await axios.get(
    //   "https://api.openrouteservice.org/v2/directions/driving-car",
    //   {
    //     params: {
    //       api_key: API_KEY,
    //       start: `${start[1]},${start[0]}`,
    //       end: `${end[1]},${end[0]}`,
    //       radiuses: [1000, 1000],
    //     },
    //   },
    // );
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
      coordinates: data.geometry.coordinates.map((c) => [c[1], c[0]]),
      distance: data.properties.summary.distance / 1000,
      duration: data.properties.summary.duration / 60,
    };
  } catch (error) {
    // console.error("Route API Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
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
        // No response received
        throw new Error("Network error. Please check internet connection.");
      }
    }

    throw new Error("Unexpected error occurred");
  }
};
