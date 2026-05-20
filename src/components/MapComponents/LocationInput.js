import { useEffect, useState } from "react";
import { searchPlaces } from "../../services/geocodingService";
import { useDebounce } from "../../services/useDebounce";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationInput = ({ label, onSelect, defaultValue, placeholder }) => {
  const [query, setQuery] = useState(defaultValue || "");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(false);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (defaultValue && !query) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    // prevent search after selecting item
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
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => {
                onSelect(
                  [parseFloat(r.lat), parseFloat(r.lon)],
                  r.display_name,
                );

                setSelected(true);
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
