import { useEffect, useState } from "react";
import { searchPlaces } from "../../services/geocodingService";
import { useDebounce } from "../../services/useDebounce";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationInput = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    const fetch = async () => {
      const data = await searchPlaces(debouncedQuery);
      setResults(data);
    };
    fetch();
  }, [debouncedQuery]);

  return (
    <div className="location-input">
      {/* <label>{label}</label> */}

      <div className="input-wrapper">
        <FaMapMarkerAlt className="icon" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter destination"
        />
      </div>

      {results.length > 0 && (
        <ul className="dropdown">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => {
                onSelect(
                  [parseFloat(r.lat), parseFloat(r.lon)],
                  r.display_name,
                );
                setQuery(r.display_name);
                setResults([]);
              }}
            >
              <span className="title">{r.display_name.split(",")[0]}</span>
              <span className="subtitle">{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
