import { useEffect, useState } from "react";
import { reverseGeocode } from "../services/geocodingService";

const STORAGE_KEY = "pickup_location";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);

    // ✅ 1. Try load from localStorage
    const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

    if (cached) {
      const parsed = JSON.parse(cached);

      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

      if (!isExpired) {
        setLocation(parsed.coords);
        setAddress(parsed.address);
        setLoading(false);
        return;
      }
    }

    // ❌ No cache → get from GPS + API
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // console.log("pos ", pos);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const coords = [lat, lon];
        setLocation(coords);

        try {
          // const data = await reverseGeocode(lat, lon);
          // const addr = data.display_name;
          const feature = await reverseGeocode(lat, lon);

          const addr = feature.properties.label;
          setAddress(addr);

          // ✅ Save to localStorage
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              coords,
              address: addr,
              timestamp: Date.now(),
            }),
          );
        } catch {
          setAddress("Unknown location");
        }

        setLoading(false);
      },
      () => {
        setAddress("Location permission denied");
        setLoading(false);
      },
    );
  }, []);

  return { location, address, loading };
};
