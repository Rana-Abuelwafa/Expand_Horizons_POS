import { useEffect, useState } from "react";
import { searchPlaces } from "../../services/geocodingService";
import { useDebounce } from "../../services/useDebounce";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationInput = ({ label, onSelect, defaultValue, placeholder }) => {
  const [query, setQuery] = useState(defaultValue || "");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(false);

  const debouncedQuery = useDebounce(query);

  // Pre-fills the input when parent provides an initial location.
  useEffect(() => {
    if (defaultValue && !query) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  // Searches places only after debounce and minimum input length.
  useEffect(() => {
    if (selected) {
      setSelected(false);
      return;
    }

    if (debouncedQuery.length > 2) {
      const fetch = async () => {
        const data = await searchPlaces(debouncedQuery);

        setResults(data);
      };

      fetch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="location-input">
      <div className="input-wrapper">
        <FaMapMarkerAlt className="icon" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(false);
          }}
          placeholder={
            placeholder || `Enter ${label?.toLowerCase() || "location"}`
          }
        />
      </div>
      {results.length > 0 && (
        <ul className="dropdown">
          {results.map((r, index) => {
            const isHotel = r.isPopular;

            return (
              <li
                key={isHotel ? r.id : index}
                onClick={() => {
                  // Normalizes both custom hotel items and API items to [lat, lon] + label.
                  if (isHotel) {
                    onSelect([r.lat, r.lng], r.name);

                    setQuery(r.name);
                  } else {
                    const lng = r.geometry.coordinates[0];
                    const lat = r.geometry.coordinates[1];

                    onSelect(
                      [parseFloat(lat), parseFloat(lng)],
                      r.properties.label,
                    );

                    setQuery(r.properties.label);
                  }

                  setSelected(true);
                  setResults([]);
                }}
              >
                <span className="title">
                  {isHotel ? r.name : r.properties.label}
                </span>

                <span className="subtitle">
                  {isHotel ? r.address : r.properties.label}
                </span>

                
              </li>
            );
          })}
        </ul>
      )}
      
      
      
    </div>
  );
};

export default LocationInput;
